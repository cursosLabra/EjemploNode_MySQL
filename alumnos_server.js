var http = require('http');
var alumnos = require('./lib/alumnos');
var mysql = require('mysql');

var db = mysql.createConnection({
  host:     '127.0.0.1',
  user:     'node',
  password: 'node',
  database: 'test'
});

var server = http.createServer(function(req, res) {
  switch (req.method) {
    case 'POST': 
      switch(req.url) {
        case '/':
          alumnos.inserta(db, req, res);
          break;
        case '/delete':
          alumnos.delete(db, req, res);
          break;
      }
      break;
    case 'GET': 
      switch(req.url) {
        case '/':
          alumnos.ver(db, res);
        break;
      }
      break;
  }
});

db.query('DROP TABLE IF EXISTS alumnos');
db.query(
  "CREATE TABLE IF NOT EXISTS alumnos (" 
  + "id INT(10) NOT NULL AUTO_INCREMENT, " 
  + "nombre VARCHAR(255), " 
  + "edad INTEGER, " 
  + "PRIMARY KEY(id))",
  function(err) { 
    if (err) throw err;
    console.log('Server started...');
    server.listen(3000, '127.0.0.1'); 
  }
);
