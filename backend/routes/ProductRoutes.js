import express from 'express';
import Product from '../models/ProductModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const ProductRouter = express.Router();

ProductRouter.get('/', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

ProductRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const newProduct = new Product({
            name: 'sample name ' + Date.now(),
            slug: 'sample-name-' + Date.now(),
            image: '/images/p1.jpg',
            price: 0,
            category: 'sample category',
            brand: 'sample brand',
            countInStock: 0,
            rating: 0,
            numReviews: 0,
            description: 'sample description',
        });
        const product = await newProduct.save();
        res.send({ message: 'Product Created', product });
    })
);

ProductRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.slug = req.body.slug;
            product.price = req.body.price;
            product.image = req.body.image;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            await product.save();
            res.send({ message: 'Product Updated' });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

ProductRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.remove();
            res.send({ message: 'Product Deleted' });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

ProductRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            if (product.reviews.find((x) => x.name === req.user.name)) {
                return res
                    .status(400)
                    .send({ message: 'You already submitted a review' });
            }

            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length;
            const updatedProduct = await product.save();
            res.status(201).send({
                message: 'Review Created',
                review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
                numReviews: product.numReviews,
                rating: product.rating,
            });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

const PAGE_SIZE = 3;

ProductRouter.get(
    '/admin',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const products = await Product.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countProducts = await Product.countDocuments();
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);

ProductRouter.get('/search', expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const searchQuery = query.query || '';
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const brand = query.brand || '';

    const queryFilter = searchQuery && searchQuery !== 'all' ? {
        name: {
            $regex: searchQuery, // regex is used to search for the query in the name of the product and the description of the product as well as based on many other filters
            $options: 'i' // case insensitive
        }
    } : {};

    const categoryFilter = category && category !== 'all' ? {
        category
    } : {};

    const ratingFilter = rating && rating !== 'all' ? {
        rating: {
            $gte: Number(rating) // $gte is used to search for the rating greater than or equal to the rating
        }
    } : {};

    const priceFilter = price && price !== 'all' ? {
        price: {
            $gte: Number(price.split('-'[0])), // $gte is used to search for the price greater than or equal to the price
            $lte: Number(price.split('-'[1])) // $lte is used to search for the price less than or equal to the price
            // consider the price as a range as 1-50 or 100-200 then price will be split as 1 or 100 and 50 or 200 respectively to get the min and max price like 1 or 100 is $gte and 50 or 200 is $lte
        }
    } : {};

    const sortOrder = order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
            ? { price: 1 } // 1 is ascending order and -1 is descending order 
            : order === 'highest'
                ? { price: -1 }
                : order === 'toprated'
                    ? { rating: -1 }
                    : order === 'newest'
                        ? { createdAt: -1 }
                        : { _id: -1 }

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter, // category filter is used to search for the category of the product
        ...ratingFilter,
        ...priceFilter
    })
        .sort(sortOrder) // sort the products based on the order
        .skip((page - 1) * pageSize) // pagination
        .limit(pageSize); // pagination
    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter
    })
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize)
    }); // send the products to the client side
}));

ProductRouter.get('/categories', expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
}))

ProductRouter.get('/slug/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

ProductRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

export default ProductRouter;