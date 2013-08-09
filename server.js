var fs = require('fs');
var http = require('http');

var server = http.createServer(function(req, res) {
  console.log(req.method + ' ' + req.url);

  if (req.method === 'POST') {
    var data = {
      length: req.headers['content-length']
    };

    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      data['uploader'] = 'html5';
    } else {
      data['uploader'] = 'iframe';
    }

    req.on('data', function() {
    });

    console.log(data);

    req.on('end', function() {

      res.writeHead(200);

      res.end(JSON.stringify(data));

    });

  } else {

    req.addListener('end', function() {
      var Server = require('node-static').Server;
      var file = new Server(fs.realpathSync('.'));

      file.serve(req, res);
    }).resume();
  }


});
console.log('View demo at http://localhost:8000/demo.html');
server.listen(8000);
