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

db.categories = require('./category.model.js')(sequelize, Sequelize);
db.products = require('./product.model.js')(sequelize, Sequelize);

db.categories.hasMany(db.products, { as: 'products' });
db.products.belongsTo(db.categories, {
  foreignKey: 'categoryId',
  as: 'category',
});

module.exports = db;
