import { useEffect, useState, useSyncExternalStore } from "react";
import { EventBus } from "./EventBus";

const watcher = (bus: EventBus<void>) => ({
  set: function <T>(obj: T, prop: string | symbol, valeur: unknown) {
    // @ts-ignore
    obj[prop] = valeur;
    bus.emit();
    return true;
  },
});

export type Observable<T extends object> = T & { __bus: EventBus<void> };

export function observable<T extends object>(
  obj: T,
  nameForDebugging?: string
): Observable<T> {
  const bus = new EventBus<void>();
  Object.defineProperty(obj, "__bus", {
    value: bus,
    writable: false,
  });

  const proxifiedObject = new Proxy<T>(obj, watcher(bus)) as Observable<T>;

  if (nameForDebugging) {
    Object.defineProperty(window, nameForDebugging, {
      value: proxifiedObject,
      writable: false,
    });
  }

  return proxifiedObject;
}

// React glue
export function useObserver<T extends object>(obj: Observable<T>) {
  const [state, setState] = useState("");
  const callback = () => setState(JSON.stringify(obj));
  useEffect(() => subscribe(obj)(callback), []);
  return obj;
}

function subscribe<T extends object>(obj: Observable<T>) {
  return (onStoreChange: () => void) => {
    const bus = obj.__bus;
    bus.subscribe(onStoreChange);
    return () => bus.unsubscribe(onStoreChange);
  };
}

export function useObserverThatDoesNotWork<T extends object>(
  obj: Observable<T>
) {
  // Doesnt work since obj reference doeas not change
  return useSyncExternalStore(subscribe(obj), () => obj);
}
