import env from './index.js';

const isLocalDev = (origin) =>
  origin &&
  (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin));

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || isLocalDev(origin) || origin === env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
