const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: 'login' }), (req, res) => {
    req.flash('success', `WELCOME BACK! ${req.user.username.toUpperCase()}`);
    const redirectUrl = req.session.returnTo || '/products';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, phone, password } = req.body;
        const user = new User({ email, username, phone });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Shopping-Cart!');
            res.redirect('/products');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'GOODBYE!');
    res.redirect('/products');
})

module.exports = router;