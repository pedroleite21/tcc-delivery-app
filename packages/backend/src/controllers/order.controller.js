const asyncHandler = require('express-async-handler');
const db = require('../models');

const Item = db.items;
const OrderItems = db.order_items;
const Orders = db.orders;

exports.create = asyncHandler(async (req, res) => {
  const { items } = req.body;

  try {
    if (!items) {
      res.status(400).send({
        message: 'An order should have items',
      });
    }

    const orderInfo = {
      ...req.body,
      customerId: req.body.userId,
    };

    const order = await Orders.create(orderInfo);

    // eslint-disable-next-line consistent-return
    items.forEach(async (item) => {
      const product = await Item.findByPk(item.id);
      if (!product) {
        return res.status(400).send({
          message: 'Non existing product',
        });
      }

      const orderItemsInfo = {
        itemId: item.id,
        orderId: order.id,
        quantity: item.qty,
      };

      await OrderItems.create(orderItemsInfo);
    });

    return res.status(200).send({
      orderId: order.id,
      message: 'Order created',
    });
  } catch (err) {
    return res.status(500).send({
      message:
        err.message || 'Some error occurred while creating the Order',
    });
  }
});

exports.findOne = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id, {
      include: [
        {
          model: Item,
          as: 'items',
          required: false,
          attributes: ['id', 'name'],
          through: {
            model: OrderItems,
            as: 'itemOrders',
            attributes: ['quantity'],
          },
        },
      ],
    });
    if (!order) {
      return res.status(404).send({
        message: 'Order not found!',
      });
    }

    return res.send(order);
  } catch (err) {
    return res.status(500).send({
      message: `Error retriving Order with id ${id}`,
    });
  }
});

exports.updateStatus = (req, res) => {
  const { id } = req.params;

  Orders.findByPk(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: 'Order',
        });
      }

      return res.send({
        message: 'Updated order status',
      });
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Order with id ${id}`,
      });
    });
};
