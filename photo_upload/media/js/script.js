//Webcam options

webcam.set_swf_url('../static/swf/webcam.swf');
webcam.set_shutter_sound(true, "../static/mp3/shutter.mp3");
webcam.set_quality(90);
webcam.set_stealth(false);
webcam.set_hook('onComplete', 'callbackCamera');
    
//Render webcam
$("#camera").html(webcam.get_html(350, 260));

//Switches uploads steps
function switchStep() {
    $("#step-1").hide();
    $("#step-2").show();
}

//Callback function for jpegcam - invokes switchStep, creates canvas, and adds jpeg image to canvas
function callbackCamera(response) {
    var data = JSON.parse(response);
    //going from step 1 to 2 in the upload form.
    switchStep();
    //save raw_photo_pk to form
    $('#id_raw_photo').val(data.raw_photo_pk);

    //canvas
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    //Making an image object to draw to my canvas
    var img = new Image();
    img.src = data.file_url;
    img.onload = function() {
        context.drawImage(img, 0, 0, 350, 260);

        //overlay a transparent rect for their info
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.fillRect(0,225,350,100);
    };
}

//redraw functions for text
$("#id_name").change(function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.font = "24px Helvetica";
    context.fillText(this.value, 5, 250);
});
    
$("#id_zip_code").change(function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.fillStyle = "rgba(0, 0, 0, 1)";
    context.font = "16px Helvetica";
    context.fillText(this.value, 100, 250);
});

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
         raw_photo_id: $('#id_raw_photo').val()
        },
        error: function(jqXHR, textStatus) {
            var errors = $.parseJSON(jqXHR.responseText);
            $('input#id_'+errors.field).addClass('error');
            $('label[for="id_'+errors.field+'"]').addClass('error');

        },
        success: function(jqXHR, textStatus, errorThrown) {
            console.log('success');
            $('#tab').click();
            $('#tab').css('background','green');
            $('#tab h2').html('Thanks!');
            $('#tab').unbind();
            //add it to the main photo flow?
        }
    });
});