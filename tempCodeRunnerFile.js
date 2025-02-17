
const { DateTime } = require('luxon');

// Simulating the schema and model setup
const KushalUserSchema = {
    joinDate: {
        type: Date,
        default: () => {
            return DateTime.now().setZone('Asia/Kolkata').toJSDate();
        }
    },
};

// Simulating the model methods
const KushalUser = {
    pre: (action, callback) => {
        // Simulating save action triggering
        if (action === 'save') {
            const context = { joinDate: DateTime.now().setZone('Asia/Kolkata').toJSDate() };
            callback.call(context, () => console.log('Saved:', context));
        }
    },
};

// Simulating creating a new user and saving
const newUser = new KushalUserSchema();
newUser.joinDate = DateTime.now().setZone('Asia/Kolkata').toJSDate();
KushalUser.pre('save', function (next) {
    this.joinedMonthAndYear = DateTime.fromJSDate(this.joinDate).setZone('Asia/Kolkata').toFormat('MMMM yyyy');
    next();
});

// Simulating the save process
newUser.save();

