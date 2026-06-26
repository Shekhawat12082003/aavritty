import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
      : ['warn', 'error'],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
  });
}

export const connectDatabase = async () => {
  await prisma.$connect();
  logger.info('Database connected successfully');
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};

export default prisma;
