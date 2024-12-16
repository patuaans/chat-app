const authService = require('./authService');

const home = (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    const username = req.session.username;
    res.render('index', { username });
};

const loginForm = (req, res) => {
    if (req.session.username) {
        return res.redirect('/');
    }
    const error = req.flash('error');
    const formData = req.session.formData || {};
    delete req.session.formData;
    res.render('login', { error, formData });
};

const login = async (req, res) => {
    try {
        await authService.login(req, res);
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login');
        res.redirect('/login');
    }
};

const registerForm = (req, res) => {
    if (req.session.username) {
        return res.redirect('/');
    }
    const error = req.flash('error');
    const formData = req.session.formData || {};
    delete req.session.formData;
    res.render('register', { error, formData });
};

const register = async (req, res) => {
    try {
        await authService.register(req, res);
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'An error occurred during registration');
        res.redirect('/register');
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/login');
    });
};

module.exports = { home, loginForm, login, registerForm, register, logout };