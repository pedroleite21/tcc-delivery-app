require('dotenv').config({ path: '../../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/models');

const corsOptions = {
  origin: 'http://localhost:8081',
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ force: true });
} else {
  db.sequelize.sync();
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to bezkoder application.' });
});

require('./src/routes/category.routes')(app);
require('./src/routes/product.routes')(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
