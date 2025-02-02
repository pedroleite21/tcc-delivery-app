const asyncHandler = require('express-async-handler');
const db = require('../models');

const Item = db.items;
const ItemOptions = db.items_options;
const OptionsItems = db.option_items;

const { Op } = db.Sequelize;

exports.createItem = (req, res) => {
  if (!req.body.name && !req.body.categoryId) {
    res.status(400).send({
      message: 'Item name and categoryId cannot be empty!',
    });
    return;
  }

  const item = {
    basePrice: req.body.basePrice,
    categoryId: req.body.categoryId,
    description: req.body.description,
    featured: req.body.featured,
    image: req.body.image,
    name: req.body.name,
  };

  const { itemOptions } = req.body;

  Item.create(item)
    .then((data) => {
      if (Array.isArray(itemOptions) && itemOptions.length > 0) {
        // eslint-disable-next-line consistent-return
        itemOptions.forEach(({ items = [], ...rest }) => {
          if (items.length === 0) {
            return res.status(400).status({
              mesasge: "An option shouldn't be empty",
            });
          }

          ItemOptions.create({
            ...rest,
            itemId: data.id,
          }).then((d) => {
            items.forEach((value) => {
              OptionsItems.create({ ...value, itemOptionId: d.id });
            });
          });
        });
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occurred while creating the Item',
      });
    });
};

exports.updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { itemOptions, userId, userEmail, ...itemInfo } = req.body;
  try {
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).send({
        message: `Item with id = ${id} not found`,
      });
    }

    await item.update(itemInfo);

    await Promise.all(
      itemOptions.forEach(async (option) => {
        const {
          createdAt,
          id: opId,
          itemId,
          items,
          optionId,
          updatedAt,
          ...info
        } = option;

        const itemOp = await ItemOptions.findByPk(opId);

        if (itemOp) {
          await itemOp.update(info);

          if (Array.isArray(items) && items.length > 0) {
            items.forEach(async (opItem) => {
              const {
                createdAt: _createdAt,
                id: opItemId,
                itemId: _itemId,
                optionId: _optionId,
                updatedAt: _updatedAt,
                itemOptionId,
                ...rest
              } = opItem;

              const opItemInstance = await OptionsItems.findByPk(
                opItemId,
              );

              if (opItemInstance) {
                await opItemInstance.update(rest);
              }
            });
          }
        }
      }),
    );

    return res.send({
      message: 'Update com sucesso',
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error updating Item with id ${id}`,
    });
  }
});

exports.findAll = (req, res) => {
  Item.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occured while retrieving items',
      });
    });
};

exports.findOne = (req, res) => {
  const { id } = req.params;

  Item.findByPk(id, {
    include: {
      model: ItemOptions,
      as: 'options',
      include: {
        model: OptionsItems,
        as: 'items',
      },
    },
    order: [
      [{ model: ItemOptions, as: 'options' }, 'position', 'ASC'],
    ],
  })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: 'Item not found',
        });
      }

      return res.send(data);
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retriving Item with id ${id}`,
      });
    });
};

exports.findFeatured = (req, res) => {
  Item.findAll({
    where: {
      featured: {
        [Op.eq]: true,
      },
    },
    order: [['updatedAt', 'DESC']],
    limit: 5,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          'Some error occured while retrieving featured items',
      });
    });
};
