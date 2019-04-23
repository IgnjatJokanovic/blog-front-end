$(document).ready(function () {

    //navigation restriction
    var user = localStorage.getItem('user');
    if(user == null)
    {
        $('.logged-in').hide();
        $('.logged-out').show();
    }
    else
    {
        $('.logged-in').show();
        $('.logged-out').hide();
    }

    $("#image").on('change', function() {
        var reader = new FileReader();
        reader.onload = function(){
            $("#preview").attr('src', reader.result).show();
        };
        reader.readAsDataURL($("#image").get(0).files[0]);   
    });

    //article insert
    $('#insert').on('click', function(){
        var title = $('#title').val();
        var image = $("#preview").attr('src');
        var body = CKEDITOR.instances.content.getData();
        var errors = [];
        if(title == '')
        {
            errors.push("<div class='alert alert-danger'>Title field is required</div>");
        }
        if(image == '')
        {
            errors.push("<div class='alert alert-danger'>Image field is required</div>");
        }
        if(body == '')
        {
            errors.push("<div class='alert alert-danger'>Body field is required</div>");
        }
        if(errors.length == 0)
        {
            const article = {
                "title": title,
                "image": image,
                "body": body.replace(/"/g, "'")
            }
            $.ajax({
                type: "POST",
                url: URL + 'article/create',
                data: article,
                dataType: "application/json",
                success: function (response)
                {
                    console.log(response);
                },
                error: function(response)
                {
                   alert(response);
                }
            });
        }
        else
        {
            var text = '';
            $.each(errors, function(key, message){
                text += message;
            });
            $('#feedback_insert').html(text);
        }
        
    });

    


});