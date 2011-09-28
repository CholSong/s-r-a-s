function dataURLtoBlob(dataURL) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURL.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURL.split(',')[1]);
    } else {
        byteString = unescape(dataURL.split(',')[1]);
    }

    // separate out the mime component
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var bb = new window.WebKitBlobBuilder();
    bb.append(ab);
    return bb.getBlob(mimeString);
}

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

function saveCanvasToAttachment(authToken) { 
    var formdata = new FormData();
    formdata.append("authenticity_token", authToken); 
    formdata.append("utf-8", "yes");
    var productId = document.getElementById("product_id_for_image_from_template").value;
    formdata.append("product_id", productId);
    var canvas = document.getElementById("image_from_template_canvas");
    var dataURL = canvas.toDataURL();
    var blob = dataURLtoBlob(dataURL);
    formdata.append("image[attachment]", blob);

    var formAction = document.getElementById("image_from_template_form").getAttribute("action");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        handleCanvasSubmitResponse(xhr, formAction);
    }
    xhr.open("POST", formAction, false);  
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    xhr.send(formdata);
}

function handleCanvasSubmitResponse(request, formAction) {
    if (request.readyState == 4) {
        window.location = formAction;
    }
}
