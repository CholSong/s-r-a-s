// JavaScript Document


$(document).ready(function(){
	$("#btn-logout").click(function(e){
		$("#logout-popup").css({"top": e.pageY, "left" : e.pageX}).show();
	});
	
	$("#logout-popup a.btn-no").click(function(){
		$("#logout-popup").hide();
	});
});