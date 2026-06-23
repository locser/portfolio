import { type NextRequest, NextResponse } from 'next/server';
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client';

// ── Singleton via global to survive Next.js module re-loads ────────────────
declare global {
  // eslint-disable-next-line no-var
  var __metricsRegistry: Registry | undefined;
}

function getRegistry(): Registry {
  if (!global.__metricsRegistry) {
    const r = new Registry();
    collectDefaultMetrics({ register: r });
    global.__metricsRegistry = r;
  }
  return global.__metricsRegistry;
}

export const register = getRegistry();

// ───── HTTP Metrics ─────
export const httpRequestsTotal = register.getSingleMetric('http_requests_total') as Counter<string> ??
  new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [register],
  });

export const httpRequestDuration = register.getSingleMetric('http_request_duration_seconds') as Histogram<string> ??
  new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
  });

// ───── Next.js Specific ─────
export const nextjsPageViews = register.getSingleMetric('nextjs_page_views_total') as Counter<string> ??
  new Counter({
    name: 'nextjs_page_views_total',
    help: 'Total Next.js page views',
    labelNames: ['route'],
    registers: [register],
  });

export const nextjsRenderErrors = register.getSingleMetric('nextjs_render_errors_total') as Counter<string> ??
  new Counter({
    name: 'nextjs_render_errors_total',
    help: 'Total Next.js render errors',
    labelNames: ['route', 'error_type'],
    registers: [register],
  });

// ───── App-specific ─────
export const activeConnections = register.getSingleMetric('app_active_connections') as Gauge<string> ??
  new Gauge({
    name: 'app_active_connections',
    help: 'Number of active connections',
    registers: [register],
  });

// ───── withMetrics wrapper ─────
export function withMetrics(
  handler: (req: NextRequest) => Promise<NextResponse>,
  route: string,
  method: string,
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    const start = Date.now();
    let status = '500';
    try {
      const response = await handler(req);
      status = String(response.status);
      return response;
    } catch (err) {
      throw err;
    } finally {
      const duration = (Date.now() - start) / 1000;
      httpRequestDuration.labels(method, route, status).observe(duration);
      httpRequestsTotal.labels(method, route, status).inc();
    }
  };
}
