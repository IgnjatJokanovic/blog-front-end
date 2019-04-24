$(document).ready(function () {

    //navigation restriction
    var user = localStorage.getItem('token');
    if(user == null)
    {
        $('.logged-in').hide();
        $('.logged-out').show();
        $('#page_insert_article').hide();
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
            $.ajax({
                type: "POST",
                url: URL + 'article/create',
                data: {
                        "title": title,
                        "image": image,
                        "body": body.replace(/"/g, "'"),
                        "token": localStorage.getItem('token')
                },
                dataType: "application/json",
                complete: function (response)
                {
                    if(response.status == 201)
                    {
                        var feedback = JSON.parse(response.responseText);
                        $('#feedback_insert').html(`<div class='alert alert-success text-center'>${feedback.message}</div>`);
                        $('html, body').scrollTop($("#feedback_insert").scrollTop() + 10);
                        
                    }
                    else
                    {
                        var text = '';
                        var errors = JSON.parse(data.responseText);
                        $.each(errors.messages, function(key, value) {
                            text += `<div class='alert alert-danger text-center'>${value}</div>`;
                        });
                        $('#feedback_insert').html(text);
                        $('html, body').scrollTop($("#feedback_insert").scrollTop() + 10);
                        
                    }
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

    $('#login').on('click', function(){
        var email = $('#email').val();
        var password = $('#password').val();
        var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var errors = [];
        if(email == '')
        {
            errors.push("<div class='alert alert-danger'>Email field is required</div>");
        }
        if(password == '')
        {
            errors.push("<div class='alert alert-danger'>Password field is required</div>");
        }
        if(email != '' && !email.match(regex))
        {
            errors.push("<div class='alert alert-danger'>Email field must be a valid email address</div>");
        }
        if(errors.length == 0)
        {
            var user = {
                "email": email,
                "password": password
            }

            $.ajax({
                type: "POST",
                url: URL + "user/login",
                data: user,
                dataType: "application/json",
                complete: function (data)
                {
                    if(data.status == 200)
                    {
                        var jsonToken = JSON.parse(data.responseText);
                        localStorage.setItem('token', jsonToken.token);
                        $('#loginModal').hide();
                        location.reload();
                       
                    }
                    else
                    {
                        var text = '';
                        var errors = JSON.parse(data.responseText);
                        $.each(errors.messages, function(key, value) {
                            text += `<div class='alert alert-danger text-center'>${value}</div>`;
                        });
                        $('#feedback_login').html(text);

                    }
                }
            });

        }
        else
        {
            var text = '';
            $.each(errors, function(key, message){
                text += message;
            });
            $('#feedback_login').html(text);
        }
    });

    $('#logout').on('click', function(){
        localStorage.removeItem('token');
        location.reload();
    })

    


});