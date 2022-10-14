import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/login', () => {
  describe('POST', () => {
    it('testa se é possivel fazer login com os dados corretos.', async () => {
      const response = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": "secret_admin"
      });
      expect(response.status).to.equal(200);
      expect(response.body).to.have.key('token');
    });
    it('testa se não é possivel fazer login sem informar um email.', async () => {
      const response = await chai.request(app).post('/login').send({
        "email": "",
        "password": "secret_admin"
      });
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({"message": "All fields must be filled"});
    });
    it('testa se não é possivel fazer login sem informar uma senha.', async () => {
      const response = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": ""
      });
      expect(response.status).to.equal(400);
      expect(response.body).to.deep.equal({"message": "All fields must be filled"});
    });
    it('testa se não é possivel fazer login com um email não cadastrado.', async () => {
      const response = await chai.request(app).post('/login').send({
        "email": "test@test.com",
        "password": "secret_admin"
      });
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({"message": "Incorrect email or password"});
    });
    it('testa se não é possivel fazer login com a senha incorreta.', async () => {
      const response = await chai.request(app).post('/login').send({
        "email": "admin@admin.com",
        "password": "secret_test"
      });
      expect(response.status).to.equal(401);
      expect(response.body).to.deep.equal({"message": "Incorrect email or password"});
    });
  });
});

describe('/login/validate', () => {
  describe('GET', () => {
    it('testa se retorna erro ao não informar o token.', async () => {
      const response = await chai.request(app).get('/login/validate').send();
      expect(response.status).to.equal(401);
      expect(response.body.message).to.be.equal('Invalid token');
    });
  });
});