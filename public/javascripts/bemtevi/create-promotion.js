function createPromotionFromTemplate() {
    drawTemplates();
    submitPromotionForm();
}

function submitPromotionForm() { 
    jQuery("#progress").css("display", "block");

    var formData = new FormData();
    formData.append("authenticity_token", AUTH_TOKEN); 
    formData.append("utf-8", "yes");
            
    var formElement = $("#new_promotion");
    var fields = formElement.serializeArray();
    
    jQuery.each(fields, function (i, field) {
        formData.append(field.name, field.value);
    });

    var canvasSummary = $("#canvas-container-summary").children("canvas")[0];
    var summaryDataURL = canvasSummary.toDataURL();
    var blobSummary = dataURLtoBlob(summaryDataURL);
    formData.append("promotion[promotion_images_attributes][0][attachment]", blobSummary);

    var canvasDetail = $("#canvas-container-detail").children("canvas")[0];
    var detailDataURL = canvasDetail.toDataURL();
    var blobDetail = dataURLtoBlob(detailDataURL);
    formData.append("promotion[promotion_images_attributes][1][attachment]", blobDetail);

    var formAction = formElement.attr("action");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        handleCanvasSubmitResponse(xhr);
    }
    xhr.open("POST", formAction);  
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    xhr.send(formData);
}

function handleCanvasSubmitResponse(request, formAction) {
    if (request.readyState == 4) {
        $(window.document.body).html(request.responseText);
    }
}

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
