'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const request = require('supertest');

const server = require('../../index');
const { addDatabaseHooks } = require('./utils');

suite(
  'destinations route',
  addDatabaseHooks(() => {
    suite('with token', () => {
      const agent = request.agent(server);
      let token = '';

      beforeEach(done => {
        request(server)
          .post('/authenticate')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({
            email: 'idalia@gmail.com.com',
            password: 'idalia123'
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            // console.log(res, 'this is the res');
            var result = JSON.parse(res.json);
            token = result.token;
            return done();
          });
      });

      test('GET /destinations', done => {
        agent
          .get('/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /json/)
          .expect(
            200,
            [
              {
                id: 1,
                name: 'Iceland',
                url: 'https://guidetoiceland.imgixhp751e822d320',
                userId: 1,
                createdAt: '2017 - 11 - 150',
                updatedAt: '2017 - 11 - 1504'
              }
            ],
            done
          );
      });

      test('GET /destinations/1', done => {
        agent
          .get('/destinations/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /plain/)
          .expect(200, 'true', done);
      });

      // test('GET /destinations/2', done => {
      //   agent
      //     .get('/destinations/check?destinationId=2')
      //     .set('Accept', 'application/json')
      //     .set('Token', token)
      //     .expect(200, 'false', done);
      // });

      test('GET /destinations/one', done => {
        agent
          .get('/destinations/check?destinationId=one')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /plain/)
          .expect(400, 'destination ID must be an integer', done);
      });

      test('POST /destinations', done => {
        agent
          .post('/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .set('Content-Type', 'application/json')
          .send({ destinationId: 2 })
          .expect('Content-Type', /json/)
          .expect(res => {
            delete res.body.createdAt;
            delete res.body.updatedAt;
          })
          .expect(
            200,
            {
              id: 1,
              name: 'Iceland',
              url: 'https://guidetoiceland.imgixhp751e822d320',
              userId: 1,
              createdAt: '2017 - 11 - 150',
              updatedAt: '2017 - 11 - 1504'
            },
            done
          );
      });

      test('POST /destinations with non-integer destinationId', done => {
        agent
          .post('/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 'two' })
          .expect('Content-Type', /plain/)
          .expect(400, 'destination ID must be an integer', done);
      });

      test('POST /destinations with unknown destinationId', done => {
        agent
          .post('/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 2000 })
          .expect('Content-Type', /plain/)
          .expect(404, 'destination not found', done);
      });
      test('PATCH /destinations', done => {
        agent
          .patch('/destinations/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .set('Content-Type', 'application/json')
          .send({ destinationId: 1 }, { location: 'Costa Rica' })
          .expect('Content-Type', 'application/json')
          // .expect(res => {
          //   delete res.body.createdAt;
          //   delete res.body.updatedAt;
          // })
          .expect(
            200,
            { destinationId: 1, name: 'Costa Rica', url: 'image.com' },
            done
          );
      });

      test('DELETE /destinations', done => {
        agent
          .delete('/destinations/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .set('Content-Type', 'application/json')
          .send({ destinationId: 1 })
          .expect('Content-Type', 'application/json')
          .expect(res => {
            delete res.body.createdAt;
            delete res.body.updatedAt;
          })
          .expect(200, { destinationId: 1, userId: 1 }, done);
      });

      test('DELETE /destinations with non-integer destinationId', done => {
        agent
          .del('/destinations/one')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 'one' })
          .expect('Content-Type', 'application/json')
          .expect(400, 'destination ID must be an integer', done);
      });

      test('DELETE /destinations with unknown destination id', done => {
        agent
          .del('/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 9000 })
          .expect('Content-Type', /plain/)
          .expect(404, 'destination not found', done);
      });
    });
    // WITHOUT TOKEN///////////////////////////////////////////////
    suite('without token', () => {
      test('GET /destinations', done => {
        request(server)
          .get('/destinations')
          .set('Accept', 'application/json')
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });

      test('GET /destinations/check?destinationId=1', done => {
        request(server)
          .get('/destinations/check?destinationId=1')
          .set('Accept', 'application/json')
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });

      test('GET /destinations/check?destinationId=2', done => {
        request(server)
          .get('/destinations/check?destinationId=2')
          .set('Accept', 'application/json')
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });

      test('POST /destinations', done => {
        request(server)
          .post('/destinations')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ destinationId: 2 })
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });
      test('PATCH /destinations', done => {
        request(server)
          .patch('/destinations/1')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ destinationId: 1 }, { location: 'Costa Rica' })
          .expect('Content-Type', 'application/json')
          .expect(res => {
            delete res.body.createdAt;
            delete res.body.updatedAt;
          })
          .expect(401, 'Unauthorized', done);
      });

      test('DELETE /destinations', done => {
        request(server)
          .del('/destinations')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ destinationId: 1 })
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });
    });
  })
);
