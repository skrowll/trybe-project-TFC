import * as Sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes na rota "/"', () => {
  describe('GET', () => {
    describe('Quando OK', () => {
      let chaiHttpResponse: Response;
      
      it('deve retornar status http 200 e a resposta "{ ok: true }"', async () => {
        chaiHttpResponse = await chai.request(app).get('/').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.ok).to.equal(true);
        
      });
    });
  });
});