const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const swaggerSpec = require('./config/swagger');
const logger = require('./utils/logger');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const v1Routes = require('./routes/v1');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin) || config.env === 'development') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

try {
  // xss-clean is optional; keep XSS mitigation if package loads
  // eslint-disable-next-line global-require
  const xss = require('xss-clean');
  app.use(xss());
} catch {
  logger.warn('xss-clean not available — ensure input is validated with Zod');
}

app.use(
  morgan(config.env === 'production' ? 'combined' : 'dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(globalLimiter);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: `${config.appName} API`,
    version: '1.0.0',
    docs: '/api/docs',
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

app.use(config.apiPrefix, v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
