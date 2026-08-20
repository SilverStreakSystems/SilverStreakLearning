/**
 * Deterministic local serve of the production build for the TTR-001 audit.
 *
 * The build target is a Worker module. This harness runs that exact built
 * server entry in-process behind a local HTTP listener and serves the built
 * client assets through the ASSETS binding. It is audit tooling only: it is
 * never imported by the application and changes nothing the application ships.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const MIME = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export async function serveProductionBuild({ distDir, port, host = "127.0.0.1" }) {
  const mod = await import(join(distDir, "server", "index.mjs"));
  const worker = mod.default;
  if (!worker || typeof worker.fetch !== "function") {
    throw new Error("built server entry does not export a fetch handler");
  }

  const assets = {
    async fetch(request) {
      const pathname = decodeURIComponent(new URL(request.url).pathname);
      const filePath = join(distDir, "client", pathname);
      try {
        const info = await stat(filePath);
        if (!info.isFile()) throw new Error("not a file");
        return new Response(await readFile(filePath), {
          headers: { "content-type": MIME[extname(filePath)] ?? "application/octet-stream" },
        });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    },
  };

  const server = createServer((req, res) => {
    const url = `http://${host}:${port}${req.url}`;
    worker
      .fetch(new Request(url, { method: req.method, headers: req.headers }), { ASSETS: assets }, {
        waitUntil() {},
        passThroughOnException() {},
      })
      .then(async (response) => {
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
      })
      .catch((error) => {
        res.writeHead(500, { "content-type": "text/plain" });
        res.end(String(error?.stack ?? error));
      });
  });

  await new Promise((resolve) => server.listen(port, host, resolve));

  return {
    origin: `http://${host}:${port}`,
    async close() {
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
