//jshint esversion: 6;

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')

const app = express();

app.set('port', process.env.PORT || 3000);

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


    const options = {
        method: "POST",
        auth: process.env.AUTH || require('./keys.js').auth
    }

    const request = https.request(process.env.URL || require('./keys.js').url, options, function (response) {

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