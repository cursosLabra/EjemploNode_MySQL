var qs = require('querystring');

exports.sendHtml = function(res, html) { 
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

exports.parseReceivedData = function(req, cb) { 
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ body += chunk });
  req.on('end', function() {
    var data = qs.parse(body);
    cb(data);
  });
};

exports.actionForm = function(id, path, label) { 
  var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '">' +
    '<input type="submit" value="' + label + '" />' +
    '</form>';
  return html;
};

exports.inserta = function(db, req, res) {
  exports.parseReceivedData(req, function(alumno) { 
    db.query(
      "INSERT INTO alumnos (nombre,edad) " + 
      " VALUES (?, ?)",
      [alumno.nombre, alumno.edad], 
      function(err) {
        if (err) throw err;
        exports.ver(db, res); 
      }
    );
  });
};

exports.delete = function(db, req, res) {
  exports.parseReceivedData(req, function(alumno) { 
    db.query(
      "DELETE FROM alumnos WHERE id=?", 
      [alumno.id], 
      function(err) {
        if (err) throw err;
        exports.ver(db, res); 
      }
    );
  });
};

exports.ver = function(db, res) {
  var query = "SELECT * FROM alumnos";
  db.query(
    query,
    function(err, rows) {
      if (err) throw err;
      html = exports.alumnosHtml(rows); 
      html += exports.alumnosFormHtml();
      exports.sendHtml(res, html); 
    }
  );
};

exports.alumnosHtml = function(rows) {
  var html = '<table>';
  for(var i in rows) { 
    html += '<tr>';
    html += '<td>' + rows[i].nombre + '</td>';
    html += '<td>' + rows[i].edad + '</td>';
    html += '<td>' + exports.alumnosDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

exports.alumnosFormHtml = function() {
  var html = '<form method="POST" action="/">' + 
    '<p>Nombre:<br/><input name="nombre" type="text"><p/>' +
    '<p>Edad: <br/><input name="edad" type="text"><p/>' +
    '<input type="submit" value="Add" />' +
    '</form>';
  return html;
};

exports.alumnosDeleteForm = function(id) { 
  return exports.actionForm(id, '/delete', 'Delete');
}
