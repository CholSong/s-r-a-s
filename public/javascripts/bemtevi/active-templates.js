// JavaScript Document

var templates = [];
templates["active"] = [];
templates["history"] = [];

function menageTplAction(id, action) {
	var post = {
		"id" : id,
		"action" : action
	}
	$.post("menageTemplates.php",{ data: JSON.stringify(post) }, function(res){
		if (res.error) {
			alert(res.error);
		} else {
			loadTemplates();
		}
	}, "json");
}

function loadTemplates() {
	// Obtendo lista de templates
	$.getJSON("activeTemplates.php",null, function(response){
		templates["active"] = response["active"];
		templates["history"] = response["history"];
		
		/* Creating list of active templates */
		var content = "<div class='foo'><ul>";
		for (var a=0; a<templates["active"].length; a++) {
			content += "<li id='tpl-active-item_"+templates["active"][a]["id"]+"' ><img src='"+templates["active"][a]["thumb"]+"' />";
			content += "<div><a href='#' class='deactive-template-btn'  title='Desativar'>Desativar</a>";
			content += "<a href='#' class='edit-template-btn'  title='Editar'>Editar</a></div></li>";
		}
		content += "</ul></div>";
		$("#promo-panel div.foo").remove();
		$("#promo-panel").append( $(content) );
		$("#promo-panel div.foo").carousel();
		
		/* Creating list of history templates */
		var content = "<div class='foo'><ul>";
		for (var a=0; a<templates["history"].length; a++) {
			content += "<li id='tpl-history-item_"+templates["history"][a]["id"]+"' ><img src='"+templates["history"][a]["thumb"]+"' />";
			content += "<div><a href='#' class='activate-template-btn'  title='Ativar'>Ativar</a>";
			content += "<a href='#' class='edit-template-btn'  title='Editar'>Editar</a></div></li>";
		}
		content += "</ul></div>";
		$("#hist-panel div.foo").remove();
		$("#hist-panel").append( $(content) );
		$("#hist-panel div.foo").carousel();
		
		/* Configurando ações dos links */
		$(".deactive-template-btn").click(function(e){
			menageTplAction(getId($(this).parent().parent().attr("id")), 0);			
		});
		$(".activate-template-btn").click(function(e){
			menageTplAction(getId($(this).parent().parent().attr("id")), 1);			
		});
	});
}

$(document).ready(function() {
	loadTemplates();
});