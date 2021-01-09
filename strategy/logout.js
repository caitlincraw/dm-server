require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router()

router.use(bodyParser.json())

router.get('/', (req, res) => {
    req.logout()
    res.redirect('/')
});