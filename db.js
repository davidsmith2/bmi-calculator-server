const r = require('rethinkdb');

exports.register = function(server, options, next) {
  const db = 'test';
  const bmisTable = 'bmis';
  let conn;
  r.connect((err, connection) => {
    if (err) {
      return next(err);
    }
    conn = connection;
    r.dbCreate(db).run(connection, (err, result) => {
      r.db(db).tableCreate(bmisTable).run(connection, () => {
        return next();
      });
    });
  });
  server.method('db.findEntries', (callback) => {
    r.db(db).table(bmisTable).orderBy(r.desc('createdAt')).run(conn, callback);
  });
  server.method('db.saveEntry', (entry, callback) => {
    r.db(db).table(bmisTable).insert(entry).run(conn, callback);
  });
  server.method('db.deleteEntry', (id, callback) => {
    r.db(db).table(bmisTable).get(id).delete().run(conn, callback);
  });
  server.method('db.findEntry', (id, callback) => {
    r.db(db).table(bmisTable).get(id).run(conn, callback);
  });
};

exports.register.attributes = {
  name: 'db'
};
