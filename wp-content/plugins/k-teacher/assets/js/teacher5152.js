(function($) {
    function isotopeTeacher(target){
        if(jQuery('.teacher-listing').length){
            var $container = $('.teacher-listing');
            var $this = $(this);
             $this.imagesLoaded( function() {
                if ( ! $container.hasClass('k2t-carousel') ) {
                   $container.isotope({
                        itemSelector: '.teacher-classic-item',
                        layoutMode: 'fitRows',
                        filter: target ,
                    }); 
                }
            });
        }
    }

    $(document).ready(function () {
        isotopeTeacher('*');

        $('.k2t-teacher-filter li').click(function () {

            $('.k2t-teacher-filter li').removeClass('active');

            $(this).addClass('active');

            var target = '*';

            if($(this).attr('data-id') != 'all'){

                target = '.filter-char-' + $(this).attr('data-id');
            }

            isotopeTeacher(target);

        });

        $('.k-teacher-filter-bar span').on('click',function(){
            var $isotope = $(this).parent().next();
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
            $isotope.isotope({
                itemSelector: '.teacher-classic-item',
                layoutMode: 'fitRows',
                filter: $(this).attr('data-filter'),
            });
        });
         
    });
    
    $(window).load(function(){
        isotopeTeacher('*');
    });

})(jQuery);

