const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            // User ID
            type: mongoose.Schema.Types.ObjectId,
            ref: "user" // Table Name
        },
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "product" // Table Name
                    },
                    quantity: {
                        type: Number
                    }
                }
            ]
        }
    },
    {
        timestamps: true
    }
);

// Middleware
// Error handling
orderSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
        next(error);
    } else {
        next();
    }
});

const Order = mongoose.model(
    "order",
    orderSchema
);

module.exports = Order;
