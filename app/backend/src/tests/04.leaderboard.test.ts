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
import { leaderboard, homeLeaderboard, awayLeaderboard } from './mocks/leaderboard.mock';

describe('Testes na rota "/leaderboard"', () => {
  describe('GET', () => {
    describe('Quando OK', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves(matchesFinished as Match[]);
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todos os times e suas pontuações', async () => {
        chaiHttpResponse = await chai.request(app).get('/leaderboard').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(leaderboard);
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
        chaiHttpResponse = await chai.request(app).get('/leaderboard').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});

describe('Testes na rota "/leaderboard/home"', () => {
  describe('GET', () => {
    describe('Quando OK', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves(matchesFinished as Match[]);
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todos os times da casa e suas pontuações', async () => {
        chaiHttpResponse = await chai.request(app).get('/leaderboard/home').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(homeLeaderboard);
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
        chaiHttpResponse = await chai.request(app).get('/leaderboard/home').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});

describe('Testes na rota "/leaderboard/away"', () => {
  describe('GET', () => {
    describe('Quando OK', () => {
      let chaiHttpResponse: Response;
      
      before(() => {
        Sinon.stub(Match, "findAll").resolves(matchesFinished as Match[]);
      });
      
      after(()=>{
        (Match.findAll as Sinon.SinonStub).restore();
      });
      
      it('deve retornar status http 200 e um array com todos os times visitantes e suas pontuações', async () => {
        chaiHttpResponse = await chai.request(app).get('/leaderboard/away').send();
        expect(chaiHttpResponse).to.have.status(200);
        expect(chaiHttpResponse.body).to.be.an('array');
        expect(chaiHttpResponse.body).to.deep.equal(awayLeaderboard);
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
        chaiHttpResponse = await chai.request(app).get('/leaderboard/away').send();
        expect(chaiHttpResponse).to.have.status(404);
        expect(chaiHttpResponse.body).to.be.an('object');
        expect(chaiHttpResponse.body.message).to.eq('Not found');
      });
    });
  });
});