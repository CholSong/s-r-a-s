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