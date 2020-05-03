//jshint esversion: 6;

// API key: a17e2286b51c064b1067af03e1385833-us8
// audience ID: 4a8b6fdb8f

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')

const app = express();

app.set('port', process.env.port || 3000);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {

    res.sendFile(__dirname + "/signup.html");
})

app.get('/fail', (req, res) => {

    res.sendFile(__dirname + "/failiure.html");
})

app.post('/', (req, res) => {

    var firstName = req.body.fName
    var lastName = req.body.lName
    var email = req.body.email

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/4a8b6fdb8f";

    const options = {
        method: "POST",
        auth: "szolzol:a17e2286b51c064b1067af03e1385833-us8s"
    }

    const request = https.request(url, options, function (response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failiure.html");

        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })


    request.write(jsonData);
    request.end();

})

app.post("/failiure", function (req, res) {  
    res.redirect("/")
})

app.listen(app.get('port'), server => {
    console.info(`Server listen on port ${app.get('port')}`);
})