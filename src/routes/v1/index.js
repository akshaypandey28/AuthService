const express = require('express');

const router = express.Router();

const UserController = require('../../controllers/user-controller.js');

router.post('/signUp', UserController.createUser);
router.post('/signIn', UserController.signIn);

module.exports = router;