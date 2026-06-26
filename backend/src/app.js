import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import env from './config/index.js';
import { corsOptions } from './config/cors.js';
import { swaggerSpec } from './config/swagger.js';
import apiRoutes from './routes/index.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import logger from './utils/logger.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(globalLimiter);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    }),
  );
}

app.use(requestLogger);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'AAVRITTY API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
