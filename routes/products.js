const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
/* GET home page. */
router.get('/', function(req, res, next) {
    let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; //set the current page number 
    const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10; // set the limit of items per page 
    let startvalue;
    let endvalue;
    if (page > 0) {
        startvalue = (page * limit) - limit; //0, 10, 20, 30 
        endvalue = page * limit;
    } else {
        startvalue = 0;
        endvalue = 10
    }
    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startvalue, endvalue)
        .sort({ id: .1 })
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    product: prods
                });
            } else {
                res.json({ message: 'No products founds' });
            }
        }).catch(err => console.log(err));
});
/** Get Single Product */
router.get('/:prodId', (req, res) => {
    let productId = req.params.prodId;
    console.log(productId);

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.images',
            'p.id'
        ])
        .filter({ 'p.id': productId })
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({ message: 'No product found with product id ${productId}' });
            }
        }).catch(err => console.log(err));

});
/** Get all products from one particular Category  */

router.get('/category/:catName', (req, res) => {
    let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; //set the current page number 
    const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10; // set the limit of items per page 
    let startvalue;
    let endvalue;
    if (page > 0) {
        startvalue = (page * limit) - limit; //0, 10, 20, 30 
        endvalue = page * limit;
    } else {
        startvalue = 0;
        endvalue = 10
    }
    //Fetch the category name from the URL 
    const cat_title = req.params.catName;
    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: `c.id = p.cat_id WHERE C.title LIKE '%${cat_title}%'`
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startvalue, endvalue)
        .sort({ id: .1 })
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    product: prods
                });
            } else {
                res.json({ message: 'No products found from ${cat_title} category' });
            }
        }).catch(err => console.log(err));
});
module.exports = router;