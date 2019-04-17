/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all transaction Endpoints', () => {
  let staffToken;

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
    it('Should return an error if user tries to make a credit transaction specifying the transaction type with whitespace in between', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '5000',
          type: 'cred it'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('No whitespaces allowed in transaction type');
          done(err);
        });
    });
    it('Should return an error if user tries to make a credit transaction without specifying the transaction type', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '13000.00',
          type: ''
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('transaction type cannot be empty');
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
          amount: '100000',
          type: 'debit'
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
    it('Should return an error if user tries to make a debit transaction specifying an invalid transaction type', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/debit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '5000',
          type: 'notdebit'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal(`Transaction type can only be 'debit' or 'credit'`);
          done(err);
        });
    });
    it('Should return an error if user tries to make a debit transaction while hitting the credit endpoint', done => {
      chai
        .request(app)
        .post('/api/v1/transactions/1029704416/credit')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          amount: '5000',
          type: 'debit'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal(
            `Please confirm that the url matches the transaction type`
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
});
