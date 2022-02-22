/**
 * Script trigger shortcodes.
 *
 * @since  1.0
 * @author LunarTheme
 * @link   http://www.lunartheme.com
 */

(function($) {
	"use strict";

	var K2T = K2T || {};

	/*  [ Mobile Check ]
	- - - - - - - - - - - - - - - - - - - */
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
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	/*  [ Animation ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.k2t_animation = function() {
		console.log( $('.animated') );
		$('.animated').each(function() {

			var $this = $(this);
			var delay = $this.data('animation-delay');
			var animation = $this.data('animation');
			$this.one('inview', function(event, isInView, visiblePartX, visiblePartY) {
				setTimeout(function(){                       
					$this.addClass(animation + ' run_animation');
				}, delay);
			}); // inview

		});
	}

	/*  [ Parallax ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.parallax = function() {
		$('.k2t-parallax').each(function() {
			var $this = $(this);
			$this.find('.bg-element').parallax();
		});
	}

	/*  [ Tipsy ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.tipsy = function() {
		if ($().tipsy) {
			$('.hastip.tooltip-top').tipsy({
				gravity: 's',
				opacity: 1,
				fade: true,
			});
			$('.hastip.tooltip-bottom').tipsy({
				gravity: 'n',
				opacity: 1,
				fade: true,
			});
			$('.hastip.tooltip-left').tipsy({
				gravity: 'e',
				opacity: 1,
				fade: true,
			});
			$('.hastip.tooltip-right').tipsy({
				gravity: 'w',
				opacity: 1,
				fade: true,
			});
		};
		if ($().tooltipster) {

			$('.k2t-tooltipster').each(function() {
				var $this = $(this);
				var args = {
					content: $this.find('.tooltipster-markup'),
					animation: $this.data('effect'),
					delay: 0,
					maxWidth: $this.data('max-width') ? $this.data('max-width') : 300,
					theme: $this.data('theme'),
					trigger: $this.data('trigger'),
					position: $this.data('position'),
				}
				$this.tooltipster(args);
			});

		}
	}

	/*  [ Pie Chart ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.piechart = function() {
		if ($().easyPieChart) {
			$('.k2t-piechart').each(function() {
				var $this = $(this);
				$this.one('inview', function(event, isInView, visiblePartX, visiblePartY) {
					var chart_args = {
						barColor: $this.data('color'),
						trackColor: $this.data('trackcolor'),
						scaleColor: false,
						lineCap: $this.data('linecap'),
						lineWidth: $this.data('thickness'),
						size: $this.data('size'),
						animate: $this.data('speed') ? $this.data('speed') : 600,
						onStep: function(value) {
							this.$el.find('span.number').text(~~value);
						},
						onStop: function() {
							var percent = this.$el.data('percent');
							this.$el.find('span.number').text(percent);
						}
					};
					var delay = parseInt($this.data('delay'));
					setTimeout(function() {
						$this.find('.chart').find('.percent').css({
							visibility: 'visible'
						}).end().easyPieChart(chart_args);
					}, delay);
				}); // bind inview										
			}); // each	
		} // if easyPieChart
	} // piechart

	/*  [ Progress ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.progress = function() {
		$('.k2t-progress').each(function() {
			var $this = $(this);
			$this.one('inview', function(event, isInView, visiblePartX, visiblePartY) {
				$this.find('.bar,.percent').animate({
					left: 0,
					opacity: '1',
				}, $this.data('speed') ? $this.data('speed') : 1500, $this.data('easing') ? $this.data('easing') : 'easeOutExpo'); // animate
			}); // bind inview		
		}); // each	
	} // progress

	/*  [ Toggle ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.toggle = function() {
			if ($().collapse) {

				/* TOGGLE */
				$('.k2t-toggle').each(function() {
					var $this = $(this);
					var collapse_args = {
						query: '.toggle-title',
						open: function() {
							this.slideDown($this.data('speed') ? $this.data('speed') : 250, 'easeOutExpo');
						},
						close: function() {
							this.slideUp($this.data('speed') ? $this.data('speed') : 250, 'easeOutExpo');
						},
					};
					$this.collapse(collapse_args);
				}); // each	

				/* ACCORDION */
				$('.k2t-accordion').each(function() {
					var $this = $(this);
					var collapse_args = {
						accordion: true,
						open: function() {
							this.slideDown($this.data('speed') ? $this.data('speed') : 250, 'easeOutExpo');
						},
						close: function() {
							this.slideUp($this.data('speed') ? $this.data('speed') : 250, 'easeOutExpo');
						},
					};
					$this.collapse(collapse_args);
				}); // each

			} // if collapse
		} // toggle

	/*  [ Tabs ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.tab = function() {
		if ($().tabslet) {

			$('.k2t-tab').each(function() {
				var $this = $(this);
				var tab_args = {
					active: $this.data('active'),
					attribute: 'data-href',
					mouseevent: $this.data('mouse'),
					animation: $this.data('animation'),
				};
				$this.tabslet(tab_args);
			}); // each

		} // if tabslet
	} // tab

	/*  [ Counter ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.counter = function() {
		if ( $().countTo ) {
			$('.k2t-counter').each(function() {
				var $this = $(this);
				var delay = parseInt($this.data('delay'));
				var counter_args = {};
				$this.one('inview', function(event, isInView, visiblePartX, visiblePartY) {
					setTimeout(function() {
						$this.find('.number').css({
							opacity: 1
						}).countTo(counter_args);
					}, delay);
				}); // inview									   
			}); // counter
		} // if countTo
	} // counter

	/*  [ Lightbox ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.lightbox = function() {
		if ($().magnificPopup) {
			/* general */
			$('.k2t-popup-link').magnificPopup({
				type: 'image'
			});

			/* gallery */
			$('.k2t-popup-gallery').magnificPopup({
				delegate: 'a', // the selector for gallery item
				type: 'image',
				gallery: {
					enabled: true
				}
			});

		}; // if magnificPopup exists
	}; // lightbox

	/*  [ iView ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.iview = function() {
		if ($().iView) {
			$('.iview').each(function(){
				$(this).iView({
					pauseTime                : 7000,
					pauseOnHover             : true,
					directionNav             : true,
					directionNavHide         : false,
					directionNavHoverOpacity : 0,
					controlNav               : false,
					nextLabel                : "Nächste",
					previousLabel            : "Vorherige",
					playLabel                : "Spielen",
					pauseLabel               : "Pause",
					timer                    : "360Bar",
					timerPadding             : 3,
					timerColor               : "#0F0"
				});
			});
		}; // if ivew exists
	}; // iview

	/*  [ eislideshow ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.eislideshow = function() {
		if ($().eislideshow) {
			$('.ei-slider').each(function(){
				$(this).eislideshow({
					animation           : 'center',
					autoplay            : true,
					slideshow_interval  : 3000,
					titlesFactor        : 0
				});
			});
		}; // if eislideshow exists
	}; // eislideshow

	/*  [ flexslider ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.flexslider = function() {
		if ($().flexslider) {
			$('.flexslider').each(function(){
				$(this).flexslider({
					animation: "slide",
					start: function(slider){
					  jQuery('body').removeClass('loading');
					}
				});
			});
		}; // if flexslider exists
	}; // flexslider

	/*  [ Sticky ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.sticky = function(){
		$('.k2t-tab-sticky').each(function(){
			var $this = $(this);
			var ID = $this.data('id');
			$this.find('.tabsticky-nav').stickyMojo({
				footerID: '#k2t-tabsticky-footer-'+ID, 
				contentID: '#k2t-tabsticky-content-'+ID,
			}); // stickyMojo
		}); // k2t-tab-sticky
	};

	/*  [ Countdown ]
	- - - - - - - - - - - - - - - - - - - */
	K2T.countdown = function(){
		
	}

	/*  [ Init Function ]
	- - - - - - - - - - - - - - - - - - - */
	$(document).ready(function() {
		K2T.k2t_animation();
		K2T.parallax();
		K2T.tipsy();
		K2T.piechart();
		K2T.progress();
		K2T.toggle();
		K2T.tab();
		K2T.countdown();
		K2T.counter();
		K2T.lightbox();
		K2T.iview();
		K2T.eislideshow();
		K2T.flexslider();
	}); // ready
	$(window).load(function(){
		K2T.sticky();
	});
})(jQuery);