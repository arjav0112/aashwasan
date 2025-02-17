const express = require('express');
const mongoose = require('mongoose');
const Product = require('./product');

const app = express();

// Middleware
app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}))

const Productdata = []
const url = "mongodb+srv://aashwasan445:2FXuldBckjw2mOTn@aashwasan.r9ia2.mongodb.net/?retryWrites=true&w=majority&appName=aashwasan";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url)
        console.log("Status", "Connected to mongo")

        app.post("/api/addproduct", async (req, res) => {
            console.log("Results", req.body);


            let data = Product(req.body);

            try {
                let datatostore = await data.save()
                res.status(200).json(datatostore);
            } catch (error) {
                res.status(400).json({
                    'sta': error.message
                });
            }
            // const pdata = {
            //     "id": Productdata.length + 1,
            //     "pname": req.body.pname,
            //     "pprice": req.body.pprice,
            //     "pdesc": req.body.pdesc,

            // }
            // Productdata.push(pdata);
            // console.log('final', pdata)

            // res.status(200).send({
            //     "statuscode": 200,
            //     "Message": "Productadded",
            //     "product": pdata
            // })
        })
        app.get("/api/getproduct", (req, res) => {
            if (Productdata.length > 0) {
                res.status(200).send({
                    "statuscode": 200,
                    "ProductData": Productdata,
                })

            } else {
                res.status(200).send({
                    "statuscode": 200,
                    "ProductData": [],
                })

            }

        })
        app.post("/api/update/:id", (req, res) => {
            let id = req.params.id * 1;
            let producttoupdate = Productdata.find(p => p.id === id);
            let index = Productdata.indexOf(producttoupdate);





            Productdata[index] = req.body;
            res.status(200).send({
                "statuscode": "Sucess",
                "message": "Updated",

            })
        })
        app.post("/api/delete/:id", (req, res) => {
            let id = req.params.id * 1;
            let producttoupdate = Productdata.find(p => p.id === id);
            let index = Productdata.indexOf(producttoupdate);

            Productdata.splice(index, 1)
            res.status(204).send({
                "statuscode": "Sucess",
                "message": "Deleted",

            })
        })


    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
connectDB();

// mongoose.connect("mongodb+srv://sachin:Sachin@123@cluster0.xpiidgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {

// }, (req, res) => {
//     console.log("Status", "Connected to mongo")
// })


app.listen(3000, () => {
    console.log("Connected to 3000 Port")
})


// zAxulhpBw3v1ExtzaJy48Idje2VzKd2QUu8KcTQEZIL5QyDRhUh129gtXrOI8FSP