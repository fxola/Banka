import '@babel/polyfill';
import express from 'express';

import bodyParser from 'body-parser';
// Routes
import userRoutes from './routes/UserRoutes';
import accountRoutes from './routes/AccountRoutes';
import transactionRoutes from './routes/TransactionRoutes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.send({ status: 200, message: 'Welcome To Banka. No More Insufficient Funds' });
});

// Handles
app.use('/api/v1', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.use((req, res, next) => {
  const error = new Error('Route Does not Exist');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status || 500,
    success: false,
    error: error.name,
    message: error.message
  });
  next();
});

app.listen(PORT, () => {
  console.log(`server is listening on port:${PORT}`);
});

export default app;
