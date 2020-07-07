const User = require('../models/user');
const passport = require('passport');
const crypto = require('crypto');
const util = require('util');

module.exports = {
    getLogin(req, res, next){
            if (req.isAuthenticated()) return res.redirect('/users/home');
            res.render('login', { title: 'login' });
        },
        // POST /login
        async postLogin(req, res, next) {
            const { username, password } = req.body;
            const { user, error } = await User.authenticate()(username, password);
            if (!user && error) return next(error);
            req.login(user, function (err) {
                if (err) return next(err);
                req.session.success = `Welcome back ${username}!`;
                const redirectUrl = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                res.redirect(redirectUrl);
            });
        },
        getLogout(req, res, next){
            req.logout();
            res.redirect('/');
        },
    // Get /register
    getRegister(req, res, next) {
        res.render('register', { title: 'Register', username: '', email: '' });
    },
    // POST /register
    async postRegister(req, res, next) {
        try {
            const user = await User.register(new User(req.body), req.body.password);
            req.login(user, function (err) {
                if (err) return next(err);
                req.session.success = `Welcome ${user.username}`;
                res.redirect('/users/home');
            });
        } catch (err) {
            const { username, email } = req.body;
            let error = err.message;
            if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error = 'A user with the given email already exists';
            }
            res.render('register', { title: 'Register', username, email, error });
        }
    }
}
