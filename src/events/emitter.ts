import { EventEmitter as NodeEventEmitter } from 'events';
import { EventType, EventPayload } from './types';

type Handler<T extends EventType> = (event: EventPayload<T>) => void;

class TypedEventEmitter {
  private emitter = new NodeEventEmitter();

  on<T extends EventType>(type: T, handler: Handler<T>): void {
    this.emitter.on(type, handler);
  }

  off<T extends EventType>(type: T, handler: Handler<T>): void {
    this.emitter.off(type, handler);
  }

  once<T extends EventType>(type: T, handler: Handler<T>): void {
    this.emitter.once(type, handler);
  }

  emit<T extends EventType>(event: EventPayload<T>): void {
    this.emitter.emit(event.type, event);
  }

  removeAllListeners(type?: EventType): void {
    this.emitter.removeAllListeners(type);
  }
}

export const events = new TypedEventEmitter();
export { TypedEventEmitter };
