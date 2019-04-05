/* eslint-env mocha */
import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('First test', () => {
  it('Should test to see if App is Up', () => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome To Banka. No More Insufficient Funds');
      });
  });

  it('Should handle error on invalid route', () => {
    chai
      .request(app)
      .get('/api/v1/somerandomroute')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Route Does not Exist');
      });
  });
});
