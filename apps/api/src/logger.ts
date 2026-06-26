import { pino } from 'pino';

export function createLogger(level: string, isDev: boolean) {
  return pino({
    level,
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        }
      : undefined,
  });
}

export type Logger = ReturnType<typeof createLogger>;
