const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const productSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            trim: true,
            required: true,
            default: null
        },
        name: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
);

productSchema.plugin(mongoose_delete);

// Middleware
// Error handling
productSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
        next(error);
    } else {
        next();
    }
});

const Product = mongoose.model(
    "product",
    productSchema
);

module.exports = Product;
