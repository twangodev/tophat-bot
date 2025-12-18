export type BotEvent =
  | { type: 'browser:launched' }
  | { type: 'browser:connected' }
  | { type: 'browser:disconnected' }
  | { type: 'browser:error'; error: Error }
  | { type: 'page:navigated'; url: string }
  | { type: 'page:login_detected' }
  | { type: 'page:login_complete' }
  | { type: 'page:error'; error: Error }
  | { type: 'question:detected' }
  | { type: 'question:answered' }
  | { type: 'state:changed'; from: string; to: string }
  | { type: 'user:pause' }
  | { type: 'user:resume' };

export type EventType = BotEvent['type'];

export type EventPayload<T extends EventType> = Extract<BotEvent, { type: T }>;
