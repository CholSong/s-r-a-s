// JavaScript Document
/**
 * Função que retorna o número do ID do elemento à partir do ID em formato String
 */
function getId(str) {
    return String(str).substring(String(str).indexOf("_") + 1);
}


$(document).ready(function() {

    $("div.foo").carousel();

    $("select.dropDownMenu").selectmenu({
        style : 'dropdown',
        menuWidth : '150px'
    });
    $("select.dropDownMenu").change(function() {
        window.location = "/manager/promotions?vendor_id=" + $("select.dropDownMenu").val();
    });

    $("#btn-logout").click(function(e) {
        var popup = $("#logout-popup");
        var x = e.pageX - Math.round(popup.width() / 2);
        popup.css({
            "top" : e.pageY,
            "left" : x
        }).show();
    });

    $("#logout-popup a.btn-no").click(function() {
        $("#logout-popup").hide();
    });
    $(".tpl-list-item").hover(
        function(){
            $(this).find("input[class$='-template-btn']").addClass("template-btn_hover");
            $(this).find("a[class$='-template-btn']").addClass("template-btn_hover");
        },
        function(){
            $(this).find("input[class~='template-btn_hover']").removeClass("template-btn_hover");
            $(this).find("a[class~='template-btn_hover']").removeClass("template-btn_hover");
        }
    );
    $("#is_recurrence").click(function(){
        if($(this).attr("checked")){
            $("#recurrenceday-div").fadeIn(2000)
        }else{
            $("#recurrenceday-div").fadeOut(2000);
        }
    })
});
    