import { JSONArray, JSONObject, JSONPrimitive } from "./json-types";

export type Permission = "r" | "w" | "rw" | "none";

export type StoreResult = Store | JSONPrimitive | undefined;

export type StoreValue =
  | JSONObject
  | JSONArray
  | StoreResult
  | (() => StoreResult);

export interface IStore {
  defaultPolicy: Permission;
  allowedToRead(key: string): boolean;
  allowedToWrite(key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
}

export const Restrict = (...params: [Permission] | []) => {
  let [permission] = params;
  return (target: Store, propertyKey: string) => {
    let value: unknown;

    Object.defineProperty(target, propertyKey, {
      get() {
        permission = permission || target.defaultPolicy;
        if (!permission.includes("r")) {
          throw new Error("No read access");
        }
        return value;
      },
      set(newValue: number) {
        permission = permission || target.defaultPolicy;
        if (!permission) {
          value = newValue;
          return;
        }
        if (!permission.includes("w")) {
          throw new Error("No write access");
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true,
    });
  };
};

export class Store implements IStore {
  defaultPolicy: Permission = "rw";

  allowedToRead(key: string): boolean {
    try {
      this.read(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  allowedToWrite(key: string): boolean {
    try {
      this.write(key, "test");
      return true;
    } catch (e) {
      return false;
    }
  }

  read(path: string): StoreResult {
    const a = this[path as keyof this];
    return this[path as keyof this] as StoreResult;
  }

  write(path: string, value: StoreValue): StoreValue {
    // @ts-ignore
    this[path as keyof this] = value;
    return value;
  }

  writeEntries(entries: JSONObject): void {
    for (const [key, value] of Object.entries(entries)) {
      this.write(key, value);
    }
  }

  entries(): JSONObject {
    return Object.fromEntries(
      Object.entries(this).filter(
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
      )
    );
  }
}
