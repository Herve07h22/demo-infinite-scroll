import { useEffect, useState } from "react";
import { EventBus } from "./EventBus";

const watcher = (bus: EventBus<void>) => ({
  set: function <T>(obj: T, prop: string | symbol, valeur: unknown) {
    // @ts-ignore
    obj[prop] = valeur;
    bus.emit();
    return true;
  },
});

function isObservable(
  obj: object | (object & { __bus: EventBus<void> })
): obj is object & { __bus: EventBus<void> } {
  return obj.hasOwnProperty("__bus");
}

export function observer<T extends object>(obj: T): T {
  const bus = new EventBus<void>();
  Object.defineProperty(obj, "__bus", {
    value: bus,
    writable: false,
  });
  return new Proxy<T>(obj, watcher(bus));
}

// React glue
export function useObserver<T extends object>(
  obj: T | (T & { __bus: EventBus<void> })
) {
  const [state, setState] = useState("");

  useEffect(() => {
    if (isObservable(obj)) {
      const bus = obj.__bus;
      const callback = () => setState(JSON.stringify(obj));
      bus.subscribe(callback);
      return () => bus.unsubscribe(callback);
    }
  }, []);

  if (isObservable(obj)) return obj;
  throw new Error(
    "Error : useReactive hook should be used with a reactive object"
  );
}
