const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Product = require('../models/product.js');
const User = require('../models/user.js');
const { isLoggedIn, validateProduct, isAdmin } = require('../middleware');

router.get('/', async (req, res) => {
    let noResult = null;
    if (req.query.search) {
        // regex will search a pattern string
        // -1 sorts in descending
        // 1 sorts in ascending
        const products = await Product.find({ title: { $regex: req.query.search } }).populate('reviews');
        if (products.length === 0) {
            noResult = req.query.search;
        }
        res.render('products/index', { products, noResult });
    }
    else if (req.query.sortby === 'rateAvg') {
        await Product.find({})
            .sort({ rateAvg: -1, rateCount: -1 })
            .populate('reviews')
            .exec((err, products) => {
                res.render('products/index', { products, noResult });
            })
    }
    else if (req.query.sortby === 'rateCount') {
        await Product.find({})
            .sort({ rateCount: -1 })
            .populate('reviews')
            .exec((err, products) => {
                res.render('products/index', { products, noResult });
            })
    }
    else if (req.query.sortby === 'priceLow') {
        await Product.find({})
            .sort({ price: 1 })
            .populate('reviews')
            .exec((err, products) => {
                res.render('products/index', { products, noResult });
            })
    }
    else if (req.query.sortby === 'priceHigh') {
        await Product.find({})
            .sort({ price: -1 })
            .populate('reviews')
            .exec((err, products) => {
                res.render('products/index', { products, noResult });
            })
    }
    else {
        const products = await Product.find({}).populate('reviews');
        res.render('products/index', { products, noResult });
    }
})

router.post('/', isLoggedIn, isAdmin, upload.array('image'), validateProduct, async (req, res) => {
    const product = new Product(req.body.product);
    product.images = req.files.map((f) => {
        return { url: f.path, filename: f.filename };
    })
    await product.save();
    res.redirect('/products');
})

router.get('/new', isLoggedIn, isAdmin, (req, res) => {
    res.render('products/new');
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        });
    product.rateAvg = product.ratingAvg;
    product.rateCount = product.ratingCount;
    await product.save();
    res.render('products/show', { product });
})

router.get('/:id/edit', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'PRODUCT NOT FOUND');
        return res.redirect('/products');
    }
    res.render('products/edit', { product });
})

router.put('/:id', isLoggedIn, isAdmin, upload.array('image'), async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body.product);
    const imgs = req.files.map((f) => {
        return { url: f.path, filename: f.filename };
    })
    product.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'SUCCESSFULLY UPDATED PRODUCT');
    res.redirect(`/products/${id}`);
})

router.delete('/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'SUCCESSFULLY DELETED PRODUCT!');
    res.redirect('/products');
})

router.get('/:id/addToCart', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const user = await User.findById({ _id: req.user._id });

    let productIndex = -1;
    for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product == id) {
            productIndex = i;
            break;
        }
    }

    if (productIndex != -1) {
        user.cart[productIndex].quantity++;
    } else {
        user.cart.push({ product, quantity: 1 });
    }

    await user.save();

    req.flash('success', 'Item successfully added to the cart!');
    res.redirect(`/products/${id}`);
})

module.exports = router;