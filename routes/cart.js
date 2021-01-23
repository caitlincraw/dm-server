const express = require('express');
const router = express.Router();
const db = require('../models');

// get all items in cart for given user
router.get('/all/:id', async (req, res) => {
    const userid = req.params.id;

    const user = await db.User.findAll({
        where: {
            id: userid
        }
    });

    if (!user) {
        res.send("User does not exist");
    }

    const cartItems = await db.Cart.findAll({
        where: {
            userId: userid
        }
    });
    res.send(cartItems);
});

// post an item in cart for given user and product
router.post('/addItem/:userid/:prodid', async (req, res) => {
    const userid = req.params.userid;
    const prodid = req.params.prodid;

    const user = await db.User.findOne({
        where: {
            id: userid
        }
    });

    const prod = await db.Product.findOne({
        where: {
            id: prodid
        }
    })

    if (!user || !prod) {
        res.send("Oh no either the user or the product doesn't exist")
    }
    
    const createCartItem = await db.Cart.create({
        userId: userid,
        productId: prodid,
        quantity: 1
    });
      res.send(`Success! The item, ${JSON.stringify(createCartItem)}, was added.` );

})

// delete an item in cart for given user and product
router.delete('/deleteItem/:id', async (req, res) => {
    const cartid = req.params.id;

    const cartItem = await db.Cart.destroy({
        where: {
            id: cartid
        }
    });

    if (!cartItem) {
        res.send("Oh no either the cart item doesn't exist")
    }
 
    res.send(`Success! The item was deleted.` );

})

module.exports = router;