// exports.up = function(knex) {
//   return knex.schema.createTable('Destination', table => {
//     table.increments('id').primary();
//     table.string('name').notNullable().defaultTo('');
//     table.string('url');
//     table
//       .integer('userId')
//       .notNullable()
//       .references('User.id')
//       .onDelete('CASCADE')
//       .index();
//     table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
//     table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
//   });
// };
//
// exports.down = function(knex) {
//   return knex.schema.dropTable('Destination');
// };
