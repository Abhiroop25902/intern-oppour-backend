const express = require('express');

router = express.Router()

router.get('/', (req, res) => {
    data = [{
        name: "intern A",
        info: "This is intern a",
    },
    {
        name: "intern B",
        info: "This is intern B",
    }]
    res.status(200).send(JSON.stringify(data));
})

module.exports = router;