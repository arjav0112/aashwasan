const { Cashfree } = require("cashfree-pg"); 
const express = require('express');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./service-account-key.json');
const registerUser = require('./models/user');
const GoogleUser = require('./models/googleuser');
const KushalCollege = require('./models/colleges');
const GigUserProfile = require('./models/userprofile');
const Cities = require('./models/cities');
const KushalUser = require('./models/kushalUser');
const OTP = require('./models/otp');
const KushalGig = require('./models/kushalgig');
const PendingKushalGig = require('./models/pendingkushalgig');
const DeviceToken = require('./models/devicetoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
// const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Groq = require("groq-sdk")
const cors = require('cors')
const { google } = require('googleapis')
const fs = require("fs")
const path = require("path")

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const url = "mongodb+srv://aashwasan445:2FXuldBckjw2mOTn@aashwasan.r9ia2.mongodb.net/?retryWrites=true&w=majority&appName=aashwasan";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url)
        console.log("Status", "Connected to MongoDB"); // Changed log message for consistency
    } catch (error) {
        console.error("Error connecting to MongoDB:", error); // Added error log
        process.exit(1);
    }
};
connectDB();
const oneYearInSeconds = 1000 * 86400;

// app.use((req, res, next) => {
//     res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
//     next();
// });

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
    next();
});



//generate agreement

const groq = new Groq({ apiKey: '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' });


async function getGroqChatCompletion(mess) {
    const chatCompletion = await groq.chat.completions.create({
    messages: mess,
    model: "llama-3.3-70b-versatile",
  });
  return chatCompletion.choices[0]?.message?.content || ""
}

async function generateAgreement(agreementDetails) {
    console.log(agreementDetails);
    const messages = [
        {
            role: "system",
            content: `You are a professional contract writer. Your task it to generate an agreement based on the given details. Follow this template for generating the template: 
ESCROW AGREEMENT

This Escrow Agreement (“Agreement”) is made effective as of [EffectiveDate] by and between:

Client: [ClientName], residing at [ClientAddress] (“Client”)
Freelancer: [FreelancerName], residing at [FreelancerAddress] (“Freelancer”)
Aashwasan: [EscrowAgentName], located at [EscrowAgentAddress] 

WHEREAS, the Client and Freelancer entered into a Service Agreement dated [ServiceAgreementDate] whereby the Freelancer shall perform certain services (“Services”) for the Client; and

WHEREAS, the parties wish to establish an escrow arrangement to secure the payment for Services rendered by the Freelancer;

NOW, THEREFORE, the parties agree as follows:

1. **Deposit of Funds**
   - The Client shall deposit an amount of [DepositAmount] [Currency] (“Escrow Funds”) with the Escrow Agent.
   - The Escrow Funds will be held until the Services are completed in accordance with the Service Agreement or until such time as other conditions specified herein are met.

2. **Release of Funds**
   - Upon confirmation by the Client that the Services have been satisfactorily completed, the Escrow Agent shall release the Escrow Funds to the Freelancer.
   - In the event of a dispute, the Escrow Funds shall remain in escrow until the dispute is resolved per Section 5.

3. **Obligations**
   - **Client:** Must deposit the funds, review the completed work within [ReviewPeriod] days, and notify the Escrow Agent of approval or dispute in writing.
   - **Freelancer:** Must perform the Services in accordance with the Service Agreement.
   - **Escrow Agent:** Shall act as a neutral party, hold the Escrow Funds securely, and release funds only in accordance with the terms set forth herein.

4. **Fees and Expenses**
   - The Escrow Agent shall charge a fee of [EscrowAgentFee]. Any additional expenses will be allocated as follows: [ExpenseAllocation].

5. **Dispute Resolution**
   - If the Client disputes the completion of Services, notice must be given to the Escrow Agent within [DisputeNotificationPeriod] days.
   - The parties agree to resolve disputes through good faith negotiations. If unresolved within [MediationPeriod] days, the dispute shall be submitted to binding arbitration in accordance with [ArbitrationRules].
   - During any dispute resolution process, the Escrow Funds shall remain with the Escrow Agent.

6. **Term and Termination**
   - This Agreement shall remain in effect until the Escrow Funds are either fully released or returned to the Client.
   - Either party may terminate this Agreement by providing [NoticePeriod] days’ written notice, subject to any outstanding obligations under the Service Agreement.

7. **Governing Law**
   - This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

8. **Miscellaneous**
   - This Agreement constitutes the entire understanding among the parties with respect to the subject matter herein.
   - Any amendments must be made in writing and signed by all parties.
   - If any provision of this Agreement is held to be invalid, the remaining provisions shall remain in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

__________________________        __________________________        __________________________  
[ClientName]                      [FreelancerName]               [EscrowAgentName]  
Signature                         Signature                      Signature

Date: ___________________         Date: ___________________         Date: ___________________
            `
        },
        {
          role: "user",
          content: JSON.stringify(agreementDetails),
        },
      ];
      const response = await getGroqChatCompletion(messages);
      return response;
}

app.get('/get_agreement', async (req, res) => {
    const agreementDetails = {
        effectiveDate: "2023-10-01",
        serviceAgreementDate: "2023-09-01",
        client: {
            name: "Arjav",
            address: "Sector-3,Delhi"
        },
        freelancer: {
            name: "Sachin Sharma",
            address: "Sector-24,Mumbai"
        },
        escrowAgent: {
            name: "Aashwasan",
            address: "Delhi"
        },
        depositAmount: 10000,
        currency: "INR",
        reviewPeriod: 14,
        disputeNotificationPeriod: 7,
        mediationPeriod: 30,
        noticePeriod: 15,
        escrowAgentFee: "2%",
        expenseAllocation: "Client",
        jurisdiction: "INDIA",
        arbitrationRules: "AAA Rules"
    };

    // {
    //     "$schema": "http://json-schema.org/draft-07/schema#",
    //     "title": "EscrowAgreementDetails",
    //     "type": "object",
    //     "properties": {
    //       "effectiveDate": {
    //         "type": "string",
    //         "format": "date",
    //         "description": "The date the escrow agreement becomes effective."
    //       },
    //       "serviceAgreementDate": {
    //         "type": "string",
    //         "format": "date",
    //         "description": "The date of the underlying service agreement."
    //       },
    //       "client": {
    //         "type": "object",
    //         "properties": {
    //           "name": { "type": "string" },
    //           "address": { "type": "string" }
    //         },
    //         "required": ["name", "address"]
    //       },
    //       "freelancer": {
    //         "type": "object",
    //         "properties": {
    //           "name": { "type": "string" },
    //           "address": { "type": "string" }
    //         },
    //         "required": ["name", "address"]
    //       },
    //       "escrowAgent": {
    //         "type": "object",
    //         "properties": {
    //           "name": { "type": "string" },
    //           "address": { "type": "string" }
    //         },
    //         "required": ["name", "address"]
    //       },
    //       "depositAmount": {
    //         "type": "number",
    //         "description": "The amount of money to be held in escrow."
    //       },
    //       "currency": {
    //         "type": "string",
    //         "minLength": 3,
    //         "maxLength": 3,
    //         "description": "The currency code (e.g., USD, EUR)."
    //       },
    //       "reviewPeriod": {
    //         "type": "integer",
    //         "description": "The number of days within which the Client must review the work."
    //       },
    //       "disputeNotificationPeriod": {
    //         "type": "integer",
    //         "description": "The number of days within which the Client must notify the Escrow Agent of a dispute."
    //       },
    //       "mediationPeriod": {
    //         "type": "integer",
    //         "description": "The number of days allowed for mediation in the event of a dispute."
    //       },
    //       "noticePeriod": {
    //         "type": "integer",
    //         "description": "The number of days required for notice of termination."
    //       },
    //       "escrowAgentFee": {
    //         "type": "string",
    //         "description": "Details of the fee charged by the Escrow Agent (e.g., fixed amount or percentage)."
    //       },
    //       "expenseAllocation": {
    //         "type": "string",
    //         "description": "Explanation of how any additional expenses are allocated among the parties."
    //       },
    //       "jurisdiction": {
    //         "type": "string",
    //         "description": "The governing law jurisdiction for the agreement."
    //       },
    //       "arbitrationRules": {
    //         "type": "string",
    //         "description": "Reference to the arbitration rules that will govern dispute resolution."
    //       }
    //     },
    //     "required": [
    //       "effectiveDate",
    //       "serviceAgreementDate",
    //       "client",
    //       "freelancer",
    //       "escrowAgent",
    //       "depositAmount",
    //       "currency",
    //       "reviewPeriod",
    //       "disputeNotificationPeriod",
    //       "mediationPeriod",
    //       "noticePeriod",
    //       "jurisdiction"
    //     ]
    //   }  
    // const agreementDetails = req.body;
    try {
        const agreement = await generateAgreement(agreementDetails);
        res.send(agreement);
    } catch (error) {
        res.status(500).send("Error generating agreement: " + error.message);
    }
    });


// Generate JWT
const generateToken = (user) => {
    const payload = { userId: user.userId, email: user.email, username: user.username, kushalID: user.kushalId, joinDate: user.joinDate, joinedMonthAndYear: user.joinedMonthAndYear, isProfileCreated: user.isProfileCreated };
    return jwt.sign(payload, 'bca74da09e63498957ee45740ab9bf5b16c22920a4a014c66d291628a1791b24', { expiresIn: oneYearInSeconds });
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('No token provided.');

    jwt.verify(token, 'bca74da09e63498957ee45740ab9bf5b16c22920a4a014c66d291628a1791b24', (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token.');
        req.userId = decoded.userId;
 
        next();
    });
};

// End POint to register user using form
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log('Received registration request:', { username, email });

    try {
        // Check if username and email are already in use
        console.log('Checking if username or email already exists...');
        const existingUser = await KushalUser.findOne({ $or: [{ username }, { email }] });
        // console.log(existingUser);
        if (existingUser) {
            console.log('Username or email already exists:', { username, email });
            return res.status(400).send('Username or email already exists');
        }

        // Hash the password
        console.log('Hashing the password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        console.log('Creating new user...');
        const newUser = new registerUser({ username, email, password: hashedPassword });
        await newUser.save();
        console.log('New user created:', { username, email });
        const userId = uuidv4();
        await createUserInKushalUsers(userId, username, email, hashedPassword);
        // Send email verification
        // console.log('Sending verification email...');
        // sendVerificationEmail(email);

        res.status(201).send('User registered successfully. Please check your email for verification.');
        console.log('Registration successful for user:', { username, email });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

//drive api
const CLIENT_ID = '811538287917-9me3ni2t2b8nuk87ab3mjbt88nh4k06u.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04izepTXW3AUdCgYIARAAGAQSNwF-L9Iro9u-r_NbsOUWBBKeB_1XAsLPAwx7e9oZpRPmhFSzyjDYD4SRIDojwBAbYLNX56DoRik';


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
})

// console.log(filepath);

const uploadflies = async (filepath)=>{
    try{
        const response = await drive.files.create({
            requestBody: {
                name: 'ABCDEF.pdf',
                mimeType: 'application/pdf',
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(filepath)
            }
        })
        
        // console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err.message)
    }
}


app.get("/uploadfile",async (req,res)=>{
    try{
        const filepath = path.join(__dirname,'graph.pdf')
        const response = await uploadflies(filepath);
        if(!response){
            throw err = "Some error Found";
        }

        // console.log(response);

        res.send(response);
    }catch(err){
        console.log(err)
    }
})

//payment api


// const cashfree = new Cashfree({
//     mode:"sandbox" //or production
// });


Cashfree.XClientId = 'TEST1048322367f436d20581684f220132238401';
Cashfree.XClientSecret = 'cfsk_ma_test_14666c0492605737a735ea295bf696df_019ed38c';
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateorderid(){
    const uniqueid = crypto.randomBytes(16).toString("hex");

    const hash = crypto.createHash('sha256');
    hash.update(uniqueid);

    const orderId = hash.digest('hex');

    return orderId.substr(0,12)
}

app.get("/orders",async (req,res)=>{
    
    let request = {
      "order_amount": "1",
      "order_currency": "INR",
      "order_id": await generateorderid(),
      "customer_details": {
        "customer_id": "SH",
        "customer_name": "sachin",
        "customer_email": "arjav@gmail.com",
        "customer_phone": "9090407368"
      },
    }
  
    Cashfree.PGCreateOrder("2023-08-01",request).then((response) => {
      var a = response.data;
      console.log(a)
    //   console.log("Current Environment:", Cashfree.XEnvironment);

      res.send(a);
    })
      .catch((error) => {
        // console.log("Current Environment:", Cashfree.XEnvironment);
        console.error('Error setting up order request:', error.response.data);
      });
  
})


// Endpoint to save user data
app.post('/api/google', async (req, res) => {
    console.log("Received request to save user data");

    const { userId, username, email } = req.body;

    try {
        // Check if a user with the same email already exists
        console.log("Checking if user already exists");
        const existingUser = await KushalUser.findOne({ email: email });

        if (existingUser) {
            // If the user already exists, update their information
            console.log("User already exists, updating information");
            const token = generateToken(existingUser);
            console.log("User updated successfully");
            res.status(200).send({ message: 'User updated successfully', token: token });
        } else {
            // If the user does not exist, create a new user
            const hashedPassword = await generateRandomPassword();
            console.log("User does not exist, creating new user");
            const newUser = new GoogleUser({ userId: userId, email, username, password: hashedPassword });
            await newUser.save();
            const username2 = await generateRandomUsername();
            console.log("New user saved successfully");
            await createUserInKushalUsers(userId, username2, email, hashedPassword);
            const token = generateToken(user);
            res.status(201).send({ message: 'User saved successfully', token: token });
        }
    } catch (error) {
        console.error('Error saving/updating user:', error); // Log the error message
        res.status(500).send('Error saving/updating user');
    }
});



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.kushalaide@gmail.com',
        pass: 'tckh hgsc irov xzuw'
        // tckh hgsc irov xzuw
    }
});

const sendVerificationEmail = async (email, otp, username) => {
    const mailOptions = {
        from: 'app.kushalaide@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Hi ${username}, Your OTP for email verification is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};
const sendForgetpassVerificationEmail = async (email, otp, username) => {
    const mailOptions = {
        from: 'app.kushalaide@gmail.com',
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Hi ${username}, Your OTP To Change your Password is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};

// Endpoint to send OTP for email verification
// Endpoint to send OTP for email verification
app.post('/api/sendotp', async (req, res) => {
    const { email, username } = req.body;

    console.log('Received request to send OTP to email:', email);

    try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('Generated OTP:', otp);

        // Find the existing OTP entry
        const existingOTP = await OTP.findOne({ email });

        if (existingOTP) {
            const currentTime = new Date();
            const lastSentTime = new Date(existingOTP.lastSent);
            const timeDiff = (currentTime - lastSentTime) / 1000 / 60; // Time difference in minutes

            if (timeDiff < 1) { // If less than 1 minute has passed
                return res.status(429).send('Please wait before requesting a new OTP');
            }

            // Update the existing OTP entry
            existingOTP.otp = otp;
            existingOTP.lastSent = currentTime;
            await existingOTP.save();
            console.log('OTP updated for email:', email);
        } else {
            // Create a new OTP entry
            await OTP.create({ email, otp, username, lastSent: new Date() });
            console.log('OTP saved to database for email:', email);
        }

        await sendVerificationEmail(email, otp, username);
        console.log('Verification email sent to:', email);

        res.status(200).send('OTP sent to email');
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Error sending OTP');
    }
});

// Endpoint to verify OTP
app.post('/api/verifyotp', async (req, res) => {
    const { email, otp } = req.body;

    console.log('Verifying OTP for email:', email);
    console.log('Received OTP:', otp);

    try {
        const record = await OTP.findOne({ email, otp });
        if (!record) {
            console.log('Invalid or expired OTP');
            return res.status(400).send('Invalid or expired OTP');
        }

        console.log('OTP verified successfully');
        await OTP.deleteOne({ email, otp });
        res.status(200).send('Email verified successfully');
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Error verifying OTP');
    }
});




// Creating a KushalProfile Automatic no end point
const createUserInKushalUsers = async (userId, username, email, hashedPassword) => {
    try {

        const kushalId = generateKushalId();
        const joinDate = new Date();
        const joinedMonthAndYear = joinDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

        const newUser = new KushalUser({ userId, username, email, kushalId, joinDate, joinedMonthAndYear, isProfileCreated: false, password: hashedPassword });
        await newUser.save();
        console.log('New user added to KushalUsers:', { userId, username, email });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            throw new Error('Email already registered with us');
        } else {
            throw new Error('Error creating user in KushalUsers');
        }
    }
};
// Endpoint to login user
app.post('/api/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    console.log('Received login request for:', emailOrUsername);

    try {
        // Check if user exists by email
        const user = await KushalUser.findOne({ email: emailOrUsername });

        // If user doesn't exist by email, check by username
        if (!user) {
            const userByUsername = await KushalUser.findOne({ username: emailOrUsername });
            if (!userByUsername) {
                console.log('User not found:', emailOrUsername);
                return res.status(404).send('User not found');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, userByUsername.password);
            if (!isPasswordValid) {
                console.log('Password does not match');
                return res.status(400).send('Password does not match');
            }
            const token = generateToken(user);
            // User authenticated by username
            console.log('User authenticated:', userByUsername.username);
            res.status(200).json({ message: 'Login successful', user: userByUsername, token: token });
        } else {
            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Password does not match');
                return res.status(400).send('Password does not match');
            }
            const token = generateToken(user);
            // User authenticated by email
            console.log('User authenticated:', user.email);
            res.status(200).json({ message: 'Login successful', token: token });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});


app.post('/api/profile', verifyToken, async (req, res) => {
    console.log('Request body:', req.body); // Debugging point: Log the request body

    const { fullName, phoneNumber, city, college, courseName, userId } = req.body;

    try {
        // Retrieve user details from KushalUser
        const user = await KushalUser.findOne({ userId: userId });
        // console.log('Request body:', user.userId); // Debugging point: Log the request body
        if (!user) {
            console.log('User not found'); // Debugging point: Log if user is not found
            return res.status(404).send('User not found');
        }

        // Check if the profile already exists
        const existingProfile = await GigUserProfile.findOne({ userId: req.userId });
        if (existingProfile) {
            console.log('Profile already exists'); // Debugging point: Log if profile already exists
            return res.status(400).send('Profile already exists');
        }

        // Create new profile
        const newProfile = new GigUserProfile({
            userId: userId,
            username: user.username,
            email: user.email,
            fullName,
            phoneNumber,
            city,
            college,
            courseName,
            kushalId: user.kushalId,
            joinedMonthAndYear: user.joinedMonthAndYear,
            joinDate: user.joinDate,
        });

        await newProfile.save();
        user.isProfileCreated = true;
        await user.save();
        console.log('Profile created successfully'); // Debugging point: Log if profile is created successfully
        const token = generateToken(user);
        res.status(201).send({ message: 'Profile created successfully', token: token });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).send('Error creating profile');
    }
});
// Endpoint to fetch Gig user profile
app.get('/api/gig-profile', verifyToken, async (req, res) => {
    const userId = req.userId; // Assuming userId is extracted from JWT token

    try {
        // Fetch KushalUser details
        const user = await KushalUser.findOne({ userId });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        // Fetch GigUserProfile based on userId
        const profile = await GigUserProfile.findOne({ userId });
        if (!profile) {
            console.log('Gig profile not found');
            return res.status(404).send('Gig profile not found');
        }

        // Return the profile data
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching Gig profile:', error);
        res.status(500).send('Error fetching Gig profile');
    }
});
// Function to generate a uniue KushalID
const generateKushalId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const getRandomDigit = () => digits[Math.floor(Math.random() * digits.length)];

    let middlePart = '';

    for (let i = 0; i < 10; i++) {
        if (i === 0 || i === 9) { // Ensure 5th and 14th positions are digits
            middlePart += getRandomDigit();
        } else {
            middlePart += Math.random() < 0.5 ? getRandomLetter() : getRandomDigit();
        }
    }

    return `KUSH${middlePart}AL`;
};
const generateRandomPassword = async () => {
    const randomPassword = crypto.randomBytes(8).toString('hex'); // Generates a random 16-character password
    const hashedPassword = await bcrypt.hash(randomPassword, 10); // Hash the random password
    return hashedPassword;
};

// Endpoint to check if email is registered and send OTP
app.post('/api/forgotpassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await KushalUser.findOne({ email });

        if (!user) {
            console.log('Email not registered:', email);
            return res.status(404).send('Email not registered');
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const existingOTP = await OTP.findOne({ email });
        const username = user.username;
        if (existingOTP) {
            const currentTime = new Date();
            const lastSentTime = new Date(existingOTP.lastSent);
            const timeDiff = (currentTime - lastSentTime) / 1000 / 60; // Time difference in minutes

            if (timeDiff < 1) { // If less than 1 minute has passed
                console.log('Please wait before requesting a new OTP:', email);
                return res.status(429).send('Please wait before requesting a new OTP');
            }

            // Update the existing OTP entry
            existingOTP.otp = otp;
            existingOTP.lastSent = currentTime;
            await existingOTP.save();
            console.log('OTP updated for email:', email);
        } else {
            await OTP.create({ email, otp, username, lastSent: new Date() });
            console.log('OTP saved to database for email:', email);
        }

        await sendForgetpassVerificationEmail(email, otp, user.username);
        console.log('OTP sent to email:', email);
        res.status(200).send('OTP sent to email');
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).send('Error during forgot password');
    }
});

// Endpoint to reset password
app.post('/api/resetpassword', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await KushalUser.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return res.status(404).send('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        console.log('Password reset successfully for user:', email);
        res.status(200).send('Password reset successfully');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
});

// Funcion to generate a random usernme
const adjectives = ["Quick", "Bright", "Sunny", "Calm", "Wise", "Brave", "Bold", "Sharp", "Smart", "Swift", "Trendy", "Creative", "Active", "Elegant", "Fashionable", "Friendly", "Tech-savvy", "Dynamic", "Innovative", "Joyful", "Modern", "Positive", "Stylish", "Kushal"];
const nouns = ["Fox", "Lion", "Tiger", "Bear", "Eagle", "Shark", "Whale", "Wolf", "Hawk", "Stag", "Student", "Learner", "Explorer", "Achiever", "Scholar", "Enthusiast", "Genius", "Pioneer", "Visionary", "Mentor", "Creator", "Dreamer", "Guru", "Expert", "Wizard", "Aide"];
const generateRandomUsername = async () => {
    let username = '';
    let isUnique = false;

    while (!isUnique) {
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const number = Math.floor(Math.random() * 100); // Generate a random number

        username = `${adjective}${noun}${number}`; // Combine to create a username

        // Check if the username meets the criteria
        if (
            username.length >= 6 &&
            username.length <= 12 &&
            !/\s/.test(username) &&                  // No spaces
            /^[a-zA-Z0-9]+$/.test(username)          // Only alphanumeric characters
        ) {
            // Check if the username is unique
            const existingUser = await KushalUser.findOne({ username: username });
            if (!existingUser) {
                isUnique = true; // Set isUnique to true to exit the loop
            }
        }
    }

    return username;
};
app.post('/api/devicetoken', verifyToken, async (req, res) => {
    const { userId, deviceToken } = req.body;

    try {
        if (!userId || !deviceToken) {
            return res.status(400).send('Missing userId or deviceToken in request.');
        }

        const existingToken = await DeviceToken.findOne({ userId });
        const currentTime = new Date();

        if (existingToken) {
            const timeDifference = currentTime - existingToken.lastTokenSaveTime;
            if (timeDifference < 5 * 24 * 60 * 60 * 1000) { // 5 days in milliseconds
                return res.status(200).send('Token update not needed.');
            }
            existingToken.deviceToken = deviceToken;
            existingToken.lastTokenSaveTime = currentTime;
            await existingToken.save();
            return res.status(200).send('Token updated successfully.');
        }

        const newDeviceToken = new DeviceToken({ userId, deviceToken, lastTokenSaveTime: currentTime });
        await newDeviceToken.save();
        res.status(201).send('Device token saved successfully.');
    } catch (error) {
        console.error('Error saving device token:', error);
        res.status(500).send('Error saving device token.');
    }
});

app.get('/api/colleges', verifyToken, async (req, res) => {
    try {
        const colleges = await KushalCollege.find().lean();
        res.status(200).json(colleges);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).send('Error fetching colleges');
    }
});
app.post('/api/addcollege', async (req, res) => {
    const { name } = req.body;
    console.log('Received request to add college:', name);

    try {
        // Check if college already exists
        const existingCollege = await KushalCollege.findOne({ name: name });
        if (existingCollege) {
            console.log('College already exists:', name);
            return res.status(400).send('College already exists');
        }

        // Add new college
        const newCollege = new KushalCollege({ name });
        await newCollege.save();
        console.log('College added successfully:', name);
        res.status(201).send('College added successfully');
    } catch (error) {
        console.error('Error adding college:', error);
        res.status(500).send('Error adding college');
    }
});

app.get('/api/cities', verifyToken, async (req, res) => {
    try {
        const cities = await Cities.find().lean();
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).send('Error fetching cities');
    }
});
// POST /api/kushal-gigs
app.post('/api/kushal-gigs', verifyToken, async (req, res) => {
    const userId = req.userId;
    const {
        title,
        description,
        type,
        subject,
        numberOfPages,
        topics,
        cost,
        dueDate // Assuming dueDate is provided by the user
    } = req.body;

    try {
        const gigId = generateGigId(); // Generate unique gig ID
        const newGig = new KushalGig({
            userId,
            gigId,
            title,
            description,
            type,
            subject,
            numberOfPages,
            topics,
            cost,
            dueDate
        });

        await newGig.save();
        res.status(201).send({ message: 'Kushal Gig created successfully', gigId });
    } catch (error) {
        console.error('Error creating Kushal Gig:', error);
        res.status(500).send('Error creating Kushal Gig');
    }
});
// POST /api/pending-kushal-gigs
app.post('/api/pending-kushal-gigs', verifyToken, async (req, res) => {
    const userId = req.userId;
    const {
        title,
        description,
        type,
        subject,
        numberOfPages,
        topics,
        cost
    } = req.body;

    try {
        const gigId = generateGigId(); // Generate unique gig ID
        const newPendingGig = new PendingKushalGig({
            userId,
            gigId,
            title,
            description,
            type,
            subject,
            numberOfPages,
            topics,
            cost
        });

        await newPendingGig.save();
        res.status(201).send({ message: 'Pending Kushal Gig created successfully', gigId });
    } catch (error) {
        console.error('Error creating Pending Kushal Gig:', error);
        res.status(500).send('Error creating Pending Kushal Gig');
    }
});

const generateGigId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const getRandomDigit = () => digits[Math.floor(Math.random() * digits.length)];

    let middlePart = '';

    for (let i = 0; i < 12; i++) {
        if (i === 4 || i === 11) { // Ensure 5th and 12th positions are digits
            middlePart += getRandomDigit();
        } else {
            middlePart += Math.random() < 0.5 ? getRandomLetter() : getRandomDigit();
        }
    }

    return `KUSH${middlePart}GIGS`;
};

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
