/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all Auth(signup and signin) Endpoints', () => {
  describe('POST api/v1/auth/signup', () => {
    it('Should successfully sign up a user and return a token', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          confirmPassword: 'simpleandweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.keys('token', 'id', 'firstName', 'lastName', 'email');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should return an error if a user tries to sign up without a firstname', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: '',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          type: 'staff'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.error).to.be.equal('Invalid firstName provided');
          done();
        });
    });
    it('Should return an error if a user tries to sign up without a lastname', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: '',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          type: 'staff'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.error).to.be.equal('Invalid lastName provided');
          done();
        });
    });
    it('Should return an error if a user tries to sign up without an email address', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: '',
          password: 'simpleandweet',
          type: 'staff'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.error).to.be.equal('Invalid email provided');
          done();
        });
    });
    it('Should return an error if a user tries to sign up without a password', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: '',
          type: 'staff'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.error).to.be.equal('Invalid password provided');
          done();
        });
    });
    it('Should return an error if a user tries to sign up with a password less than 6 characters', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpl',
          confirmPassword: 'simpl'
        })
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body.status).to.be.equal(406);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('Password must not be less than six(6) characters');
          done();
        });
    });
    it('Should return an error if a user tries to sign up with a non-alpabetic firstname', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: '..',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          confirmPassword: 'simpleandweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('firstName must be Alphabetical');
          done();
        });
    });
    it('Should return an error if a user tries to sign up with a non-alpabetic lastname', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: '.@',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          confirmPassword: 'simpleandweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('lastName must be Alphabetical');
          done();
        });
    });

    it('Should return an error if a user tries to sign up with an invalid email address', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jongmail.com',
          password: 'simpleandweet',
          confirmPassword: 'simpleandweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.error).to.be.equal('Invalid email address');
          done();
        });
    });
    it('Should return an error if a user tries to sign up with a taken email address', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          confirmPassword: 'simpleandweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.equal(409);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.error).to.be.equal('Email already in use');
          done();
        });
    });
  });
  describe('POST api/v1/auth/signin', () => {
    it('should login a registered user and return a token if valid credentials are provided', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'jon@gmail.com',
          password: 'simpleandweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.keys('status', 'data', 'success', 'message');
          expect(res.body.data).to.have.key('token', 'id', 'firstName', 'lastName', 'email');
          done();
        });
    });
    it('Should return an error if a registered user tries to log in with wrong credentials', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'jon@gmail.com',
          password: 'complexandbitter'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.keys('status', 'error', 'success');
          expect(res.body.error).to.be.equal(
            'Authentication Failed. Invalid Login credentials provided'
          );
          done();
        });
    });
    it('Should return an error if a user tries to log in with a non existent account', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'jondoe@gmail.com',
          password: 'simpleandsweet'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.keys('status', 'error', 'success');
          expect(res.body.error).to.be.equal(
            'Authentication Failed. Invalid Login credentials provided'
          );
          done();
        });
    });
    it('Should return an error if a user tries to log in without providing an email address', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: '',
          password: 'simpleandweet',
          type: 'staff'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('email cannot be empty');
          done();
        });
    });
    it('Should return an error if a user tries to log in without providing a password', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'jon@gmail.com',
          password: '',
          type: 'staff'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.keys('status', 'error', 'message', 'success');
          expect(res.body.message).to.be.equal('password cannot be empty');
          done();
        });
    });
  });
});
