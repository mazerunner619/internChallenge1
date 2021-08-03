const express = require('express');
const app = express();
const Route = require('./Routes/router');
const OTProute = require('./Routes/otplogin');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv/config');

app.use(bodyParser.json());
app.use(cors({
    origin : ["http://localhost:3000"],
    credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/', Route);
app.use('/otp', OTProute);

app.get('/logout' , (req, res) => {
    res.cookie("token", "",{
    httpOnly : true,
    expires : new Date(0)
    }).send();
    console.log('logged out');
})

mongoose.connect(process.env.CONN_STRING, 
    {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }, 
    function(error){
        if(error){ 
            console.log(error);
        }
        else{
            console.log("connected to DB vidyayan !");
        }
    }
 ); 


if(process.env.NODE_ENV == "production"){
    app.use(express.static("quoteblog/build"));
}

app.listen(PORT, () => {
    console.log(`Server is running on port:`+PORT);
});