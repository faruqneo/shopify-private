const dotenv = require('dotenv').config();
const express = require('express');
const crypto = require('crypto'); //
const cookie = require('cookie');
const nonce = require('nonce')(); //
const querystring = require('querystring');
const request = require('request');
const Shopify = require('shopify-api-node');
const path = require('path');
var hbs = require('express-hbs');
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/++[++^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

const apiKey = process.env.SHOPIFY_PRIVATE_API_KEY;
const apiPass = process.env.SHOPIFY_PRIVATE_API_PASSWORD;
const apiSecret = process.env.SHOPIFY_PRIVATE_API_SECRET;
const shop = process.env.SHOPIFY_PRIVATE_API_SHOP;
const shopname = process.env.SHOPIFY_PRIVATE_API_SHOP_name;

const shopify = new Shopify({
        shopName: shopname,
        apiKey: apiKey,
        password: apiPass
      });

//Init App
const app = express();

//Load View Engine
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
  }));

  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views/partials');

//   hbs.registerHelper('with', function(context, options) {
//     return options.fn(context);
//   });

// Order
app.get('/order',function(req, res){

    shopify.order.list({ limit: 5 })
    .then(orders => {
        // res.send(orders)
        res.render('order',{
            title: 'Order data',
            order: orders
        });
    })
    .catch(err => console.error(err));


});

//Products create
app.get('/product/create',function(req, res){

    shopify.product.create({  vendor: 'neo', title: 'xxxxx' })
    .then(product => {
        res.render('product_create',{
            title: 'product data is changed',
            products: product
        })
        //res.send(product)
    })
    .catch(err => console.error(err));
});



// Product request
app.get('/product',function(req, res, next){

    // let url = "https://"+apiKey+":"+apiPass+"@"+shop+"/admin/products.json";
    let url = `https://${shop}/admin/products.json`;
    // console.log(url);
    var encodedData = Base64.encode(`${apiKey}:${apiPass}`);
        request({
            method: 'GET',
            uri: url,
            'auth': {
                'user': apiKey,
                'pass': apiPass,
                'sendImmediately': false
              }
            
        },
        function (error, response, body) {
            if (error) {
            return console.error('failed:', error);
            }
            // console.log(body);
            let data = JSON.parse(body);
            res.render('product',{
                title: "express-hbs",
                data: data.products
            });
        })
  
});




// Listening 
app.listen(3000, function(){
    console.log("Server is running");
});