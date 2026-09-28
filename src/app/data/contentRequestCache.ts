/** Share concurrent downloads and successful results; never retain a rejection. */
export function createContentRequestCache<Key, Value>() {
  const requests = new Map<Key, Promise<Value>>();
  return (key: Key, loader: () => Promise<Value>): Promise<Value> => {
    const existing = requests.get(key);
    if (existing) return existing;
    const request = Promise.resolve()
      .then(loader)
      .catch((error: unknown) => {
        requests.delete(key);
        throw error;
      });
    requests.set(key, request);
    return request;
  };
}
