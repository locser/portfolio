import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client';

// Registry chia sẻ cho toàn app
export const register = new Registry();

// Default Node.js metrics (heap, GC, event loop, ...)
collectDefaultMetrics({ register });

// ───── HTTP Metrics ─────
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// ───── Next.js Specific ─────
export const nextjsPageViews = new Counter({
  name: 'nextjs_page_views_total',
  help: 'Total Next.js page views',
  labelNames: ['route'],
  registers: [register],
});

export const nextjsRenderErrors = new Counter({
  name: 'nextjs_render_errors_total',
  help: 'Total Next.js render errors',
  labelNames: ['route', 'error_type'],
  registers: [register],
});

// ───── App-specific ─────
export const activeConnections = new Gauge({
  name: 'app_active_connections',
  help: 'Number of active connections',
  registers: [register],
});
