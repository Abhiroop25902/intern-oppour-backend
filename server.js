const express = require('express');
const cors = require('cors');
const health = require('./routes/health.js')
const internship = require('./routes/internship.js')
require('dotenv').config()
const app = express()

app.set('trust proxy', true)

app.use(express.json()); //for json support
app.use(cors())
app.use('/health', health)
app.use('/internship', internship)

const port = process.env.PORT || 5000;
const server = app.listen(port,
    () => console.log(`Listening on port ${port}...`));