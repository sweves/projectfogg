// NavBar

$('.navbar-collapse a:not(.dropdown-toggle)').click(function(){
	if($(window).width() < 768 )
    $(".navbar-collapse").collapse('hide');
});
$('.navbar-collapse .dropdown-menu').click(function(){
	if($(window).width() < 768 )
    $(".navbar-collapse").collapse('hide');
});





//scroll to top
$(document).ready(function(){

//Check to see if the window is top if not then display button
$(window).scroll(function(){
	if ($(this).scrollTop() > 100) {
		$('.scroller').fadeIn();
	} else {
		$('.scroller').fadeOut();
	}
});



});

