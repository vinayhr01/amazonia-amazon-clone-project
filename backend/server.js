import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SeedRouter from './routes/SeedRoutes.js';
import ProductRouter from './routes/ProductRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import orderRouter from './routes/OrderRoutes.js';
import uploadRouter from './routes/UploadRoutes.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI_LOCAL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB', err);
});

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sandbox');
})

app.use('/api/upload', uploadRouter);

app.use('/api/seed', SeedRouter);

app.use('/api/products', ProductRouter);

app.use('/api/users', UserRouter);

app.use('/api/orders', orderRouter);

// 2 middlewares

const __dirname = path.resolve(); // returns current directory

app.use(express.static(path.join(__dirname, '/frontend/build'))); // serve static files like HTML, CSS and images from build folder

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
); // send index.html file to client
// * means that any route will be handled by this middleware

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
