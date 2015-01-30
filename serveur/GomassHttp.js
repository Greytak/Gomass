var http = require('http');
var url = require('url');
var querystring = require('querystring');

var callbackRequest = function(req, res) {
  //var jsonParams = JSON.parse(req);
  var page = url.parse(req.url).pathname;
  var params = querystring.parse(url.parse(req.url).query);
  //console.log(jsonParams);
  console.log(page);console.log(params);
  res.setHeader("Access-Control-Allow-Origin", "*"); //for localhost
  res.writeHead(200, {"Content-Type": "text/html"});
  if (page == '/') {
    if (params['command'] == 'gomove') {
      console.log('move from '+params['srcx']+','+params['srcy']+' to '+params['desx']+','+params['desy']);
      // check if movement is ok
      if (true) {
        res.end("moveOk");
      }
      else {
        res.end("moveKo");
      }
    }
    if (params['command'] == 'endturn') {
      console.log('tour terminé');
      res.end("finish");
    }
  }
  //res.writeContinue();
};
var callBackClose = function() {
    console.log('Bye bye !');
};
var server = http.createServer();
server.listen(8080); // lancement du serveur
server.on('request', callbackRequest); // evenement de connection au serveur
server.on('close', callBackClose); // evenement de fermeture du serveur
//server.close(); // Arrete le serveur. Declenche l'evenement close