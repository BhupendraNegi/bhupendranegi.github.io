function initializeScripts(){
  // Remove Materialize overlays/targets that get stuck on Barba page transitions
  $('#sidenav-overlay').remove();
  $('.lean-overlay').remove();
  $('.drag-target').remove();
  $('body').css({ overflow: '', width: '' });

  // Re-trigger Google Translate on new page content after Barba transition
  var select = document.querySelector('.goog-te-combo');
  if (select && select.value && select.value !== 'en') {
    select.dispatchEvent(new Event('change'));
  }

  // $( document ).tooltip();

  $('.materialboxed').materialbox();
  // $('.carousel-arrows').click(function(e){
  //   var arrow = e.target;
  //   debugger
  // })

  $('.my-borders').css({
    height: '0px',
    width: '0px'
  })
  // $('.carousel.carousel-slider').carousel({fullWidth: true});
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered

  $('#contact-message').trigger('autoresize');

  $('.project_list').on('click', '.next', function(e){
    e.preventDefault();
    var thisId = $(this).attr('id');
    var nextId = (parseInt(thisId) + 1).toString();

    $('#' + thisId).modal('close');

    // need to rework this to use promise rather then setTimeout
    setTimeout(function(){
      var nextId = (parseInt(thisId) + 1).toString();
      $('#' + nextId).modal('open')
    }, 200)
  })

  $('#email_modal').modal({
    opacity: 1, // Opacity of modal background
    inDuration: 500, // Transition in duration
    outDuration: 500, // Transition out duration
    startingTop: '30%', // Starting top style attribute
    endingTop: '35%',
  })

  $('.project_list .modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .8, // Opacity of modal background
      inDuration: 200, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '0%', // Starting top style attribute
      endingTop: '0%', // Ending top style attribute
      ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        // alert("Ready");
        modal_open = true
        $('.carousel.carousel-slider').carousel({fullWidth: true});
      },
      complete: function(e) {
        // debugger
      } // Callback for Modal close
    });

  var urlString = window.location.href;
  
  $(document).scrollTop();

  var pagename = window.location.pathname.replace('/', '')
  
  if(window.ga) {
    window.ga('set', 'page', window.location.pathname);
    window.ga('send', 'pageview');
  }
  
  if(pagename){
    $('nav a[href="/' + pagename + '"]').parent().find('div').addClass('nav-underlined');
  }

  $("nav ul li a").hover(function(e){
    $(e.target).parent().find('div').addClass('nav-hover-underlined');
  }, function(e){
    $(e.target).parent().find('div').removeClass('nav-hover-underlined');
  });

  // debugger
  $(window).scroll(() => {
    var scrollPos = $(document).scrollTop();
        documentHeight = $(document).height();
    if(scrollPos/documentHeight > 0.1){
      $('#scroll-top').css('display', 'block');
    }else {
      $('#scroll-top').css('display', 'none');
    }
  })

  $('#scroll-top').click((e)=>{
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 250);
    return false;
  })
}
