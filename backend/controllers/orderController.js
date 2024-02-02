import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// Create new order
// POST api/orders
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length == 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        //define new order
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        return res.status(201).json(createdOrder);
    }
});

// Get order by id
// GET api/orders
const getAllOrders = asyncHandler(async (req, res) => {
    res.send('Get all orders');
});

// Get logged-in orders
// GET api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    return res.status(200).json(orders);
});

// Get order by id
// GET api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        return res.status(200).json(order);
    } else {
        return res.status(404).json('Order not found');
    }
});

// Update paid status of the order
// PUT api/orders/:id/pay

const updateOrderPaid = asyncHandler(async (req, res) => {
    res.send('Update paid status of the order');
});

// Update delivered status of the order
// PUT api/orders/:id/deliver

const updateOrderDelivered = asyncHandler(async (req, res) => {
    res.send('Update delivered status of the order');
});


export { addOrderItems, getAllOrders, getMyOrders, getOrderById, updateOrderDelivered, updateOrderPaid };