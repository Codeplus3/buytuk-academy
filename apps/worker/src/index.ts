// =============================================================================
// BuyTuk Academy - BullMQ Workers Entry Point
// =============================================================================

import { logger } from '@buytuk/observability';
import { closeWorkers, createWorkers } from './workers.js';

async function bootstrap() {
  const runtime = createWorkers();
  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'Stopping BullMQ workers');
    await closeWorkers(runtime);
    process.exit(0);
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  logger.info({ workers: runtime.workers.length }, 'BullMQ workers started successfully');
}

bootstrap().catch((error) => {
  logger.error('Failed to start workers', error);
  process.exit(1);
});
