import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { authMiddleware } from './auth';
import type { AppContext } from './context';
import { ApiError } from './errors';
import { buildFirmTemplatesRouter } from './routes/firm-templates';
import { buildMattersRouter } from './routes/matters';

export function createApp(ctx: AppContext) {
  const app = new Hono();

  app.use(
    '*',
    honoLogger((message) => ctx.logger.info(message)),
  );
  app.use('*', secureHeaders());
  app.use(
    '*',
    cors({
      origin: ctx.config.WEB_ORIGIN,
      credentials: false,
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.get('/health', (c) =>
    c.json({
      status: 'ok',
      service: 'interfluo-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    }),
  );

  app.use('/v1/*', authMiddleware(ctx.config.CLERK_SECRET_KEY));
  app.route('/v1/matters', buildMattersRouter(ctx));
  app.route('/v1/firm-templates', buildFirmTemplatesRouter(ctx));

  app.onError((err, c) => {
    if (err instanceof ApiError) {
      return c.json(
        { error: { code: err.code, message: err.message, details: err.details } },
        // biome-ignore lint/suspicious/noExplicitAny: Hono accepts numeric status
        err.status as any,
      );
    }
    ctx.logger.error({ err }, 'Unhandled error');
    return c.json(
      { error: { code: 'internal_error', message: 'An unexpected error occurred' } },
      500,
    );
  });

  app.notFound((c) =>
    c.json({ error: { code: 'not_found', message: `No route for ${c.req.path}` } }, 404),
  );

  return app;
}
