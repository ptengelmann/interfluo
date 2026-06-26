import { serve } from '@hono/node-server';
import { createApp } from './app';
import { loadConfig } from './config';
import { createAppContext } from './context';

async function main() {
  const config = loadConfig();
  const ctx = createAppContext(config);
  const app = createApp(ctx);

  serve(
    {
      fetch: app.fetch,
      port: config.API_PORT,
      hostname: config.API_HOST,
    },
    (info) => {
      ctx.logger.info(
        { port: info.port, host: info.address },
        `Interfluo API listening at http://${info.address}:${info.port}`,
      );
    },
  );
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
