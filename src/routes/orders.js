const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');

router.post('/new', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.get('', orderController.getOrders);

module.exports = router;
