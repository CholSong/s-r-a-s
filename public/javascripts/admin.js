/**
This is a collection of javascript functions and whatnot
under the spree namespace that do stuff we find helpful.
Hopefully, this will evolve into a propper class.
**/

var spree;
if (!spree) spree = {};

jQuery.noConflict() ;

jQuery(document).ajaxStart(function(){
  jQuery("#progress").slideDown();
});

jQuery(document).ajaxStop(function(){
  jQuery("#progress").slideUp();
});

jQuery.fn.visible = function(cond) { this[cond ? 'show' : 'hide' ]() };

// Apply to individual radio button that makes another element visible when checked
jQuery.fn.radioControlsVisibilityOfElement = function(dependentElementSelector){
  if(!this.get(0)){ return  }
  showValue = this.get(0).value;
  radioGroup = $("input[name='" + this.get(0).name + "']");
  radioGroup.each(function(){
    jQuery(this).click(function(){
      jQuery(dependentElementSelector).visible(this.checked && this.value == showValue)
    });
    if(this.checked){ this.click() }
  });
}

var request = function(options) {
  jQuery.ajax(jQuery.extend({ dataType: 'script', url: options.url, type: 'get' }, options));
  return false;
};

// remote links handler
jQuery('a[data-remote=true]').live('click', function() {
  if(confirm_msg = jQuery(this).attr("data-confirm")){
    if (!confirm(confirm_msg)) return false;
  }
  if(method = jQuery(this).attr("data-method")){
    return request({ url: this.href, type: 'POST', data: {'_method': method} });
  } else {
    update_target = jQuery(this).attr("data-update");
    link_container = jQuery(this).parent();
    if (update_target) {
      if ($("#"+update_target).length == 0) {
        if ($("#"+update_target.replace('_', '-')).length > 0) {
          update_target = update_target.replace('_', '-')
        } else {
          alert("<div id="+update_target+"></div> not found, add it to view to allow AJAX request.");
          return true;
        }
      }
    }
    jQuery.ajax({ dataType: 'script', url: this.href, type: 'get',
        success: function(data){
          if (update_target) {
            $("#"+update_target).html(data);
            link_container.hide();
          }
        }
    });
    return false;
  }
});

// remote forms handler
jQuery('form[data-remote=true]').live('submit', function() {
  return request({ url : this.action, type : this.method, data : jQuery(this).serialize() });
});




// Product autocompletion
image_html = function(item){
  return "<img src='/assets/products/" + item['images'][0]["id"] + "/mini/" + item['images'][0]['attachment_file_name'] + "'/>";
}

format_autocomplete = function(data){
  var html = "";

  var product = data['product'];

  if(data['variant']==undefined){
    // product

    if(product['images'].length!=0){
      html = image_html(product);
    }

    html += "<div><h4>" + product['name'] + "</h4>";
    html += "<span><strong>Sku: </strong>" + product['master']['sku'] + "</span>";
    html += "<span><strong>On Hand: </strong>" + product['count_on_hand'] + "</span></div>";
  }else{
    // variant
    var variant = data['variant'];
    var name = product['name'];

    if(variant['images'].length!=0){
      html = image_html(variant);
    }else{
      if(product['images'].length!=0){
        html = image_html(product);
      }
    }

    name += " - " + $.map(variant['option_values'], function(option_value){
      return option_value["option_type"]["presentation"] + ": " + option_value['name'];
    }).join(", ")

    html += "<div><h4>" + name + "</h4>";
    html += "<span><strong>Sku: </strong>" + variant['sku'] + "</span>";
    html += "<span><strong>On Hand: </strong>" + variant['count_on_hand'] + "</span></div>";
  }


  return html
}


prep_autocomplete_data = function(data){
  return $.map(eval(data), function(row) {

    var product = row['product'];

    if(product['variants'].length>0 && expand_variants){
      //variants
      return $.map(product['variants'], function(variant){

        var name = product['name'];
        name += " - " + $.map(variant['option_values'], function(option_value){
          return option_value["option_type"]["presentation"] + ": " + option_value['name'];
        }).join(", ");

        return {
            data: {product: product, variant: variant},
            value: name,
            result: name
        }
      });
    }else{
      return {
          data: {product: product},
          value: product['name'],
          result: product['name']
      }
    }
  });
}

jQuery.fn.product_autocomplete = function(){
  $(this).autocomplete("/admin/products.json?authenticity_token=" + $('meta[name=csrf-token]').attr("content"), {
      parse: prep_autocomplete_data,
      formatItem: function(item) {
        return format_autocomplete(item);
      }
    }).result(function(event, data, formatted) {
      if (data){
        if(data['variant']==undefined){
          // product
          $('#add_variant_id').val(data['product']['master']['id']);
        }else{
          // variant
          $('#add_variant_id').val(data['variant']['id']);
        }
      }
    });
}



jQuery.fn.objectPicker = function(url){
  jQuery(this).tokenInput(url + "&authenticity_token=" + AUTH_TOKEN, {
    searchDelay          : 600,
    hintText             : strings.type_to_search,
    noResultsText        : strings.no_results,
    searchingText        : strings.searching,
    prePopulateFromInput : true
  });
};

jQuery.fn.productPicker = function(){
  jQuery(this).objectPicker(ajax_urls.product_search_basic_json);
}
jQuery.fn.userPicker = function(){
  jQuery(this).objectPicker(ajax_urls.user_search_basic_json);
}

jQuery(document).ready(function() {

  jQuery('.tokeninput.products').productPicker();
  jQuery('.tokeninput.users').userPicker();
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

function add_fields(target, association, content) {
  var new_id = new Date().getTime();
  var regexp = new RegExp("new_" + association, "g");
  $(target).append(content.replace(regexp, new_id));
}

jQuery('a.remove_fields').live('click', function() {
  $(this).prev("input[type=hidden]").val("1");
  $(this).closest(".fields").hide();
  return false;
});

jQuery(".observe_field").live('change', function() {
  target = $(this).attr("data-update");
  ajax_indicator = $(this).attr("data-ajax-indicator") || '#busy_indicator';
  $(target).hide();
  $(ajax_indicator).show();
  $.get($(this).attr("data-base-url")+encodeURIComponent($(this).val()),
    function(data) {
      $(target).html(data);
      $(ajax_indicator).hide();
      $(target).show();
    }
  );
});

var detail_file_length;
var summary_file_length
function select_file(obj, type){
  var file_length = 0;
  if(type == "summary" ){
    file_length = summary_file_length;
  }else{
    file_length = detail_file_length
  }
  if( !file_length ){
    file_length = jQuery("." + type + "_product_overlay_images input[type='file']").size();
  }
  var element_name
  if(type=="summary"){
    element_name = "image_template_set[image_templates_attributes][0][overlays_attributes][0][image_overlay_attributes][overlay_images_attributes][" + (file_length-1) + "][attachment]";
  }else{
    element_name = "image_template_set[image_templates_attributes][1][overlays_attributes][0][image_overlay_attributes][overlay_images_attributes][" + (file_length-1) + "][attachment]"
  }
  if(jQuery(obj).attr("name") == element_name){
    var file_name = obj.files[0].name;
    if(file_name != ""){
      var new_element_name
      if(type=="summary"){
        new_element_name = "image_template_set[image_templates_attributes][0][overlays_attributes][0][image_overlay_attributes][overlay_images_attributes][" + file_length + "][attachment]";
      }else{
        new_element_name = "image_template_set[image_templates_attributes][1][overlays_attributes][0][image_overlay_attributes][overlay_images_attributes][" + file_length + "][attachment]"
      }
      jQuery(obj).parent().siblings(".view_file").html("<p>"+file_name+"</p>");
      jQuery(obj).parent().siblings(".file_remove").html("<a id='"+type+"_file_remove_"+file_length +"' href='javascript:jQuery(\"#"+type+"_file_remove_"+file_length +"\").parent().parent().remove();'>Remover</a>");
      var new_file_input_div = '<div class="product_overlay_images"><div class="input_tag_container product_overlay_child">' +
          '<input onchange="javascript:select_file(this,\''+type+'\');" name="'+new_element_name+'" type="file">' +
         '</div><div class="view_file product_overlay_child"></div><div class="file_remove product_overlay_child"></div></div>';
      jQuery(obj).parent().parent().parent().append(new_file_input_div);
      if(type == "summary" ){
        summary_file_length = file_length;
        summary_file_length++;
      }else{
        detail_file_length = file_length;
        detail_file_length++;
      }
    }
  }
}

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
  if($.browser.mise){
    alert(which_image)
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

