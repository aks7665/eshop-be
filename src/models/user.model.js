const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongoose_delete = require("mongoose-delete");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            required: true,
            trim: true,
            lowercase: true,
            default: 'user'
        },
    },
    {
        timestamps: true
    }
);

// Index
userSchema.index({ from: 1 });

// Enable beautifying on this schema
userSchema.plugin(mongoose_delete);
userSchema.plugin(beautifyUnique);

// Middleware
// Error handling
userSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
        next(error);
    } else {
        next();
    }
});

// To hash password before saving a user into database
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8); // Here 8 is no of rounds
    }
    next();
});

// To remove password and tokens from user data before sending reaponse to client
userSchema.methods.toClean = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.__v;

    return userObject;
};

const User = mongoose.model(
    "user",
    userSchema
);

module.exports = User;
