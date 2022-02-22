(function($) {

	/*  [ Init Function ]
	- - - - - - - - - - - - - - - - - - - */
	$(document).ready(function() {
        if($( '#cd-dropdown' ).length){
           $( '#cd-dropdown' ).dropdown( {
                gutter : 5,
                stack : false,
                delay : 100,
                slidingIn : 100
            } ); 
        }
        

        if ( $().masonry && $().isotope && $().imagesLoaded ) {
    		if(jQuery('.event-listing-masonry-wrapper').length){
                var $this = $(this);
    			var container = document.querySelector('.event-listing-masonry');
                $this.imagesLoaded( function() {
        			var msnry = new Masonry( container, {
        				itemSelector: '.masonry-its',
        				columnWidth: container.querySelector('.grid-sizer'),
        				gutter: 0
        			});
                });


    			$('.event-listing-masonry-wrapper').each(function(){
    				var $container = $this.find('.event-listing-masonry');

                        // filter items when filter link is clicked
                        $this.find('.cd-dropdown').find('span').click(function(){
                            if ( $(this).parent().parent().parent().hasClass('cd-active') ){
                                var selector = $(this).attr('class');
                                $container.isotope({
                                    filter: selector,
                                });
                            }
                        });

        				$this.find('.filter-list').find('li').eq(0).addClass('active');
        				$this.find('.filter-list').find('li').click(function(){
    					if(jQuery(this).hasClass('active')){
    						return false;
    					}
    					var selector = $(this).attr('class');
    					$container.isotope({
    						filter: selector,
    					});
    					$(this).parent().find('li').removeClass('active');
    					$(this).addClass('active')
    				});
    			});
    		}
        }

		if(jQuery('.ticket-input').length){
			$(".ticket-input .button").on("click", function() {

			  var $button = $(this);
			  var oldValue = $button.parent().find("input").val();
			  if ($button.hasClass("inc")) {
				  var newVal = parseFloat(oldValue) + 1;
				} else {
			   // Don't allow decrementing below zero
				if (oldValue > 0) {
				  var newVal = parseFloat(oldValue) - 1;
				} else {
				  newVal = 0;
				}
			  }
			  $button.parent().find("input").val(newVal).trigger('change');
			});
		}

        $('.ticket-input input').on('change',function(){
            var $link = $(this).closest('.entry-meta-inner').find('.add-to-cart-link');
            var    new_link = $link.attr('href').replace( /\d{0,10}$/,$(this).val() );
            $link.attr( 'href', new_link );
        });

	}); // ready

	if(jQuery('.countdown-container').length){

		jQuery(window).on('load', function() {

            $('.countdown-container').each(function(index){
                var labels = ['weeks','days', 'hours', 'minutes', 'seconds'],
                    template = _.template($(this).parent().next().find('script.countdown-template').html()),
                    currDate = '00:00:00:00:00',
                    nextDate = '00:00:00:00:00',
                    parser = /([0-9]{2})/gi,
                    $example = $(this);
                if ( typeof k2t_countdown_label != 'undefined' ) {
                    labels[0] = k2t_countdown_label.weeks;
                    labels[1] = k2t_countdown_label.days;
                    labels[2] = k2t_countdown_label.hours;
                    labels[3] = k2t_countdown_label.min;
                    labels[4] = k2t_countdown_label.sec;
                }
                // Parse countdown string to an object
                function strfobj(str) {
                    var parsed = str.match(parser),
                        obj = {};
                    labels.forEach(function(label, i) {
                        obj[label] = parsed[i]
                    });
                    return obj;
                }
                // Return the time components that diffs
                function diff(obj1, obj2) {
                    var diff = [];
                    labels.forEach(function(key) {
                        if (obj1[key] !== obj2[key]) {
                            diff.push(key);
                        }
                    });
                    return diff;
                }
                // Build the layout
                var initData = strfobj(currDate);
                labels.forEach(function(label, i) {
                    $example.append(template({
                        curr: initData[label],
                        next: initData[label],
                        label: label
                    }));
                });
                // Starts the countdown

                $example.countdown($example.parent().next().find('script.countdown-template').data('startdate'), function(event) {
                    var newDate = event.strftime('%w:%d:%H:%M:%S'),
                        data;
                    if (newDate !== nextDate) {
                        currDate = nextDate;
                        nextDate = newDate;
                        // Setup the data
                        data = {
                            'curr': strfobj(currDate),
                            'next': strfobj(nextDate)
                        };
                        // Apply the new values to each node that changed
                        diff(data.curr, data.next).forEach(function(label) {
                            var selector = '.%s'.replace(/%s/, label),
                                $node = $example.find(selector);
                            // Update the node
                            $node.removeClass('flip');
                            $node.find('.curr').text(data.curr[label]);
                            $node.find('.next').text(data.next[label]);
                            // Wait for a repaint to then flip
                            _.delay(function($node) {
                                $node.addClass('flip');
                            }, 50, $node);
                        });
                    }
                });
            });

		});
	}
	
	
})(jQuery);

