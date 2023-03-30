const express = require('express');
const Joi = require('joi');
const { MongoClient, ObjectId } = require('mongodb');

router = express.Router()

// validate the request to have only {name: string} and noting else
function validatePostAndPutRequest(req_body) {
    const schema = Joi.object({
        name: Joi.string().required(),
        link: Joi.string(),
        info: Joi.string().allow('')
    })

    return schema.validate(req_body);
}

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

router.get('/:id', async (req, res) => {
    const dbClient = new MongoClient(process.env.DATABASE_URI);

    const id = req.params.id
    //check id to be of 24 characters
    if (id.length !== 24) {
        res.status(404).send();
        return;
    }

    try {
        // connection to DB happens in the next line
        const database = dbClient.db('intern_oppour')
        const internshipCollection = database.collection('internship');
        const filter = {
            _id: new ObjectId(id)
        }
        const internship = await internshipCollection.findOne(filter);
        if (internship)
            res.send(internship);
        else
            res.status(404).send();
    }
    finally {
        dbClient.close();
    }
})

router.post('/', async (req, res) => {
    const { error } = validatePostAndPutRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const dbClient = new MongoClient(process.env.DATABASE_URI);

    try {
        // connection to DB happens in the next line
        const database = dbClient.db('intern_oppour')
        const internshipCollection = database.collection('internship')

        // check if the user is already present
        const filter = {
            name: req.body.name
        };

        const result = await internshipCollection.findOne(filter);

        if (result)
            res.send(result);
        else {
            //else make a new user
            const newUserData = req.body;

            const result = await internshipCollection.insertOne(newUserData);
            console.log(`New User Created with _id: ${result.insertedId}`);
            res.status(201)
                .location(`/internship/${result.insertedId}`)
                .send(newUserData); // 201 created

        }
    } finally {
        // Ensures that the client will close when you finish/error
        await dbClient.close();
    }
})

router.put('/', (req, res) => {
    res.status(405).send();
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    //check id to be of 24 characters
    if (id.length !== 24) {
        res.status(404).send();
        return;
    }

    const { error } = validatePostAndPutRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const dbClient = new MongoClient(process.env.DATABASE_URI);


    try {
        // connection to DB happens in the next line
        const database = dbClient.db('intern_oppour')
        const internshipCollection = database.collection('internship')

        const filter = {
            _id: new ObjectId(id)
        }

        const options = {
            returnDocument: 'after'
        }

        const result = await internshipCollection.findOneAndReplace(filter, req.body, options)
        if (result.value)
            res.send(result.value);
        else
            res.status(404).send();
    }
    finally {
        dbClient.close();
    }
})

router.delete('/', (req, res) => {
    res.status(405).send();
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    //check id to be of 24 characters
    if (id.length !== 24) {
        res.status(404).send();
        return;
    }

    const dbClient = new MongoClient(process.env.DATABASE_URI);

    try {
        // connection to DB happens in the next line
        const database = dbClient.db('intern_oppour')
        const internshipCollection = database.collection('internship')


        const filter = {
            _id: new ObjectId(id)
        }

        const deleteResult = await internshipCollection.findOneAndDelete(filter)

        if (deleteResult.value)
            res.send(deleteResult.value);
        else
            res.status(404).send();

    }
    finally {
        dbClient.close();
    }
})

module.exports = router;