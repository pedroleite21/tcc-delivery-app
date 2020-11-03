const asyncHandler = require('express-async-handler');
const moment = require('moment');
const db = require('../models');

const { Op } = db.Sequelize;

const Address = db.addresses;
const Customers = db.customers;
const Item = db.items;
const OptionItems = db.option_items;
const OrderDelivery = db.orders_delivery;
const OrderItems = db.order_items;
const OrderOptionItems = db.order_option_items;
const OrderPayment = db.orders_payment;
const Orders = db.orders;
const Payments = db.payments;

const ORDER_STATUS = [
  'awaiting_confirmation',
  'confirmed',
  'on_route',
  'delivered',
];

exports.create = asyncHandler(async (req, res, next, socket) => {
  const { items, delivery, payment } = req.body;

  try {
    if (!delivery.takeout && !delivery.addressId) {
      return res.status(400).send({
        message: 'A delivery address should be selected',
      });
    }

    if (!payment) {
      return res.status(400).send({
        message: 'A payment method should be selected',
      });
    }

    if (!items) {
      return res.status(400).send({
        message: 'An order should have items',
      });
    }

    const orderInfo = {
      ...req.body,
      customerId: req.body.userId,
      takeout: delivery.takeout,
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

    if (!delivery.takeout) {
      const orderDeliveryInfo = {
        takeout: delivery.takeout,
        addressId: delivery.addressId,
        orderAddId: order.id,
      };

      await OrderDelivery.create(orderDeliveryInfo);
    }

    const paymentInfo = await Payments.findByPk(payment.paymentId);
    if (!paymentInfo) {
      return res.status(400).send({
        message: 'Payment id not found',
      });
    }

    const orderPaymentInfo = {
      paymentId: payment.paymentId,
      orderPayId: order.id,
      change: payment.change,
    };

    await OrderPayment.create(orderPaymentInfo);

    const resReturn = res.status(200).send({
      orderId: order.id,
      message: 'Order created',
    });

    socket.of('/admin').emit('new_order', order.id);

    return resReturn;
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
      attributes: [
        'id',
        'status',
        'value',
        'takeout',
        'createdAt',
        'updatedAt',
      ],
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
        {
          model: Address,
          as: 'addresses',
          attributes: [
            'id',
            'name',
            'address_1',
            'address_2',
            'locality',
          ],
          through: {
            model: OrderDelivery,
            attributes: ['takeout'],
          },
        },
        {
          model: Payments,
          as: 'payments',
          attributes: ['id', 'name'],
          through: {
            model: OrderPayment,
            attributes: ['change'],
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
    console.error(err);
    return res.status(500).send({
      message: `Error retriving Order with id ${id}`,
    });
  }
});

function getPagination(page, size) {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}

function getPagingData(data, page, limit) {
  const { count: totalItems } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, totalPages, currentPage };
}

exports.findAll = asyncHandler(async (req, res) => {
  const { page, size, status } = req.query;
  const { limit, offset } = getPagination(page, size);
  const condition = status ? { status: { [Op.eq]: status } } : null;

  try {
    const data = await Orders.findAndCountAll({
      where: condition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
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
        {
          model: Address,
          as: 'addresses',
          attributes: [
            'id',
            'name',
            'address_1',
            'address_2',
            'locality',
          ],
          through: {
            model: OrderDelivery,
            attributes: ['takeout'],
          },
        },
        {
          model: Payments,
          as: 'payments',
          attributes: ['id', 'name'],
          through: {
            model: OrderPayment,
            attributes: ['change'],
          },
        },
      ],
    });

    let orders = data.rows.map((el) => el.get({ plain: true }));
    orders = await Promise.all(
      orders.map(async (order) => {
        let newItems = order.items;

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

        const customer = await Customers.findByPk(order.customerId, {
          attributes: ['name'],
        });

        return {
          ...order,
          items: newItems,
          customer,
        };
      }),
    );

    const pagingData = getPagingData(data, page, limit);

    return res.send({
      ...pagingData,
      orders,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error retriving Orders`,
    });
  }
});

exports.updateStatus = asyncHandler(
  async (req, res, next, socket) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const order = await Orders.findByPk(id);
      if (!order || !status || ORDER_STATUS.indexOf(status) === -1) {
        return res.status(404).send({
          message: 'Error, verify parameters',
        });
      }

      order.status = status;
      order.save();

      const resResult = res.send({
        message: 'Updated order status',
      });

      if (status === 'confirmed' || status === 'on_route') {
        const orderInfo = {
          id: order.id,
          status,
        };

        socket
          .of(`/user/${order.customerId}`)
          .emit('order_status', JSON.stringify(orderInfo));
      }

      return resResult;
    } catch (err) {
      return res.status(500).send({
        message: `Error retriving Order with id ${id} `,
      });
    }
  },
);

exports.findOrdersDay = asyncHandler(async (req, res) => {
  const day = moment();
  const startOfDay = day.startOf('day').toDate();
  const endOfDay = day.endOf('day').toDate();

  Orders.findAndCountAll({
    where: {
      createdAt: {
        [Op.gt]: startOfDay,
        [Op.lt]: endOfDay,
      },
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occured while retrieving today's orders",
      });
    });
});

exports.findOngoingOrders = asyncHandler(async (req, res) => {
  try {
    const ongoingOrders = await Orders.findAll({
      where: {
        status: {
          [Op.in]: ['awaiting_confirmation', 'confirmed', 'on_route'],
        },
      },
      order: [['createdAt', 'ASC']],
      attributes: [
        'id',
        'status',
        'value',
        'takeout',
        'createdAt',
        'updatedAt',
      ],
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
        {
          model: Address,
          as: 'addresses',
          attributes: [
            'id',
            'name',
            'address_1',
            'address_2',
            'locality',
          ],
          through: {
            model: OrderDelivery,
            attributes: ['takeout'],
          },
        },
        {
          model: Payments,
          as: 'payments',
          attributes: ['id', 'name'],
          through: {
            model: OrderPayment,
            attributes: ['change'],
          },
        },
      ],
    });

    let orders = ongoingOrders.map((el) => el.get({ plain: true }));

    orders = await Promise.all(
      orders.map(async (order) => {
        let newItems = order.items;

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

        return {
          ...order,
          items: newItems,
        };
      }),
    );

    return res.send(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: `Error retriving ongoing orders`,
    });
  }
});
