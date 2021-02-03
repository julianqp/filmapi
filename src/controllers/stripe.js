const config = require('../config/config');
const Orders = require('../models/orders');
const Stripe = require('../models/stripe');
const stripe = require('stripe')(config.stripe_sk);

const YOUR_DOMAIN = 'http://localhost:3000';

module.exports = {
  //Metodo para crear un nuevo pago
  newPayment: async (req, res) => {
    const { id, items, email } = req.body;

    try {
      const info = {
        payment_method_types: ['card'],
        customer_email: email,
        line_items: items.map(item => {
          return {
            price_data: {
              currency: 'eur',
              product_data: {
                name: item.title,
                images: [`https://image.tmdb.org/t/p/w500${item.poster}`],
              },
              unit_amount: item.price * 100,
            },
            quantity: 1,
          };
        }),
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/checkout/${id}`,
        cancel_url: `${YOUR_DOMAIN}/cart`,
      };

      const session = await stripe.checkout.sessions.create(info);

      const order = await Orders.findOne({ id }, { _id: 1 });

      const infoStripe = {
        pi: session.payment_intent,
        amount: session.amount_total / 100,
        order: order._id,
      };

      const stripeCreated = new Stripe(infoStripe);
      await stripeCreated.save();

      res.json({
        status: 'OK',
        message: '',
        id: session.id,
      });
    } catch (error) {
      res.json({
        status: 'KO',
        message: error.message,
        data: null,
      });
    }
  },
  //Metodo para crear un reembolso total
  refund: async (req, res) => {
    const { id } = req.params;

    try {
      const order = await Orders.findOne({ id: parseInt(id, 10) });
      const items = order.items.map(x => {
        const newItem = {
          pendingRefund: true,
          _id: x._id,
          title: x.title,
          id: x.id,
          price: x.price,
          poster: x.poster,
          status: 'pending-refund',
        };
        return newItem;
      });
      await Orders.findByIdAndUpdate(order._id, {
        $set: {
          pendingRefund: true,
          status: 'pending-refund',
          items,
        },
      });

      const payment = await Stripe.findOne({ order: order._id });
      await stripe.refunds.create({
        payment_intent: payment.pi,
      });

      return res.json({
        status: 'OK',
        message: '',
        data: true,
      });
    } catch (error) {
      await Orders.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { $set: { pendingRefund: true } },
      );
      return res.json({
        status: 'KO',
        message: error.message,
        data: null,
      });
    }
  },
  //Metodo para crear un reembolso parcial
  partialRefund: async (req, res) => {
    const { id } = req.params;
    const { title, price } = req.body;

    try {
      const order = await Orders.findOneAndUpdate(
        { id: parseInt(id, 10), 'items.title': title },
        {
          $set: {
            'items.$.pendingRefund': true,
            'items.$.status': 'pending-refund',
          },
        },
      );
      const payment = await Stripe.findOne({ order: order._id });
      await stripe.refunds.create({
        amount: price * 100,
        payment_intent: payment.pi,
      });

      return res.json({
        status: 'OK',
        message: '',
        data: true,
      });
    } catch (error) {
      await Orders.findOneAndUpdate(
        { id: parseInt(id, 10) },
        { $set: { pendingRefund: true } },
      );
      return res.json({
        status: 'KO',
        message: error.message,
        data: null,
      });
    }
  },
  //Configuración del webhook
  wb: async (req, res) => {
    try {
      const { data } = req.body;
      const pi = data.object.payment_intent;
      if (data.object.refunded) {
        const payment = await Stripe.findOneAndUpdate(
          { pi },
          { $set: { status: 'refunded' } },
          {
            new: true,
          },
        );
        await Orders.findByIdAndUpdate(
          payment.order,
          { $set: { status: 'refunded' } },
          {
            new: true,
          },
        );
      } else {
        const payment = await Stripe.findOneAndUpdate(
          { pi },
          { $set: { status: data.object.payment_status } },
          {
            new: true,
          },
        );
        await Orders.findByIdAndUpdate(
          payment.order,
          { $set: { status: data.object.payment_status } },
          {
            new: true,
          },
        );
      }
      res.json({
        status: 'OK',
        message: '',
        data: null,
      });
    } catch (error) {
      res.json({
        status: 'KO',
        message: error.message,
        data: null,
      });
    }
  },
};
