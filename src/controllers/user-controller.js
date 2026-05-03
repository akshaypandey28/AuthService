const UserService = require('../services/user-services.js');

const userService = new UserService();

const createUser = async (req,res) =>{
    try {
        const response = await userService.create({
            email:req.body.email,
            password:req.body.password
        });

        return res.status(201).json({
            data:response,
            message:'User created successfully at controller layer',
            success:true,
            err:{}
        })
    } catch (error) {
        console.log("Something went wrong in the controller layer");
        return res.status(500).json({
            data:{},
            message:'Something went wrong in the controller layer while creating the user',
            success:false,
            err:error
        })
    }
}

const signIn = async (req, res) => {
    try {
        const response = await userService.signIn(req.body.email, req.body.password);
        return res.status(200).json({
            success: true,
            data: response,
            err: {},
            message: 'Successfully signed in'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in the controller layer while signing in',
            data: {},
            success: false,
            err: error
        });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticated(token);
        return res.status(200).json({
            success: true,
            err: {},
            data: response,
            message: 'user is authenticated and token is valid'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            data: {},
            success: false,
            err: error
        });
    }
}

module.exports = {
    createUser,
    signIn
}