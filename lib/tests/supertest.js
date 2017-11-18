'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const request = require('supertest');
const server = require('../../index');
const { addDatabaseHooks } = require('./utils');
let token;
suite(
  'destinations route',
  addDatabaseHooks(() => {
    suite('with token', () => {
      const agent = request.agent(server);

      beforeEach(done => {
        request(server)
          .post('/authenticate')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({
            email: 'idalia@gmail.com',
            password: 'idalia123'
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            var result = res.body;

            token = result.token;
            // console.log(token, 'this is the test token');
            return done();
          });
      });

      test('GET /users/1/destinations', done => {
        agent
          .get('/users/1/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /json/)
          .expect(
            200,
            [
              {
                id: 1,
                name: 'Iceland',
                url:
                  'https://guidetoiceland.imgix.net/4928/x/0/top-10-beautiful-waterfalls-of-iceland-1.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-1.1.0&w=883&s=181dbff8aab1eb0ae2931751e822d320',
                userId: 1,
                createdAt: '2017-11-17T20:05:18.814Z',
                updatedAt: '2017-11-17T20:05:18.814Z'
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
          // .expect('Accept', 'application/json')
          .expect(200, done);
      });

      test('GET /destinations/2', done => {
        agent
          .get('/destinations/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect(401, done);
      });

      test('GET /destinations/one', done => {
        agent
          .get('/destinations/check?destinationId=one')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /plain/)
          .expect(404, 'Not Found', done);
      });

      test('POST /destinations', done => {
        agent
          .post('/users/1/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'Iceland',
            url: 'https://guidetoiceland.imgixhp751e822d320'
          })
          // .set('Content-Type', 'text/plain; charset=utf-8')
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(res => {
            delete res.body.createdAt;
            delete res.body.updatedAt;
          })
          .expect(
            200,
            {
              id: 3,
              name: 'Iceland',
              url: 'https://guidetoiceland.imgixhp751e822d320',
              userId: 1
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
          .expect(404, 'Not Found', done);
      });

      test('POST /destinations with unknown destinationId', done => {
        agent
          .post('/destinations')
          .set('Accept', 'text/plain; charset=utf-8')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 2000 })
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(404, 'Not Found', done);
      });
      // test('PATCH /destinations', done => {
      //   agent
      //     .patch('/destinations/1')
      //     .set('Accept', 'application/json')
      //     .set('Authorization', 'Bearer ' + token)
      //     // .send({ name: 'Costa Rica', url: 'image.com' })
      //     .set('Content-Type', 'application/json')
      //     .send({ name: 'Costa Rica' })
      //     .expect('Content-Type', 'application/json; charset=utf-8')
      //     // .expect(res => {
      //     //   delete res.body.createdAt;
      //     //   delete res.body.updatedAt;
      //     // })
      //     .expect(
      //       200,
      //       { destinationId: 1, name: 'Costa Rica', url: 'image.com' },
      //       done
      //     );
      // });

      test('DELETE /destinations', done => {
        agent
          .delete('/destinations/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .set('Content-Type', 'application/json')
          // .send({ destinationId: 1 })
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(res => {
            delete res.body.createdAt;
            delete res.body.updatedAt;
          })
          .expect(
            200,
            {
              id: 1,
              name: 'Iceland',
              url:
                'https://guidetoiceland.imgix.net/4928/x/0/top-10-beautiful-waterfalls-of-iceland-1.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-1.1.0&w=883&s=181dbff8aab1eb0ae2931751e822d320',
              userId: 1
            },
            done
          );
      });

      test('DELETE /destinations with non-integer destinationId', done => {
        agent
          .del('/destinations/one')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 'one' })
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(404, 'Not Found', done);
        //check must be an integer
      });

      test('DELETE /destinations with unknown destination id', done => {
        agent
          .del('/destinations')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .send({ destinationId: 9000 })
          .expect('Content-Type', /plain/)
          .expect(404, 'Not Found', done);
      });
    });
    // WITHOUT TOKEN///////////////////////////////////////////////
    suite('without token', () => {
      test('GET /destinations', done => {
        request(server)
          .get('/users/1/destinations')
          .set('Accept', 'application/json')
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });

      test('POST /destinations', done => {
        request(server)
          .post('/users/1/destinations')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({
            name: 'Iceland',
            url: 'https://guidetoiceland.imgixhp751e822d320'
          })
          // .send({ destinationId: 2 })
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(401, 'Unauthorized', done);
      });
      test('PATCH /destinations', done => {
        request(server)
          .patch('/destinations/1')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ destinationId: 1 }, { location: 'Costa Rica' })
          .expect('Content-Type', 'text/plain; charset=utf-8')
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
          .send({ destinationId: 2 })
          .expect('Content-Type', /plain/)
          .expect(401, 'Unauthorized', done);
      });
    });
  })
);
test('POST /destinations with non-integer destinationId', done => {
  request(server)
    .post('/destinations')
    .set('Accept', 'application/json')
    .send({ destinationId: 'two' })
    .expect('Content-Type', /plain/)
    .expect(404, 'Not Found', done);
});
//connection of test db, user does not exist, seed must not be working..
