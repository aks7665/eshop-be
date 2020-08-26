const multer = require("multer");
const Product = require("../models/product.model");

/**
 *
 * Upload Product Image
 *
 */
let storage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/products");
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        const tempFileName =
            file.fieldname +
            "-" +
            datetimestamp +
            "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1];
        req.fileUrl = tempFileName;
        cb(null, tempFileName);
    }
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 5242880 // in bytes 5MB
    },
    onFileUploadStart: function (file) {
        const fileMime = file.mimetype;
        const fileMimeSplit = fileMime.split("/");
        if (fileMimeSplit[0] == "image") {
            cb(null, true);
        } else {
            cb(new Error("Please upload only images only."));
        }
    }
}).single("product_image");

exports.add_new_product = async (req, res) => {
    await upload(req, res, async function (err) {
        if (err) {
            return res.status(200).send({
                status: false,
                status_code: 200,
                error: err,
                error_fields: ["image"],
                message: "Error in file size/extension."
            });
        }

        try {
            const body = req.body;

            if (req.hasOwnProperty("fileUrl")) {
                body.image = req.fileUrl;
            }

            const product = new Product(body);
            const result = await product.save();

            if (!result) {
                throw new Error("Error while creating product.");
            }

            return res.status(200).send({
                status: true,
                status_code: 201,
                result,
                message: "Product created successfully."
            });
        } catch (error) {
            return res.status(200).send({
                status: false,
                status_code: 400,
                error,
                message: error.message ? error.message : "Error while creating product."
            });
        }
    });
};

exports.fetch_all_product = async (req, res) => {
    try {
        const result = await Product.find({
            deleted: false
        }).sort({
            createdAt: 1
        });

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

exports.fetch_product = async (req, res) => {
    try {
        const _id = req.params.id;

        const result = await Product.findById(_id);

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

exports.delete_product = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await Product.deleteOne({
            _id: id
        });

        if (!result) {
            throw new Error("Error while deleting product.");
        }

        return res.status(200).send({
            status: true,
            status_code: 202,
            message: "Product deleted."
        });
    } catch (error) {
        return res.status(200).send({
            status: false,
            status_code: 400,
            error,
            message: error.message || 'Error while deleting product.'
        });
    }
};

exports.update_product = async (req, res) => {
    await upload(req, res, async function (err) {
        if (err) {
            return res.status(200).send({
                status: false,
                status_code: 200,
                error: err,
                error_fields: ["image"],
                message: "Error in file size/extension."
            });
        }

        try {
            const id = req.params.id;
            const body = req.body;

            if (req.hasOwnProperty("fileUrl")) {
                body.image = req.fileUrl;
            }

            const result = await Product.findOneAndUpdate({
                _id: id
            }, body, {
                new: true,
                runValidators: true
            });

            if (!result) {
                throw new Error("Error while updating product.");
            }

            return res.status(200).send({
                status: true,
                status_code: 201,
                result,
                message: "Product updated successfully."
            });
        } catch (error) {
            return res.status(200).send({
                status: false,
                status_code: 400,
                error,
                message: error.message ? error.message : "Error while updating product."
            });
        }
    });
};