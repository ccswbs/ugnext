// Custom server that gates /_next/image so the in-container image optimizer can't
// OOM-kill the Cloud Run container under load: cap concurrent optimizations and
// queue depth, shed overflow with an immediate 503, pass everything else through.
// It bounds the failure, it does not speed up optimization. Env-configurable:
// IMAGE_OPT_CONCURRENCY (2), IMAGE_OPT_QUEUE_DEPTH (16), IMAGE_OPT_QUEUE_WAIT_MS (15000).
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const MAX_CONCURRENT_IMAGE_OPS = Number(process.env.IMAGE_OPT_CONCURRENCY || 2);
const MAX_QUEUE_DEPTH = Number(process.env.IMAGE_OPT_QUEUE_DEPTH || 16);
const MAX_QUEUE_WAIT_MS = Number(process.env.IMAGE_OPT_QUEUE_WAIT_MS || 15000);

let inFlight = 0;
const queue = [];

function admit() {
  inFlight++;
  return () => {
    inFlight--;
    const waiter = queue.shift();
    if (waiter) waiter();
  };
}

function acquireImageSlot() {
  if (inFlight < MAX_CONCURRENT_IMAGE_OPS) {
    return Promise.resolve(admit());
  }
  if (queue.length >= MAX_QUEUE_DEPTH) {
    return Promise.reject(new Error("queue_full"));
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const idx = queue.indexOf(onTurn);
      if (idx !== -1) queue.splice(idx, 1);
      reject(new Error("queue_timeout"));
    }, MAX_QUEUE_WAIT_MS);
    function onTurn() {
      clearTimeout(timeout);
      resolve(admit());
    }
    queue.push(onTurn);
  });
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    const isImageOptimize = req.url && req.url.startsWith("/_next/image");
    if (!isImageOptimize) {
      handle(req, res);
      return;
    }

    let release;
    try {
      release = await acquireImageSlot();
    } catch (err) {
      const reason = err.message === "queue_full" ? "queue full" : "queue wait exceeded";
      res.statusCode = 503;
      res.setHeader("Retry-After", "2");
      res.setHeader("Content-Type", "text/plain");
      res.end(`Image optimizer busy (${reason}), retry shortly`);
      return;
    }

    let released = false;
    const releaseOnce = () => {
      if (released) return;
      released = true;
      release();
    };
    res.on("finish", releaseOnce);
    res.on("close", releaseOnce);

    try {
      await handle(req, res);
    } catch (err) {
      releaseOnce();
      throw err;
    }
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(
      `> Image optimizer admission: max ${MAX_CONCURRENT_IMAGE_OPS} concurrent, queue depth ${MAX_QUEUE_DEPTH}, max wait ${MAX_QUEUE_WAIT_MS}ms`,
    );
  });
});
