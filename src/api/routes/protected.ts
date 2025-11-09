import { Elysia } from 'elysia';
import { record } from '@elysiajs/opentelemetry';
import { Stringify } from '../../core/utils';
import { requireAuth } from './auth';

export const protectedRoute = new Elysia()
  .use(requireAuth)
  .get('/example', (context) => {
    if (!(context as any).publicKey) {
      context.set.status = 401;
      return { error: 'Unauthorized' };
    }
    return record('protected.example.get', () => {
      return Stringify({
        message: 'You have access!',
        yourPublicKey: (context as any).publicKey,
      });
    });
  }, {
    detail: {
      summary: 'Protected Example',
      description: 'An example endpoint that requires authentication',
      tags: ['Protected']
    }
  })
  .head('/example', ({ set }) => 
    record('protected.example.head', () => {
      set.status = 200;
      return
    }), {
    detail: {
      summary: 'Protected Example HEAD',
      description: 'HEAD for protected example endpoint',
      tags: ['Protected']
    }
  })
  .options('/example', () =>
    record('protected.example.options', () => {
      return Stringify({
        message: 'CORS preflight response',
        status: 204,
        allow: 'GET,OPTIONS,HEAD',
      });
    }), {
      detail: {
        summary: 'Protected Example OPTIONS',
        description: 'CORS preflight for protected example',
        tags: ['Protected']
      }
    });
