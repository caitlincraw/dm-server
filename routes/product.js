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

// add products
router.post('/all', async (req, res) => {
    const newProduct = new product(req.body);
    const savedProduct = await newProduct.save();
    res.send(savedProduct);
});

// delete product
router.delete('/:id', async (req, res) => {
    const deletedProduct = await product.findByIdAndDelete(req.params.id);
    res.send(deletedProduct);
})

module.exports = router;