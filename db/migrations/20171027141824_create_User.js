exports.up = function(knex, Promise) {
  return knex.schema.createTable('User', table => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.string('email').notNullable().unique('email');
    table.specificType('hashedPassword', 'char(60)').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('User');
};
