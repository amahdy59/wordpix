import { createServer } from "node:http";
import { test as base } from "@playwright/test";

type OfflineServer = { url: string; setOffline: (offline: boolean) => void };

/** Fail real HTTP connections, including service-worker fetches, without WebKit's broken offline-emulation navigation path. */
export const test = base.extend<{ offlineServer: OfflineServer }>({
  serviceWorkers: "allow",
  offlineServer: async ({ browserName }, provide) => {
    let offline = false;
    const upstream = `http://localhost:${process.env.WORDPIX_E2E_PORT ?? "6173"}`;
    const server = createServer(async (request, response) => {
      if (offline) {
        request.socket.destroy();
        return;
      }
      try {
        const result = await fetch(new URL(request.url ?? "/", upstream), {
          signal: AbortSignal.timeout(10000),
        });
        response.writeHead(
          result.status,
          Object.fromEntries(
            [...result.headers].filter(
              ([name]) =>
                !["content-encoding", "content-length", "transfer-encoding"].includes(name)
            )
          )
        );
        response.end(Buffer.from(await result.arrayBuffer()));
      } catch {
        response.writeHead(502);
        response.end();
      }
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string")
      throw new Error(`Offline test server did not start for ${browserName}`);
    try {
      await provide({
        url: `http://127.0.0.1:${address.port}`,
        setOffline: (value) => {
          offline = value;
        },
      });
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    }
  },
  baseURL: async ({ offlineServer }, provide) => {
    await provide(offlineServer.url);
  },
});
export { expect } from "@playwright/test";
