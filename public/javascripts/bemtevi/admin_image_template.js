jQuery(document).ready(function() {
  jQuery(".text-overlay").click(function(){
    jQuery(this).find("p").css("display","none");
    jQuery(this).find("textarea").css("display","block").html(jQuery(this).find("p").html())
  });
  jQuery(".text-overlay textarea").blur(function(){
    jQuery(this).css("display","none");
    jQuery(this).siblings("p").css("display","block").html(jQuery(this).val())
  });
  jQuery("input[type='file']").change(function(){
    upload_tolocal(this);
  })
});

function preview_template(template_type){
  var background_image_element_index = template_type=='detail'?1:0;
  var background_image = jQuery("input[name$='["+ background_image_element_index +"][background_image_attributes][attachment]']").siblings("a").attr("href");
  if(template_type=='detail'){
    if(detail_back_src!='')background_image=detail_back_src;
  }else{
    if(sumary_back_src!='')background_image=sumary_back_src;
  }
  if(!background_image)return;
  jQuery(".template-background-"+template_type).attr("src",background_image);
  jQuery("#template-container-" + template_type + " .image-overlay").css({
    'left' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][position_x]']").val()+'px',
    'top' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][position_y]']").val()+'px',
    'width' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][width]']").val()+'px',
    'height' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][height]']").val()+'px'
  });
   jQuery("#template-container-" + template_type + " .ui-wrapper").css({
    'width' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][width]']").val()+'px',
    'height' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][height]']").val()+'px'
   });
   var flyer_image = jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][image_overlay_attributes][overlay_images_attributes][0][attachment]']").parent().siblings(".view_file").find("a").attr("href");
   if(template_type=='detail'){
    if(detail_flyer_src!='')flyer_image=detail_flyer_src;
  }else{
    if(sumary_flyer_src!='')flyer_image=sumary_flyer_src;
  }
  if(flyer_image){
    jQuery("#template-container-" + template_type + " .flyer-image").attr("src",flyer_image).css({
      'width' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][width]']").val()+'px',
      'height' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes][0][height]']").val()+'px'    
     });
  }
   var text_overlay_index = 2;
   jQuery("#template-container-" + template_type + " .text-overlay").each(function(){
    jQuery(this).css({
      'left' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][position_x]']").val()+'px',
      'top' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][position_y]']").val()+'px',
      'width' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][width]']").val()+'px',
      'height' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][height]']").val()+'px'
    });
    jQuery(this).children().css({
      'color' : jQuery("input[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][color]']").val(),
      'font-family' : jQuery("select[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][font_family]']").val(),
      'font-size' : jQuery("select[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][font_size]']").val(),
      'text-align' : jQuery("select[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][text_align]']").val(),
      'font-weight' : jQuery("select[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][font_weight]']").val(),
      'font-style' : jQuery("select[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][font_style]']").val(),
      'text-decoration' : jQuery("select[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][text_decoration]']").val()

    })
    jQuery(this).children("p").html(jQuery("input[name$='["+background_image_element_index+"][overlays_attributes]["+text_overlay_index+"][text_overlay_attributes][text]']").val())
    text_overlay_index++;
   });
  jQuery.fancyboxrun(jQuery("#template-container-" + template_type));
}



var detail_back_src="";
var detail_flyer_src="";
var sumary_back_src="";
var sumary_flyer_src="";

function upload_tolocal(obj){
  var submit_flag =  false;
  var which_image = "";
  if(jQuery(obj).parent().get(0).tagName == "FIELDSET"){
    submit_flag = true;
    which_image = jQuery(obj).parent().attr("id")=='summary_template_fields'?'sumary_back_src':'detail_back_src';
  }else{
    if(jQuery("."+jQuery(obj).parent().parent().attr("class")).size()<2){
      submit_flag = true;
      which_image = jQuery(obj).parent().parent().attr("class")=='summary_product_overlay_images'?'sumary_flyer_src':'detail_flyer_src';
    }
  }
  if(!submit_flag)return;
  if($.browser.msie){
    which_image_src = jQuery(obj).val();
    switch(which_image){
      case 'detail_back_src':
        detail_back_src = which_image_src;
        break;
      case 'detail_flyer_src':
        detail_flyer_src = which_image_src;
        break;
      case 'sumary_back_src':
        sumary_back_src = which_image_src;
        break;
      case 'sumary_flyer_src':
        sumary_flyer_src = which_image_src;
        break;
    }
  }else{
    var file = obj.files[0];
    var formdata = false;
    if(window.FormData){
      formdata = new FormData();
      formdata.append('img-upload',file);
    }
    if(formdata){
      var xhr = new XMLHttpRequest();
      xhr.open("POST","/upload_temp_image");
      xhr.setRequestHeader('X-CSRF-Token',AUTH_TOKEN)
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if((this.status >= 200 && this.status < 300) || this.status == 304){
            if(this.responseText!=''){
              which_image_src = jQuery(this.responseText).find("file_path").text();
              switch(which_image){
                case 'detail_back_src':
                  detail_back_src = which_image_src;
                  break;
                case 'detail_flyer_src':
                  detail_flyer_src = which_image_src;
                  break;
                case 'sumary_back_src':
                  sumary_back_src = which_image_src;
                  break;
                case 'sumary_flyer_src':
                  sumary_flyer_src = which_image_src;
                  break;
              }
            }
          }
        }
      }
      xhr.send(formdata);
    }
  }
  
}