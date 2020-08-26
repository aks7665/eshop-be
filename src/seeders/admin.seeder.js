const User = require("../models/user.model");

/** create admin account */
exports.seedAdmin = async () => {
	try {
		/** check if already populated */
        const usersCollection = await User.find({ role: 'admin'});
		if (usersCollection.length > 0) {
            return;
        }
        
		const admin = new User({
            name: 'Admin User',
            email: 'admin@mail.com',
            password: '12345678',
            role: 'admin'
        });
        
		/** create new database entry for admin */
        await User.create(admin);
        console.log('Admin seeder added.');
	} catch (error) {
		console.log('Seeder: Error - ', error);
	}
}