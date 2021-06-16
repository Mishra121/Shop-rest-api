const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


const OrdersController = require('../controllers/orderController');

router.get('/', checkAuth, OrdersController.order_get_all)

router.post('/', checkAuth, OrdersController.orders_create_order)

router.get('/:orderId', checkAuth, OrdersController.orders_get_order)

router.delete('/:orderId', checkAuth, OrdersController.orders_del_order)

module.exports = router;