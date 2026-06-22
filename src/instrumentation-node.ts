export async function register() {
  const { httpRequestsTotal, httpRequestDuration } = await import('./lib/metrics');

  // Hook vào request lifecycle
  const originalFetch = global.fetch;
  global.fetch = async (...args) => {
    const start = Date.now();
    const response = await originalFetch(...args);
    const duration = (Date.now() - start) / 1000;

    httpRequestDuration
      .labels('fetch', String(args[0]), String(response.status))
      .observe(duration);

    httpRequestsTotal
      .labels('fetch', String(args[0]), String(response.status))
      .inc();

    return response;
  };
}