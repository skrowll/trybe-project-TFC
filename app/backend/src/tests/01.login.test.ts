import * as Sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import User from '../database/models/user.model';
import { user, login } from './mocks/user.mock';

describe('Teste na rota "/login"', () => {
  describe('POST', () => {
    describe('Quando o usuário é válido', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um token', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existUser);
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.have.key('token');  
      });
    });

    describe('Quando o email ou senha não forem preenchidos', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves();
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });
      
      it(`deve retornar status http 400 e a mensagem de erro "All fields must be filled" caso o email esteja vazio`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.empytEmail);
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.eq('All fields must be filled');  
      });

      it(`deve retornar status http 400 e a mensagem de erro "All fields must be filled" caso a senha esteja vazia`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.empytPassword);
        expect(chaiHttpResponse).to.have.status(400);
        expect(chaiHttpResponse.body.message).to.eq('All fields must be filled');  
      });
    });

    describe('Quando o email não é encontrado no banco de dados', () => {
      let chaiHttpResponse: Response;
    
      before(() => {
        Sinon.stub(User, "findOne").resolves();
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });

      it(`deve retornar status http 401 e a mensagem de erro "Incorrect email or password"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.incorrectEmail);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('Incorrect email or password');  
      });
    });

    describe('Quando o email é encontrado no banco de dados mas a senha está incorreta', () => {
      let chaiHttpResponse: Response;
    
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      })

      it(`deve retornar status http 401 e a mensagem de erro "Incorrect email or password"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.incorrectPassword);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('Incorrect email or password');  
      });
    });
  });
});

describe('Testes na rota "/login/validate"', () => {
  describe('GET', () => {
    describe('Quando o login foi feito com sucesso', () => {
      let chaiHttpResponse: Response;

      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });

      it('deve retornar status http 200 e um objeto com a role do usuário', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existUser);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).get('/login/validate').set({'Authorization':`${token}`});  
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.have.key('role');  
        expect(chaiHttpResponse.body.role).to.eq('user');
      });
    });

    describe('Quando o token não for válido', () => {
      let chaiHttpResponse: Response;

      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });

      it(`deve retornar status http 401 e a mensagem de erro "Token must be a valid token"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existUser);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).get('/login/validate').set({'Authorization':'token_inválid'});  
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('Token must be a valid token');
      });
    });
  });
});
