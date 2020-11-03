const asyncHandler = require('express-async-handler');
const db = require('../models');

const Restaurant = db.restaurants;
const Address = db.addresses;

exports.createUpdate = asyncHandler(async (req, res) => {
  const { address, userId, userEmail, ...rest } = req.body;

  try {
    const data = await Restaurant.findByPk(1);

    if (!data) {
      // create new
      const restaurant = await Restaurant.create(rest);

      const addressData = {
        restaurantId: restaurant.id,
        name: 'Restaurant address',
        ...address,
      };

      await Address.create(addressData);
    } else {
      // update
      await data.update(rest);

      const addressInstance = await Address.findOne({
        where: {
          restaurantId: data.id,
        },
      });

      addressInstance.update(address);
    }

    return res.send({
      message: 'Tudo certo',
    });
  } catch (err) {
    return res.status(500).send({
      message:
        err.message ||
        "Some error occurred while creating/updating the Restaurant's info",
    });
  }
});

exports.getRestaurantInfo = asyncHandler(async (req, res) => {
  try {
    const data = await Restaurant.findOne({
      where: {
        id: 1,
      },
    });

    if (!data) {
      return res.send({});
    }

    const address = await Address.findOne({
      where: {
        restaurantId: data.id,
      },
    });

    return res.send({
      ...data.get({ plain: true }),
      address: address.get({ plain: true }),
    });
  } catch (err) {
    return res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving the Restaurant's info",
    });
  }
});
