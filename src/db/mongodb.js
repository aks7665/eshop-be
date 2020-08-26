// Mongo DB Connection
const mongoose = require('mongoose');
const { seedAdmin } = require('../seeders/admin.seeder');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to database.');
    /** execute seeders */
	seedAdmin();
}).catch((e) => {
    console.log('Database connection failed.');
});
