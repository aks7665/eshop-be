const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.user_registration = async (req, res) => {
    try {
        const body = req.body;

        const user = new User(body);

        let result = await user.save();

        return res.status(200).send({
            status: true,
            status_code: 201,
            user: result,
            message: "User registerted successfully."
        });
    } catch (error) {
        let error_fields = [];
        if (error.hasOwnProperty("errors")) {
            for (let key in error.errors) {
                error_fields.push(key);
            }
        }

        return res.status(200).send({
            status: false,
            status_code: 400,
            error,
            error_fields,
            message: error.message ? error.message : "Error while registering user."
        });
    }
};

// Login user
exports.user_login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            email,
            deleted: false
        });

        if (!user) {
            throw new Error("Username/Password combination is invalid."); // User Doesn't Exist or Deleted.
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Username/Password combination is invalid.");
        }

        // Generate JWT token
        const token = await jwt.sign({
                _id: user._id.toString(),
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d"
            }
        );
        
        let result = user.toClean();
        result.token = token;

        return res.status(200).send({
            status: true,
            status_code: 200,
            user: result,
            message: "User Logged In."
        });
    } catch (error) {
        return res.status(200).send({
            status: false,
            status_code: 400,
            error,
            message: error.message || 'Error while logging in user.'
        });
    }
};