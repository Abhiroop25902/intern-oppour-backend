const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

router = express.Router()

router.get('/', async (req, res) => {
    const page = req.query.page || 1;
    const LIMIT_SIZE = 10;

    const dbClient = new MongoClient(process.env.DATABASE_URI);

    try {
        const database = dbClient.db('intern_oppour')
        const internshipCollection = database.collection('internship')

        const cursor = internshipCollection.find({})
            .skip((page - 1) * LIMIT_SIZE).limit(LIMIT_SIZE);

        const data = await cursor.toArray();

        res.status(200).send(JSON.stringify(data));

    } finally {
        await dbClient.close();
    }
})

module.exports = router;