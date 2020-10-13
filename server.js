// require necessary NPM packages
import express from 'express';
import { json, urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

// route files
import cartRouter from './app/routes/cart_routes';
import productRouter from './app/routes/product_routes';
import purchaseRouter from './app/routes/purchase_routes';
import stripeRouter from './app/routes/stripe_routes';

// error handling middleware
import errorHandler from './app/lib/error_handler';

// database configuration logic
import databaseUri from './config/db';

// configured passport authentication middleware
import auth from './app/lib/auth';

// establish database connection
mongoose.connect(databaseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// instantiate express application object
const app = express();

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:4741' }));

// define port for API to run on
const port = process.env.PORT || 4741;

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const auth = req.headers.authorization
    // if we find the Rails pattern in the header, replace it with the Express
    // one before `passport` gets a look at the headers
    req.headers.authorization = auth.replace('Token token=', 'Bearer ')
  }
  next()
});

// register passport authentication middleware
app.use(auth);

// add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(json());
// this parses requests sent by `$.ajax`, which use a different content type
app.use(urlencoded({ extended: true }));

// set static directory
app.use(express.static('public'));

// register route files
app.use(cartRouter);
app.use(productRouter);
app.use(purchaseRouter);
app.use(stripeRouter);

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler);

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log('listening on port ' + port)
});

// needed for testing
export default app;
