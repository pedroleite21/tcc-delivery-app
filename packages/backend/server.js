require('dotenv').config({ path: '../../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/models');
const initDb = require('./src/initDb');

const corsOptions = {
  origin: 'http://localhost:8081',
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ force: true }).then(() => {
    initDb.createAdminUser();
  });
  // db.sequelize.sync({ force: true });
} else {
  db.sequelize.sync();
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to bezkoder application.' });
});

require('./src/routes/category.routes')(app);
require('./src/routes/customer.routes')(app);
require('./src/routes/item.routes')(app);
require('./src/routes/order.routes')(app);
require('./src/routes/auth.routes')(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
