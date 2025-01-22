import { Permission, Store } from "../store";

export const getKeyPolicy = (store: Store, key: string): Permission => {
  const permission =
    store.customPolicies[key] ||
    Object.getPrototypeOf(store).customPolicies?.[key] ||
    store.defaultPolicy;

  return permission;
};
