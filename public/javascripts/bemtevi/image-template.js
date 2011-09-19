function prepare_canvas () {
    templateOverlayList = new Object();
    drawAndSaveCanvasToAttachment();
}

function setOverlayText(txtElement, posX, posY, fillStyle, font) {
    var newElement = {
        "type": "text",
        "value": txtElement.value,
        "posX": posX,
        "posY": posY,
        "fillStyle": fillStyle,
        "font": font
    }
    
    templateOverlayList[txtElement.name] = newElement;
    drawAndSaveCanvasToAttachment();
}

function setOverlayImage(imgElement, posX, posY, width, height) {
    var newElement = {
        "type": "file",
        "image": new Image(),
        "posX": posX,
        "posY": posY,
        "width": width,
        "height": height
    };
    
    templateOverlayList[imgElement.name] = newElement;
    newElement.image.onload = function() {
        drawAndSaveCanvasToAttachment();
    };
    
    var file = imgElement.files[0];
    if (!file.type.match('image.*')) {
        return;
    }
      
    var reader = new FileReader();
    reader.onload  = function() {
        newElement.image.src = reader.result;
    };
    reader.readAsDataURL(file);
}

function drawAndSaveCanvasToAttachment() {
    drawTemplateAndOverlays();
    //saveCanvasToAttachment();
}

function drawTemplateAndOverlays() {
    var template = document.getElementById('template_image');
    var canvas = document.getElementById('image_from_template_canvas');
    canvas.width = template.width;
    canvas.height = template.height;

    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(template, 0, 0, template.width, template.height);
    
    for (var key in templateOverlayList) {
        var elem = templateOverlayList[key];
        if (elem.type == "text") {
            ctx.font = elem.font;
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";    
            ctx.fillStyle = elem.fillStyle;
            ctx.fillText(elem.value, elem.posX, elem.posY);
        } else if (elem.type == "file") {
            ctx.drawImage(elem.image, elem.posX, elem.posY, elem.width, elem.height);
        }
    }
}

function saveCanvasToAttachment() { 
    var canvas = document.getElementById('image_from_template_canvas');
    var resultingImage = canvas.toDataURL();
    var attachment = document.getElementById('image_attachment');
    attachment.src = resultingImage;
    attachment.value = "bemtevi-template.jpg";
    
    alert('sending form');
    
    var formdata = new FormData();
    formdata.append("authenticity_token", "KdTGeGQnTyQ7QySo2UpnnHKfrfuOOhjV9sGgrMXbB/g="); 
    formdata.append("utf-8", "yes");
    formdata.append("image", resultingImage);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/admin/products/promocao-de-teste/images");  
    xhr.send(formdata);
    alert('form sent');

}
