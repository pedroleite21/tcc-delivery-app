const asyncHandler = require('express-async-handler');
const db = require('../models');

const Item = db.items;
const OrderItems = db.order_items;
const Orders = db.orders;
const OptionItems = db.option_items;
const OrderOptionItems = db.order_option_items;

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

      const orderItem = await OrderItems.create(orderItemsInfo);

      const { options } = item;
      if (options && Array.isArray(options) && options.length > 0) {
        // eslint-disable-next-line consistent-return
        options.forEach(async (option) => {
          const optionItem = await OptionItems.findByPk(option.id);
          if (!optionItem) {
            return res.status(400).send({
              message: 'Non existing option',
            });
          }

          const optionItemOrderInfo = {
            orderItemId: orderItem.id,
            orderOptionItemId: option.id,
            quantity: option.qty,
          };

          await OrderOptionItems.create(optionItemOrderInfo);
        });
      }
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
      attributes: ['id', 'status', 'value'],
      include: [
        {
          model: Item,
          as: 'items',
          attributes: ['id', 'name'],
          through: {
            model: OrderItems,
            attributes: ['quantity', 'id'],
          },
        },
      ],
    });
    if (!order) {
      return res.status(404).send({
        message: 'Order not found!',
      });
    }

    let newItems = order.get('items', { plain: true });
    newItems = await Promise.all(
      newItems.map(async (item) => {
        const newItem = item;
        const optionOrderItems = await OrderOptionItems.findAll({
          where: {
            orderItemId: newItem.order_item.id,
          },
        });

        newItem.options = await Promise.all(
          optionOrderItems.map(async (o) => {
            const optionItem = await OptionItems.findByPk(
              o.orderOptionItemId,
            );

            return {
              quantity: o.quantity,
              name: optionItem.name,
              optionId: o.orderOptionItemId,
            };
          }),
        );

        return newItem;
      }),
    );

    return res.send({
      ...order.get({ plain: true }),
      items: newItems,
    });
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
        message: `Error retriving Order with id ${id} `,
      });
    });
};
