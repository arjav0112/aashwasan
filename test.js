// const moment = require('moment-timezone');

// const currentDateUTC = new Date(); // Capture current time in UTC
// const currentDateIST = moment.tz(currentDateUTC, 'Asia/Kolkata');
// const joinDate = moment().utcOffset("+05:30").format(); // Convert back to Date object (optional)

// console.log("Current time in UTC:", currentDateUTC);
// console.log("Current time in IST:", joinDate); 

// const { format } = require('date-fns');
// const { format, utcToZonedTime } = require('date-fns-tz');

// // Function to format and display the current time in a given time zone
// function displayTimeInTimeZone(timeZone) {
//     const now = new Date();
//     const zonedDate = zonedTimeToUtc(now, timeZone);
//     const formattedDate = format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
//     console.log(`Current time in ${timeZone}: ${formattedDate}`);
// }

// // Define the time zones you want to display
// const timeZones = [
//     'America/New_York',
//     'Europe/London',
//     'Asia/Tokyo',
//     'Australia/Sydney',
//     'Asia/Kolkata' // Added India's time zone
// ];

// // Display the current time in each of the defined time zones
// timeZones.forEach(displayTimeInTimeZone);
// const { format } = require('date-fns');
// const { utcToZonedTime } = require('date-fns-tz');

// // Function to format and display the current time in a given time zone
// function displayTimeInTimeZone(timeZone) {
//     const now = new Date();
//     const zonedDate = utcToZonedTime(now, timeZone);
//     const formattedDate = format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
//     console.log(`Current time in ${timeZone}: ${formattedDate}`);
// }

// // Define the time zones you want to display
// const timeZones = [
//     'America/New_York',
//     'Europe/London',
//     'Asia/Tokyo',
//     'Australia/Sydney',
//     'Asia/Kolkata' // Added India's time zone
// ];

// // Display the current time in each of the defined time zones
// timeZones.forEach(displayTimeInTimeZone);


// const { DateTime } = require('luxon');

// // Simulating the schema and model setup
// const KushalUserSchema = {
//     joinDate: {
//         type: Date,
//         default: () => {
//             return DateTime.now().setZone('Asia/Kolkata').toJSDate();
//         }
//     },
// };

// // Simulating the model methods
// const KushalUser = {
//     pre: (action, callback) => {
//         // Simulating save action triggering
//         if (action === 'save') {
//             const context = { joinDate: DateTime.now().setZone('Asia/Kolkata').toJSDate() };
//             callback.call(context, () => console.log('Saved:', context));
//         }
//     },
// };

// // Simulating creating a new user and saving
// const newUser = new KushalUserSchema();
// newUser.joinDate = DateTime.now().setZone('Asia/Kolkata').toJSDate();
// KushalUser.pre('save', function (next) {
//     this.joinedMonthAndYear = DateTime.fromJSDate(this.joinDate).setZone('Asia/Kolkata').toFormat('MMMM yyyy');
//     next();
// });

// // Simulating the save process
// newUser.save();


const { DateTime } = require('luxon');

// Function to display the current date and time in a given time zone
function displayTimeInTimeZone(timeZone) {
  const dt = DateTime.now().setZone(timeZone);
  console.log(`Current time in ${timeZone}: ${dt.toFormat('yyyy-MM-dd HH:mm:ss')}`);
}

// Define the time zones you want to display
const timeZones = [
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Asia/Kolkata' // Added India's time zone
];

// Display the current time in each of the defined time zones
timeZones.forEach(displayTimeInTimeZone);
