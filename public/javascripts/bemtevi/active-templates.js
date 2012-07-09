// JavaScript Document

var templates = [];

function menageTplAction(id, action) {
	var post = {
		"id" : id,
		"action" : action
	}
	$.post("menageTemplates.php",{ data: JSON.stringify(post) }, function(res){
		if (res.error) {
			alert(res.error);
		} else {
            $("#tpl-list-item_"+res.id).removeClass("active").addClass(res.status);
		}
	}, "json");
}

function getPage(pg) {
    $.getJSON("/manager/promotions/promotions?pg=" + pg, null, function(response){
        templates = response["templates"];
        pg = response["page"];
        firstPg = response["first_page"];
        lastPg = response["last_page"];
        totalPg = response["total_pages"];
		
		/* Creating list of active templates */
        var content = "";
        var counter = 0;
        for (var a=0; a<templates.length; a++) {
            content += "<div class='tpl-list-item "+templates[a]["status"]+"' id='tpl-list-item_"+templates[a]["id"]+"' ><img src='"+templates[a]["thumb"]+"' /><div>";
            content += "<a href='#' class='duplicate-template-btn' title='Duplicar'>Duplicar</a>";
            content += "<a href='#' class='deactive-template-btn' title='Desativar'>Desativar</a>";
            content += "<a href='#' class='active-template-btn' title='Ativar'>Ativar</a>";
            content += "<a href='#' class='edit-template-btn' title='Editar'>Editar</a></div>";
            content += "<label>Val. "+templates[a]["valdate"]+"</label></div>";
		}
        $("#tpl-container").html(content);
		
        //Criando os links de paginação
        content = "<a href='javascript:getPage(0)' title='Primeira' ><<</a>";
        for (var p=firstPg; p<=lastPg; p++){
            active = (p == pg) ? "active" : "";
            content += "<a href='javascript:getPage("+p+")' class='"+active+"' title='Página "+(p+1)+"' >"+(p+1)+"</a>";
		}
        content += "<a href='javascript:getPage("+lastPg+")' title='Última' >>></a>";
        $("#pagination").html(content);
        
        /* Configurando ações dos links */
        $(".deactive-template-btn").click(function(e){
            menageTplAction(getId($(this).parent().parent().attr("id")), 0);            
        });
        $(".active-template-btn").click(function(e){
            menageTplAction(getId($(this).parent().parent().attr("id")), 1);            
        });
    });
}

function loadTemplates() {
    // Obtendo lista de templates
    $.getJSON("activeTemplates.php",null, function(response){
        templates = response["templates"];
        
        // Criando a lista de templates
        var content = "";
        var counter = 0;
        for (var a=0; a<templates.length; a++) {
            content += "<div class='tpl-list-item "+templates[a]["status"]+"' id='tpl-list-item_"+templates[a]["id"]+"' ><img src='"+templates[a]["thumb"]+"' /><div>";
            content += "<a href='#' class='duplicate-template-btn' title='Duplicar'>Duplicar</a>";
            content += "<a href='#' class='deactive-template-btn' title='Desativar'>Desativar</a>";
            content += "<a href='#' class='active-template-btn' title='Ativar'>Ativar</a>";
            content += "<a href='#' class='edit-template-btn' title='Editar'>Editar</a></div>";
            content += "<label>Val. "+templates[a]["valdate"]+"</label></div>";
        }
        $("#tpl-container").html(content);
		
		/* Configurando ações dos links */
		$(".deactive-template-btn").click(function(e){
			menageTplAction(getId($(this).parent().parent().attr("id")), 0);			
		});
        $(".active-template-btn").click(function(e){
			menageTplAction(getId($(this).parent().parent().attr("id")), 1);			
		});
	});
}

$(document).ready(function() {
  loadTemplates();
//  getPage(0);
});