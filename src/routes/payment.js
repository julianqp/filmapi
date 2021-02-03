const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe');

router.post('/stripe/new', stripeController.newPayment);
router.post('/stripe/refund/:id', stripeController.refund);
router.post('/stripe/partialrefund/:id', stripeController.partialRefund);
router.post('/stripe/wb', stripeController.wb);

module.exports = router;
