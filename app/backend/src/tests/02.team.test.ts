import * as Sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

import Team from '../database/models/team.model';
import { allTeams, oneTeam } from './mocks/team.mock';

describe('Testes na rota "/teams"', () => {
  describe('GET', () => {
    describe('Quando OK', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Team, "findAll").resolves(allTeams as Team[]);
      });
      
      after(()=>{
        (Team.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todos os times', async () => {
        chaiHttpResponse = await chai.request(app).get('/teams').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(allTeams);
      });
    });

    describe('Quando a consulta no banco de dados retornar vazia', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Team, "findAll").resolves();
      });
      
      after(()=>{
        (Team.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 404 e a mensagem de erro "Not found"', async () => {
        chaiHttpResponse = await chai.request(app).get('/teams').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});

describe('Testes na rota "/teams/:id"', () => {
  describe('GET', () => {
    describe('Quando o id é válido', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Team, "findByPk").resolves(oneTeam as Team);
      });
      
      after(()=>{
        (Team.findByPk as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e o objeto do time correspondente', async () => {
        chaiHttpResponse = await chai.request(app).get('/teams/4').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body).to.deep.equal(oneTeam);
      });
    });

    describe('Quando o id não é válido', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Team, "findByPk").resolves();
      });
      
      after(()=>{
        (Team.findByPk as Sinon.SinonStub).restore();
      });
      
      it(`deve retornar status http 404 e a mensagem de erro "Not found"`, async () => {
        chaiHttpResponse = await chai.request(app).get('/teams/100').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});
