const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products' + doc._id
                    }
                }
            })
        }
        res.status(200).json({
            response
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.products_create_product = (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save().then(result => {
        res.status(201).json({
            message: `Created Product sucessfully`,
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products' + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json(doc);  
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            }); 
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};

    for(const ops in req.body) {
        updateOps[ops] = req.body[ops];
    }

    Product.findOneAndUpdate({_id: id}, { 
        $set: updateOps
    }, {new: true})
    .exec()
    .then(result => {
        res.status(200).json({
            result
        })
    })
    .catch(err => {
        res.status(500).json({error: err})
    }) 
}

exports.products_del_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result => {
        res.status(200).json({
            message: `Deleted the product`,
        }) 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
}