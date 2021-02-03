const Order = require('../models/orders');

module.exports = {
  //Metodo para crear un pedido
  createOrder: async (req, res) => {
    const {
      name,
      lastName,
      email,
      observation,
      paymentMethod,
      items,
      total,
      subtotal,
      iva,
    } = req.body;
    const newOrder = {
      name,
      lastName,
      email,
      observation,
      paymentMethod,
      items: items.map(x => ({ ...x, status: 'pending' })),
      total,
      subtotal,
      iva,
    };

    try {
      const orderCreated = new Order(newOrder);
      await orderCreated.save();
      res.json({
        status: 'OK',
        message: '',
        data: orderCreated,
      });
    } catch (error) {
      res.json({
        status: 'KO',
        message: error.message,
        data: null,
      });
    }
  },
  //Metodo para obtener un pedido
  getOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const order = await Order.findOne({ id });
      res
        .json({
          status: 'OK',
          message: '',
          data: order,
        })
        .status(200);
    } catch (error) {
      res
        .json({
          status: 'KO',
          message: error.message,
          data: null,
        })
        .status(403);
    }
  },
  //Metodo para obtener todos los pedidos
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find();
      res
        .json({
          status: 'OK',
          message: '',
          data: orders,
        })
        .status(200);
    } catch (error) {
      res
        .json({
          status: 'KO',
          message: error.message,
          data: null,
        })
        .status(403);
    }
  },
};
