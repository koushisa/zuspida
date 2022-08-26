import { atom, selector, DefaultValue } from "recoil";
import create from "zustand/vanilla";
import type { StoreApi } from "zustand/vanilla";
import { nanoid } from "../nanoid";

function atomWithZustand<T>(store: StoreApi<T>, key = nanoid()) {
  const baseAtom = atom({
    key,
    default: store.getState(),
    effects: [
      ({ trigger, setSelf, onSet }) => {
        const subscribe = () => {
          const syncStore = () => {
            setSelf(store.getState());
          };

          // call on mount
          syncStore();

          const unsub = store.subscribe(syncStore);
          return unsub;
        };

        if (trigger === "get") {
          subscribe();
        }

        onSet((newValue, _, isReset) => {
          if (isReset) {
            store.destroy();
          }

          store.setState(newValue, true);
        });
      }
    ]
  });

  const storeAtom = selector({
    key: `${key}/storeAtom`,
    get: ({ get }) => get(baseAtom),
    set: ({ set, reset }, newValue: T | DefaultValue) => {
      if (newValue instanceof DefaultValue) {
        reset(baseAtom);
        return;
      }

      set(baseAtom, newValue);
    }
  });

  return storeAtom;
}

export const AtomWithZustand = {
  createStore: create,
  withAtom: atomWithZustand
};
