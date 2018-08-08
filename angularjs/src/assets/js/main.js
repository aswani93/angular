$( document ).ready(function() {
        
   /*===========================/LEFT NAVIGATION/===========================*/
    
    /*$('#leftmenu a').click(function(){

        $(this).siblings().slideToggle();
        $(this).siblings().children().children('ul').slideUp();
        $(this).parent().siblings().children('ul').slideUp();
        $(this).parent().siblings().children('ul').children().children('ul').slideUp();
        
        $(this).toggleClass('open');        
        $(this).siblings().children().children('a').removeClass('open');
        $(this).parent().siblings().children('a').removeClass('open');
        $(this).parent().siblings().children('ul').children().children('a').removeClass('open');
        
        $(this).toggleClass('active');       
        $(this).siblings().children().children('a').removeClass('active');
        $(this).parent().siblings().children('a').removeClass('active');
        $(this).parent().siblings().children('ul').children().children('a').removeClass('active');

        // $(this).siblings().slideToggle();
        // $(this).siblings().children().children('ul').slideUp();
        // $(this).parent().siblings().children('ul').slideUp();
        // $(this).parent().siblings().children('ul').children().children('ul').slideUp();
        
        // $(this).toggleClass('open');        
        // $(this).siblings().children().children('a').removeClass('open');
        // $(this).parent().siblings().children('a').removeClass('open');
        // $(this).parent().siblings().children('ul').children().children('a').removeClass('open');
        
        // $(this).toggleClass('active');       
        // $(this).siblings().children().children('a').removeClass('active');
        // $(this).parent().siblings().children('a').removeClass('active');
        // $(this).parent().siblings().children('ul').children().children('a').removeClass('active');
        
        
    });*/
    
    
    
    $('#acoordian-wrapper .accordian-title').click(function(){
        $(this).siblings().slideToggle();
        $(this).children('.actions').children('div').children('a').children('i').toggleClass('arow-up');
        
        
    });
  
    /*===/END/===*/
    
     $(".mobclick").click(function(){
        $(".mobilemenu").toggleClass('nshow');
     });
   
    
    /*===========================/LOCATION NAVIGATION/===========================*/
    $('#locNav a').click(function(){
        $(this).siblings().slideToggle();
        $(this).siblings().children().children('ul').slideUp();
        $(this).parent().siblings().children('ul').slideUp();
        $(this).parent().siblings().children('ul').children().children('ul').slideUp();
        
        $(this).toggleClass('open');        
        $(this).siblings().children().children('a').removeClass('open');
        $(this).parent().siblings().children('a').removeClass('open');
        $(this).parent().siblings().children('ul').children().children('a').removeClass('open');
        
        /*$(this).toggleClass('active');       
        $(this).siblings().children().children('a').removeClass('active');
        $(this).parent().siblings().children('a').removeClass('active');
        $(this).parent().siblings().children('ul').children().children('a').removeClass('active');*/
        
        
    });
    /*===/END/===*/
    
    
});


/*===========================/TAB/===========================*/
function tabing(evt, tabName) {
    var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
}
/*===/TAB END/===*/

/*** DROPDOWN ***/
/*$(function () {
    $('.makeMeList').each(function (index, element) {
        $(this).parent()
            .after()
            .append("<div class='scrollableList'><div class='selectedOption'></div><ul></ul><i class='icon icon-arrow-point-to-down'></i></div>");

        $(element).each(function (idx, elm) {
            $('option', elm).each(function (id, el) {
                $('.scrollableList ul:last').append('<li>' + el.text + '</li>');
            });
            $('.scrollableList ul').hide();
            $('.makeMeUl').children('div.selectedOption').text("Duplicate from SSID");
        });
        $('.scrollableList:last').children('div.selectedOption').text("Duplicate from SSID");
    });

    $('.selectedOption').on('click', function () {
        $(this).next('ul').slideToggle(200);
        $('.selectedOption').not(this).next('ul').hide();
    });

    $('.scrollableList ul li').on('click', function () {
        var selectedLI = $(this).text();
        $(this).parent().prev('.selectedOption').text(selectedLI);
        $('#weightFilter').val(selectedLI);
        $(this).parent('ul').hide();
    });

    $('.scrollableList').show();
    $('.makeMeList').hide();
});*/