if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const multer = require('multer');
const { storage, cloudinary } = require('./cloudinary');
const upload = multer({ storage });
const { isLoggedIn, validateProduct, validateReview, isReviewAuthor, isAdmin } = require('./middleware');

const Product = require('./models/product');
const User = require('./models/user');
const Review = require('./models/review');
const Order = require('./models/order');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const cartAndOrderRoutes = require('./routes/cartAndOrder');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/shopping-cart')
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.log('Connection Error');
        console.log(err);
    });

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // if this flag is true means our cookie cant be accessed by client side scripts,and browser will not reveal the cookie to a third-party
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // we are setting the expiration date for cookie
        maxAge: 1000 * 60 * 60 * 24 * 7 // maxAge for the cookie
    }
}

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
    if (!['/login', '/', '/register'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentPath = req.originalUrl;
    res.locals.moment = require('moment');
    if (req.user) {
        res.locals.currentUser = await req.user
            .populate({
                path: 'cart.product',
                populate: {
                    path: 'reviews'
                }
            });
    }
    else {
        res.locals.currentUser = req.user;
    }
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    return next();
})

app.use('/products', productRoutes);
app.use('/products/:id/reviews', reviewRoutes);
app.use('/', cartAndOrderRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    res.render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})