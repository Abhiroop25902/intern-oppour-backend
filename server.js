const express = require('express');
const cors = require('cors');
// const internship = require('./routes/internship.js')
const health = require('./routes/health.js')
const app = express()

app.set('trust proxy', true)

app.use(express.json()); //for json support
app.use(cors())
// app.use('/internship', internship)
app.use('/health', health)

const port = process.env.PORT || 5000;
const server = app.listen(port,
    () => console.log(`Listening on port ${port}...`));