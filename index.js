const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.zlyvbqe.mongodb.net/registrationDB` ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
    password: String
});

const Registration = mongoose.model("Registration", userSchema);

app.use(bodyParser.urlencoded ({extended: false}));
app.use(bodyParser.json());


app.get('/',(req,res) => {
    res.sendFile(__dirname + "/pages/index.html")
})

app.post('/register' ,async (req,res) => {
    try{
        const {name,email,number,password} = req.body;

        const existingUser = await Registration.findOne({email: email});
        if(!existingUser){
            const userData = new Registration({
                name,
                email,
                number,
                password
        });
        
        await userData.save();
        res.redirect('/success');
    }
    else {
        console.log("User Already exist");
        res.redirect("/registered");
    }
}
    catch(err){
        console.log(err);
    }
})

app.get('/success', (req,res) => {
    res.sendFile(__dirname + "/pages/success.html")
})

app.get('/error', (req,res) => {
    res.sendFile(__dirname + "/pages/error.html")
})

app.get('/registered', (req,res) => {
    res.sendFile(__dirname + "/pages/registered.html")
})

app.listen(port, () => {
    console.log("server is running");
})
