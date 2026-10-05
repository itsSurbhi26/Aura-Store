const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const OrderItem = require('../models/order-item');

router.get('/', async (req, res) => {
    const orderList = await Order.find()
    .populate('user', 'name').sort({'dateOrdered': -1})
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    });

    if (!orderList) {
        return res.status(500).json({ success: false });
    }
    res.send(orderList);
})

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.send(order);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Invalid order ID', error: err.message });
    }
})

router.post('/', async (req, res) => {
   
    const orderItemsIds = Promise.all(req.body.orderItems.map( async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a+ b , 0 );

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if (!order)
        return res.status(404).send('Order cannot be created')
    res.send(order);
})

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, {
        new: true
    })

    if (!order)
        return res.status(404).send('Order cannot be created')
    res.send(order);
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async order => {
        if (order) {
            await Promise.all(order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem);
            }));
            return res.status(200).json({ success: true, message: 'Order deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err });
    });
})

router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments();
    if (orderCount === undefined || orderCount === null) {
        return res.status(500).json({ success: false })
    }
    res.status(200).send({
        orderCount: orderCount
    });
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, totalsales:{ $sum :'$totalPrice'}}}
    ])

    if (!totalSales || totalSales.length === 0){
        return res.send({ totalsales: 0 });
    }
    res.send({ totalsales: totalSales.pop().totalsales });
})

router.get('/get/usersorders/:userid', async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid})
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        return res.status(500).json({ success: false });
    }
    res.send(userOrderList);
})

module.exports = router;