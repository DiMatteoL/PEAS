import { JSONObject } from "../json-types";

export const flattenEntries = (entries: JSONObject): JSONObject => {
  const flatEntries = Object.entries(entries).reduce((acc, [key, value]) => {
    if (value && typeof value === "object") {
      const nestedEntries = Object.entries(value).reduce(
        (acc, [nestedKey, nestedValue]) => {
          acc[`${key}:${nestedKey}`] = nestedValue;
          return acc;
        },
        {} as JSONObject
      );
      return { ...acc, ...nestedEntries };
    }
    acc[key] = value;
    return acc;
  }, {} as JSONObject);

  return flatEntries;
};
