import { useEffect } from "react";

export class EventBus<T> {
  _handlers: Set<(t: T) => void> = new Set();
  subscribe(handler: (t: T) => void) {
    this._handlers.add(handler);
  }
  unsubscribe(handler: (t: T) => void) {
    this._handlers.delete(handler);
  }
  emit(t: T) {
    for (const h of this._handlers.values()) {
      h(t);
    }
  }
}
