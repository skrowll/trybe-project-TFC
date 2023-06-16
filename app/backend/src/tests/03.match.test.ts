import * as Sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import Match from '../database/models/match.model';
import {
  allMatches,
  matchesInProgress,
  matchesFinished,
  objMatchCreateReq,
  objMatchCreatedRes,
  objMatchCreateSameTeamReq,
  objMatchPatchReq
} from './mocks/match.mock';

import User from '../database/models/user.model';
import { user, login } from './mocks/user.mock';

import Team from '../database/models/team.model'

describe('Testes na rota "/matches"', () => {
  describe('GET', () => {
    describe('Quando OK', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves(allMatches as Match[]);
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todas as partidas', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(allMatches);
      });
    });

    describe('Quando a consulta no banco de dados retornar vazia', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves();
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 404 e a mensagem de erro "Not found"', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });

  describe('POST', () => {
    describe('Quando o usuário é Administrador', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Match, "create").resolves(objMatchCreatedRes as Match);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Match.create as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 201 e um objeto com a partida criada', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).post('/matches').set({'Authorization':`${token}`}).send(objMatchCreateReq);
        expect(chaiHttpResponse).to.have.status(201);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body).to.deep.equal(objMatchCreatedRes);
      });
    });

    describe('Quando o id de um dos times informados não for válido', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Team, "findByPk").resolves(null);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Team.findByPk as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 404 e a mensagem de erro "There is no team with such id!"', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).post('/matches').set({'Authorization':`${token}`}).send(objMatchCreateReq);
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('There is no team with such id!');
      });
    });
  
    describe('Quando o usuário não é Administrador', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });
      
      it(`deve retornar status http 401 e a mensagem de erro "You must be an Admin"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existUser);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).post('/matches').set({'Authorization':`${token}`}).send(objMatchCreateReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('You must be an Admin');
      });
    });
  
    describe('Quando não for informado um token', () => {
      let chaiHttpResponse: Response;
      
      it(`deve retornar status http 401 e a mensagem de erro "Token not found"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/matches').send(objMatchCreateReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('Token not found');
      });
    });

    describe('Quando os times informados forem iguais', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Match, "create").resolves();
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Match.create as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 401 e a mensagem de erro "It is not possible to create a match with two equal teams"', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).post('/matches').set({'Authorization':`${token}`}).send(objMatchCreateSameTeamReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('It is not possible to create a match with two equal teams');
      });
    });
  });
});

describe('Testes na rota "/matches?inProgress="', () => {
  describe('GET', () => {
    describe('Quando inProgress = true', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves(matchesInProgress as Match[]);
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todas as partidas em progresso', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(matchesInProgress);
      });
    });

    describe('Quando inProgress = false', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves(matchesFinished as Match[]);
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todas as partidas finalizadas', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(matchesFinished);
      });
    });

    describe('Quando a consulta no banco de dados retornar vazia', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves();
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 404 e a mensagem de erro "Not found"', async () => {
        chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});

describe('Testes na rota "/matches/:id"', () => {
  describe('PATCH', () => {
    describe('Quando o usuário é Administrador', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Match, "update").resolves([1] as any);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Match.update as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um objeto com a mensagem "Updated"', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).patch('/matches/1').set({'Authorization':`${token}`}).send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Updated');
      });
    });

    describe('Quando o usuário não é Administrador', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });
      
      it(`deve retornar status http 401 e a mensagem de erro "You must be an Admin"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existUser);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).patch('/matches/1').set({'Authorization':`${token}`}).send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('You must be an Admin');
      });
    });

    describe('Quando não for informado um token', () => {
      let chaiHttpResponse: Response;
      
      it(`deve retornar status http 401 e a mensagem de erro "Token not found"`, async () => {
        chaiHttpResponse = await chai.request(app).patch('/matches/1').send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('Token not found');
      });
    });

    describe('Quando não houver partida com o id informado', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Match, "update").resolves();
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Match.update as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 404 e a mensagem de erro "Not found"', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).patch('/matches/1').set({'Authorization':`${token}`}).send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});

describe('Testes na rota "/matches/:id/finish"', () => {
  describe('PATCH', () => {
    describe('Quando o usuário é Administrador', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Match, "update").resolves([1] as any);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Match.update as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um objeto com a mensagem "Finished"', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).patch('/matches/1/finish').set({'Authorization':`${token}`}).send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Finished');
      });
    });

    describe('Quando o usuário não é Administrador', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validUser as User);
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
      });
      
      it(`deve retornar status http 401 e a mensagem de erro "You must be an Admin"`, async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existUser);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).patch('/matches/1/finish').set({'Authorization':`${token}`}).send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('You must be an Admin');
      });
    });

    describe('Quando não for informado um token', () => {
      let chaiHttpResponse: Response;
      
      it(`deve retornar status http 401 e a mensagem de erro "Token not found"`, async () => {
        chaiHttpResponse = await chai.request(app).patch('/matches/1/finish').send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(401);
        expect(chaiHttpResponse.body.message).to.eq('Token not found');
      });
    });

    describe('Quando não houver partida com o id informado', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(User, "findOne").resolves(user.validAdmin as User);
        Sinon.stub(Match, "update").resolves();
      });
      
      after(()=>{
        (User.findOne as Sinon.SinonStub).restore();
        (Match.update as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 404 e a mensagem de erro "Not found"', async () => {
        chaiHttpResponse = await chai.request(app).post('/login').send(login.existAdmin);
        const token = chaiHttpResponse.body.token;
        
        chaiHttpResponse = await chai.request(app).patch('/matches/200/finish').set({'Authorization':`${token}`}).send(objMatchPatchReq);
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});