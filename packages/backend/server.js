const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const socketIo = require('socket.io');

let rootEnv;
if (process.env.NODE_ENV === 'production') {
  rootEnv = path.join(__dirname, '../', '../', '../', '.env');
} else {
  rootEnv = path.join(__dirname, '../', '../', '.env');
}
dotenv.config({ path: rootEnv });

const db = require('./src/models');
const initDb = require('./src/initDb');

const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const customerRoutes = require('./src/routes/customer.routes');
const itemRoutes = require('./src/routes/item.routes');
const orderRoutes = require('./src/routes/order.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const paymentRoutes = require('./src/routes/payment.routes');

async function startServer() {
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

  const server = app.listen(process.env.PORT || 3000, (error) => {
    if (error) {
      console.error('❌ Oops...');
      console.error(error);
      process.exit(1);
    }

    console.info('Server is running on port 3000.');
  });

  const io = socketIo(server);

  authRoutes(app);
  categoryRoutes(app);
  customerRoutes(app);
  itemRoutes(app);
  orderRoutes(app, io);
  uploadRoutes(app);
  paymentRoutes(app);
}

startServer();
