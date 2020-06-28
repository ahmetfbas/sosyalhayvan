

$(document).ready(function () {

	$('form.search input.form-control').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('form.search input[type="submit"]').click();
        }
    });
	
	    $(".select-avatar a").click(function () {
        if ($(".select-avatar a").hasClass("selected")) {
            $(".select-avatar a").removeClass("selected");
            $(this).addClass('selected');
            
        }
        else {
            $(this).addClass('selected');
        }
        var selectedAvatar = $(".selected img").attr('src');
        $( "input[name='avatar']" ).val(selectedAvatar);
        console.log($( "input[name='avatar']" ).val());
    });
});