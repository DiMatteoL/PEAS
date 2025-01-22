export const getKeysFromPath = (path: string): string[] => {
  return path.split(":");
};

export const getPathKeys = (path: string): string[] => {
  const keys = getKeysFromPath(path);
  return keys.slice(0, -1);
};

export const getLastKey = (path: string): string => {
  const keys = getKeysFromPath(path);
  return keys[keys.length - 1];
};
