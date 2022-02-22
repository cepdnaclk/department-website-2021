jQuery(window).load(function() {
	var container = document.querySelector('.b-masonry .masonry-layout');
	var msnry = new Masonry( container, {
		itemSelector: '.hentry',
		columnWidth: container.querySelector('.grid-sizer'),
		gutter: 0
	});
});
