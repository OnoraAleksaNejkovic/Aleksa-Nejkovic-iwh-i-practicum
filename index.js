const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

//OBJECT ROUTE
const CUSTOM_OBJECT_ID = '2-128320982';
const BASE_COBJ_ROUTE = 'https://api.hubspot.com/crm/v3/objects/';
const COBJ_PROPERTIES= '?properties=name,brand,size,price,launch_date';
const ObjRoute = () => {
    return BASE_COBJ_ROUTE + CUSTOM_OBJECT_ID;
};
const ObjRouteWithProperties = () => {
    return BASE_COBJ_ROUTE + CUSTOM_OBJECT_ID + COBJ_PROPERTIES;
};

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {

    const parfumes = ObjRouteWithProperties();
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(parfumes, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Parfume table', data});      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});      
   
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post("/update-cobj", async (req,res) =>{
    const update = {
        properties:{
            "name":req.body.parfumeName,
            "brand":req.body.parfumeBrand,
            "size":req.body.parfumeSize,
            "price":req.body.parfumePrice,
            "launch_date":req.body.parfumeLaunchDate
        }
    }
    const parfumes = ObjRoute(); 

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
      };

    try {
        await axios.post(parfumes, update, {headers});
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));