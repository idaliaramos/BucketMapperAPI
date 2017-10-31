// exports.up = function(knex) {
//   return knex.schema.createTable('AdventureTag', table => {
//     table.increments('id').primary();
//     table.string('name').notNullable();
//     table
//       .integer('adventureId')
//       .notNullable()
//       .references('Adventure.id')
//       .onDelete('CASCADE');
//     table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
//     table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
//   });
// };
//
// exports.down = function(knex) {
//   return knex.schema.dropTable('AdventureTag');
// };
