import type { ClerkClient } from '@clerk/backend';
import { type AiClient, createAiClient } from '@interfluo/ai';
import {
  type BlobStore,
  type MatterRepository,
  createInMemoryRepository,
  createLocalBlobStore,
  createPostgresRepository,
} from '@interfluo/storage';
import { createClerk } from './auth';
import type { AppConfig } from './config';
import { type Logger, createLogger } from './logger';

export interface AppContext {
  config: AppConfig;
  logger: Logger;
  repo: MatterRepository;
  blobs: BlobStore;
  ai: AiClient;
  clerk: ClerkClient;
  shutdown: () => Promise<void>;
}

export function createAppContext(config: AppConfig): AppContext {
  const logger = createLogger(config.LOG_LEVEL, config.NODE_ENV !== 'production');

  let repo: MatterRepository;
  let dbClose: (() => Promise<void>) | null = null;

  if (config.DATABASE_URL) {
    logger.info('Storage: Postgres');
    const handle = createPostgresRepository(config.DATABASE_URL);
    repo = handle.repo;
    dbClose = handle.close;
  } else {
    logger.warn('Storage: in-memory (DATABASE_URL not set — data will not persist)');
    repo = createInMemoryRepository();
  }

  const blobs = createLocalBlobStore(config.BLOB_ROOT);
  const ai = createAiClient({
    apiKey: config.ANTHROPIC_API_KEY,
    defaultModel: config.ANTHROPIC_DEFAULT_MODEL,
    reasoningModel: config.ANTHROPIC_REASONING_MODEL,
  });
  const clerk = createClerk(config.CLERK_SECRET_KEY);

  return {
    config,
    logger,
    repo,
    blobs,
    ai,
    clerk,
    shutdown: async () => {
      if (dbClose) await dbClose();
    },
  };
}
