import { setup, assign } from 'xstate';

export const botMachine = setup({
  types: {
    context: {} as { error?: string },
    events: {} as
      | { type: 'LAUNCH' }
      | { type: 'SUCCESS' }
      | { type: 'FAIL'; error: string }
      | { type: 'LOGIN_REQUIRED' }
      | { type: 'LOGGED_IN' }
      | { type: 'READY' }
      | { type: 'START' }
      | { type: 'STOP' }
      | { type: 'RETRY' },
  },
}).createMachine({
  id: 'bot',
  initial: 'init',
  context: {
    error: undefined,
  },
  states: {
    init: {
      on: { LAUNCH: 'launching' },
    },
    launching: {
      on: {
        SUCCESS: 'connecting',
        FAIL: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    connecting: {
      on: {
        SUCCESS: 'checking',
        FAIL: {
          target: 'error',
          actions: assign({ error: ({ event }) => event.error }),
        },
      },
    },
    checking: {
      on: {
        LOGIN_REQUIRED: 'waiting_for_login',
        READY: 'selecting_class',
      },
    },
    waiting_for_login: {
      on: {
        LOGGED_IN: 'selecting_class',
      },
    },
    selecting_class: {
      on: {
        START: 'answering',
        LOGIN_REQUIRED: 'waiting_for_login',
      },
    },
    answering: {
      on: {
        STOP: 'selecting_class',
        LOGIN_REQUIRED: 'waiting_for_login',
      },
    },
    error: {
      on: {
        RETRY: 'init',
      },
    },
  },
});

export type BotState = 'init' | 'launching' | 'connecting' | 'checking' | 'waiting_for_login' | 'selecting_class' | 'answering' | 'error';