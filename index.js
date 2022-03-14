// requiring modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet'); // module that helps you secure HTTP headers
const dotenv = require('dotenv'); // module that helps you to hide personal or secret info like passwords and urls
const morgan = require('morgan'); // simplifies the process of logging requests to your application
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

// connections
dotenv.config();
mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true, })    
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

// middleware
app.use(express.json()); // based on (body-parser) used to parse requests
app.use(helmet());
app.use(morgan("common"));


app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

// requests ans responses/ operations
// app.get('/', function (req, res) {
//     res.send("ok");
// });

// backend port
app.listen(8800, function () {
    console.log("server running at port 8800");
});