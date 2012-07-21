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
});
