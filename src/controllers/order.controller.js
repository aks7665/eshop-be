const Order = require("../models/order.model");

exports.add_new_order = async (req, res) => {
    try {
        const body = req.body;
        body.buyer = req.logged_in_user._id;

        const order = new Order(body);
        const result = await order.save();

        if (!result) {
            throw new Error("Error while creating order.");
        }

        return res.status(200).send({
            status: true,
            status_code: 201,
            result,
            message: "Order created successfully."
        });
    } catch (error) {
        return res.status(200).send({
            status: false,
            status_code: 400,
            error,
            message: error.message ? error.message : "Error while creating order."
        });
    }
};

exports.fetch_all_order = async (req, res) => {
    try {
        const result = await Order.find({}).sort({
            createdAt: 1
        }).populate(
            [{
                path: 'buyer',
                select: {
                    name: 1
                }
            }, {
                path: 'products.product',
                select: {
                    name: 1,
                    image: 1
                }
            }]
        );

        if (!result) {
            throw new Error("Error while fetching records.");
        }

        return res.status(200).send({
            status: true,
            status_code: 200,
            result,
            message: "Records fetched."
        });
    } catch (error) {
        return res.status(200).send({
            status: false,
            status_code: 500,
            error,
            message: error.message ? error.message : "Error while fetching records."
        });
    }
};