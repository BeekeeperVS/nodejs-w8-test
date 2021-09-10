const express = require("express");
const app = express();
const port = process.env.PORT
const host = process.env.HOST

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.send("Our api server is working correctly")
});

// POST method route
app.post('/parser', function (req, res) {
    res.send(req.body);
    console.log(req.query);
});

app.post('/copart-lot-parse', (req, res) => {

    let lotId = req.body.lotId
    let cookie = req.body.cookie
    var axios = require('axios');
console.log(lotId);

    console.log(cookie);
    var config = {
        method: 'GET',
        url: `https://www.copart.com/public/data/lotdetails/solr/${lotId}`,
        maxRedirects: 100,

        headers: {
            'cookie': `${cookie}`
        }
    };

    axios(config)
        .then(function (response) {
            res.send(response.data)
            console.log("Copart Lot parser success!!!");
        })
        .catch(function (error) {
            console.log(error);
        });

});

app.listen(3000, () => {
    console.log(`Started api service on port: ${port}`);
    console.log(`On host: ${host}`)
})