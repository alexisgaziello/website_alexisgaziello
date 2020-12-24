/*********************************************************************/
/* Autogrow function for textareas */
/*********************************************************************/

(function($)
{
    /**
     * Auto-growing textareas; technique ripped from Facebook
     * 
     * 
     * http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
     */
    $.fn.autogrow = function(options)
    {
        return this.filter('textarea').each(function()
        {
            var self         = this;
            var $self        = $(self);
            var minHeight    = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;
            var settings = $.extend({
                preGrowCallback: null,
                postGrowCallback: null
              }, options );

            var shadow = $('<div></div>').css({
                position:    'absolute',
                top:         -10000,
                left:        -10000,
                width:       $self.width(),
                fontSize:    $self.css('fontSize'),
                fontFamily:  $self.css('fontFamily'),
                fontWeight:  $self.css('fontWeight'),
                lineHeight:  $self.css('lineHeight'),
                resize:      'none',
    			'word-wrap': 'break-word'
            }).appendTo(document.body);

            var update = function(event)
            {
                var times = function(string, number)
                {
                    for (var i=0, r=''; i<number; i++) r += string;
                    return r;
                };

                var val = self.value.replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/\n$/, '<br/>&#xa0;')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/ {2,}/g, function(space){ return times('&#xa0;', space.length - 1) + ' ' });

				// Did enter get pressed?  Resize in this keydown event so that the flicker doesn't occur.
				if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
					val += '<br />';
				}

                shadow.css('width', $self.width());
                shadow.html(val + (noFlickerPad === 0 ? '...' : '')); // Append '...' to resize pre-emptively.
                
                var newHeight=Math.max(shadow.height() + noFlickerPad, minHeight);
                if(settings.preGrowCallback!=null){
                  newHeight=settings.preGrowCallback($self,shadow,newHeight,minHeight);
                }
                
                $self.height(newHeight);
                
                if(settings.postGrowCallback!=null){
                  settings.postGrowCallback($self);
                }
            }

            $self.change(update).keyup(update).keydown({event:'keydown'},update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);

window.onload = function() {
    $("#message").autogrow();
}

/*********************************************************************/
/* Form API send and update site */
/*********************************************************************/

function formDisappear(){
    var form = document.getElementById("contact-form-all");
    form.style.display = "none";
  
    var loading_spinner = document.getElementById("contact-loading-spinner");
    loading_spinner.style.display = "block"
}
  
function updateForm(success) {
    var loading_spinner = document.getElementById("contact-loading-spinner");
    loading_spinner.style.display = "none"
  
    var reservation_form_success = document.getElementById("contact-success");
    var reservation_form_failure= document.getElementById("contact-failure");
  
    if (success){
      reservation_form_success.style.display = "block";
      reservation_form_failure.style.display = "none";
    } else {
      reservation_form_success.style.display = "none";
      reservation_form_failure.style.display = "block";
    }
}

function sendEmail() {
    var obj = document.getElementsByClassName("input-field")

    var name = obj.item(0).value
    var email = obj.item(1).value
    var message = obj.item(2).value

    var subject = "Contact form from alexis.gaziello.me!".replace(' ',"%20") + name;
  
    var body = "";

    body += "Hello my name is ".replace(' ',"%20") + name;
    body += " and I would like to contact you.".replace(' ',"%20") + "%0D%0A";

    body += "Email: ".replace(' ',"%20") + email + "%0D%0A" + "%0D%0A";

    body += "Message:" + "%0D%0A" + message.replace(' ',"%20") + "%0D%0A";
  
    body += "%0D%0A" + "Note: there was an error with the website.".replace(' ',"%20") + "%0D%0A";
  
    var text = "mailto:alexis.gaziello@gmail.com?subject=" + subject + "&body=" + body;
    window.open(text);
}


function sendRequest() {

    console.log("Hola")

    var obj = document.getElementsByClassName("input-field")
  
    results = {}
  
    results['name'] = obj.item(0).value
    results['email'] = obj.item(1).value
    results['message'] = obj.item(2).value

    console.log(results)
  
    const xhr = new XMLHttpRequest();
    const url = "https://b5w6twi00d.execute-api.us-east-1.amazonaws.com/default/server-alexisgaziello-contact";
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = (e) => {
      updateForm(parseInt(xhr.response))
    }
  
    xhr.send(JSON.stringify(results));
    formDisappear()
  
}