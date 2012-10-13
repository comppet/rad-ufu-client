<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>{block name=titulo}Rad-UFU{/block}</title>
    <link rel="stylesheet" href="static/lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="static/lib/bootstrap/css/bootstrap-responsive.min.css">
  </head>
  <body style = "padding-top: 40px;">
    <div class = "navbar navbar-fixed-top">
      <div class = "navbar-inner">
        <div class = "container">
          <a class = "brand" href = "#">RAD/UFU</a>
          <ul class = "nav pull-right">
            <li><a href = "#">Relatório</a></li>
            <li><a href = "#">Ajuda</a></li>
            <li><a href = "#">Sair</a></li>
            </ul>
        </div>
      </div>
   </div>
   <div class = "container" style = "padding-top: 10px;">
     {block name=conteudo}Hello Smarty!{/block}
   </div>
   <script type = "text/javascript" src = "static/lib/jquery/jquery-1.8.1.min.js"></script>
   <script type = "text/javascript" src = "static/lib/bootstrap/js/bootstrap.min.js"></script>
   {block name=scripts}{/block}
  </body>
</html>