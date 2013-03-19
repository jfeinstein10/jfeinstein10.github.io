
$(document).ready(function(){
	(function($) {

		$('button.send').click(function() {
			console.log('hello');
			var name = escape($('input.name').val());
			var subject = escape($('input.subject').val());
			if (name)
				subject = name + " - " + subject
			var message = escape($('textarea.message').val());
			var link = "mailto:jfeinstein10@gmail.com"
							+ "?subject=" + subject
							+ "&body=" + message;
			var win = window.open(link, '_blank');
  		win.focus();
		});

	  var allPanels = $('div.accordion').find('.acc-content').hide();
	  var allArrows = $('div.accordion').find('img.arrow');
		$('.accordion').find('a.accordion').click(function() {
		  	$this = $(this);
		  	$target = $this.next();
		  	$img = $this.find('img');
		  	var opts = {duration:300, queue:false};
		  	var arrowopts = {duration:350, queue:false};
		  	if (!$target.hasClass('active')) {
		  		allArrows.removeClass('activearrow').animate({rotate:0}, arrowopts);		  		
		  		$img.addClass('activearrow').animate({rotate:90}, arrowopts);
		  		allPanels.removeClass('active').slideUp(opts);
		  		$target.addClass('active').slideDown(opts);
		  	} else {
		  		$target.removeClass('active').slideUp(opts);
		  		$img.removeClass('activearrow').animate({rotate:0}, arrowopts);
		  	}
		    return false;
		});

	})(jQuery);
});
