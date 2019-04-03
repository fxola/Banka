import express from 'express';

import bodyParser from 'body-parser';
// Routes
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import transactionRoutes from './routes/transaction.routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.send({ status: 200, message: 'Welcome To Banka' });
});

// Handles
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status || 500,
    message: error.message
  });
  next();
});

app.listen(PORT, () => {
  console.log(`server is listening on port:${PORT}`);
});

export default app;
