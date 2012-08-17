//TODO:  Creating a blank global variable to start this seems like a bad practice, but I'm not sure of a better
//solution.  Refactor this soon.


//Webcam options

webcam.set_swf_url('../static/swf/webcam.swf');
webcam.set_shutter_sound(true, "../static/mp3/shutter.mp3");
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


//Convert ZIP code to state, draw to canvas
function zipLookup(zip) {
    $.ajax({
        type: 'get',
        url: '../usps/zip_lookup',
        data: {
            zip: zip
        },
        error: function(d) {
            options = options || {name: $('#id_name').val(),
                      location: citystate,
                      message : $('#id_message').val(),
                      logo_url: "/static/tmp/zombo.png"};
            redraw();
            console.log("okay");
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
                          logo_url: "/static/tmp/zombo.png"};
    //note that logo_url must be in the same host as this script, otherwise we can't do canvas.toDataURL()
    //overlay a transparent rect to draw text on
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(0,380,640,100);

    //name & location
    if (options === undefined) {
        var name_text = "";
    } else if (options.location === undefined) {
        var name_text = options.name;
    } else {
        var name_text = options.name+" - "+options.location;        
    }
    console.log(name_text);
    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.font = "24px Helvetica";
    context.fillText(name_text, 10, 410);
    //message
    if (options.message !== "undefined") {
        var msg_text = options.message;
        var fontSize = 18;
        var textWrapWidth = 500; //for text wrap
        var heightOffset = 415; //starting height
        context.font = fontSize+"px Helvetica";
        
        var lines = wrapLines(context, msg_text, textWrapWidth - parseInt(fontSize,0));
        lines.forEach(function(line, i) {
            context.fillText(line, 10, heightOffset + ((i + 1) * parseInt(fontSize,0)));
        });
    }

    //logo
    if (options.logo_url !== "undefined") {
        var logo = new Image();
        logo.src = options.logo_url;
        logo.onload = function() {
            context.drawImage(logo,640-logo.width-10,480-logo.height-10,logo.width,logo.height);
        };
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

//button click handlers
$('#tab').click(function(e){
    $(this).parent().toggleClass('active');
});

$("#snap-button").click(function() {
    webcam.snap("upload_raw_photo", "callbackCamera");
});

//Show upload form field for photo
$("#show_photo").click(function() {
    document.location.hash = "#show_photo";
    if(document.location.hash === "#show_photo") {
        $("div.nophoto").removeClass("nophoto");
        $("div#captioned_photo").hide();
        $("#step-1").hide();
        $("#step-2").show();
    document.location.hash = "#upload_photo";
}
});

$("#uploadDirect").click(function(e) {
        //this is how you upload files via ajax, I guess?
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
            alert('fail')
        },
        success: function(data) {
            console.log(data);
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
    var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL();

    $('input').removeClass('error');
    $('label').removeClass('error');

    $.ajax({type: 'POST',
        url:"submit",
        contentType: "application/json",
        dataType: "json",
        data: {captioned_photo: dataURL,
         name:$('#id_name').val(),
         zip_code: $('#id_zip_code').val(),
         email: $('#id_email').val(),
         raw_photo_pk: $('#id_raw_photo_pk').val()
        },
        error: function(jqXHR, textStatus) {
            var errors = $.parseJSON(jqXHR.responseText);
            $('input#id_'+errors.field).addClass('error');
            $('label[for="id_'+errors.field+'"]').addClass('error');

        },
        success: function(jqXHR, textStatus, errorThrown) {
            $('#tab').click();
            $('#tab').css('background','green');
            $('#tab h2').html('Thanks!');
            $('#tab').unbind();
            //add it to the main photo flow?
        }
    });
});