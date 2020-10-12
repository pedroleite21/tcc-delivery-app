const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.addresses = require('./address.model')(sequelize, Sequelize);
db.categories = require('./category.model')(sequelize, Sequelize);
db.customers = require('./customer.model')(sequelize, Sequelize);
db.items = require('./item.model')(sequelize, Sequelize);
db.order_items = require('./order_item.model')(sequelize, Sequelize);
db.orders = require('./order.model')(sequelize, Sequelize);
db.restaurants = require('./restaurant.model')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);

db.categories.hasMany(db.items, { as: 'items' });
db.items.belongsTo(db.categories, {
  foreignKey: 'categoryId',
  as: 'category',
});

db.customers.hasMany(db.addresses, { as: 'addresses' });
db.addresses.belongsTo(db.customers, {
  foreignKey: 'customerId',
  as: 'customer',
});

db.customers.hasMany(db.orders, { as: 'orders' });
db.orders.belongsTo(db.customers, {
  foreignKey: 'customerId',
  as: 'customer',
});

db.orders.belongsToMany(db.items, {
  through: db.order_items,
  foreignKey: 'itemId',
  otherKey: 'orderId',
});
db.items.belongsToMany(db.orders, {
  through: db.order_items,
  foreignKey: 'orderId',
  otherKey: 'itemId',
});

module.exports = db;
