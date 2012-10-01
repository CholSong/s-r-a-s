function createPromotionFromTemplate() {
    if(template_type==""){
        return;
    }
    $("#btnVoltar2").click(false);
    $("#btnProximo2").click(false);
    drawTemplates();
    submitPromotionForm();
}

function padTo2Digits(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
}

function submitPromotionForm() { 
    $("#progress").slideDown();

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
    if(jQuery("#is_recurrence").attr("checked")){
        var recurrencedays = "";
        jQuery("#recurrenceday-div input[type='checkbox']").each(function(){
            if(jQuery(this).attr("checked")){
                if(recurrencedays=="")
                    recurrencedays += jQuery(this).val();
                else
                    recurrencedays += "," + jQuery(this).val();
            }
        });

        if(recurrencedays!=""){
            formData.append("promotion[promotion_recurrenceday_attributes][day]", recurrencedays);
        }
    }
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
        window.location = "/manager/promotions";
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
