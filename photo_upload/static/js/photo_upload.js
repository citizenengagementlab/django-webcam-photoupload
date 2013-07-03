//spin.js options
var opts = {
  lines: 13, // The number of lines to draw
  length: 7, // The length of each line
  width: 2, // The line thickness
  radius: 4, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

var target = document.getElementById('caption_form');
var spinner = new Spinner(opts).spin(target);

//lazy load
$("img.lazy").lazyload({
    effect       : "fadeIn"
});

$("ul#photo_grid > li").not(".first").hover(function() {

})

//flash
function flash(){
    $('.flashDiv')
    .show()  //show the hidden div
    .animate({opacity: 0.5}, 300) 
    .fadeOut(300)
    .css({'opacity': 1});
}

//Shadowbox, on click it goes away
$("#start_upload button").click(function(event) {
    event.preventDefault();
    $("#black_overlay").fadeIn('slow', function() {
            $(this).click(function() {
                $('#upload').hide();
                $('#black_overlay').fadeOut();
                $('#step-2').hide();
                $('#step-1').show();
            });
        $("#upload").show();
    });
});

//Webcam options
webcam.set_swf_url('../../static/swf/webcam.swf');
webcam.set_shutter_sound(true, "../../static/mp3/shutter.mp3");
webcam.set_quality(90);
webcam.set_stealth(false);
webcam.set_hook('onComplete', 'callbackCamera');
    
//Render webcam
$("#camera").html(webcam.get_html(640, 480));

//Switches uploads steps
function switchStep() {
    $("#step-1").hide();
    $("#step-2").show();
}

function stepBack() {
    redraw(); //remove current photo
    $("#step-2").hide();
    $("#step-1").show();
}

//Character limit on TextArea
var text = $("#id_message") 
var max_length = text.attr("max-length");
if (text.val().length >= max_length) {
    text.on("keydown", function(event) {
        event.preventDefault();
    });
}

    
$(document).ready(function() {
$('.spinner').hide();

var text = $("#id_message"),
    max_length = text.attr("maxlength"),
    label = $('label[for=id_message] span');

//initial
label.html(max_length - text.val().length)

//change
$('#id_message').keyup(function(){
   label.html(max_length - this.value.length)
   //change color
   var charCount = text.val().length
   switch(true)
   {
   case (charCount >=130):
        label.css("color", "red");
        break;
   default:
        label.css("color", "white");
   }
});
});


//Convert ZIP code to state, draw to canvas
function zipLookup(zip) {
    $.ajax({
        type: 'get',
        url: '/photo/ziplookup/zip_lookup',
        data: {
            zip: zip
        },
        error: function(d) {
            alert("Error looking up zip code.")
            return false;
        },
        success: function(d) {
            //TODO:  tie this into form upload so correct ZIP is required
            if (d.city === undefined || d.state === undefined) {
                $('input#id_zip_code').addClass('error');
            } else {
                window.citystate = d.city + ", " + d.state;
                $('input#id_zip_code').removeClass('error');
                redraw();
            }
        }
    })
}


//wrap text on spaces to max width
function wrapWords(context, text, maxWidth) {
    var words = text.split(' '),
        lines = [],
        line = "";
    if (context.measureText(text).width < maxWidth) {
        return [text];
    }
    while (words.length > 0) {
        if (context.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + " ";
        } else {
            lines.push(line);
            line = "";
        }
        if (words.length === 0) {
            lines.push(line);
        }
    }
    return lines;
}

//wrap text on linebreaks
function wrapLines(context,text,maxWidth) {
    var sections = text.split('\n'),
        lines = [],
        line = "";
    for (var i = 0; i < sections.length; i++) {
        var wrapped_lines = wrapWords(context,sections[i],maxWidth);
        for (var j = 0; j < wrapped_lines.length; j++) {
            lines.push(wrapped_lines[j]);
        }
    }
    return lines;
}

//redraw functions for text
function drawText(context, options) {
    var citystate = window.citystate;
    options = options || {name: $('#id_name').val(),
                          location: citystate,
                          message : $('#id_message').val(),
                          logo_url: logo_url};
    //note that logo_url must be in the same host as this script, otherwise we can't do canvas.toDataURL()
    //overlay a transparent rect to draw text on
    context.fillStyle = "rgba(0, 0, 0, 0.50)";
    context.fillRect(0,380,640,100);

    //name & location
    if (options === undefined) {
        var name_text = "";
    } else if (options.location === undefined) {
        var name_text = options.name;
    } else {
        var name_text = options.name+" - "+options.location;        
    }
   
    context.fillStyle = "rgba(255, 255, 255, 1)";
    context.font = "bold 20px museo-slab";
    context.textAlign = "end";
    context.fillText(name_text, 630, 470);
    //message
    if (options.message !== "undefined") {
        var msg_text = options.message;
        var fontSize = 19;
        var textWrapWidth = 560; //for text wrap
        var heightOffset = 390; //starting height
        context.textAlign = "start";
        context.font = fontSize+"px museo-slab";
        
        var lines = wrapLines(context, msg_text, textWrapWidth - parseInt(fontSize,0));
        lines.forEach(function(line, i) {
            context.fillText(line, 40, heightOffset + ((i + 1) * parseInt(fontSize,0)));
        });
    }


        if (options.logo_url !== "undefined") {
            var logo = new Image();
            logo.src = options.logo_url;
            logo.onload = function() {
                context.fillStyle = "#BF2E1A";
                context.fillRect(0,0,logo.width+40,logo.height+20);
                context.drawImage(logo,20,10,logo.width,logo.height);
            }
        }
    }

function drawPhoto(context,image_src, callback) {
    var img = new Image();
    img.src = image_src;
    img.onload = function() {
        context.drawImage(img, 0, 0, 640, 480);

        if (typeof callback !== "undefined") {
            callback(context);
        }
    };
}

function redraw(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    drawPhoto(context,$('#id_raw_photo_url').val(),drawText);
}

//Callback function for jpegcam - invokes switchStep, creates canvas, and adds jpeg image to canvas
function callbackCamera(response) {
    var data = JSON.parse(response);
    //going from step 1 to 2 in the upload form.
    switchStep();
    //save photo pk and url form
    $('#id_raw_photo_pk').val(data.raw_photo_pk);
    $('#id_raw_photo_url').val(data.file_url);

    //draw image to canvas
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    drawPhoto(context,data.file_url);
}

//update image on text fields change
$("#id_name").change(redraw);
$("#id_zip_code").change(function() {
    zip = $(this).val();
    zipLookup(zip);
});
$("#id_message").change(redraw);

//preview link
$("a#previewImage").click(function(event) {
    event.preventDefault();
    redraw();
});

//start over link
$("a#startOver").click(function(event) {
    event.preventDefault();
    stepBack();
});

//button click handlers

$("#snap-button").click(function() {
    flash();
    webcam.snap("upload_raw_photo", "callbackCamera");
});

$("#uploadDirect").click(function(e) {
        e.preventDefault();
        data = new FormData();
        data.append('photo', $("#id_photo")[0].files[0]);

        $.ajax({
            type: 'POST',
            url:"upload_raw_photo",
            processData:false,
            contentType: false,
            dataType: false,
            data: data,
        error: function(data) {
            alert('Please select a photo to upload before submitting.')
        },
        success: function(data) {
            var data = $.parseJSON(data);
            //clears canvas
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0,0,canvas.width,canvas.height);
            switchStep();
                $('#id_raw_photo_pk').val(data.raw_photo_pk);
                $('#id_raw_photo_url').val(data.file_url);

                //draw image to canvas
                var canvas = document.getElementById("canvas");
                var context = canvas.getContext("2d");

             drawPhoto(context,data.file_url);
        }
    });
});

$("#sendForm").click(function(e) {
    e.preventDefault();
    this.disabled=true;
    
    var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL();
    $('#id_photo_dataurl').val(dataURL);
    $("#sendForm").val("");
    $(".spinner").show();
    $('input').removeClass('error');
    $('label').removeClass('error');

    $.ajax({
        type: 'POST',
        url:"submit",
        contentType:'multipart/form-data',
        data: {
            captioned_photo: dataURL,
            name:$('#id_name').val(),
            zip_code: $('#id_zip_code').val(),
            email: $('#id_email').val(),
            message: $('#id_message').val(),
            raw_photo_pk: $('#id_raw_photo_pk').val(),
        },
       error: function(jqXHR, textStatus) {
            $(".spinner").hide();
            $("#sendForm").val("Submit");
            var errors = $.parseJSON(jqXHR.responseText);
            $('input#id_'+errors.field).addClass('error');
            $('label[for="id_'+errors.field+'"]').addClass('error');
            $("#sendForm").removeAttr("disabled")
        },
        success: function(jqXHR, textStatus, errorThrown) {
            $(".spinner").hide();
            $('#upload').hide();
            $('#black_overlay').fadeOut();
            $('#start_upload').html("<p>Thanks for sharing your voice!</p>")
            $("#sendForm").removeAttr("disabled")
            $("#sendForm").val("Submit");
        }
    });  
});



