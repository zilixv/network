module.exports= {
  HTML:function(title,list,description){
    return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">

    <head>
      <meta charset="utf-8">
      <title> ${title} </title>
      <script>
        function del_alert(){
  	       alert("삭제합니다!!!");
  	      }
      </script>
    </head>

    <body>
      <h1> <a href="/"> ${title}</a> </h1>
      ${list}
      <a href='/create'> 글쓰기 </a>
      <a href='/update?id=${title}'> 글수정 </a> <br>
      <form action = "/delete_page" method = "post" onsubmit="return del_alert()">
        <input type = "hidden" name = "id" value="${title}">
        <input type = "submit" value="delete">
      </form>
      <p>${description}</p>
    </body>
    </html>
    `;
  },
  list:function(filelist){
    var list = '<ol>'
    for(var i=0;i<filelist.length;i++){
      list = list+`<li><a href='?id=${filelist[i]}'>${filelist[i]}</a></li>`;
    }
    list= list+'</ol>';
    return list;
  }
}
