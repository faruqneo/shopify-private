const dotenv = require('dotenv').config();
const express = require('express');
const crypto = require('crypto'); //
const cookie = require('cookie');
const nonce = require('nonce')(); //
const querystring = require('querystring');
const request = require('request');
const Shopify = require('shopify-api-node');

const apiKey = process.env.SHOPIFY_PRIVATE_API_KEY;
const apiPass = process.env.SHOPIFY_PRIVATE_API_PASSWORD;
const apiSecret = process.env.SHOPIFY_PRIVATE_API_SECRET;
const shop = process.env.SHOPIFY_PRIVATE_API_SHOP;

const shopify = new Shopify({
        shopName: shop,
        apiKey: apiKey,
        password: apiPass
      });

//Init App
const app = express();



// Order
app.get('/order',function(req, res){

    shopify.order.list({ limit: 5 })
    .then(orders => {
        res.send(orders)
    })
    .catch(err => console.error(err));


});


// Product
app.get('/product',function(req, res, next){

    let url = "https://"+apiKey+":"+apiPass+"@"+shop+"/admin/products.json";

        request({
            method: 'GET',
            uri: url,
        },
        function (error, response, body) {
            if (error) {
            return console.error('failed:', error);
            }
            console.log('successful!  Server responded with:');
        })
  
});




// Listening 
app.listen(3000, function(){
    console.log("Server is running");
});