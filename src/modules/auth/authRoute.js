const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { loginValidator, registerValidator } = require('../../middlewares/validate');

router.get('/', authController.home);
router.get('/login', authController.loginForm);
router.post('/login', loginValidator, authController.login);
router.get('/register', authController.registerForm);
router.post('/register', registerValidator, authController.register);
router.get('/logout', authController.logout);

module.exports = router;