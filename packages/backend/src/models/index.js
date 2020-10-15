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

db.payments = require('./payment_methods.model')(
  sequelize,
  Sequelize,
);
db.addresses = require('./address.model')(sequelize, Sequelize);
db.categories = require('./category.model')(sequelize, Sequelize);
db.customers = require('./customer.model')(sequelize, Sequelize);
db.items = require('./item.model')(sequelize, Sequelize);
db.items_options = require('./item_options.model')(
  sequelize,
  Sequelize,
);
db.option_items = require('./option_items.model')(
  sequelize,
  Sequelize,
);
db.order_items = require('./order_item.model')(sequelize, Sequelize);
db.order_option_items = require('./order_options_item.model')(
  sequelize,
  Sequelize,
);
db.orders = require('./order.model')(sequelize, Sequelize);
db.orders_delivery = require('./order_delivery.model')(
  sequelize,
  Sequelize,
);
db.orders_payment = require('./order_payments.model')(
  sequelize,
  Sequelize,
);
db.restaurants = require('./restaurant.model')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize);

db.categories.hasMany(db.items, { as: 'items' });
db.items.belongsTo(db.categories, {
  foreignKey: 'categoryId',
  as: 'category',
});

db.restaurants.hasOne(db.addresses, {
  foreignKey: 'addressId',
});
db.addresses.belongsTo(db.restaurants);

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

db.items_options.hasMany(db.option_items, { as: 'items' });
db.option_items.belongsTo(db.items_options, {
  foreignKey: 'itemId',
  as: 'item',
});

db.items.hasMany(db.items_options, { as: 'options' });
db.items_options.belongsTo(db.items, {
  foreignKey: 'optionId',
  as: 'item',
});

db.option_items.belongsToMany(db.order_items, {
  as: 'order_option_items',
  foreignKey: 'orderOptionItemId',
  otherKey: 'orderItemId',
  through: db.order_option_items,
});
db.order_items.belongsToMany(db.option_items, {
  as: 'order_option_items',
  foreignKey: 'orderItemId',
  otherKey: 'orderOptionItemId',
  through: db.order_option_items,
});

db.orders.belongsToMany(db.addresses, {
  as: 'addresses',
  foreignKey: 'orderAddId',
  otherKey: 'addressId',
  through: db.orders_delivery,
});
db.addresses.belongsToMany(db.orders, {
  as: 'orders_add',
  foreignKey: 'addressId',
  otherKey: 'orderAddId',
  through: db.orders_delivery,
});

db.orders.belongsToMany(db.payments, {
  as: 'payments',
  foreignKey: 'orderPayId',
  otherKey: 'paymentId',
  through: db.orders_payment,
});
db.payments.belongsToMany(db.orders, {
  as: 'orders_pay',
  foreignKey: 'paymentId',
  otherKey: 'orderPayId',
  through: db.orders_payment,
});

db.orders.belongsToMany(db.items, {
  as: 'items',
  foreignKey: 'orderId',
  otherKey: 'itemId',
  through: db.order_items,
});
db.items.belongsToMany(db.orders, {
  as: 'orders',
  foreignKey: 'itemId',
  otherKey: 'orderId',
  through: db.order_items,
});

module.exports = db;
