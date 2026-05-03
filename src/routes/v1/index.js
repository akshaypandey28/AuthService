const express = require('express');

const router = express.Router();

const UserController = require('../../controllers/user-controller.js');
const {AuthRequestValidators} = require('../../middlewares/index.js');

router.post(
    '/signUp', 
    AuthRequestValidators.validateUserAuth,
    UserController.createUser,
);
router.post(
    '/signIn', 
    AuthRequestValidators.validateUserAuth,
    UserController.signIn,
);

module.exports = router;