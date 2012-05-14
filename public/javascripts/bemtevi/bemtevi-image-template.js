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
    var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;;
    var bb = new BlobBuilder();
    bb.append(ab);
    return bb.getBlob(mimeString);
}

function getOverlayList(templateId) {
    if (typeof templateOverlayMatrix == 'undefined') {
        templateOverlayMatrix = new Object();
    }
    var overlayList = templateOverlayMatrix[templateId];
    if (typeof overlayList == 'undefined') {
        templateOverlayMatrix[templateId] = new Object();
        overlayList = templateOverlayMatrix[templateId];
    }
    return overlayList;
}

function enableOverlaysAndDrawTemplate(templateId) {
    jQuery("#overlay_fields").show();
    if (typeof templateOverlayMatrix != 'undefined' && 
        typeof templateOverlayMatrix[templateId] != 'undefined') {
        templateOverlayMatrix[templateId] = new Object();
    }
    drawTemplateAndOverlays(templateId);
}

function setOverlayText(txtElement, templateId, posX, posY, fillStyle, font) {
    var newElement = {
        "type": "text",
        "value": txtElement.value,
        "posX": posX,
        "posY": posY,
        "fillStyle": fillStyle,
        "font": font
    }
    var overlayList = getOverlayList(templateId);
    overlayList[txtElement.id] = newElement;
    drawTemplateAndOverlays(templateId);
}

function setOverlayImage(imgElement, templateId, overlayImageId, posX, posY, width, height) {
    var file = imgElement.files[0];
    if (!file.type.match('image.*')) {
        return;
    }
    
    var newElement = {
        "type": "file",
        "image": document.getElementById(overlayImageId),
        "posX": posX,
        "posY": posY,
        "width": width,
        "height": height
    };

    var overlayList = getOverlayList(templateId);
    overlayList[imgElement.id] = newElement;

    var reader = new FileReader();
    reader.onload  = function() {
        newElement.image.src = reader.result;
    };
    reader.readAsDataURL(file);
    
    // Use uploadImage when issues with https are solved.  
    // uploadImage(file, overlayImageId);
}

function uploadImage(file, overlayImageId) { 
    jQuery("#progress").css("display", "block");
    
    var formdata = new FormData();
    formdata.append("authenticity_token", AUTH_TOKEN); 
    formdata.append("utf-8", "yes");
    formdata.append("image[attachment]", file);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        handleImageSubmitResponse(xhr, overlayImageId);
    }
    xhr.open("POST", "/api2/images");  
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(formdata);
}

function handleImageSubmitResponse(request, overlayImageId) {
    if (request.readyState == 4) {
        if (request.status == 201) {
            jQuery.getJSON(request.getResponseHeader("Location"), function(data) {
                var proxiedUrl = data.image.url.split("s3.amazonaws.com")[1];
                document.getElementById(overlayImageId).src = proxiedUrl;
            });
        } else {
            // TODO: need to get a prompt from rails to support proper translations.
            jAlert("Erro ao ler a imagem.", "Erro");
        }
    }
}

function drawTemplateAndOverlays(templateId) {
    var template = document.getElementById(templateId);
    var canvas = document.getElementById('image_from_template_canvas');
    canvas.width = template.width;
    canvas.height = template.height;

    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(template, 0, 0, template.width, template.height);
    
    var overlayList = getOverlayList(templateId);
    for (var key in overlayList) {
        var elem = overlayList[key];
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

function saveCanvasToAttachmentAsBase64() { 
    // This could help in case we cant create a Blob to post the inmage to the server.
    // Currently not being used.
    jQuery("#progress").css("display", "block");
    
    var type='image/png';
    var boundary='myboundaryrandom';
    var canvas = document.getElementById("image_from_template_canvas");
    var promotionId = document.getElementById("promotion_id_for_image_from_template").value;
    var arr, data, j, xhr;
    data = canvas.toDataURL(type);
    data = data.replace('data:' + type + ';base64,', '');
    arr = ['--' + boundary, 
           'Content-Disposition: form-data; name="authenticity_token"', 
           '',
           AUTH_TOKEN,
           '--' + boundary, 
           'Content-Disposition: form-data; name="utf-8"', 
           '',
           'yes',
           '--' + boundary,
           'Content-Disposition: form-data; name="product_id"', 
           '',
           promotionId,
           '--' + boundary,
           'Content-Disposition: form-data; name="image[attachment]"; filename="myfile"', 
           'Content-Transfer-Encoding: base64',
           'Content-Type: ' + type,
           '',
           data,
           '--' + boundary + '--'];
    j = arr.join('\r\n');

    var formAction = document.getElementById("image_from_template_form").getAttribute("action");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        handleCanvasSubmitResponse(xhr, formAction);
    }
    xhr.open("POST", formAction);  
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    xhr.send(j);
}

function saveCanvasToAttachment() { 
    jQuery("#progress").css("display", "block");
    
    var formdata = new FormData();
    formdata.append("authenticity_token", AUTH_TOKEN); 
    formdata.append("utf-8", "yes");
    
    var promotionId = document.getElementById("promotion_id_for_image_from_template").value;
    formdata.append("product_id", promotionId);
    
    var canvas = document.getElementById("image_from_template_canvas");
    var dataURL = canvas.toDataURL();
    var blob = dataURLtoBlob(dataURL);
    formdata.append("promotion_image[attachment]", blob);

    var formAction = document.getElementById("image_from_template_form").getAttribute("action");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        handleCanvasSubmitResponse(xhr, formAction);
    }
    xhr.open("POST", formAction);  
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    xhr.send(formdata);
}

function handleCanvasSubmitResponse(request, formAction) {
    if (request.readyState == 4) {
        $(window.document.body).html(request.responseText);
    }
}
