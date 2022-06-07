var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;

    if(pathname == '/'){
      if(queryData.id == undefined ){
        fs.readdir('./data', function(err,filelist){
          title = 'Hello';
          var description = '헉!';
          var list = template.list(filelist);
          var html = template.HTML(title, list, description);
          response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          response.end(html);
        })
      }
      else{
        fs. readFile(`data/${queryData.id}`,'utf8',function(err, description){
          fs.readdir('./data', function(err,filelist){
            var list = template.list(filelist);
            var html = template.HTML(title, list, description);
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(html);
          });
        });
      }
    }
    else if (pathname == '/create'){
      fs.readdir('./data', function(err,filelist){
        title = 'Create';
        var description = `
        <form action="http://localhost:3000/create_page" method="post">
          <p>
            <input type="text" name="title" placeholder="title">
          </p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`;
        var list = template.list(filelist);
        var html = template.HTML(title, list, description);
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
      })
    }
    else if (pathname == '/create_page'){
      var body = '';
      request.on('data', function(data){
        body=body+data;
      })
      request.on('end', function(){
        var post = qs.parse(body);
        title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description,'utf8', function(err){
          response.writeHead(302, {Location:encodeURI(`/?id=${title}`), 'Content-Type': 'text/html; charset=utf-8'});
          response.end('전송 완료^^!');
        })
      })
    }
    else if (pathname == '/update'){
      fs. readFile(`data/${queryData.id}`,'utf8',function(err, description){
        fs.readdir('./data', function(err,filelist){
          var list = template.list(filelist);
          var update_description = description;
          description = `
          <form action="http://localhost:3000/update_page" method="post">
          <input type="hidden" name="id" value = "${title}">
            <p>
              <input type="text" name="title" placeholder="title" value="${title}">
            </p>
            <p>
              <textarea name="description" placeholder="description">${update_description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`;
          var html = template.HTML(title, list, description);
          response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          response.end(html);
        });
      });
    }
    else if(pathname == '/update_page'){
      var body = '';
      request.on('data', function(data){
        body=body+data;
      })
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(err){
          fs.writeFile(`data/${title}`, description,'utf8', function(err){
            response.writeHead(302, {Location:`/?id=${title}`, 'Content-Type': 'text/html; charset=utf-8'});
            response.end();
          })
        })
      })
    }
    else if(pathname == '/delete_page'){
      var body = '';
      request.on('data', function(data){
        body=body+data;
      })
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        fs.unlink(`data/${id}`, function(err){
          response.writeHead(302, {Location:`/`, 'Content-Type': 'text/html; charset=utf-8'});
          response.end();
        })
      })
    }
    else{
      response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      response.end('메롱 NOT FOUND');
    }
});
app.listen(3000);
