exports.up = function(knex, Promise) {
    return knex.schema.createTable('cells', function(table) {
      table.uuid('id').unique().notNullable();
      table.string('type').notNullable();
      table.timestamp('date_created').defaultTo(knex.fn.now())
      table.string('verb').notNullable();
      table.string('unit');
      table.boolean('forBool');
      table.string('number');
      table.integer('user_id');
      table.string('comment');
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('cells');
  }