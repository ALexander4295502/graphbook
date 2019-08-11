import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';

// Express Setup
const app = express();
const root = path.join(__dirname, '../../');

// Express Helmet
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleStc: ["'self'", 'data:', '*.amazonaws.com'],
    },
  }),
);
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// Compression with Express.js
app.use(compress());

// CORS with Express.js
app.use(cors());

app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
  res.sendFile(path.join(root, '/dist/client/index.html'));
});

app.listen(8080, () => console.log('Listening on port 8080!'));
