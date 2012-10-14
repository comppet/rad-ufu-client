{extends file = 'layout.tpl'}
{block name=titulo} Items de Ensino {/block}
{block name=conteudo}
  <ul class = "nav nav-tabs" id = "items">
  	{block name=active-tab}
      <li class = "active" ><a href="atividades.php?t=ensino" data-toggle = "tab">Ensino</a></li>
  	  <li><a href="#orientacao" data-toggle = "tab">Orientação</a></li>
  	  <li><a href="#producao" data-toggle = "tab">Produção</a></li>
  	  <li><a href="#pesquisa" data-toggle = "tab">Pesquisa</a></li>
  	  <li><a href="#extensao" data-toggle = "tab">Extensão</a></li>
  	  <li><a href="#administracao" data-toggle = "tab">Administração</a></li>
  	  <li><a href="#outras" data-toggle = "tab" tab = "outras">Outras</a></li>
    {/block}
  </ul>
  {block name=tabela}{/block}
{*
  <div class = "tab-content">
  	<div class = "tab-pane active" id = "ensino">{block name=atividades_ensino}{/block}</div>
  	<div class = "tab-pane" id = "orientacao">ajax_geraview_atividades_orientacao</div>
  	<div class = "tab-pane" id = "producao">ajax_geraview_atividades_producao</div>
  	<div class = "tab-pane" id = "pesquisa">ajax_geraview_atividades_pesquisa</div>
  	<div class = "tab-pane" id = "extensao">ajax_geraview_atividades_extensao</div>
  	<div class = "tab-pane" id = "administracao">ajax_geraview_atividades_administracao</div>
  	<div class = "tab-pane" id = "outras">ajax_geraview_atividades_outras</div>
  </div> *}
{/block}