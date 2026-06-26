import prisma from '../config/database.js';
import { ApiResponse } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Service health status
 */
export const getHealth = asyncHandler(async (req, res) => {
  let database = 'Disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'Connected';
  } catch {
    database = 'Disconnected';
  }

  res.status(200).json(
    new ApiResponse(200, {
      status: 'OK',
      database,
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }),
  );
});
