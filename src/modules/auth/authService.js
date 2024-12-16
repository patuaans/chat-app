const { validationResult } = require('express-validator');
const { User } = require('../../models/user');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        req.session.formData = req.body;
        return res.redirect('/login');
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/login');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/login');
    }

    req.session.username = username;
    res.redirect('/');
};

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        req.session.formData = req.body;
        return res.redirect('/register');
    }

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username: username,
        password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
};

module.exports = { login, register };