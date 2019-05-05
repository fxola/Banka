/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all transaction Endpoints', () => {
  let staffToken;
  let secondUserToken;

  before(done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'user2@staff.com',
        password: 'staffuser2'
      })
      .end((err, res) => {
        const { token } = res.body.data;
        staffToken = token;
        done(err);
      });
  });

  before(done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'second@user.com',
        password: 'seconduser'
      })
      .end((err, res) => {
        const { token } = res.body.data;
        secondUserToken = token;
        done(err);
      });
  });

  before(done => {
    chai
      .request(app)
      .patch('/api/v1/accounts/1029704416')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'activate'
      })
      .end(() => {
        done();
      });
  });

  describe('POST api/v1/transactions/<account-number>/credit', () => {
    it('Should successfully credit a bank account on provision of valid details', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '150000',
          type: 'credit'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.keys(
            'transactionId',
            'accountNumber',
            'amount',
            'cashier',
            'transactionType',
            'accountBalance'
          );
          done(err);
        });
    });
    it('Should return an error if user tries to credit a non-active bank account', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704415/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '150000',
          type: 'credit'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          done(err);
        });
    });
    it('Should return an error if user tries to make a credit transaction less than 500 naira', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '499',
          type: 'credit'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal(
            'You can only make debit/credit transactions above 500 Naira'
          );
          done(err);
        });
    });
    it('Should return an error if user tries to make a credit transaction using a non numeric amount', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '5000b',
          type: 'credit'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Transaction amount must be a number');
          done(err);
        });
    });
    it('Should return an error if user tries to make a credit transaction without providing the amount', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '',
          type: 'credit'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('transaction amount cannot be empty');
          done(err);
        });
    });
    it('Should return an error if user tries to make a credit transaction providing the amount with whitespace in between', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '50 00',
          type: 'credit'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('No whitespaces allowed in transaction amount');
          done(err);
        });
    });
  });
  describe('POST api/v1/transactions/<account-number>/debit', () => {
    it('Should successfully debit a bank account on provision of valid details', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/debit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '100000'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.keys(
            'transactionId',
            'accountNumber',
            'amount',
            'cashier',
            'transactionType',
            'accountBalance'
          );
          done(err);
        });
    });

    it('Should return an error if user tries to make a debit transaction of an amount more than the account balance ', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/debit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '500000',
          type: 'debit'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.include('Insufficient Funds');
          done(err);
        });
    });
    it('Should return an error if user tries to make a debit transaction on a non existent account', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1020000000/debit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '500000',
          type: 'debit'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Account does not exist');
          done(err);
        });
    });
    it('Should return an error if user tries to make a debit transaction without authorization ', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/debit')
        .send({
          amount: '500000',
          type: 'debit'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error');
          expect(res.body.error).to.include('You do not have access to this page');
          done(err);
        });
    });
  });
  describe('GET api/v1/transactions/<transaction-id>', () => {
    it('Should fetch a single transaction if authorized', done => {
      chai
        .request(app)
        .get('/api/v1/transactions/1')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'data', 'success');
          expect(res.body.data).to.have.key(
            'transactionId',
            'amount',
            'oldBalance',
            'newBalance',
            'amount',
            'transactionType',
            'createdOn',
            'cashier'
          );
          done(err);
        });
    });
    it('Should return an error of a user tries to view a transaction is not related to their account', done => {
      chai
        .request(app)
        .get('/api/v1/transactions/1')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(
            `You don't have permission to view this transaction`
          );
          done(err);
        });
    });
    it('Should return an error of a user tries to view a transaction with an invalid ID', done => {
      chai
        .request(app)
        .get('/api/v1/transactions/hey')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(`Transaction ID must be a number`);
          done(err);
        });
    });
    it('Should return an error of a user tries to view a transaction that does not exist', done => {
      chai
        .request(app)
        .get('/api/v1/transactions/9999')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(`Transaction does not exist`);
          done(err);
        });
    });
  });
  describe('GET api/v1/accounts/<account-number>/transactions', () => {
    it('Should fetch a list of transactions performed on an account if authorized', done => {
      chai
        .request(app)
        .get('/api/v1/accounts/1029704416/transactions')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'data', 'success');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.key(
            'transactionId',
            'amount',
            'oldBalance',
            'newBalance',
            'amount',
            'transactionType',
            'createdOn',
            'cashier'
          );
          done(err);
        });
    });
    it('Should return an error of a user tries to view transactions not related to their account', done => {
      chai
        .request(app)
        .get('/api/v1/accounts/1029704416/transactions')
        .set('Authorization', `Bearer ${secondUserToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(
            `You don't have permission to view these transactions`
          );
          done(err);
        });
    });
    it('Should return an error of a user tries to view a transaction of an invalid account', done => {
      chai
        .request(app)
        .get('/api/v1/accounts/hey/transactions')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(`Account Number must be a Number`);
          done(err);
        });
    });
    it("Should return an error of a user tries to view transactions when there aren't any", done => {
      chai
        .request(app)
        .get('/api/v1/accounts/1029709922/transactions')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'success', 'message');
          expect(res.body.message).to.be.equal(
            `There are no transactions for this account currently`
          );
          done(err);
        });
    });
  });
});
