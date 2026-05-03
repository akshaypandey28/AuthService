const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');

const UserRepository = require('../repository/user-repository.js');
const {JWT_KEY} = require('../config/serverConfig.js');
const AppError = require('../utils/error-handler.js');

class UserService {
    constructor(){
        this.userRepository = new UserRepository();
    }
    
    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw error;
            }
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async signIn(email, plainPassword) {
        try {

            // step 1-> fetch the user using the email
            const user = await this.userRepository.getByEmail(email);

            if (!user) {
                throw new AppError(
                    'UserNotFound',
                    'User does not exist',
                    'No user found with given email',
                    StatusCodes.NOT_FOUND
                );
            }

            // step 2-> compare incoming plain password with stores encrypted password
            const passwordsMatch = this.#checkPassword(plainPassword, user.password); //true or false

            if (!passwordsMatch) {
                throw new AppError(
                    'IncorrectPassword',
                    'Password mismatch',
                    'Entered password is incorrect',
                    StatusCodes.UNAUTHORIZED
                );
            }


            // step 3-> if passwords match then create a token and send it to the user
            const newJWT = this.#createToken({email: user.email, id: user.id});

            return newJWT;
        } catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.#verifyToken(token);
            if(!response) {
                throw {error: 'Invalid token'}
            }
            const user = await this.userRepository.getById(response.id);
            if(!user) {
                throw {error: 'No user with the corresponding token exists'};
            }
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the auth process");
            throw error;
        }
    }

    #createToken(user){ //user is object
        try {
            const result = jwt.sign(user, JWT_KEY, {expiresIn: '1d'});
            return result;
        } catch (error) {
            console.log("Something went wrong in the service layer while token creation");
        }
    }

    #verifyToken(token) {
        try {
            const response = jwt.verify(token, JWT_KEY); //returns the payload (data) that was used when the token was created, after verifying it
            return response;
        } catch (error) {
            console.log("Something went wrong in the service layer while token validation", error);
            throw error;
        }
    }

    #checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword); //return boolean value
        } catch (error) {
            console.log("Something went wrong in service layer in password comparison");
            throw error;
        }
    }

    isAdmin(userId) {
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log("Something went wrong in service layer while checking for admin role");
            throw error;
        }
    }
}

module.exports = UserService;