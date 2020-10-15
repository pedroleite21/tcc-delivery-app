const asyncHandler = require('express-async-handler');
const db = require('../models');

const Payments = db.payments;

exports.findAll = asyncHandler(async (req, res) => {
  try {
    const payments = await Payments.findAll({
      attributes: ['id', 'name'],
    });
    if (!payments) {
      return res.status(404).send({
        message: 'Payment methods not found',
      });
    }

    return res.status(200).send(payments);
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
});
