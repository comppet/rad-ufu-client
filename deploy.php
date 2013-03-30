<?php
  require_once (__DIR__ . '/../src/RADUFU/Autoloader.php');

  use RADUFU\Service\CategoriaService,
      RADUFU\Service\AtividadeService,
      RADUFU\Service\ProfessorService,
      RADUFU\Service\TipoService;

  $atividadeService = new AtividadeService();
  $categoriaService = new CategoriaService();
  $professorService = new ProfessorService();
  $tipoService      = new TipoService();

  $user = $professorService->get(1);

  session_start();
  $_SESSION["user"] = $user;

  $user_json  = json_encode($user);
  $atividades = json_encode($atividadeService->searchAll($user->getId()));
  $categorias = json_encode($categoriaService->searchAll());
  $tipos      = json_encode($tipoService->searchAll());
?>

<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>RAD / UFU</title>
  <link rel="stylesheet" href="css/style.css">
</head>

<body style="padding-top: 40px;">

  <!-- Navbar -->
  <div class = "navbar navbar-fixed-top">
    <div class = "navbar-inner">
      <div class = "container-fluid">
        <div class="row-fluid">
          <div class="span10 offset1">
            <div id="navbar"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Conteúdo -->
  <div class = "container-fluid">
    <div class="row-fluid">
      <div class="span10 offset1">
        <div id="content"></div>
      </div>
    </div>
  </div>
  <script type="text/javascript">
    var require = {
      config: {
        "app": {
          loggedUser: <?php echo($user_json); ?>,
          categorias: <?php echo($categorias); ?>,
          tipos:      <?php echo($tipos); ?>,
          atividades: <?php echo($atividades); ?>
        }
      }
    }
  </script>
  <script type="text/javascript" data-main="js/main.js" src="js/lib/require.js"></script>
</body>

</html>