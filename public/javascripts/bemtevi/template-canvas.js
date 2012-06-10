function drawTemplates() {
    var template = getTemplateByType("detail", savedData.activeTemplateSet);
    var templateContainer = $(".template-container.detail");
    var canvasContainer = $("#canvas-container-detail");
    drawTemplateAndOverlays(template, templateContainer, canvasContainer);
}

function drawTemplateAndOverlays(template, templateContainer, canvasContainer) {
    var templateType = template.template_type;
    var canvas = $(canvasContainer).children("[id|=canvas]")[0];
    var templateElements = $(canvasContainer).children("[id|=template-elements]");
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";

    var background = $(templateContainer).find("[class|=template-background]")[0];

    ctx.drawImage(background, 0, 0, background.width, background.height);

    var overlays = template.overlays;
    for(var i=0; i < overlays.length; i++) {
        var overlay = overlays[i];
        if(overlay.overlay_type == "text") {
            // ctx.font = elem.font;
            // ctx.textAlign = "left";
            // ctx.textBaseline = "bottom";
            // ctx.fillStyle = elem.fillStyle;
            // ctx.fillText(elem.value, elem.posX, elem.posY);
        } else if(overlay.overlay_type == "image") {
            var overlayCanvas = $('<canvas id="' + overlay.tag + "-" + templateType + '" />');
            templateElements.append(overlayCanvas);
            var overlayCanvasElement = overlayCanvas[0];
            var overlayImgElement = $(templateContainer).find("#image-overlay_" + overlay.id).find(".ui-wrapper > img")[0];
            var imageOverlay = overlay.image_overlay;
            var imageOverlayWidth = imageOverlay.width.split("px")[0] * 1;
            var imageOverlayHeight = imageOverlay.height.split("px")[0] * 1;
            overlayCanvasElement.width = imageOverlayWidth;
            overlayCanvasElement.height = imageOverlayHeight;
            var overlayCtx = overlayCanvasElement.getContext("2d");
            overlayCtx.globalCompositeOperation = "source-over";
            overlayCtx.drawImage(overlayImgElement, 0, 0, 425, 542, 0, 0, imageOverlayWidth, imageOverlayHeight);
            
            
            
            // var teste_x = imageOverlay.position_x.split("px")[0] * -1;
            // var teste_y = imageOverlay.position_y.split("px")[0] * -1;
            // overlayCtx.drawImage(overlayImgElement, teste_x, teste_y, 100, 100, 0, 0, 100, 100);
        }
    }

}

