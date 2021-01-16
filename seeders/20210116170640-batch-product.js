'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [{
        description: 'Test Brand. A ream of paper',
        image: 'paper1.jpg',
        price: 5,
        quantity: 15,
        title: 'Paper 1',
        createdAt: new Date(),
        updatedAt: new Date(),
    }, {
      description: 'Tru Red Brand. A ream of paper',
      image: 'paper2.jpg',
      price: 10,
      quantity: 15,
      title: 'Paper 2',
      createdAt: new Date(),
      updatedAt: new Date(),
  }, {
    description: 'Hammermill Brand. A ream of paper',
    image: 'paper3.jpg',
    price: 15,
    quantity: 15,
    title: 'Paper 3',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
