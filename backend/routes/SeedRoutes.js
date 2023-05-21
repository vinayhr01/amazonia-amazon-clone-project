import express from 'express';
import Product from '../models/ProductModel.js';
import data from '../data.js';
import User from '../models/UserModel.js';

const SeedRouter = express.Router();

SeedRouter.get('/', async (req, res) => {
    // Remove all previous records in products model using await
    await Product.remove({});
    const CreatedProducts = await Product.insertMany(data.products);

    await User.remove({});
    const CreatedUsers = await User.insertMany(data.users);
    res.send({ CreatedUsers , CreatedProducts });
});
export default SeedRouter;