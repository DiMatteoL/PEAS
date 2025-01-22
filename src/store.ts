import { JSONArray, JSONObject, JSONPrimitive } from "./json-types";
import { flattenEntries } from "./utils/flattenEntires";
import { getKeyPolicy } from "./utils/getKeyPolicy";
import {
  getKeysFromPath,
  getLastKey,
  getPathKeys,
} from "./utils/getKeysFromPath";
import { getNestedStoreValue } from "./utils/getNestedStoreValue";

export type Permission = "r" | "w" | "rw" | "none";

export type StoreResult = Store | JSONPrimitive | undefined;

export type StoreValue =
  | JSONObject
  | JSONArray
  | StoreResult
  | (() => StoreResult);

export interface IStore {
  defaultPolicy: Permission;
  customPolicies: Record<string, Permission>;
  allowedToRead(key: string): boolean;
  allowedToWrite(key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
}

// NB: using Object.defineProperty seems like the right approach, but I'm facing issues during class construction.
// With no clean solution that I can think of.
export const Restrict = (...params: [Permission] | []) => {
  let [permission] = params;
  return (target: Store, propertyKey: string) => {
    if (!target.customPolicies) target.customPolicies = {};
    if (permission) target.customPolicies[propertyKey] = permission;
  };
};

export class Store implements IStore {
  defaultPolicy: Permission = "rw";
  customPolicies: Record<string, Permission> = {};

  allowedToRead(key: string): boolean {
    const permission = getKeyPolicy(this, key);
    return permission.includes("r");
  }

  allowedToWrite(key: string): boolean {
    const permission = getKeyPolicy(this, key);
    return permission.includes("w");
  }

  read(path: string): StoreResult {
    const keys = getKeysFromPath(path);
    const store = getNestedStoreValue(this, keys);
    return store;
  }

  write(path: string, value: StoreValue): StoreValue {
    const pathKeys = getPathKeys(path);
    const store = getNestedStoreValue(this, pathKeys, true);

    const key = getLastKey(path);
    if (!store.allowedToWrite(key)) throw new Error(`Cannot write to ${path}`);

    // Hate these @ts-ignore,
    // if I had more time I would probably use a proerly typed `storeValues` object in the Store class
    if (value && typeof value === "object") {
      // @ts-ignore
      store[key] = new Store();
      // @ts-ignore
      store[key].writeEntries(value as JSONObject);
    } else {
      // @ts-ignore
      store[key] = value;
    }
    // @ts-ignore
    return store[key];
  }

  writeEntries(entries: JSONObject): void {
    const flatEntries = flattenEntries(entries);
    for (const [key, value] of Object.entries(flatEntries)) {
      this.write(key, value);
    }
  }

  entries(): JSONObject {
    const entries = Object.entries(this).filter(
      ([key]) =>
        this.allowedToRead(key) &&
        ![
          "defaultPolicy",
          "allowedToRead",
          "allowedToWrite",
          "read",
          "write",
          "writeEntries",
          "entries",
        ].includes(key)
    );
    const readableEntries = entries.filter(([key]) => this.allowedToRead(key));
    return Object.fromEntries(readableEntries);
  }
}
