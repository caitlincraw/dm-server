const express = require('express');
const router = express.Router();

router.get('/socket', (req, res) => {
    res.send ({ response: 'I AM ALIVE'}).status(200);
});

module.exports = router;