exports.seed = function(knex, Promise) {
  return Promise.resolve()
    .then(() => knex('Adventure').del())
    .then(() => knex('Destination').del())
    .then(() => knex('User').del())
    .then(() =>
      knex('User').insert(
        [
          {
            id: 1,
            name: 'idalia',
            email: 'idalia@gmail.com',
            hashedPassword:
              '$2a$10$nAVDMfgZLsDxKcRxbY8aoObH5dfJ01XsreR1jm5RuhxBlqfSK82ki'
          },
          {
            id: 2,
            name: 'Michael',
            email: 'MPJ@gmail.com',
            hashedPassword:
              '$2a$10$Z6BgoE6XmeThisIsTest230mEifbXTfY0uQE0tDDjIHdKy'
          }
        ],
        '*'
      )
    )
    .then(() =>
      knex.raw(`SELECT setval('"User_id_seq"', (SELECT MAX("id") FROM "User"))`)
    )
    .then(() =>
      knex('Destination').insert([
        {
          id: 1,
          userId: 1,
          name: 'Iceland',
          url:
            'https://guidetoiceland.imgix.net/4928/x/0/top-10-beautiful-waterfalls-of-iceland-1.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-1.1.0&w=883&s=181dbff8aab1eb0ae2931751e822d320',
          createdAt: '2017-11-17T20:05:18.814Z',
          updatedAt: '2017-11-17T20:05:18.814Z'
        },
        {
          id: 2,
          userId: 2,
          name: 'Japan',
          url:
            'https://i1.wp.com/boutiquejapan.com/wp-content/uploads/2013/10/Western-Japan-Naoshima-Island-Art-Yayoi-Kusama-Pumpkin-Sculpture-bigstock-600.png?w=600&ssl=1'
        }
      ])
    )
    .then(() =>
      knex.raw(
        `SELECT setval('"Destination_id_seq"', (SELECT MAX("id") FROM "Destination"))`
      )
    )
    .then(() =>
      knex('Adventure').insert([
        {
          id: 1,
          userId: 1,
          destinationId: 1,
          url:
            'https://guidetoiceland.imgix.net/4928/x/0/top-10-beautiful-waterfalls-of-iceland-1.jpg?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-1.1.0&w=883&s=181dbff8aab1eb0ae2931751e822d320'
        },
        {
          id: 2,
          userId: 2,
          destinationId: 2,
          url:
            'https://i1.wp.com/boutiquejapan.com/wp-content/uploads/2013/10/Western-Japan-Naoshima-Island-Art-Yayoi-Kusama-Pumpkin-Sculpture-bigstock-600.png?w=600&ssl=1'
        }
      ])
    )
    .then(() =>
      knex.raw(
        `SELECT setval('"Adventure_id_seq"', (SELECT MAX("id") FROM "Adventure"))`
      )
    )
    .then(() =>
      knex('AdventureTag').insert([
        {
          id: 1,
          name: 'Beach',
          adventureId: 1
        }
      ])
    )
    .then(() =>
      knex.raw(
        `SELECT setval('"AdventureTag_id_seq"', (SELECT MAX("id") FROM "AdventureTag"))`
      )
    );
};
