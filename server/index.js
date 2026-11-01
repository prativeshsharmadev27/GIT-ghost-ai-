require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRouter = require('./routes/health');
const githubRouter = require('./routes/github');
const analyzeRouter = require('./routes/analyze');

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.use('/api/health', healthRouter);
app.use('/api/github', githubRouter);
app.use('/api/analyze', analyzeRouter);

app.use((error, _request, response, _next) => {
  if (response.headersSent) return;
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) {
    console.error('API request failed:', error.message);
  }
  response.status(status).json({
    error: error.message || 'An unexpected server error occurred.',
    ...(error.code ? { code: error.code } : {}),
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`GitGhost AI API listening on http://localhost:${port}`);
  });
}

module.exports = app;
