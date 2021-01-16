const express = require('express');
const router = express.Router();
const db = require('../models');

// get all products
router.get('/all', async (req, res) => {
    const products = await db.Product.findAll();
    res.send(products);
});

// get product by ID
router.get('/:id', async (req, res) => {
    const prodId = req.params.id;
    const product = await db.Product.findAll({
        where: {
            id: prodId
        }
    });
    res.send(product);
});

module.exports = router;