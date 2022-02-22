(function($) {

    /*  [ Init Function ]
	- - - - - - - - - - - - - - - - - - - */
    $(document).ready(function() {

    	/* Filter
        ------------------------------------ */
        if($( '#cd-dropdown' ).length){
           $( '#cd-dropdown' ).dropdown( {
                gutter : 5,
                stack : false,
                delay : 100,
                slidingIn : 100
            } ); 
        }


    	 if ($().magnificPopup) {
            /* general */
            $('.k2t-popup-link').magnificPopup({ 
				type: 'image',
			}); // magnificPopup
			
			$('.k2t-video-popup-link').magnificPopup({ 
				type: 'iframe',
			}); // magnificPopup

			$('.k2t-audio-popup-link').magnificPopup({ 
				type:'inline',
	  			midClick: true
			}); // magnificPopup

            /* gallery */
            $('.k2t-popup-gallery').magnificPopup({
                delegate: 'a', // the selector for gallery item
                type: 'image',
                gallery: {
                    enabled: true
                }
            });

        }; // if magnificPopup exists

        /* sticky sidebar
		------------------------------------ */
        // $('.has-sticky-sidebar #secondary').stickyMojo({footerID: '#k2t_portfolio_factor', contentID: '#primary'});


		if ( $().masonry && $().isotope && $().imagesLoaded ) {
			
			$('.k2t-isotope-wrapper').each(function(){
											 
				var $this = $(this);
				var $container = $this.find('.k2t-isotope-container');
				
				// initialize Isotope + Masonry after all images have loaded  
				$this.imagesLoaded( function() {

					$container.addClass('loaded').find('.isotope-selector').find('.article-inner');
					var isotope_args = {
						itemSelector: '.isotope-selector',
						transitionDuration	: '.55s',
						masonry: {
							gutter	: '.gutter-sizer',
							//columnWidth: 
						},
					};
					if ($this.hasClass('isotope-grid')) {
						isotope_args['layoutMode'] = 'fitRows';
					}
					if ($this.hasClass('isotope-no-padding')) {
						delete isotope_args.masonry.gutter; //true
					}
					if ($this.hasClass('isotope-free')) {
						isotope_args.masonry['columnWidth'] = '.width-1';
					}
					var $grid = $container.isotope(isotope_args);
					
					// animation
					var animation = $grid.data('animation');
					if (animation = true) {
						$container.find('.isotope-selector').find('.article-inner').each(function(){
							var $this=$(this);
							$this.parent().one('inview', function(event, isInView, visiblePartX, visiblePartY) {
								if (isInView) {
									$this.addClass('run_animation');
								} // inview						  
							});// bind
						}); // each
							
					} // endif animation
					

					// filter items when filter link is clicked
					$this.find('.cd-dropdown').find('span').click(function(){
						if ( $(this).parent().parent().parent().hasClass('cd-active') ){
							var selector = $(this).attr('class');
							$container.isotope({
								filter: selector,
							});
						}
					});
					
					// filter items when filter link is clicked
					$this.find('.k2t-isotope-filter').find('a').click(function(){
						$this.find('.k2t-isotope-filter').find('li').removeClass('active');
						$(this).parent().addClass('active');
						var selector = $(this).attr('data-filter');
						$container.isotope({
							filter: selector,
						});
						return false;
					});
					
				}); // imagesLoaded
				
			}); // each .k2t-isotope-wrapper
		} // if isotope


        
    }); // ready
	
})(jQuery);

