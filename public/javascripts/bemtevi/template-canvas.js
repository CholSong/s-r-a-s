function showPromotionDetails() {
    $("#promotion-details").removeClass("is-hidden");
    $("#template_editing").addClass("is-hidden");
}

function showTemplateEditing() {
    $("#promotion-details").addClass("is-hidden");
    $("#template_editing").removeClass("is-hidden");
}

function drawTemplates() {
    var template = getTemplateByType("detail", savedData.activeTemplateSet);
    var templateContainer = $(".template-container.detail");
    var canvasContainer = $("#canvas-container-detail");
    drawTemplateAndOverlays(template, templateContainer, canvasContainer);

    template = getTemplateByType("summary", savedData.activeTemplateSet);
    templateContainer = $(".template-container.summary");
    canvasContainer = $("#canvas-container-summary");
    drawTemplateAndOverlays(template, templateContainer, canvasContainer);
}

function pxToNumber(data) {
    var a = typeof data;
    if ( typeof data === 'string') {
        return data.split("px")[0] * 1;
    } else {
        return data;
    }
}

function wrapText(context, text, x, y, maxWidth, textSizeInPx) {
    var lineHeight = pxToNumber(textSizeInPx);
    var words = text.split(" ");
    var line = "";

    for (var n = 0; n < words.length; n++) {
        var testLine = line == "" ? words[n] : line + " " + words[n];
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n];
            y += lineHeight * 1.2;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function drawTemplateAndOverlays(template, templateContainer, canvasContainer) {
    // Recreates the canvas container, removing previous elements from it.
    canvasContainer.children().remove();
    var templateType = template.template_type;
    var width = templateType == "summary" ? 393 : 423;
    var height = templateType == "summary" ? 216 : 695;
    var canvas = $('<canvas width="' + width + '" height="' + height + '" />');
    canvasContainer.append(canvas);
    var templateElementsContainer = $('<div class="template-elements-container">');
    canvasContainer.append(templateElementsContainer);

    // Gets the canvas context to draw the template elements.
    var canvasNode = canvas[0];
    var ctx = canvasNode.getContext("2d");
    ctx.globalCompositeOperation = "source-over";

    // Draws the template background over the canvas.
    var backgroundNode = $(templateContainer).find("[class|=template-background]")[0];
    ctx.drawImage(backgroundNode, 0, 0, backgroundNode.width, backgroundNode.height);

    // Loops through the template overlays to draw tem over the background.
    var overlays = template.overlays;
    for (var i = 0; i < overlays.length; i++) {
        var overlay = overlays[i];
        if (overlay.overlay_type == "text") {
            var textOverlay = overlay.text_overlay
            ctx.font = textOverlay.font_style + " " + textOverlay.font_weight + " " + textOverlay.font_size + " " + textOverlay.font_family;
            ctx.textAlign = textOverlay.text_align;
            ctx.textBaseline = "top";
            ctx.fillStyle = textOverlay.color;
            var text = savedData[templateType][overlay.tag] === undefined ? textOverlay.text : savedData[templateType][overlay.tag].text;
            wrapText(ctx, text, overlay.position_x, overlay.position_y, overlay.width, textOverlay.font_size);
        } else if (overlay.overlay_type == "image") {
            drawImageOverlay(overlay, ctx, templateElementsContainer, template, templateContainer, canvasContainer);
        }
    }

}

function drawImageOverlay(overlay, outCanvasContext, templateElementsContainer, template, templateContainer, canvasContainer) {

    // When the overlay is an image, it is necessary to redraw it over a canvas using the dimensions
    // applied to the image with CSS properties, otherwise we will have the image in its natural size
    // when drawing it to the template canvas.

    var templateType = template.template_type;

    // Gets the overlay image node from the user editing area.
    var imageOverlay = overlay.image_overlay;
    var overlayImgNode = $(templateContainer).find("#image-overlay_" + overlay.id).find(".ui-wrapper > img")[0];

    // Create a new canvas to draw the overlay image, resized to the dimensions set by the user during editing.
    var overlayCanvas = $('<canvas id="' + overlay.tag + "-" + templateType + '" />');
    templateElementsContainer.append(overlayCanvas);
    var overlayCanvasNode = overlayCanvas[0];
    var imageOverlayWidth = pxToNumber(imageOverlay.width);
    var imageOverlayHeight = pxToNumber(imageOverlay.height);
    overlayCanvasNode.width = imageOverlayWidth;
    overlayCanvasNode.height = imageOverlayHeight;

    // Draw the original overlay image into the canvas, in order to have a resized image.
    var overlayCtx = overlayCanvasNode.getContext("2d");
    overlayCtx.globalCompositeOperation = "source-over";
    overlayCtx.drawImage(overlayImgNode, 0, 0, overlayImgNode.naturalWidth, overlayImgNode.naturalHeight, 0, 0, imageOverlayWidth, imageOverlayHeight);

    // Create a new canvas to draw the resized image repositioned according to the user editing.
    var repositionedOverlayCanvas = $('<canvas id="repositioned-' + overlay.tag + "-" + templateType + '" />');
    templateElementsContainer.append(repositionedOverlayCanvas);
    var repositionedOverlayCanvasNode = repositionedOverlayCanvas[0];
    var overlayWidth = overlay.width;
    var overlayHeight = overlay.height;
    repositionedOverlayCanvasNode.width = overlayWidth;
    repositionedOverlayCanvasNode.height = overlayHeight;

    // Draw the resized overlay image into the canvas, in order to have a repositioned image.
    var x = pxToNumber(imageOverlay.position_x);
    var y = pxToNumber(imageOverlay.position_y);
    var repositionedOverlayCtx = repositionedOverlayCanvasNode.getContext("2d");
    repositionedOverlayCtx.globalCompositeOperation = "source-over";
    repositionedOverlayCtx.drawImage(overlayCanvasNode, 0, 0, imageOverlayWidth, imageOverlayHeight, x, y, imageOverlayWidth, imageOverlayHeight);

    // Draw the resized/repositioned image on the output canvas.
    outCanvasContext.drawImage(repositionedOverlayCanvasNode, overlay.position_x, overlay.position_y);
}
