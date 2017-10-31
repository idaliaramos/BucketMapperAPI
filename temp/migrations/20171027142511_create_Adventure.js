// exports.up = function(knex, Promise) {
//   return knex.schema.createTable('Adventure', table => {
//     table.increments('id').primary();
//     table
//       .integer('destinationId')
//       .notNullable()
//       .references('Destination.id')
//       .onDelete('CASCADE')
//       .index();
//     table
//       .integer('userId')
//       .notNullable()
//       .references('User.id')
//       .onDelete('CASCADE')
//       .index();
//     table.string('name').notNullable().defaultTo('');
//     table.string('location');
//     table.string('url');
//     table.string('description');
//     table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
//   });
// };
//
// exports.down = function(knex, Promise) {
//   return knex.schema.dropTable('Adventure');
// };
