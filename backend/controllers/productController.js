import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// Fetch all products -> GET /api/products
const getProducts = asyncHandler(async (req, res) => {

    // Pagination params
    const pageSize = 5;
    const page = Number(req.query.pageNum) || 1;

    // Search params
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {}; //$options i is for insensitive case
    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// Fetch a product by id -> GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// Admin create a product -> POST /api/products
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Default name',
        price: 0,
        user: req.user._id,
        image: '/images/default.jpg',
        brand: 'Default brand',
        category: 'Default category',
        countIntStock: 0,
        numReviews: 0,
        description: 'Default description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// Admin update a product -> PUT /api/products
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, image, brand, category, countInStock, description } = req.body;
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = name;
        product.price = price;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        product.description = description;
    } else {
        res.status(404);
        throw new Error('Product not found');
    }

    const updateProduct = await product.save();
    res.json(updateProduct);
});


// Admin delete a product -> DELETE /api/products
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Review a product -> POST /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    const userId = req.user._id;
    if (product) {
        const reviewed = product.reviews.find(review => review.user.toString() === userId.toString());
        if (reviewed) {
            res.status(400);
            throw new Error('Product has already been reviewed');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: userId
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        const reviewSum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        product.rating = reviewSum / product.numReviews;

        await product.save();
        res.status(201).json({ message: 'Thank you for the review!' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Fetch top products -> GET /api/products/top
const getTopProducts = asyncHandler(async (req, res) => {
    const maxToDisplay = 3;
    const product = await Product.find({}).sort({ rating: -1 }).limit(maxToDisplay);
    return res.status(200).json(product);
});

export { createProduct, createProductReview, deleteProduct, getProductById, getProducts, updateProduct, getTopProducts };

