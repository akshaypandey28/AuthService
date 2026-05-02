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

module.exports = {
    createUser
}