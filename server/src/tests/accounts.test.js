/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all accounts Endpoints', () => {
  let staffToken;
  let clientToken;
  let firstUserToken;
  let newUserToken;

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
      .post('/api/v1/auth/signin')
      .send({
        email: 'second@user.com',
        password: 'seconduser'
      })
      .end((err, res) => {
        const { token } = res.body.data;
        clientToken = token;
        done(err);
      });
  });

  before(done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'first@user.com',
        password: 'firstuser'
      })
      .end((err, res) => {
        const { token } = res.body.data;
        firstUserToken = token;
        done(err);
      });
  });

  before(done => {
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'new@user.com',
        password: 'firstuser'
      })
      .end((err, res) => {
        const { token } = res.body.data;
        newUserToken = token;
        done(err);
      });
  });

  before(done => {
    chai
      .request(app)
      .patch('/api/v1/accounts/1029704123')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        status: 'activate'
      })
      .end(() => {
        done();
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
          email: 'second@user.com',
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
            'balance',
            'avatar'
          );
          done(err);
        });
    });

    it('Should return an error if a client tries to create an account without specifying an account type', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
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

    it('Should return an error if a client tries to create an account with an invalid account type', done => {
      chai
        .request(app)
        .post('/api/v1/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          type: 'neithersavingsnorcurrent'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal(`Type can only be 'savings' or 'current'`);
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
            'ownerEmail',
            'avatar',
            'fullName'
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
    it('Should fetch all existing active bank accounts on the platform if authorized', done => {
      chai
        .request(app)
        .get('/api/v1/accounts?status=active')
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
            'ownerEmail',
            'avatar',
            'fullName'
          );
          done(err);
        });
    });
    it('Should return an error if a client user tries to view all active accounts on the platform', done => {
      chai
        .request(app)
        .get('/api/v1/accounts?status=active')
        .set('Authorization', `Bearer ${clientToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.keys('status', 'error', 'success');
          expect(res.body.error).to.include('You are not Authorized to perform this Action');
          done(err);
        });
    });
    it("Should return an error if a user tries to view all dormant accounts on the platform when there aren't any", done => {
      chai
        .request(app)
        .get('/api/v1/accounts?status=dormant')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.keys('status', 'success', 'message');
          expect(res.body.message).to.include(
            'There are no dormant accounts on the platform currently'
          );
          done(err);
        });
    });
  });

  describe('GET api/v1/accounts/<account-number>', () => {
    it('Should fetch details of a bank account specified if authorized', done => {
      chai
        .request(app)
        .get('/api/v1/accounts/1029709922')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'data', 'success');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.key(
            'accountNumber',
            'balance',
            'type',
            'status',
            'createdOn',
            'ownerEmail',
            'avatar',
            'fullName'
          );
          done(err);
        });
    });
    it('Should return an error if a user tries to view an account that does not exist on the platform', done => {
      chai
        .request(app)
        .get('/api/v1/accounts/1020000000')
        .set('Authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.keys('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal('Account does not exist');
          done(err);
        });
    });
    it('Should return an error of a user tries to view account details of an account other than their own', done => {
      chai
        .request(app)
        .get('/api/v1/accounts/1029704416')
        .set('Authorization', `Bearer ${clientToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(
            `You don't have permission to view this account's details`
          );
          done(err);
        });
    });
  });
  describe('GET api/v1/users/<email>/accounts', () => {
    it('Should fetch all bank accounts of a user if authorized', done => {
      chai
        .request(app)
        .get('/api/v1/user/first@user.com/accounts')
        .set('Authorization', `Bearer ${firstUserToken}`)
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
            'ownerEmail',
            'avatar',
            'fullName'
          );
          done(err);
        });
    });
    it('Should return an error of a user tries to view account details of an account other than their own', done => {
      chai
        .request(app)
        .get('/api/v1/user/first@user.com/accounts')
        .set('Authorization', `Bearer ${clientToken}`)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.be.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.key('status', 'error', 'success', 'message');
          expect(res.body.message).to.be.equal(`You don't have permission to view these accounts`);
          done(err);
        });
    });

    it('Should return an error if a user tries to view all their accounts providing an invalid email address', done => {
      chai
        .request(app)
        .get('/api/v1/user/firstuser.com/accounts')
        .set('Authorization', `Bearer ${firstUserToken}`)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Please provide a valid email address');
          done();
        });
    });
  });
});
