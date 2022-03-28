const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const User = require('../models/user.js');
const Order = require('../models/order.js');
const { isLoggedIn, isAdmin } = require('../middleware');

router.get('/myCart', isLoggedIn, (req, res) => {
    res.render('myCart/show', { user: req.user });
})

router.get('/addProductToCart', isLoggedIn, async (req, res) => {
    const { productNumber } = req.query;
    const user = await User.findById(req.user._id);
    user.cart[productNumber].quantity += 1;
    await user.save();
    req.flash('success', 'Item successfully added to the cart!');
    res.redirect('/myCart');
})

router.get('/removeProductFromCart', isLoggedIn, async (req, res) => {
    const { productNumber, productIndex } = req.query;
    if (productNumber) {
        const user = await User.findById(req.user._id);
        user.cart[productNumber].quantity -= 1;
        await user.save();
        req.flash('success', 'Item successfully removed to the cart!');
        res.redirect('/myCart');
    }
    else {
        const user = await User.findById(req.user._id);
        const productId = user.cart[productIndex].product;
        const newCart = user.cart.filter((item) => {
            if (productId != item.product) return item;
        })
        user.cart = newCart;
        await user.save();
        res.redirect('/myCart');
    }
})

router.get('/myorders', isLoggedIn, async (req, res) => {
    const orders = await Order.find({ user: req.user._id, status: { $nin: ['Order Delivered'] } })
        .populate('products.product')
        .populate('user');
    res.render('orders/show', { orders, previous: false });
})

router.get('/previousOrders', isLoggedIn, async (req, res) => {
    const orders = await Order.find({ user: req.user._id, status: { $in: ['Order Delivered'] } })
        .populate('products.product')
        .populate('user');
    res.render('orders/show', { orders, previous: true });
})

router.get('/allorders', isLoggedIn, isAdmin, async (req, res) => {
    const orders = await Order.find({})
        .populate('products.product')
        .populate('user');
    res.render('orders/index', { orders });
})

router.get('/changeOrderStatus', isLoggedIn, isAdmin, async (req, res) => {
    const { orderId, status } = req.query;
    const orders = await Order.find({});
    orders[orderId].status = status;
    orders.forEach(async (order) => {
        await order.save();
    })
    res.redirect('/allorders');
})

router.post('/placeOrder', isLoggedIn, async (req, res) => {
    let order = new Order(req.body);
    order.user = req.user;
    order.products = req.user.cart;
    order = await order.populate('products.product');
    req.user.cart = [];
    await req.user.save();
    await order.save();
    res.redirect('/myorders');
})

module.exports = router;
