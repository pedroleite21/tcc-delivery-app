module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define('address', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    primary: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },
    address_1: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    address_2: {
      type: Sequelize.TEXT,
    },
    locality: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return Address;
};
