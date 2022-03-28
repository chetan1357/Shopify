const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Product = require('../models/product.js');
const Review = require('../models/review.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    product.reviews.push(review);
    await review.save();
    await product.save();
    req.flash('success', 'SUCCESSFULLY CREATED NEW REVIEW!');
    res.redirect(`/products/${product._id}`);
})

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // removing the reviewId from the particular campground
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'SUCCESSFULLY DELETED REVIEW!');
    res.redirect(`/products/${id}`);
})

module.exports = router;