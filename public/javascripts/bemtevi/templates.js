var autoSaveId = null;
var autoSaveTime = 5000;
var templateSets = null;

var savedData = {
    activeTemplateSetId : null,
    activeTemplateId : null,
    activeTemplateSet : null,
    activeTemplate : null,
    detail : {},
    summary : {}
};

var formatDescriptor = {};
formatDescriptor["bold-style"] = ["font_weight", "font-weight", "bold", "normal"];
formatDescriptor["italic-style"] = ["font_style", "font-style", "italic", "normal"];
formatDescriptor["underline-style"] = ["text_decoration", "text-decoration", "underline", "none"];
formatDescriptor["left-style"] = ["text_align", "text-align", "left", "left"];
formatDescriptor["center-style"] = ["text_align", "text-align", "center", "left"];
formatDescriptor["right-style"] = ["text_align", "text-align", "right", "left"];
formatDescriptor["justified-style"] = ["text_align", "text-align", "justify", "left"];
formatDescriptor["size-up-style"] = ["font_size", "font-size", null, "+=1"];
formatDescriptor["size-down-style"] = ["font_size", "font-size", null, "-=1"];

/**
 * Utility function to substitute line-breaks by br element.
 */
function nl2br(str) {
    return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />');
}

/**
 * Utility function to substitute br elements by line-breaks.
 */
function br2nl(str) {
    return String(str).replace(/<br\s*\/?>/mg, "\n");
}

/**
 * Creates the template thumbs with the data contained in the templateSets variable.
 */
function createTemplateList() {
    var container = $("#template-list");
    container.html("");
    container.append($('<div id="template-editing-carousel" class="foo"><ul></ul></div>'));

    var listItem = $("<li></li>");
    var counter = 0;

    // Loops through all available template sets (templateSets)
    for(var f = 0; f < templateSets.length; f++) {

        // Creating the primary structure for the template set.
        var templateSetContainer = $('<div class="tpl-thumb" id="family-' + f + '"></div>');
        var imgContainer = $('<div class="img-container" ></div>');
        templateSetContainer.append(imgContainer);

        // Loops through the templates in the template set
        var templateSet = templateSets[f].image_template_set;
        for(var t = 0; t < templateSet.image_templates.length; t++) {

            // Creating the template structure (only detailed templates are displayed
            // in the template list as thumbnails).
            var template = templateSet.image_templates[t];
            if(template.template_type == "detail") {
                imgContainer.append($('<img class="thumb-img_' + t + '" src="' + template.background_image.url + '"/>'));
                templateSetContainer.click(function() {
                    display_template(templateSet, template)
                });
            }

        }

        // Closing the template set element
        templateSetContainer.append($('<div class="frame" ></div>'));
        listItem.append(templateSetContainer);
        counter++;

        // Adding templateSet to the list entries
        if(counter == 9 || f == templateSets.length - 1) {
            container.find("ul").append(listItem);
            listItem = $("<li></li>");
            counter = 0;
        }
    }

    // Starting the engine that handles navigation through the template sets.
    container.find("div#template-editing-carousel").carousel();
}

/**
 * Retrieves a template from a template set (by the template type).
 */
function getTemplateByType(type, templateSet) {
    var templates = templateSet.image_templates;
    for(var t = 0; t < templates.length; t++) {
        if(templates[t].template_type == type) {
            return templates[t];
        }
    }
    return null;
}

/**
 * Selects either the detail or summary template for the current template set.
 */
function displayTemplateForActiveSet(type) {
    var activeTemplateSet = savedData.activeTemplateSet;
    var template = getTemplateByType(type, activeTemplateSet)
    if(template != null) {
        display_template(activeTemplateSet, template);
    }
}

/**
 * Displays the selected template and its overlays.
 */
function display_template(templateSet, template) {
    if(templateSet == null || template == null) {
        return;
    }

    savedData.activeTemplateSet = templateSet;
    savedData.activeTemplateSetId = templateSet.id;
    savedData.activeTemplate = template;
    savedData.activeTemplateId = template.id;

    // Setting up the container according to the template type.
    $("#regions-container").html("");
    $("#template-container").removeClass("detail");
    $("#template-container").removeClass("summary");
    $("#template-container").addClass(template.template_type);
    $("#regions-container").css({
        backgroundImage : "url(" + template.background_image.url + ")",
        backgroundRepeat : "no-repeat"
    });

    // Setting up the overlays.
    for(var o = 0; o < template.overlays.length; o++) {
        var overlay = template.overlays[o];
        if(overlay.overlay_type == "text") {
            createTextOverlay(overlay, template.template_type);
        } else if(overlay.overlay_type == "image") {
            createImageOverlay(overlay, template.template_type);
        }
    }

    // Configuring actions for the overlays.
    $(".overlay").mouseenter(function() {
        if($(this).find(".hidden").css("display") == "none") {
            $(this).find(".hidden").fadeIn(300);
        };
    });
    $(".overlay").mouseleave(function() {
        if($(this).find(".hidden").css("display") != "none") {
            $(this).find(".hidden").fadeOut(500);
        }
    });
    // Setting up upload events for Upload Panel.
    $("input.img-upload").change(function() {
        /* Creating iFrame */
        var frame = $('<iframe id="up-iframe_' + getId($(this).attr("id")) + '" name="up-iframe" ></iframe>');
        $(this).parent().append(frame);
        frame.bind('load', function() {
            var cross = 'javascript:window.parent.callBack("' + getId($(this).attr("id")) + '", document.body.innerHTML)';
            $(this).attr('src', cross);
        });
        /* Creating form */
        var form = $('<form id="up-form_' + getId($(this).attr("id")) + '" name="up-form" method="POST" target="up-iframe" enctype="multipart/form-data" encoding="multipart/form-data" action="/upload_temp_image"></form>');
        $(this).parent().append(form);
        form.append($(this));
        // Exibindo a imagem de loading
        $(this).parent().parent().parent().parent().addClass("uploading");
        /* Uploading file */
        form.submit();
    });
    // Setting up events for text editor.
    $("div.text-overlay p").click(function() {
        var txt = $(this).parent().find("textarea");
        txt.text(br2nl($(this).text()));
        $(this).css({
            "display" : "none"
        });
        txt.css({
            "display" : "block"
        });
        txt.focus();
    });

    $("div.text-overlay textarea").focusout(textFocusOut);

    $(".format-tools a").click(textFormatClick);
}

/**
 * Gets the type of the active template.
 */
function getActiveTemplateType() {
    return savedData.activeTemplate.template_type
}

/**
 * Finds an overlay on a given template (by the overlay id).
 */
function getOverlayById(overlayId, template) {
    for(var o = 0; o < template.overlays.length; o++) {
        var overlay = template.overlays[o];
        if(overlay.id == overlayId) {
            return overlay;
        }
    }
}

/**
 * Saves overlay text according to the active template type and tag for the given HTML element id.
 */
function saveTextByTag(elementId, text) {
    var overlayId = getId(elementId);
    var overlay = getOverlayById(overlayId, savedData.activeTemplate);
    var overlayTag = overlay.tag;
    var templateType = getActiveTemplateType();
    if(savedData[templateType][overlayTag] === undefined) {
        savedData[templateType][overlayTag] = {
            text : text
        };
    } else {
        savedData[templateType][overlayTag].text = text;
    }
}

/**
 * Saves overlay image URL according to the active template type and tag for the given HTML element id.
 */
function saveUrlByTag(elementId, image_url) {
    var overlayId = getId(elementId);
    var overlay = getOverlayById(overlayId, savedData.activeTemplate);
    var overlayTag = overlay.tag;
    var templateType = getActiveTemplateType();
    if(savedData[templateType][overlayTag] === undefined) {
        savedData[templateType][overlayTag] = {
            image_url : image_url
        };
    } else {
        savedData[templateType][overlayTag].image_url = image_url;
    }
}

/**
 * Verifies savedData for the given text element. When there is no saved data, a entry is created in the array.
 * Otherwise, an entry is created with the given value.
 */
function verifySavedData(elementId, overlay) {
    var templateType = getActiveTemplateType();
    if(savedData[templateType][elementId] === undefined) {
        savedData[templateType][elementId] = overlay;
        return overlay;
    } else {
        return savedData[templateType][elementId];
    }
}

/**
 * Applies text formatting and saves the entered text into savedData.
 */
function textFocusOut(e) {
    var text = nl2br($(this).attr("value"));
    var elementId = $(this).parent().attr("id");

    var p = $(this).parent().find("p");
    p.html(text);

    save_text_for_tag(elementId, text);

    $(this).css({
        "display" : "none"
    });
    p.css({
        "display" : "block"
    });

}

/**
 * Applies saved data formatting to an element.
 */
function applyTextFormatting(element, overlay) {
    var styleMap = {
        "color" : overlay.color,
        "font-family" : overlay.font_family,
        "font-size" : overlay.font_size,
        "font-style" : overlay.font_style,
        "font-weight" : overlay.font_weight,
        "text-align" : overlay.text_align,
        "text-decoration" : overlay.text_decoration
    };
    element.css(styleMap);
}

/**
 * Formats a text overlay through the formatting toolbar.
 */
function textFormatClick(e) {
    e.preventDefault();

    $(this).removeClass("active");

    var cssClass = $(this).attr("class");
    var elementId = $(this).parent().parent().attr("id");

    var txtEditor = $(this).parent().parent().find("textarea");
    var txt = $(this).parent().parent().find("p");

    save_text_for_tag(elementId, txt.text());

    // Setting up the requested change.
    var templateType = getActiveTemplateType();
    var descriptor = formatDescriptor[cssClass];
    var property = descriptor[0];
    var oldValue = savedData[templateType][elementId][property];
    if(descriptor[2] == null) {
        var tmp = $("<p></p>");
        applyTextFormatting(tmp, savedData[activeTemplateType][elementId]);
        tmp.css(descriptor[1], descriptor[3]);
        savedData[activeTemplateType][elementId][property] = tmp.css(descriptor[1]);
    } else if(oldValue == descriptor[2]) {
        savedData[activeTemplateType][elementId][property] = descriptor[3];
    } else {
        savedData[activeTemplateType][elementId][property] = descriptor[2];
    }

    // Applying to the element.
    applyTextFormatting(txt, savedData[activeTemplateType][elementId].text_overlay)
    applyTextFormatting(txtEditor, savedData[activeTemplateType][elementId].text_overlay);
}

/**
 * Função que cria a estrutura html de overlays do tipo texto
 */
function createTextOverlay(overlay, tplType) {
    var value = overlay.text_overlay.text;
    var txtOverlay = overlay.text_overlay;
    var elementId = "text-overlay_" + overlay.id;
    var savedTxt = savedData[tplType][overlay.tag] !== undefined ? savedData[tplType][overlay.tag].text : undefined;
    var value = savedTxt !== undefined ? savedTxt : overlay.text_overlay.text;

    var overlayElement = $('<div class="text-overlay overlay" id="' + elementId + '" ></div>');
    var text = $('<p>' + value + '</p>');
    var formatPanel = '<textarea id="txtArea' + overlay.id + '" name="txtArea' + overlay.id + '" ></textarea>';

    // Hiding formatting for the time being.
    // formatPanel += '<div class="format-tools hidden">';
    // formatPanel += '<a href="#" class="bold-style" >Negrito</a>';
    // formatPanel += '<a href="#" class="italic-style" >Itálico</a>';
    // formatPanel += '<a href="#" class="underline-style" >Itálico</a>';
    // formatPanel += '<a href="#" class="left-style" >Alinhar à esquerda</a>';
    // formatPanel += '<a href="#" class="center-style" >Centralizar</a>';
    // formatPanel += '<a href="#" class="right-style" >Alinhar à direita</a>';
    // formatPanel += '<a href="#" class="justified-style" >Justificar</a>';
    // formatPanel += '<a href="#" class="size-up-style" >A+</a>';
    // formatPanel += '<a href="#" class="size-down-style" >A-</a>';
    // formatPanel += '</div>';

    formatPanel = $(formatPanel);

    overlayElement.append(text);
    overlayElement.append(formatPanel);

    overlayElement.css("left", overlay.position_x);
    overlayElement.css("top", overlay.position_y);
    overlayElement.css("width", overlay.width);
    overlayElement.css("height", overlay.height);

    var savedTxtOverlay = verifySavedData(elementId, overlay.text_overlay);
    applyTextFormatting(overlayElement.find("textarea"), savedTxtOverlay);
    applyTextFormatting(text, savedTxtOverlay);

    $('#regions-container').append(overlayElement);
}

/**
 * Função que cria a estrutura html de overlays do tipo imagem
 */
function createImageOverlay(data, tplType) {
    var value = data.value;
    var elementId = 'image-overlay_' + data.id;

    /* searching for saved data */
    for(var sd = 0; sd < savedData[tplType].length; sd++) {
        if(savedData[tplType][sd].type == "image" && savedData[tplType][sd].elementId == "") {
            value = savedData[tplType][sd].value;
            valueFormat = savedData[tplType][sd].valueFormat;
            savedData[tplType][sd].elementId = elementId;
            break;
        }
    }

    var overlay = '<div class="image-overlay overlay" id="' + elementId + '"><div class="image-control" ></div>';
    overlay += '<div class="up-panel hidden">';
    overlay += '<div class="upload-btn" ><em><input type="file" name="img-upload" id="img-upload_' + data.id + '" class="img-upload"/></em>';
    overlay += '<img src="/images/bemtevi/ajax-loader.gif" /></div>';
    overlay += '</div>';
    overlay = $(overlay);
    overlay.css("left", data.position_x);
    overlay.css("top", data.position_y);
    overlay.css("height", data.height);
    overlay.css("width", data.width);
    $('#regions-container').append(overlay);

    data.image_overlay.position_x || (data.image_overlay.position_x = 0);
    data.image_overlay.position_y || (data.image_overlay.position_y = 0);
    data.image_overlay.width || (data.image_overlay.width = data.width);
    data.image_overlay.height || (data.image_overlay.height = data.height);

    createImage(overlay.find(".image-control"), data.image_overlay.overlay_image.url, data.image_overlay);
}

function createImage(parent, filePath, valueFormat) {
    var image = $('<img src="' + filePath + '" />');
    parent.append(image);

    image.css({
        "width" : valueFormat.width,
        "height" : valueFormat.height,
        "left" : 0,
        "top" : 0
    });

    parent.draggable({
        stop : imageDragStop
    });
    parent.find('img').resizable({
        stop : imageResizeStop
    });
    parent.css({
        "left" : valueFormat.position_x,
        "top" : valueFormat.position_y
    });
}

function imageDragStop(event, ui) {
    var elementId = $(this).parent().attr("id");
    var overlay = getOverlayById(getId(elementId), savedData.activeTemplate);
    var savedOverlay = verifySavedData(elementId, overlay.image_overlay);
    savedOverlay.position_x = $(this).css("left");
    savedOverlay.position_y = $(this).css("top");
}

function imageResizeStop(event, ui) {
    var elementId = $(this).parent().parent().attr("id");
    var overlay = getOverlayById(getId(elementId), savedData.activeTemplate);
    var savedOverlay = verifySavedData(elementId, overlay.image_overlay);
    savedOverlay.width = $(this).css("width");
    savedOverlay.height = $(this).css("height");
}

/**
 * Função de callback chamada após o upload de uma nova imagem
 */
function callBack(e, res) {
    var response = $(res);

    /* Moving input element */
    $("#up-form_" + e).parent().append($("#up-form_" + e).find('input'));

    /* Removing temporary elements */
    $("#up-iframe_" + e).remove();
    $("#up-form_" + e).remove();
    /* Searching for file path */
    if(response.find("file_path").length) {

        var elementId = "image-overlay_" + e;
        var filePath = response.find("file_path").text();
        saveUrlByTag(elementId, filePath);

        /* Removing image and image control */
        var imgOverlay = $("#" + elementId);
        imgOverlay.find(".image-control").remove();
        var imgControl = $('<div class="image-control" ></img>');
        imgOverlay.append(imgControl);
        /* Recreating the new image */
        var overlay = getOverlayById(getId(elementId), savedData.activeTemplate);
        createImage(imgControl, filePath, overlay.image_overlay);
        // Removendo status de loading
        imgOverlay.find(".uploading").removeClass("uploading");
    }
}

function autoSave() {
    autoSaveId = null;
    var post = {
        "detail" : savedData.detail,
        "simple" : savedData.summary,
        "general" : savedData
    }
    $.post('save.php', {
        data : JSON.stringify(post)
    }, function(res) {
        if(res.error) {
            alert(res.error);
        }
        var d = new Date();
        // Somente ativa o auto save por tempo caso o intervalo seja um valor > 0
        if(autoSaveTime > 0) {
            autoSaveId = setTimeout(autoSave, autoSaveTime);
        }
    }, "json");
}

function showResult(res) {
    templateSets = res;
    createTemplateList();

    $(".tpl-thumb span").mouseenter(function() {
        var id = getId($(this).attr("id"));
        $(this).parent().find(".img-container img").css("display", "none");
        $(this).parent().find(".img-container img.thumb-img_" + id).css("display", "block");
    });
}


$(document).ready(function() {
    templateSets = null;

    // Setando ação do link de logout
    $("a.logout").click(function(e) {
        e.preventDefault();
    });
    // Obtendo lista de templates
    $.getJSON("/manager/image_template_sets", null, function(response) {
        templateSets = response;
        createTemplateList();

        $(".tpl-thumb span").mouseenter(function() {
            var id = getId($(this).attr("id"));
            $(this).parent().find(".img-container img").css("display", "none");
            $(this).parent().find(".img-container img.thumb-img_" + id).css("display", "block");
        });
        // TODO: investigate how to store data into session
        // // Obtendo dados salvos em sessão
        // $.getJSON("savedData.php", null, function(response){
        // savedData.detail = (response["detail"]) ? response["detail"] : [];
        // savedData.summary = (response["simple"]) ? response["simple"] : [];
        // savedData = (response["general"]) ? response["general"] : savedData;
        // // Abrindo o template que estava salvo na sessão
        // if (savedData.activeTemplateSetId != null && savedData.activeTemplateId != null) {
        // display_template(savedData.activeTemplateSet, savedData.activeTemplate);
        // }
        // // Somente ativa o auto save por tempo caso o intervalo seja um valor > 0
        // if (autoSaveTime > 0) {
        // autoSaveId = setTimeout(autoSave, autoSaveTime);
        // }
        // });

    });

    $("a.full").click(function() {
        displayTemplateForActiveSet("detail");
    });
    $("a.small").click(function() {
        displayTemplateForActiveSet("summary");
    });
});
