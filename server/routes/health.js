const express = require('express');

const router = express.Router();

router.get('/', (_request, response) => {
  response.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
