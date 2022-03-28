const { productSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/product');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to do that');
        return res.redirect('/login');
    }
    next(); // this will call the next middleware or any route handler
}

module.exports.validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => {
            return el.message;
        }).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/products/${id}`);
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {
    if (req.user.username !== 'admin') {
        req.flash('error', 'Sorry!! You are not an admin');
        return res.redirect(`/products`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => {
            return el.message;
        }).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}