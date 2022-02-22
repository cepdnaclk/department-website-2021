/**
 * Custom script for Lincoln.
 *
 * @package Lincoln
 * @author  LunarTheme
 * @link	http://www.lunartheme.com
 */
 
(function($) {
	"use strict";

	$(function() {

		/*  [ Detecting Mobile Devices ]
		- - - - - - - - - - - - - - - - - - - - */
		var isMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
			},
			Desktop: function() {
				return window.innerWidth <= 960;
			},
			any: function() {
				return ( isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || isMobile.Desktop() );
			}
		}

		/*  [ Button click effect ]
		- - - - - - - - - - - - - - - - - - - - */
		var element, ripple, d, x, y;
		var i = 1;
		var queue = [];


		$(".vc_tta-tab").on('click',function(){
			var id = $(this).find('a').attr('href');
			setTimeout( function(){
				$(id).find('.teacher-listing').isotope('layout');
			}, 300 );
		});

		$(document).on('click', '.btn-ripple', function (e) {
			element = $(this);

			// remove old items from queue and DOM
			// allow max 5 to be loaded
			if (queue.length > 5) {
				$('._' + queue.shift()).remove();
			}

			// Assume user can't click more than 1000 times / second
			//terrible overflow protection.
			if (i > 1000) {
				i = 0;
			}

			// add next item to queue
			i++;
			queue.push(i);

			// Build element
			element.append('<span class="ripple _' + i + '"></span>');
			ripple = element.find('._' + i);

			// Make it big enough to cover whole parent
			if(!ripple.height() && !ripple.width()) {
				d = Math.max(element.outerWidth(), element.outerHeight());
				ripple.css({height: d, width: d});
			}

			// Get origin
			x = e.pageX - element.offset().left - ripple.width() / 2;
			y = e.pageY - element.offset().top - ripple.height() / 2 ;

			// Set location and animate
			ripple.css({top: y+'px', left: x+'px'}).addClass('animate');
		});

		/*  [ Sticky menu trigger ]
		- - - - - - - - - - - - - - - - - - - - */
		if ( true ) {
			if ( mainParams.sticky_menu == 'sticky_top' ) {
				var nav = $(".k2t-header-top");
				var waypoint_offset = 20;
			} else if ( mainParams.sticky_menu == 'sticky_mid' ) {
				var nav = $(".k2t-header-mid");
				var waypoint_offset = 50;
			} else if ( mainParams.sticky_menu == 'sticky_bot' ) {
				var nav = $(".k2t-header-bot");
				var waypoint_offset = 30;
			}
			
			var container = $( '.k2t-header' );
			var top_spacing = 0;
			$(window).on('scroll', function(){

				scrollFunc();
				if ( mainParams.smart_sticky == 1 )	{// smart sticky menu 
					if ( mainParams.sticky_menu == 'sticky_top' || mainParams.sticky_menu == 'sticky_mid' || mainParams.sticky_menu == 'sticky_bot' ) {
						if ( __k2t_check_updown > 0 && !$('body').hasClass('header-sticky') ) {
							container.css({
								'height': nav.outerHeight()
							});
							nav.stop().addClass('sticky').css('top', - nav.outerHeight() ).animate({
								'top': top_spacing
							});
							$('body').addClass('header-sticky');
						} else if ( __k2t_check_updown < 0 || __k2t_check_updown == 0 ) {
							container.css({
								'height': 'auto'
							});
							nav.stop().removeClass('sticky').css('top', nav.outerHeight() + waypoint_offset).animate({
								'top': ''
							});
							$('body').removeClass('header-sticky');
						}
					}
				}
				else // normal sticky menu 
				{

					if ( window.pageYOffset < 0 ) return;

					if ( mainParams.sticky_menu == 'sticky_top' || mainParams.sticky_menu == 'sticky_mid' || mainParams.sticky_menu == 'sticky_bot' ) {
						if ( __k2t_check_updown < 0 && !$('body').hasClass('header-sticky') && window.pageYOffset >= 100 ) {
							container.css({
								'height': nav.outerHeight()
							});
							nav.stop().addClass('sticky').css('top', - nav.outerHeight() ).animate({
								'top': top_spacing
							});
							$('body').addClass('header-sticky');

						} else if ( __k2t_check_updown = 0 || window.pageYOffset <= 0 ) {
							container.css({
								'height': 'auto'
							});
							nav.stop().removeClass('sticky').css('top', nav.outerHeight() + waypoint_offset).animate({
								'top': ''
							});
							$('body').removeClass('header-sticky');
						}
					};
				}

			});

		}

		/*  [ Vertical header ]
		- - - - - - - - - - - - - - - - - - - - */
		$('#showPushMenu').on('click', function() {
			if ( mainParams.vertical_menu == '1' ){
				$('body').toggleClass('vertical-close');
			}
			return false;
		});

		/*  [ Custom RTL Menu ]
		- - - - - - - - - - - - - - - - - - - - */
		if ( ! isMobile.any() ) {
			$( '.sub-menu li' ).on( 'hover', function () {
				var sub_menu = $( this ).find( ' > .sub-menu' );
				if ( sub_menu.length ) {
					if ( sub_menu.outerWidth() > ( $( window ).outerWidth() - sub_menu.offset().left ) ) {
						$( this ).addClass( 'menu-rtl' );
					}
				}
			});
		}

		/*  [ Back to top ]
		- - - - - - - - - - - - - - - - - - - - */
		$( '.k2t-btt' ).on("click", function () {
			$("html, body").animate({
				scrollTop: 0
			}, 500);
			return false;
		});

		/*  [ Scroll to row start ]
		- - - - - - - - - - - - - - - - - - - - */
		$( '.chevron-down' ).on("click", function () {
			$('html, body').animate({
			    scrollTop: ($('#row-start').offset().top)
			},1000);
		});

		/*  [ Offcanvas Sidebar ]
		- - - - - - - - - - - - - - - - - - - - */
		$( '.open-sidebar' ).on( 'click', function() {
			//if ( mainParams.offcanvas_turnon == '1' ){
				$( 'body' ).toggleClass( 'offcanvas-open' );
				$( '.offcanvas-sidebar' ).toggleClass( 'is-open' );
				$(this).toggleClass( 'close-sidebar' );
			//}
			//return false;
		});

		$( '.k2t-container' ).on( 'click', function(e) {
			if ($(e.target).hasClass( 'open-sidebar' ) || $(e.target).closest( '.open-sidebar' ).length > 0 ) {
				return;
			}
			$( 'body' ).removeClass( 'offcanvas-open' );
			$( '.offcanvas-sidebar' ).removeClass( 'is-open' );
			$( '.open-sidebar' ).removeClass( 'close-sidebar' );
		});

		$('.offcanvas-sidebar .k2t-sidebar ul li').on("click", function(){
			if ($(this).find('ul') && $(this).find('ul').hasClass('k2t-active')){
				$(this).find('ul').removeClass('k2t-active');
				$(this).removeClass('k2t-active');
			}else {
				$(this).find('ul').addClass('k2t-active');
				$(this).addClass('k2t-active');
			}
		});

		/*  [ Search Box ]
		- - - - - - - - - - - - - - - - - - - - */
		$('.search-box i').on( 'click', function(){
			$('body').addClass('mode-search');
			$('.k2t-searchbox-close').addClass('is-active');
			setTimeout(function() { $('.k2t-searchbox #s').focus() }, 300);
		});
		$('.k2t-searchbox-close').on( 'click', function(){
			$('body').removeClass('mode-search');
		});

		$('.k2t-searchbox .mark').on( 'click', function(){
			$('body').removeClass('mode-search');
		});

		$('.hamburger').on('click',function(){
			$(this).toggleClass('is-active');
		});

		/*  [ VC Alert close ]
		- - - - - - - - - - - - - - - - - - - - */
		$( '.wpb_alert .close' ).on("click", function (){
			var parent = $(this).parent();
			parent.css({"opacity":"0", "height":"0", "padding":"0", "margin":"0"});
		});

		/*  [ Mobile menu ] 
		- - - - - - - - - - - - - - - - - - - - */
		$('.hamburger').on('click',function(){
			$(this).toggleClass('is-active');
		});

		$('.mobile-menu-toggle').on("click", function(e) {
			e.stopPropagation();
			$(this).toggleClass('active');
			$('.mobile-menu-wrap').toggleClass('active');
			$(this).find('.main-mm-trigger').each(function(){
				if( $(this).hasClass('is-active') ) {
						setTimeout(function(){
							$('.main-mm-trigger').css('opacity','0');
							$(this).css('position','fixed');
						}, 300)
					}
				else {
					$(this).css('position','relative');
					$('.main-mm-trigger').css('opacity','1');
				}
			});
			$('.mobile-menu-wrap .hamburger ').addClass('is-active');
	    });
	    $('body').on('click',function(){
	    	$('.mobile-menu-wrap').removeClass('active');
	    	$('.mobile-menu-toggle').removeClass('active');
	    	$('.mobile-menu-toggle .hamburger').removeClass('is-active');
	    	$('.main-mm-trigger').each(function(){
				$(this).css('position','relative');
				$('.main-mm-trigger').css('opacity','1');
			});
	    });

	    // open sub menu

		$('.menu-item-has-children > .wrap-link-item .open-sub-menu').on('click', function(e){
			e.stopPropagation();
			var $parent = $(this).parent().parent();
			$(this).toggleClass('active');
			$parent.children('.sub-menu').slideToggle();
		})

		$(".mobile-menu .menu-item-has-children ").find('a').on('click',function(e){
			if ( $(this).attr('href') == '#' || typeof( $(this).attr('href') ) == '') {
				e.stopPropagation();
				var $parent = $(this).parent().parent();
				$(this).toggleClass('active');
				$parent.children('.sub-menu').slideToggle();
			};
		});

		// prevent parent element scroll

		$(".mobile-menu-wrap").bind('mousewheel', function(e, d)  {
		    var t = $(this);
		    if (d > 0 && t.scrollTop() === 0) {
		        e.preventDefault();
		    }
		    else {
		        if (d < 0 && (t.scrollTop() == t.get(0).scrollHeight - t.innerHeight())) {
		            e.preventDefault();
		        }
		    }
		})

		/* ============= End Menu Mobile ====================*/

		// Isotope
		if ( $().masonry && $().isotope && $().imagesLoaded ) {
			
			$( '.k2t-isotope-wrapper' ).each( function() {

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
					
				}); // imagesLoaded
				
			}); // each .k2t-isotope-wrapper
		} // if isotope

		/*  [ Performs a smooth page scroll to an anchor ]
		- - - - - - - - - - - - - - - - - - - - */
		$('.scroll').on("click", function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash),
				headerH = $('.k2t-header').outerHeight();

				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top - 170 + "px"
					}, 1200);
					return false;
			   }
		   }
		});

		var $logoImg = $('.k2t-logo img');
		if ( $logoImg.css( 'min-height' ) == '1px' ) {
			$logoImg.attr( 'src', $logoImg.attr( 'src' ).replace( 'logo.png', 'logo@2x.png' ) );
		}

		if(jQuery('#commentform > p').length){
			$('#commentform > p > input').each( function() {
				if ( $(this).attr('value').length > 0 ) $(this).parent().addClass('focus');
			});

			jQuery('#commentform > p').each(function(){
				$('#commentform > p input').focus(function(){
					$(this).closest('p').addClass('focus');
				});
				$('#commentform > p textarea').focus(function(){
					$(this).closest('p').addClass('focus');
				});
				$('#commentform > p input').blur(function(){
					if($(this).val() == ''){
						$(this).closest('p').removeClass('focus');
					}
				});
				$('#commentform > p textarea').blur(function(){
					if($(this).val() == ''){
						$(this).closest('p').removeClass('focus');
					}
				});
			});
		}

		/*  [ Call owl carousel ]
		- - - - - - - - - - - - - - - - - - - - */
		if ( $().owlCarousel ) {
			jQuery('.related-post-wrap').owlCarousel({
				items: 3,
				autoPlay: true,
				margin: 30,
				loop: true,
				nav: false,
				navText: [
					"<i class='zmdi zmdi-arrow-left'></i>",
					"<i class='zmdi zmdi-arrow-right'></i>"
				],
				dots: false,
				responsive: {
					320: {
						items: 1
					},
					480: {
						items: 1
					},
					768: {
						items: 2
					},
					992: {
						items: 3
					},
					1200: {
						items: 3
					}
				},
			});
			var owl = jQuery(".owl-carousel");
			owl.each(function(){
				var items 			= $(this).attr('data-items'),
					autoPlay 		= $(this).attr('data-autoPlay'),
					margin 			= $(this).attr('data-margin'),
					loop 			= $(this).attr('data-loop'),
					nav 			= $(this).attr('data-nav'),
					dots 			= $(this).attr('data-dots'),
					mobile 			= $(this).attr('data-mobile'),
					tablet 			= $(this).attr('data-tablet'),
					desktop 		= $(this).attr('data-desktop'),
					URLhashListener = $(this).attr('data-URLhashListener');

				$(this).owlCarousel({
					items: items,
					autoPlay: autoPlay == "true" ? true : false,
					margin: parseInt( margin ),
					loop: true,
					nav: nav == "true" ? true : false,
					navText: [
						"<i class='zmdi zmdi-arrow-left btn-ripple'></i>",
						"<i class='zmdi zmdi-arrow-right btn-ripple'></i>"
					],
					dots: dots == "true" ? true : false,
					responsive: {
						320: {
							items: mobile
						},
						480: {
							items: mobile
						},
						768: {
							items: tablet
						},
						992: {
							items: desktop
						},
						1200: {
							items: items
						}
					},
					URLhashListener: URLhashListener == "true" ? true : false,
				});
			});
		}

	});

	$(window).load(function() {

		/*  [ Check scroll ]
		- - - - - - - - - - - - - - - - - - - - */
		i();
		$(document).mousewheel(function(event, delta) {
            if ($(this).scrollTop() > 50) {
				$('.k2t-btt').fadeIn('slow');
				$('body').addClass('scroll-dow');
			} else {
				$('.k2t-btt').fadeOut('slow');
				$('body').removeClass('scroll-dow');
			}
			var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
			if (scrollBottom < 50) {
				$('body').addClass('scroll-bottom');
			} else {
				$('body').removeClass('scroll-bottom');
			}
			i();
			set_current_menu_for_scroll();
        });

		/*  [ Page loader effect ]
		- - - - - - - - - - - - - - - - - - - - */
		$( '#loader' ).delay(600).fadeOut();
		$( '#loader-wrapper' ).delay(600).fadeOut( 'slow' );
		setTimeout(function(){
			$( '#loader-wrapper' ).remove();
		}, 800);

		
		/*  [ Menu One Page ]
		- - - - - - - - - - - - - - - - - - - - */
		var headerH = $(".k2t-header-mid").height();
		var adminbar = $("#wpadminbar").height();
		if (!adminbar) adminbar = 0;
		function i() {
			var e = "";
			var t = "";
			$(".k2t-header .k2t-menu > li").each(function(e) {
				var n = $(this).find("a").attr("href");
				var r = $(this).find("a").attr("data-target");
				if ($(r).length > 0 && $(r).position().top - headerH <= $(document).scrollTop()) {
					t = r
				}
			});
		}
		function set_current_menu_for_scroll(){
			var menu_arr = [];
			var i =  0;
			$(".k2t-header .k2t-menu > li").each(function(e) {
				var n = $(this).find("a").attr("href");
				if ( typeof(n) != 'undefined' && n.charAt(0) == "#" && n.length > 2) {
					menu_arr[i] = n.substr(1, n.length - 1);
					i++;
				}
			});
			if (menu_arr.length > 0){
				jQuery.each( menu_arr, function(){
					var offset = $("#" + this).offset();
					var posY = offset.top - $(window).scrollTop();
					var posX = offset.left - $(window).scrollLeft(); 
					if(posY > 0){
						var new_active = "#" + this;
						if( jQuery(".k2t-header .k2t-menu > li.active > a").attr("href") == new_active  )
						{}else{
							jQuery(".k2t-header .k2t-menu > li.active").removeClass("active");
							jQuery("[href=#" + this + "]").parent("li").addClass("active");
						}
						return false;
					}
				});
			}
		}
		var n = 1e3;
		var r = "#" + $(".k2t-content").attr("id");
		$("body").on("click", ".k2t-header .k2t-menu > li > a", function() {
			var e = $(this).attr("href");
			var i = $(this).attr("data-target");

			$(".k2t-header .k2t-menu > li").each(function(){
				$(this).removeClass("active");
			});
			$(this).parent("li").addClass("active");
			if (e.charAt(0) == "#") {
				i = e
			}
			if ($(i).length > 0) {
				if (e == r) {
					$("html,body").animate({
						scrollTop: 0
					}, n, "easeInOutQuart")
				} else {
					$("html,body").animate({
						scrollTop: $(i).offset().top - headerH - adminbar
					}, n, "easeInOutQuart")
				}
				return false
			}
		});
	});

	var __k2t_check_updown = 0;
	function scrollFunc(e) {

		if ( typeof scrollFunc.x == 'undefined' ) {
			scrollFunc.x=window.pageXOffset;
			scrollFunc.y=window.pageYOffset;
		}
		var diffX=scrollFunc.x-window.pageXOffset;
		var diffY=scrollFunc.y-window.pageYOffset;

		if( diffX<0 ) {
			// Scroll right
		} else if( diffX>0 ) {
			// Scroll left
		} else if( diffY<0 ) {
			// Scroll down
			__k2t_check_updown = -1;
		} else if ( window.pageYOffset == 0 ) {
			__k2t_check_updown = 0;
		}else if( diffY>0 ) {
			// Scroll up
			__k2t_check_updown = 1;
		} else {
			__k2t_check_updown = 0;
			// First scroll event
		}
		scrollFunc.x=window.pageXOffset;
		scrollFunc.y=window.pageYOffset;

	}


	//Set cookie for change product layout
	jQuery('.pageviewitem').not('.active').on("click", function () {
		if (jQuery.cookie('product-view') != '') {
			jQuery.cookie('product-view', jQuery(this).attr('data-view'));
			document.location.reload();
		}
	});
	jQuery('.k2t-register input').on('focus', function(){
		jQuery( this ).parent().addClass('focus');
	} );
	$('.k2t-register input').blur(function(){
		if($(this).val() == ''){
			$(this).closest('div').removeClass('focus');
		}
	});
	$('.k2t-register input').each( function(){
		if($(this).val() != ''){
			$(this).closest('div').addClass('focus');
		}
	})
	jQuery('.txtbox-ajax input').on('focus', function(){
		jQuery( this ).closest('.txtbox-ajax').addClass('focus');
	} );
	$('.txtbox-ajax input').blur( function(){
		console.log( $(this).val() );
		if ( $(this).val() == '' )
		jQuery( this ).closest('.txtbox-ajax').removeClass('focus');
	} );
	jQuery('.wrap-focus input[type="text"]').each(function(){
		if($(this).val() != ''){
			$(this).closest('.wrap-focus').addClass('focus');
		}
	})
	jQuery('.wrap-focus input[type="text"]').on('focus', function(){
		jQuery( this ).closest('.wrap-focus').addClass('focus');
	} );
	jQuery('.wrap-focus input[type="text"]').blur( function(){
		if ( $(this).val() == '' )
			jQuery( this ).closest('.wrap-focus').removeClass('focus');
	} );
})(jQuery);

