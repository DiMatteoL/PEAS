import { Store } from "../store";

export const getNestedStoreValue = (
  store: Store,
  keys: string[],
  isWrite: boolean = false // NB: Flags are not recommended, but in this case it seems to be the best solution
): Store => {
  let result: Store = store;
  for (const key of keys) {
    const isAllowed = isWrite
      ? result.allowedToWrite(key)
      : result.allowedToRead(key);
    if (!isAllowed) {
      throw new Error(
        `Cannot ${!isWrite ? "read from" : "write to"} ${keys.join(":")}`
      );
    }

    // Hate these @ts-ignore,
    // if I had more time I would probably use a proerly typed `storeValues` object in the Store class
    if (isWrite && !result.hasOwnProperty(key)) {
      // @ts-ignore
      result[key] = new Store();
    }
    // @ts-ignore
    if (typeof result[key] === "function") {
      // @ts-ignore
      result = result[key]();
    } else {
      // @ts-ignore
      result = result[key];
    }
  }

  return result;
};
