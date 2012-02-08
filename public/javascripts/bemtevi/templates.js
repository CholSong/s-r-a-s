// JavaScript Document
var families = null;
var savedData = [];
savedData["general"] = {
  activeFamily : null,
  activeTemplate : null
}
savedData["detail"] = [];
savedData["simple"] = [];
var templateType = null;
var autoSaveId = null;
var autoSaveTime = 5000;


function nl2br(str) {
	return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />');
}
function br2nl(str) {
	return String(str).replace(/<br\s*\/?>/mg,"\n");
}

/**
* Função que cria a lista de templates à partir da estrutura JSON contida na variável "families"
*/
function create_template_list() {
	var container = $("#template-list");
	container.html("");
	container.append($('<div class="foo"><ul></ul></div>'));
	
	var listItem = $("<li></li>");
	var counter = 0;
	// Percorrendo a lista de famílias disponível
	for (var f=0; f<families.length; f++) {
		// Criando a estrtura primária de família
		var family = $('<div class="tpl-thumb" id="family-'+f+'"></div>');
		var imgContainer = $('<div class="img-container" ></div>');
		family.append(imgContainer);
		// Percorrendo a lista de template disponível na família
		for (var t=0; t<families[f].templates.length; t++) {
			// Criando a estrutura HTML do template. Somente templates detalhados são exibidos na lista
			if (families[f].templates[t].type == "detail") {
				imgContainer.append($('<img class="thumb-img_'+t+'" src="'+families[f].templates[t].thumbUrl+'" />'));
				
				var bullet = $('<span id="#thumb-color_'+t+'" onClick="choose_template('+families[f].id+','+families[f].templates[t].id+')" >&nbsp;</span>');
				bullet.css({"background-color":families[f].templates[t].baseColor, "top":((t*30)+10)+"px" });
				family.append(bullet);
			}
		}
		// Fechando estrutura da família
		family.append($('<div class="frame" ></div>'));
		listItem.append(family);
		counter++;
		// Inserindo família na listagem
		if (counter == 9 || f == families.length-1) {
			container.find("ul").append(listItem);
			listItem = $("<li></li>");
			counter=0;
		}
	}
	// Iniciando a engine que cria a rotação da listagem de famílias
	container.find("div.foo").carousel();
}

/**
* Função que carrega o template relacionado ao que está sendo exibido, alternando
* entre templates detalhados e templates resumidos
*/
function choose_related_template(type) {
	var activeFamily = savedData["general"].activeFamily;
	var activeTemplate = savedData["general"].activeTemplate;
	
	if (activeTemplate == null || activeFamily == null) { return; }
	if (type == families[activeFamily].templates[activeTemplate].type) { return false; }

	choose_template(activeFamily, families[activeFamily].templates[activeTemplate].peerTemplateId);
}

/**
* Função que carrega o template selecionado e cria seus overlays
*/
function choose_template(famId,tplId) {
	if (famId == null || tplId == null) { return false; }
	
	var activeFamily = null;
	var activeTemplate = null;
	
	var template = null;
	$("#regions-container").html("");
	// Localizando a família socitada no vetor
	for (var f=0; f<families.length; f++) {
		if (families[f].id == famId) {
			activeFamily = f;
			savedData["general"].activeFamily = activeFamily;
			// Localizando template solicitado no vetor
			for (var t=0; t<families[f].templates.length; t++) {
				if (families[f].templates[t].id == tplId) {
					activeTemplate = t;
					savedData["general"].activeTemplate = activeTemplate;
					template = families[f].templates[t];
					break;
				}
			}
			break;
		}
	}
	if (template == null) {
		alert("Template não encontrado");
		return false;
	}
	templateType = template.type;
	
	// Setando formato do container de acordo com o tipo de template
	$("#template-container").removeClass("detail");
	$("#template-container").removeClass("simple");
	$("#template-container").addClass(template.type);
	// Aplicando o background geral do template
//	$("#template-container").css("background", "url("+template["imageUrl"]+")");
	$("#regions-container").css("background", template["bgFormat"]);
	
	// Limpando relacionamento dos dados salvos com os elementos do template anterior
	for (var sd=0; sd<savedData["detail"].length; sd++) {
		savedData["detail"][sd].elementId = "";
	}
	for (var sd=0; sd<savedData["simple"].length; sd++) {
		savedData["simple"][sd].elementId = "";
	}
	
	// Criando estrutura html do template selecionado ( overlays )
	for (var o=0; o<template.overlays.length; o++){
		switch (template.overlays[o].type) {
			case "text": create_text_overlay(template.overlays[o], template.type); break;
			case "image": create_image_overlay(template.overlays[o], template.type); break;
		}
	}

	// Configurando ações dos painéis de configuração dos overlays
	$(".overlay").mouseenter(function() {
		if ($(this).find(".hidden").css("display") == "none") {
			$(this).find(".hidden").fadeIn(300);
		};
	});
	$(".overlay").mouseleave(function() {
		if ($(this).find(".hidden").css("display") != "none") {
			$(this).find(".hidden").fadeOut(500);
		}
	});


	/* Setting up upload events for Upload Panel */
	$("input.img-upload").change(function(){
		/* Creating iFrame */
		var frame = $('<iframe id="up-iframe_'+getId($(this).attr("id"))+'" name="up-iframe" ></iframe>');
		$(this).parent().append(frame);
		frame.bind('load', function() {
	   	var cross = 'javascript:window.parent.callBack("'+getId($(this).attr("id"))+'", document.body.innerHTML)';
		 	$(this).attr('src', cross);
		});
		/* Creating form */
		var form = $('<form id="up-form_'+getId($(this).attr("id"))+'" name="up-form" method="POST" target="up-iframe" enctype="multipart/form-data" encoding="multipart/form-data" action="/upload_temp_image"></form>');
		$(this).parent().append(form);
		form.append($(this));
		// Exibindo a imagem de loading
		$(this).parent().parent().parent().parent().addClass("uploading");
		/* Uploading file */		
		form.submit();
	});
	
	/* Setting up events for text editor */
	$("div.text-overlay p").click(function(){
		var txt = $(this).parent().find("textarea");
		txt.text( br2nl($(this).text()) );
		$(this).css({"display":"none"});
		txt.css({"display":"block"});
		txt.focus();
	});
	/*1*/
	$("div.text-overlay textarea").focusout(textFocusOut);
	
	$(".format-tools a").click(textFormatClick);
	
}


/**
* Função que aplica a alteração de texto e salva os dados no vetor
*/
function textFocusOut(e) {
	var text = nl2br( $(this).attr("value") );
	var elementId = $(this).parent().attr("id");
	
	var p = $(this).parent().find("p");
	p.html(text);

	var savedDataId = verifySavedData("text", text, elementId);
	savedData[templateType][savedDataId].value = text;

	$(this).css({"display":"none"});
	p.css({"display":"block"});
	
}

/**
* Função que formata o texto de dentro do overlay à partir do comando acionado no painel do mesmo
*/
function textFormatClick(e) {
	e.preventDefault();
	var activeFamily = savedData["general"].activeFamily;
	var activeTemplate = savedData["general"].activeTemplate;
	
	var vals = [];
	vals["bold-style"] = ["font-weight", "bold", "normal"];
	vals["italic-style"] = ["font-style", "italic", "normal"];
	vals["underline-style"] = ["text-decoration", "underline", "none"];
	vals["left-style"] = ["text-align", "left", "left"];
	vals["center-style"] = ["text-align", "center", "left"];
	vals["right-style"] = ["text-align", "right", "left"];
	vals["justified-style"] = ["text-align", "justify", "left"];
	vals["size-up-style"] = ["font-size", null, "+=1"];
	vals["size-down-style"] = ["font-size", null, "-=1"];
	
	$(this).removeClass("active");

	var cssClass = $(this).attr("class");
	var elementId = $(this).parent().parent().attr("id");

	var txtEditor = $(this).parent().parent().find("textarea");
	var txt = $(this).parent().parent().find("p");

	var savedDataId = verifySavedData("text", txt.text(), elementId);

	/* Setting up the requested change */
	var oldValue = savedData[templateType][savedDataId].valueFormat[ vals[cssClass][0] ];
	if (oldValue == vals[cssClass][1] || vals[cssClass][1] == null) {
		var tmp = $("<p></p>");
		tmp.css(savedData[templateType][savedDataId].valueFormat);
		tmp.css(vals[cssClass][0], vals[cssClass][2]);
		
		savedData[templateType][savedDataId].valueFormat[ vals[cssClass][0] ] = tmp.css(vals[cssClass][0]);
	} else {
		savedData[templateType][savedDataId].valueFormat[ vals[cssClass][0] ] = vals[cssClass][1];
	}
	/* Applying to the element */
	txt.css(savedData[templateType][savedDataId].valueFormat)
	txtEditor.css(savedData[templateType][savedDataId].valueFormat);

}

/**
* Função que cria a estrutura html de overlays do tipo texto
*/
function create_text_overlay(data, tplType) {
	var value = data.value;
	var valueFormat = data.valueFormat;
	var elementId = "text-overlay_"+data.id;
	/* searching for saved data */
	for (var sd=0; sd<savedData[tplType].length; sd++){
		if (savedData[tplType][sd].type == "text" && savedData[tplType][sd].elementId == "") {
			value = savedData[tplType][sd].value;
			valueFormat = savedData[tplType][sd].valueFormat;
			savedData[tplType][sd].elementId = elementId;
			break;
		}
	}

	var overlay = $('<div class="text-overlay overlay" id="'+elementId+'" ></div>');
	var text = $('<p>'+value+'</p>');
	var formatPanel = '<textarea id="txtArea'+data.id+'" name="txtArea'+data.id+'" ></textarea>';
	formatPanel += '<div class="format-tools hidden">';
	formatPanel += '<a href="#" class="bold-style" >Negrito</a>';
	formatPanel += '<a href="#" class="italic-style" >Itálico</a>';
	formatPanel += '<a href="#" class="underline-style" >Itálico</a>';
	formatPanel += '<a href="#" class="left-style" >Alinhar à esquerda</a>';
	formatPanel += '<a href="#" class="center-style" >Centralizar</a>';
	formatPanel += '<a href="#" class="right-style" >Alinhar à direita</a>';
	formatPanel += '<a href="#" class="justified-style" >Justificar</a>';
	formatPanel += '<a href="#" class="size-up-style" >A+</a>';
	formatPanel += '<a href="#" class="size-down-style" >A-</a>';
	formatPanel += '</div>';
	formatPanel = $(formatPanel);

	overlay.append( text );
	overlay.append( formatPanel );

	overlay.css(data.format);
	overlay.find("textarea").css(valueFormat);
	text.css(valueFormat);

	$('#regions-container').append(overlay);
}

/**
* Função que verifica se o elemento que está sendo editado já existe no vetor de dados salvos
* e cria um novo item caso não exista, retornando a posição do novo item no vetor
*/
function verifySavedData(type, value, elementId) {
	var activeFamily = savedData["general"].activeFamily;
	var activeTemplate = savedData["general"].activeTemplate;

	var savedDataId = null;
	var numId = getId(elementId);

	/* Searching for saved data */
	for (var sd=0; sd<savedData[templateType].length; sd++) {
		if (elementId == savedData[templateType][sd].elementId) {
			savedDataId = sd;
			break;
		}
	}
	/* Creating a new register to save the current data if it doesn't exist */
	if (savedDataId == null) {
		var savedDataId = savedData[templateType].length;
		savedData[templateType][savedDataId] = {
			"type" : type,
			"value" : value,
			"elementId" : elementId,
			"valueFormat" : []
		};
		/* Getting format from active template */
		for (var o=0; o<families[activeFamily].templates[activeTemplate].overlays.length; o++) {
			if (families[activeFamily].templates[activeTemplate].overlays[o].id == numId) {
				/* Setting Up Value Format */
				savedData[templateType][savedDataId].valueFormat = families[activeFamily].templates[activeTemplate].overlays[o].valueFormat;
				/* Setting Up TagId */
				if (families[activeFamily].templates[activeTemplate].overlays[o].tagId != null) {
					savedData[templateType][savedDataId].tagId = families[activeFamily].templates[activeTemplate].overlays[o].tagId;
				}
				break;
			}
		}
	}
	return savedDataId;
}










/**
* Função que cria a estrutura html de overlays do tipo imagem
*/
function create_image_overlay(data, tplType) {
	var value = data.value;
	var valueFormat = data.valueFormat;
	var elementId = 'image-overlay_'+data.id;
	
	/* searching for saved data */
	for (var sd=0; sd<savedData[tplType].length; sd++){
		if (savedData[tplType][sd].type == "image" && savedData[tplType][sd].elementId == "") {
			value = savedData[tplType][sd].value;
			valueFormat = savedData[tplType][sd].valueFormat;
			savedData[tplType][sd].elementId = elementId;
			break;
		}
	}
	
	var overlay = '<div class="image-overlay overlay" id="'+elementId+'"><div class="image-control" ></div>';
	overlay += '<div class="up-panel hidden">';
	overlay += '<div class="upload-btn" ><em><input type="file" name="img-upload" id="img-upload_'+data.id+'" class="img-upload"/></em>';
	overlay += '<img src="/images/bemtevi/ajax-loader.gif" /></div>';
	overlay += '</div>';
	overlay = $(overlay);
	overlay.css(data.format);
	$('#regions-container').append(overlay);
	
	
	
	valueFormat.width = (valueFormat.width) ? valueFormat.width : data.format.width;
	valueFormat.height = (valueFormat.height) ? valueFormat.height : data.format.height;
	valueFormat.left = (valueFormat.left) ? valueFormat.left : 0;
	valueFormat.top = (valueFormat.top) ? valueFormat.top : 0;
	
	create_image(overlay.find(".image-control"), value, valueFormat);
}

function create_image(parent, filePath, valueFormat) {
	var image = $('<img src="'+filePath+'" />');
	parent.append(image);

	image.css(valueFormat);
	var width = valueFormat.width;
	var height = valueFormat.height;
	var left = valueFormat.left;
	var top = valueFormat.top;
	image.css({"width":width, "height":height, "left":0, "top":0});

	parent.draggable({
		stop: image_drag_stop
	});
	parent.find('img').resizable({
		stop: image_resize_stop
	});
	parent.css({"left":left, "top":top });
}

function image_drag_stop(event, ui) {
	var activeFamily = savedData["general"].activeFamily;
	var activeTemplate = savedData["general"].activeTemplate;

	var left = $(this).css("left");
	var top = $(this).css("top");
	
	var filePath = $(this).find("img").attr("src");
	var elementId = $(this).parent().attr("id");

	var savedDataId = verifySavedData("image", filePath, elementId);

	savedData[templateType][savedDataId].valueFormat.left = left;
	savedData[templateType][savedDataId].valueFormat.top = top;
}

function image_resize_stop(event, ui) {
	var activeFamily = savedData["general"].activeFamily;
	var activeTemplate = savedData["general"].activeTemplate;

	var width = $(this).css("width");
	var height = $(this).css("height");
	
	var filePath = $(this).find("img").attr("src");
	var elementId = $(this).parent().parent().attr("id");
	var savedDataId = verifySavedData("image", filePath, elementId);

	savedData[templateType][savedDataId]["valueFormat"].width = width;
	savedData[templateType][savedDataId]["valueFormat"].height = height;
}

/**
* Função de callback chamada após o upload de uma nova imagem
*/
function callBack(e, res) {
	var activeFamily = savedData["general"].activeFamily;
	var activeTemplate = savedData["general"].activeTemplate;

	var response = $(res);
	
	/* Moving input element */
	$("#up-form_"+e).parent().append($("#up-form_"+e).find('input'));
																												 
	/* Removing temporary elements */
	$("#up-iframe_"+e).remove();
	$("#up-form_"+e).remove();
	/* Searching for file path */
	if (response.find("file_path").length) {
		
		var elementId = "image-overlay_"+e;
		var filePath = response.find("file_path").text();
		var savedDataId = verifySavedData("image", filePath, elementId);
		savedData[templateType][savedDataId].value = filePath;

		/* Removing image and image control */
		var imgOverlay = $("#"+elementId);
		imgOverlay.find(".image-control").remove();
		var imgControl = $('<div class="image-control" ></img>');
		imgOverlay.append( imgControl );
		/* Recreating the new image */
		create_image(imgControl, filePath, savedData[templateType][savedDataId].valueFormat);
		// Removendo status de loading
		imgOverlay.find(".uploading").removeClass("uploading");
	}
}

function startSending() {
	return true;
}










function startDataArray() {
	/* Title */
	savedData["detail"][0] = {
		type : "text",
		value : "New title value",
		elementId : "",
		valueFormat : {
			"font-size":"24px",
			"text-align":"left",
			"font-family":"Arial",
			"font-weight":"bold",
			"font-style":"italic",
			"color":"#030303"
		}
	}
	return false;
	/* Title */
//	savedData["detail"][0] = [];
//	savedData["detail"][0]["type"] = "text";
//	savedData["detail"][0]["value"] = "New title value";
//	savedData["detail"][0]["elementId"] = "";
//	savedData["detail"][0]["valueFormat"] = {
//		"font-size":"24px",
//		"text-align":"left",
//		"font-family":"Arial",
//		"font-weight":"bold",
//		"font-style":"italic",
//		"color":"#030303"
//	}
	/* Picture */
//	savedData["detail"][1] = [];
//	savedData["detail"][1]["type"] = "image";
//	savedData["detail"][1]["value"] = "http://localhost/bemtevi/templates/samurai_x_screen.jpg";
//	savedData["detail"][1]["elementId"] = "";
//	savedData["detail"][1]["valueFormat"] = {
//		"left":"10px", 
//		"top":"10px"
//	}
	
	/* Title */
//	savedData["detail"][2] = [];
//	savedData["detail"][2]["type"] = "text";
//	savedData["detail"][2]["value"] = "New footer value";
//	savedData["detail"][2]["elementId"] = "";
//	savedData["detail"][2]["valueFormat"] = {
//		"font-size":"16px",
//		"text-align":"center",
//		"font-family":"Arial",
//		"font-weight":"bold",
//		"font-style":"italic",
//		"color":"red"
//	}
}
function autoSave() {
	autoSaveId = null;
	var post = 
  { 
    "detail" : savedData["detail"],
		"simple" : savedData["simple"],
		"general" : savedData["general"]
  }
  $.post('save.php', { data: JSON.stringify(post) }, function(res) {
		if (res.error) {
			alert(res.error);
		}
		var d = new Date();
		// Somente ativa o auto save por tempo caso o intervalo seja um valor > 0
		if (autoSaveTime > 0) {
			autoSaveId = setTimeout(autoSave, autoSaveTime);
		}
	}, "json");
	
}

function showResult(res) {
		families = res;
		create_template_list();
		
		$(".tpl-thumb span").mouseenter(function(){
			var id = getId($(this).attr("id"));
			$(this).parent().find(".img-container img").css("display","none");
			$(this).parent().find(".img-container img.thumb-img_"+id).css("display","block");
		});
}



$(document).ready(function(){
	families = null;

	// Setando ação do link de logout
	$("a.logout").click(function(e){
		e.preventDefault();
	});
	
	// Obtendo lista de templates
	$.getJSON("templates",null, function(response){
		families = response;
		create_template_list();
		
		$(".tpl-thumb span").mouseenter(function(){
			var id = getId($(this).attr("id"));
			$(this).parent().find(".img-container img").css("display","none");
			$(this).parent().find(".img-container img.thumb-img_"+id).css("display","block");
		});
		
		// // Obtendo dados salvos em sessão
		// $.getJSON("savedData.php", null, function(response){
			// savedData["detail"] = (response["detail"]) ? response["detail"] : [];
			// savedData["simple"] = (response["simple"]) ? response["simple"] : [];
			// savedData["general"] = (response["general"]) ? response["general"] : savedData["general"];
			// // Abrindo o template que estava salvo na sessão
			// if (savedData["general"].activeFamily != null && savedData["general"].activeTemplate != null) {
				// choose_template(savedData["general"].activeFamily, savedData["general"].activeTemplate);
			// }
			// // Somente ativa o auto save por tempo caso o intervalo seja um valor > 0
			// if (autoSaveTime > 0) {
				// autoSaveId = setTimeout(autoSave, autoSaveTime);
			// }
		// });

	});
		
	$("a.full").click(function(){
		choose_related_template("detail");
	});
	$("a.small").click(function(){
		choose_related_template("simple");
	});
	
});