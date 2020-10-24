exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
      table.increments();
      table.string('profile_image').defaultTo("https://place-hold.it/300")
      table.string('password').notNullable();
      table.timestamp('date_created').defaultTo(knex.fn.now())
      table.string('user_name').notNullable();
      table.string('full_name').notNullable();
      table.string('type').defaultTo('user');
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
  }