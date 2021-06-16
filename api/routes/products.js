const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = function(req, file, cb) {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        // Reject a file
        cb(null, false);
    }
}

const upload = multer({ 
    storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
});

const ProductsController = require('../controllers/productController');

router.get('/', ProductsController.products_get_all)

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product)

router.get('/:productId', ProductsController.products_get_product)

router.patch('/:productId', checkAuth, ProductsController.products_update_product)

router.delete('/:productId', checkAuth, ProductsController.products_del_product)

module.exports = router;