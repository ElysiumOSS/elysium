import { Elysia } from 'elysia';
import { record } from '@elysiajs/opentelemetry';
import { Stringify } from '@/core/utils';

/**
 * The current application version, loaded from package.json.
 * @type {string}
 */
const version: string = await import('../../../../package.json').then(pkg => pkg.version).catch(() => 'N/A');

export const utilityRoute = new Elysia()
  .get('/', () =>
    record('root.get', () => {
      return Stringify({
        message: `Welcome to the API. Don't be naughty >:(`,
        status: 200,
      });
    }), {
      detail: {
        summary: 'Root endpoint',
        description: 'Welcome message for the API',
        tags: ['Utility']
      }
    }
  )
  .head('/', ({ set }) =>
    record('root.head', () => {
      set.status = 200;
      return;
    }), {
      detail: {
        summary: 'Root HEAD',
        description: 'HEAD for root endpoint',
        tags: ['Utility']
      }
    }
  )
  .options('/', () =>
    record('root.options', () => {
      return Stringify({
        message: 'CORS preflight response',
        status: 204,
        allow: 'GET,OPTIONS,HEAD',
      });
    }), {
      detail: {
        summary: 'Root OPTIONS',
        description: 'CORS preflight for root',
        tags: ['Utility']
      }
    }
  )
  .get('/status', async () =>
    record('status.get', async () => {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      const appVersion = version;
      return Stringify({
        message: 'Application status',
        status: 200,
        data: {
          uptime: `${uptime.toFixed(2)} seconds`,
          memory: {
            rss: `${(memoryUsage.rss / 1_024 / 1_024).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1_024 / 1_024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1_024 / 1_024).toFixed(2)} MB`,
            external: `${(memoryUsage.external / 1_024 / 1_024).toFixed(2)} MB`,
          },
          version: appVersion,
          environment: process.env.NODE_ENV || 'development',
        },
      });
    }), {
      detail: {
        summary: 'Get application status',
        description: 'Returns uptime, memory usage, version, and environment',
        tags: ['Utility']
      }
    }
  )
  .head('/status', ({ set }) =>
    record('status.head', () => {
      set.status = 200;
      return;
    }), {
      detail: {
        summary: 'Status HEAD',
        description: 'HEAD for status endpoint',
        tags: ['Utility']
      }
    }
  )
  .options('/status', () =>
    record('status.options', () => {
      return Stringify({
        message: 'CORS preflight response',
        status: 204,
        allow: 'GET,OPTIONS,HEAD',
      });
    }), {
      detail: {
        summary: 'Status OPTIONS',
        description: 'CORS preflight for status',
        tags: ['Utility']
      }
    }
  )
  .get('/version', async () =>
    record('version.get', async () => {
      const appVersion = version;
      return Stringify({
        version: appVersion,
        status: 200,
      });
    }), {
      detail: {
        summary: 'Get API version',
        description: 'Returns the current API version',
        tags: ['Info']
      }
    }
  )
  .head('/version', ({ set }) =>
    record('version.head', () => {
      set.status = 200;
      return;
    }), {
      detail: {
        summary: 'Version HEAD',
        description: 'HEAD for version endpoint',
        tags: ['Info']
      }
    }
  )
  .options('/version', () =>
    record('version.options', () => {
      return Stringify({
        message: 'CORS preflight response',
        status: 204,
        allow: 'GET,OPTIONS,HEAD',
      });
    }), {
      detail: {
        summary: 'Version OPTIONS',
        description: 'CORS preflight for version',
        tags: ['Info']
      }
    }
  )
  .get('/info', () =>
    record('info.get', () => {
      return Stringify({
        message: `Information about the API`,
        status: 200,
        data: {
          contact: `example @example.com`,
          documentationUrl: 'https://docs.your-api.com',
        },
      });
    }), {
      detail: {
        summary: 'Get API info',
        description: 'Returns information about the API',
        tags: ['Info']
      }
    }
  )
  .head('/info', ({ set }) =>
    record('info.head', () => {
      set.status = 200;
      return;
    }), {
      detail: {
        summary: 'Info HEAD',
        description: 'HEAD for info endpoint',
        tags: ['Info']
      }
    }
  )
  .options('/info', () =>
    record('info.options', () => {
      return Stringify({
        message: 'CORS preflight response',
        status: 204,
        allow: 'GET,OPTIONS,HEAD',
      });
    }), {
      detail: {
        summary: 'Info OPTIONS',
        description: 'CORS preflight for info',
        tags: ['Info']
      }
    }
  )
  .get('/health', async () =>
    record('health.get', () => {
      return Stringify({ message: 'ok', status: 200 });
    }), {
      detail: {
        summary: 'Health check',
        description: 'Returns ok if the API is healthy',
        tags: ['Health']
      }
    }
  )
  .head('/health', ({ set }) =>
    record('health.head', () => {
      set.status = 200;
      return;
    }), {
      detail: {
        summary: 'Health HEAD',
        description: 'HEAD for health endpoint',
        tags: ['Health']
      }
    }
  )
  .options('/health', () =>
    record('health.options', () => {
      return Stringify({
        message: 'CORS preflight response',
        status: 204,
        allow: 'GET,OPTIONS,HEAD',
      });
    }), {
      detail: {
        summary: 'Health OPTIONS',
        description: 'CORS preflight for health',
        tags: ['Health']
      }
    }
  );
