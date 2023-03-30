const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.send({ status: 'UP' }))

module.exports = router;