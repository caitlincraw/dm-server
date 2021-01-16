'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Orders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Orders.belongsTo(models.User, {
                foreignKey: 'paperstore'
            })
        }
    };
    Orders.init({
        ordernum: DataTypes.STRING,
        orderprice: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Orders',
    });
    return Orders;
};