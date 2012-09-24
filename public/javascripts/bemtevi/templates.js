var templateSets = null;
var template_type = 'detail';
var product_image_url;

var savedData = {
    activeTemplateSetId : null,
    activeTemplateId : null,
    activeTemplateSet : null,
    activeTemplate : null,
    detail : {},
    summary : {}
};

var counterpartType = {
    "summary" : "detail",
    "detail" : "summary"
};

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

        var templateSet = templateSets[f].image_template_set;
        var detailTemplate = getTemplateByType("detail", templateSet);
        var summaryTemplate = getTemplateByType("summary", templateSet);
        if(detailTemplate == null || summaryTemplate == null) {
            continue;
        }

        // Creating the primary structure for the template set.
        var templateSetContainer = $('<div class="tpl-thumb" id="family-' + f + '"></div>');
        var imgContainer = $('<div class="img-container" ></div>');
        templateSetContainer.append(imgContainer);
        // Creates the thumbnail for the template set
        imgContainer.append($('<img class="thumb-img_' + detailTemplate.id + '" src="' + detailTemplate.background_image.thumbnail_url + '"/>'));
        templateSetContainer.click(onTemplateSetClicked(templateSet, detailTemplate, summaryTemplate));
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
 * Displays the selected template and its overlays.
 */
function displayTemplateForActiveSet(templateType) {
    template_type = templateType;
    if(savedData.activeTemplateSet === undefined || savedData.activeTemplateSet === null) {
        return;
    }
    var templateToDisplay = getTemplateByType(templateType, savedData.activeTemplateSet);
    savedData.activeTemplate = templateToDisplay;
    savedData.activeTemplateId = templateToDisplay.id;
    $(".template-container." + counterpartType[templateType]).addClass("is-hidden");
    $(".template-container." + templateType).removeClass("is-hidden");
}

function onTemplateSetClicked(templateSet, detailTemplate, summaryTemplate) {
    return function() {
        createTemplateContainers(templateSet, detailTemplate, summaryTemplate);
    }
}

function createTemplateContainers(templateSet, detailTemplate, summaryTemplate) {
    createTemplateContainer(templateSet, detailTemplate);
    createTemplateContainer(templateSet, summaryTemplate);
    savedData.activeTemplateSet = templateSet;
    savedData.activeTemplateSetId = templateSet.id;
    displayTemplateForActiveSet("detail");
}

/**
 * Displays the selected template and its overlays.
 */
function createTemplateContainer(templateSet, template) {
    // Setting up the container according to the template type.
    var templateType = template.template_type;
    var containerContext = $(".template-container." + templateType)
    $(".regions-container", containerContext).html("");
    var background = $('<img src="' + template.background_image.url + '" class="template-background-' + templateType + '" />');
    $(".regions-container", containerContext).append(background);
    // Setting up the overlays.
    for(var o = 0; o < template.overlays.length; o++) {
        var overlay = template.overlays[o];
        if(overlay.overlay_type == "text") {
            createTextOverlay(containerContext, template, overlay);
        } else if(overlay.overlay_type == "image") {
            createImageOverlay(containerContext, template, overlay);
            createImageOverlayGallary(template,overlay);
        }
    }
    // Configuring actions for the overlays.
    $(".overlay", containerContext).mouseenter(function() {
        if($(this).find(".up-panel")) {
            $(this).find(".up-panel").fadeIn(300);
        };
    });
    $(".overlay", containerContext).mouseleave(function() {
        if($(this).find(".up-panel")) {
            $(this).find(".up-panel").fadeOut(500);
        }
    });
    // Setting up upload events for Upload Panel.
    $("input.img-upload", containerContext).change(function() {
        /* Creating iFrame */
        var frame = $('<iframe id="up-iframe_' + getId($(this).attr("id")) + '" name="up-iframe" ></iframe>');
        $(this).parent().append(frame);
        frame.bind('load', function() {
            var cross = 'javascript:window.parent.onOverlayImageUploadComplete("' + getId($(this).attr("id")) + '", document.body.innerHTML)';
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
    $("div.text-overlay p", containerContext).click(function() {
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

    $("div.text-overlay textarea", containerContext).focusout(onTextFocusOut);
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
 * Applies text formatting and saves the entered text into savedData.
 */
function onTextFocusOut(e) {
    var text = nl2br($(this).attr("value"));
    var elementId = $(this).parent().attr("id");

    var p = $(this).parent().find("p");
    p.html(text);

    saveTextByTag(elementId, text);

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

function createTextOverlay(context, template, overlay) {
    var txtOverlay = overlay.text_overlay;
    var elementId = "text-overlay_" + overlay.id;
    var value = overlay.text_overlay.text;
    if(savedData[template.template_type][overlay.tag] !== undefined && savedData[template.template_type][overlay.tag].text !== undefined) {
        value = savedData[template.template_type][overlay.tag].text;
    }

    var overlayElement = $('<div class="text-overlay overlay" id="' + elementId + '" ></div>');
    var text = $('<p>' + value + '</p>');
    var formatPanel = '<textarea id="txtArea' + overlay.id + '" name="txtArea' + overlay.id + '" ></textarea>';
    formatPanel = $(formatPanel);

    overlayElement.append(text);
    overlayElement.append(formatPanel);

    overlayElement.css("left", overlay.position_x);
    overlayElement.css("top", overlay.position_y);
    overlayElement.css("width", overlay.width);
    overlayElement.css("height", overlay.height);

    applyTextFormatting(overlayElement.find("textarea"), overlay.text_overlay);
    applyTextFormatting(text, overlay.text_overlay);

    $('.regions-container', context).append(overlayElement);
}

function createImageOverlay(context, template, overlay) {
    var value = overlay.value;
    var elementId = 'image-overlay_' + overlay.id;

    var overlayElement = '<div class="image-overlay overlay" id="' + elementId + '"><div class="image-control" ></div>';
    overlayElement += '<div class="up-panel">';
   //overlayElement += '<div class="upload-btn" ><em><input type="file" name="img-upload" id="img-upload_' + overlay.id + '" class="img-upload"/></em>';
    overlayElement += '<div class="upload-btn" onclick="show_gallary_window();">';
    overlayElement += '<img src="/images/bemtevi/ajax-loader.gif" /></div>';
    overlayElement += '</div>';
    overlayElement = $(overlayElement);
    overlayElement.css("left", overlay.position_x);
    overlayElement.css("top", overlay.position_y);
    overlayElement.css("height", overlay.height);
    overlayElement.css("width", overlay.width);
    $('.regions-container', context).append(overlayElement);

    overlay.image_overlay.position_x || (overlay.image_overlay.position_x = 0);
    overlay.image_overlay.position_y || (overlay.image_overlay.position_y = 0);
    overlay.image_overlay.width || (overlay.image_overlay.width = overlay.width);
    overlay.image_overlay.height || (overlay.image_overlay.height = overlay.height);
    var first_image = overlay.image_overlay.overlay_images[0];
    try{
        var imageUrl = first_image.url;
    }catch(e){

    }
    if(savedData[template.template_type][overlay.tag] !== undefined && savedData[template.template_type][overlay.tag].image_url !== undefined) {
        imageUrl = savedData[template.template_type][overlay.tag].image_url;
    }
    if(imageUrl){
        createImage(overlayElement.find(".image-control"), imageUrl, overlay.image_overlay);
    }    
}

function createImage(parent, filePath, imageOverlay) {
    var image = $('<img src="' + filePath + '" />');
    parent.append(image);

    image.css({
        "width" : imageOverlay.width,
        "height" : imageOverlay.height,
        "left" : 0,
        "top" : 0
    });

    parent.draggable({
        stop : onImageDragStop
    });
    parent.find('img').resizable({
        stop : onImageResizeStop
    });

    parent.css({
        "left" : imageOverlay.position_x,
        "top" : imageOverlay.position_y
    });
}

function onImageDragStop(event, ui) {
    var elementId = $(this).parent().attr("id");
    var overlay = getOverlayById(getId(elementId), savedData.activeTemplate);
    overlay.image_overlay.position_x = $(this).css("left");
    overlay.image_overlay.position_y = $(this).css("top");
}

function onImageResizeStop(event, ui) {
    var elementId = $(this).parent().parent().attr("id");
    var overlay = getOverlayById(getId(elementId), savedData.activeTemplate);
    overlay.image_overlay.width = $(this).css("width");
    overlay.image_overlay.height = $(this).css("height");
}

/**
 * Triggered when the overlay image upload finishes.
 */
function onOverlayImageUploadComplete(e, res) {
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


$(document).ready(function() {
    templateSets = null;

    $("a.logout").click(function(e) {
        e.preventDefault();
    });

    $.getJSON("/manager/image_template_sets", null, function(response) {
        templateSets = response;
        createTemplateList();
    });

    $("a.full").click(function() {
        displayTemplateForActiveSet("detail");
    });
    $("a.small").click(function() {
        displayTemplateForActiveSet("summary");
    });
});
function createImageOverlayGallary(template, overlay){
    var template_type = template.template_type;
    if(jQuery("#"+template_type+"_image_gallary").size() > 0 ){
        jQuery("#"+template_type+"_image_gallary").remove()
    }
    jQuery("#content").append('<div class="gallary_container"  style="display:none;"><div class="gallary_content_div" id="'+template_type+'_image_gallary"></div></div>');
    var overlay_images = overlay.image_overlay.overlay_images;
    for(var i=0; i<overlay_images.length; i++){
        var url = overlay_images[i].url;
        var thumbnail_url = overlay_images[i].thumbnail_url;
        var overlay_image = '<div class="gallary_overlay_image_div"><div onclick="change_product_image(this);" class="gallary_overlay_image"><img org_url="'+url+'" src="'+thumbnail_url+'"/></div></div>';
        jQuery("#"+template_type+"_image_gallary").append(overlay_image);
    }
}
function change_product_image(obj){
    var url = jQuery(obj).find("img").attr('org_url');
    jQuery("#template-container-"+template_type+" .ui-wrapper img").attr("src",url);
    jQuery.fancyboxrun.close();
    jQuery(".image_loading").show().css({
        "position": "absolute",
        "top": (jQuery("#template-container-"+template_type+" .ui-wrapper img").position().top+250)+"px",
        "left": (jQuery("#template-container-"+template_type+" .ui-wrapper img").position().left+250)+"px"});
}
function show_gallary_window(){
    jQuery("#template-container-"+template_type+" .ui-wrapper img").attr("onload","photoloaded();")
    jQuery.fancyboxrun(jQuery("#"+template_type+"_image_gallary").parent());
}
function photoloaded(){
    jQuery(".image_loading").hide();
}