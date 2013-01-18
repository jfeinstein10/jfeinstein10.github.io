$(function() {

	var navbar = $('#navbar');
	var fork = $('#fork');
	var nav_offset = navbar.offset().top;
	var fork_offset = fork.offset().top;

	var floating_navigation = function() {
        // current vertical position from the top
        var scroll_top = $(window).scrollTop();
		// if scrolled more than the navigation, change its 
        // position to fixed to float to top, otherwise change 
        // it back to relative
        if (scroll_top > nav_offset) { 
            navbar.css({ 'position': 'fixed', 'top':0 });
        } else {
            navbar.css({ 'position': 'relative' }); 
        }

        if (scroll_top > fork_offset) { 
            fork.css({ 'position': 'fixed', 'top':0});
        } else {
            fork.css({ 'position': 'relative' }); 
        } 
	}

	floating_navigation();

	// run function every time you scroll
    $(window).scroll(function() {
         floating_navigation();
    });

});