/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all accounts Endpoints', () => {
  let staffToken;
  let clientToken;

  before(done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'user@staff.com',
        password: 'staffuser'
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
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'jon',
        lastName: 'bellion',
        email: 'bellion@gmail.com',
        password: 'simpleandweet',
        confirmPassword: 'simpleandweet'
      })
      .end((err, res) => {
        const { token } = res.body.data;
        clientToken = token;
        done(err);
      });
  });

  describe('POST api/v1/accounts', () => {
    it('Should successfully create a new bank account on provision of valid details', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'bellion@gmail.com',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.keys(
            'accountNumber',
            'firstName',
            'lastName',
            'email',
            'type',
            'status',
            'balance'
          );
          done(err);
        });
    });

    it('Should return an error if a client tries to create an account with a non registered email', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'another@gmail.com',
          password: 'simpleandweet',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal(
            'You can only create a bank account with your registered e-mail'
          );
          done();
        });
    });

    it('Should return an error if a client tries to create an account without providing a firstname', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: '',
          lastName: 'bellion',
          email: 'bellion@gmail.com',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('firstName cannot be empty');
          done();
        });
    });

    it('Should return an error if a client tries to create an account without providing a lastname', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: '',
          email: 'bellion@gmail.com',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('lastName cannot be empty');
          done();
        });
    });
    it('Should return an error if a client tries to create an account without providing an email', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: '',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('email cannot be empty');
          done();
        });
    });
    it('Should return an error if a client tries to create an account without specifying an account type', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'bellion@gmail.com',
          type: ''
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('account type cannot be empty');
          done();
        });
    });

    it('Should return an error if a client tries to create an account with a non alphabetic firstname', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'j34r',
          lastName: 'bellion',
          email: 'bellion@gmail.com',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('firstName must be Alphabetical');
          done();
        });
    });

    it('Should return an error if a client tries to create an account with a non alphabetic lastname', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: '25r2',
          email: 'bellion@gmail.com',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('lastName must be Alphabetical');
          done();
        });
    });
    it('Should return an error if a client tries to create an account with an invalid email address', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'bellion.com',
          type: 'savings'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Please provide a valid email address');
          done();
        });
    });
  });
  describe('PATCH api/v1/accounts/<account-number>', () => {
    it('Should update the status of a newly created account to dormant if authorized', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'deactivate'
        })
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res.body.status).to.be.equal(202);
          expect(res.body).to.have.keys('status', 'data', 'message', 'success');
          expect(res.body.data.status).to.be.equal('dormant');
          done();
        });
    });
    it('Should update the status of a newly created account to active if authorized', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'activate'
        })
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res.body.status).to.be.equal(202);
          expect(res.body).to.have.keys('status', 'data', 'message', 'success');
          expect(res.body.data.status).to.be.equal('active');
          done();
        });
    });
    it('Should return an error if an unauthorized user tries to update the status of an account', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          status: 'activate'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.keys('status', 'error', 'success');
          expect(res.body.error).to.be.equal('You are not Authorized to perform this Action');
          done();
        });
    });
    it('Should return an error if a user tries to update the status of a non-existent account', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705313')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'activate'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Account does not exist');
          done();
        });
    });
    it('Should return an error if a user tries to update a non-numeric account', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/102970er313')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'activate'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Account Number must be a Number');
          done();
        });
    });
    it('Should return an error if a user tries to update an account, providing an incomplete account number', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/102970313')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'activate'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal(
            'Account Number must be 10 digits and begin with the digits 102'
          );
          done();
        });
    });
    it('Should return an error if a user tries to update an account without providing a status', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: ''
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('status cannot be empty');
          done();
        });
    });
    it('Should return an error if a user tries to update an account providing a non-alphabetic status', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: '..!'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('status must be Alphabetical');
          done();
        });
    });
    it('Should return an error if a user tries to update an account providing a status with whitespace in between', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'act ivate'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('No whitespaces allowed in status');
          done();
        });
    });
    it('Should return an error if a user tries to update an account providing a status that differs from "activate" or "deactivate"', done => {
      chai
        .request(app)
        .patch('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          status: 'activatenot'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.have.keys('status', 'error', 'success');
          expect(res.body.error).to.be.equal(`Status can only be 'activate' or 'deactivate'`);
          done();
        });
    });
  });
  describe('DELETE api/v1/accounts/<account-number>', () => {
    it('Should delete an existing account if authorized', done => {
      chai
        .request(app)
        .delete('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.keys('status', 'message', 'success');
          expect(res.body.message).to.be.equal('Account sucessfully deleted');
          done();
        });
    });
    it('Should return an error if a user tries to delete a non-existent account', done => {
      chai
        .request(app)
        .delete('/api/v1/accounts/1029705319')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Account does not exist');
          done();
        });
    });
  });
  describe('GET api/v1/accounts', () => {
    it('Should fetch all existing bank accounts on the platform if authorized', done => {
      chai
        .request(app)
        .get('/api/v1/accounts')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'data', 'success');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.key(
            'accountNumber',
            'balance',
            'type',
            'status',
            'createdOn',
            'ownerEmail'
          );
          done(err);
        });
    });
    it('Should return an error if a client user tries to view all accounts on the platform', done => {
      chai
        .request(app)
        .get('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.keys('status', 'error', 'success');
          expect(res.body.error).to.include('You are not Authorized to perform this Action');
          done(err);
        });
    });
  });
});
