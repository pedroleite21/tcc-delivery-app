const asyncHandler = require('express-async-handler');
const db = require('../models');

const Address = db.addresses;
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

    socket.emit('new_order', order.id);

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
      attributes: ['id', 'status', 'value', 'takeout'],
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

exports.updateStatus = asyncHandler(async (req, res) => {
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

    return res.send({
      message: 'Updated order status',
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error retriving Order with id ${id} `,
    });
  }
});
