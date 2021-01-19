const express = require('express');
const router = express.Router();
const db = require('../models');

// get all items in cart for given user
router.get('/all/:id', async (req, res) => {
    const userid = req.params.id;
    const cartItems = await db.Cart.findAll({
        where: {
            userId: userid
        }
    });
    res.send(cartItems);
});

module.exports = router;