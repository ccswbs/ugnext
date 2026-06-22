/**
 * k6 load test – GraphQL traffic simulation
 *
 * Mimics the traffic pattern identified in the June 2026 outage:
 * many concurrent Next.js SSR renders each driving fresh POST /graphql
 * requests against the Drupal backend.
 *
 * Run locally:
 *   k6 run tests/load/graphql-load.js
 *
 * Run against staging:
 *   BASE_URL=https://staging.example.com k6 run tests/load/graphql-load.js
 *
 * Scenarios
 * ─────────
 * baseline   – steady 10 VUs over 1 min  (sanity check, should always pass)
 * soak       – 50 VUs over 5 min         (mirrors normal peak load)
 * spike      – ramps to 300 VUs in 30 s  (reproduces the outage conditions)
 */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// Pages that are representative of a typical browse session.
// These drive Next.js SSR which in turn calls Drupal /graphql.
const PAGES = [
  "/",
  "/news",
  "/programs/undergraduate",
  "/programs/graduate",
  "/faculty/search",
];

// ── Custom metrics ─────────────────────────────────────────────────────────────

const errorRate   = new Rate("error_rate");
const p99Duration = new Trend("page_duration_p99", true);

// ── Thresholds (test fails if these are breached) ──────────────────────────────

export const options = {
  scenarios: {
    baseline: {
      executor: "constant-vus",
      vus: 10,
      duration: "1m",
      tags: { scenario: "baseline" },
    },
    soak: {
      executor: "constant-vus",
      vus: 50,
      duration: "5m",
      startTime: "1m30s",   // starts after baseline finishes + buffer
      tags: { scenario: "soak" },
    },
    spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 300 },  // ramp up hard – reproduces the outage
        { duration: "1m",  target: 300 },  // hold
        { duration: "30s", target: 0   },  // ramp down
      ],
      startTime: "8m",   // starts after soak finishes + buffer
      tags: { scenario: "spike" },
    },
  },

  thresholds: {
    // Overall error rate must stay below 1 %
    error_rate: [{ threshold: "rate < 0.01", abortOnFail: false }],

    // p95 response time for page loads: under 3 s
    "http_req_duration{scenario:baseline}": ["p(95) < 3000"],
    "http_req_duration{scenario:soak}"    : ["p(95) < 3000"],

    // During the spike, allow up to 5 s p95 – but no 502s
    "http_req_duration{scenario:spike}"   : ["p(95) < 5000"],
    "http_req_failed{scenario:spike}"     : ["rate < 0.02"],
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function randomPage() {
  return PAGES[Math.floor(Math.random() * PAGES.length)];
}

// ── Default function (runs once per VU iteration) ──────────────────────────────

export default function () {
  const page = randomPage();
  const url  = `${BASE_URL}${page}`;

  group("page load", () => {
    const res = http.get(url, {
      headers: { Accept: "text/html" },
      tags:    { page },
    });

    const ok = check(res, {
      "status is 200":         (r) => r.status === 200,
      "no 502 bad gateway":    (r) => r.status !== 502,
      "no 503 unavailable":    (r) => r.status !== 503,
      "body not empty":        (r) => r.body.length > 0,
    });

    errorRate.add(!ok);
    p99Duration.add(res.timings.duration);

    if (res.status === 502 || res.status === 503) {
      console.error(`[${res.status}] ${url}`);
    }
  });

  // Simulate human think-time between page views (1–3 s)
  sleep(1 + Math.random() * 2);
}

export function handleSummary(data) {
  // Emit a JUnit-compatible summary for Azure Pipelines
  return {
    "test-results/k6-load-results.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

// Minimal text summary (k6 built-in textSummary is available in k6 >= 0.34)
function textSummary(data) {
  const m = data.metrics;
  const lines = [
    "═══════════════════════ k6 Load Test Summary ═══════════════════════",
    `  Total requests  : ${m.http_reqs?.values?.count ?? "n/a"}`,
    `  Error rate      : ${((m.error_rate?.values?.rate ?? 0) * 100).toFixed(2)} %`,
    `  p95 duration    : ${(m.http_req_duration?.values?.["p(95)"] ?? 0).toFixed(0)} ms`,
    `  p99 duration    : ${(m.http_req_duration?.values?.["p(99)"] ?? 0).toFixed(0)} ms`,
    "═════════════════════════════════════════════════════════════════════",
  ];
  return lines.join("\n");
}
