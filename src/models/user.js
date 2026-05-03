'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

const { SALT } = require('../config/serverConfig.js');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role,{
        through: 'User_Roles',
      })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user,options) =>{
    // console.log("Before creating the user in the database");
    // console.log(user);

    const encryptedPassord = bcrypt.hashSync(user.password,SALT); //this will give encrypted password using bcrypt and salt
    user.password = encryptedPassord; //replacing the password with the encrypted password before saving in the database

  })
  return User;
};