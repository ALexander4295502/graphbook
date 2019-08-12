import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';

import db from './database';
import services from './services';

// Express Setup
const app = express();
const root = path.join(__dirname, '../../');

// Express Helmet(production)
if (process.env.NODE_ENV === 'development') {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", 'data:', '*.amazonaws.com'],
      },
    }),
  );
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
}

// Compression with Express.js
app.use(compress());

// CORS with Express.js
app.use(cors());

// Bind GraphQl and other services to Express.js
Object.keys(services).map(serviceName => {
  if (serviceName === 'graphql') {
    services[serviceName].applyMiddleware({ app });
  } else {
    app.use(`/${serviceName}`, services[serviceName]);
  }
  return true;
});

app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
  res.sendFile(path.join(root, '/dist/client/index.html'));
});

// eslint-disable-next-line no-console
app.listen(8080, () => console.log('Listening on port 8080!'));
