require('dotenv').config({ path: '../../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Socket = require('socket.io');

const db = require('./src/models');
const initDb = require('./src/initDb');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync({ force: true }).then(() => {
    initDb.createAdminUser();
    initDb.populatePaymentMethods();
  });
} else {
  db.sequelize.sync();
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to bezkoder application.' });
});

app.use((_, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept',
  );

  next();
});

require('./src/routes/auth.routes')(app);
require('./src/routes/category.routes')(app);
require('./src/routes/customer.routes')(app);
require('./src/routes/item.routes')(app);
require('./src/routes/order.routes')(app);
require('./src/routes/upload.routes')(app);
require('./src/routes/payment.routes')(app);

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});

/* Socket server */
const io = new Socket(server);

io.on('connection', () => {
  console.log('Made socket connection');
});
