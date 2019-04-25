$(document).ready(function () {

    //navigation restriction
    var user = localStorage.getItem('token');
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

    $("#image_edit").on('change', function() {
        var reader = new FileReader();
        reader.onload = function(){
            $("#current_image").attr('src', reader.result);
            $('#edited_image').val(reader.result);
        };
        reader.readAsDataURL($("#image_edit").get(0).files[0]);   
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
                        var errors = JSON.parse(response.responseText);
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

    //login
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
                        window.location.href = "index.html";
                       
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
    //logout
    $('#logout').on('click', function(){
        $.ajax({
            type: "POST",
            url: URL + 'user/logout',
            data: {
                "token":  localStorage.getItem('token')
            },
            dataType: "application/json",
            complete: function (response) {
                localStorage.removeItem('token');
                window.location.href = "index.html";
            }
        });
    });
    

    //paginate all articles
    $(document).on("click", ".pagination-all", function(e){
        e.preventDefault();
         var link = $(this).attr('data-id');
        $.ajax({
            type: "GET",
            url: link,
            dataType: "application/json",
            complete: function (response) {
                var articles = '';
                var json = JSON.parse(response.responseText);
                $.each(json.data, function(key, value){
                    var date = new Date(value.created_at);
                    var day = date.getDate();
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    articles += `<div class="col-lg-4 col-md-6 mb-4">
                                <div class="card h-100">
                                <a href="single_article.html?id=${value.id}"><img class="card-img-top" src="${value.main_image}" alt="${value.alt}"></a>
                                <div class="card-body">
                                    <h4 class="card-title">
                                    <a href="single_article.html?id=${value.id}">${value.title}</a>
                                    </h4>
                                    <h5>Posted by: ${value.user.name} on ${day + '/' + month + '/' + year}</h5>
                                </div>
                                </div>
                            </div>`;
                });
                $('#index').html(articles);
            }
        });
    });
    //paginate user articles
    $(document).on("click", ".pagination-user", function(e){
        e.preventDefault();
         var link = $(this).attr('data-id');
        $.ajax({
            type: "GET",
            url: link,
            data: {
                "token": localStorage.getItem('token')
            },
            dataType: "application/json",
            complete: function (response) {
                if(response.status != 401)
                {
                    var articles = '';
                    var json = JSON.parse(response.responseText);
                    $.each(json.data, function(key, value){
                        var date = new Date(value.created_at);
                        var day = date.getDate();
                        var month = date.getMonth();
                        var year = date.getFullYear();
                        articles += `<div class="col-lg-4 col-md-6 mb-4">
                                    <div class="card h-100">
                                    <a href="single_article.html?id=${value.id}"><img class="card-img-top" src="${value.main_image}" alt="${value.alt}"></a>
                                    <div class="card-body">
                                        <h4 class="card-title">
                                        <a href="single_article.html?id=${value.id}">${value.title}</a>
                                        </h4>
                                        <h5>Posted by: ${value.user.name} on ${day + '/' + month + '/' + year}</h5>
                                        <a href="update_article.html?id=${value.id}" class="btn btn-primary">Edit</a>
                                        <button class="btn btn-primary btn-delete" data-id="${value.id}">Delete</button>
                                    </div>
                                    </div>
                                </div>`;
                    });
                    $('#user_articles').html(articles);
                }
                else
                {
                    var text = '';
                    var errors = JSON.parse(response.responseText);
                    $.each(errors.messages, function(key, value) {
                        text += `<div class='alert alert-danger text-center'>${value}</div>`;
                    });
                    $('#feedback_user_posts').html(text);
                    $('html, body').scrollTop($("#feedback_user_posts").scrollTop() + 10);
                }
                
            }
        });
    });

    //delete post
    $(document).on('click', '.btn-delete', function(){
        var token = localStorage.getItem('token');
        if(token != null)
        {
           $.ajax({
               type: "DELETE",
               url: URL + "article/delete",
               data: {
                   "token": token,
                   "id": $(this).attr('data-id')
               },
               dataType: "application/json",
               complete: function (response) {
                   if(response.status != 401)
                   {
                        var json = JSON.parse(response.responseText);
                        var output = `<div class='alert alert-success text-center'>${json.message}</div>`
                        $('#feedback_user_posts').html(output);
                        $('html, body').scrollTop($("#feedback_user_posts").scrollTop() + 10);
                        load();
                   }
                   else
                   {
                        var text = '';
                        var errors = JSON.parse(response.responseText);
                        $.each(errors.messages, function(key, value) {
                            text += `<div class='alert alert-danger text-center'>${value}</div>`;
                        });
                        $('#feedback_user_posts').html(text);
                        $('html, body').scrollTop($("#feedback_user_posts").scrollTop() + 10);

                   }
               }
           });
        }
        else
        {
            window.location.href = "index.html";
        }
    });

    //update
    $('#update').on('click', function(){
        var title = $('#title_edit').val();
        var image = $("#edited_image").val();
        var body = CKEDITOR.instances.edit.getData();
        var errors = [];
        var id = $('#article_id').val();
        if(title == '')
        {
            errors.push("<div class='alert alert-danger'>Title field is required</div>");
        }
        if(body == '')
        {
            errors.push("<div class='alert alert-danger'>Body field is required</div>");
        }
        if(errors.length == 0)
        {
            $.ajax({
                type: "PUT",
                url: URL + 'article/update',
                data: {
                        "title": title,
                        "image": image,
                        "body": body.replace(/"/g, "'"),
                        "id": id,
                        "token": localStorage.getItem('token')
                },
                dataType: "application/json",
                complete: function (response)
                {
                    if(response.status == 200)
                    {
                        var feedback = JSON.parse(response.responseText);
                        $('#feedback_update').html(`<div class='alert alert-success text-center'>${feedback.message}</div>`);
                        $('html, body').scrollTop($("#feedback_update").scrollTop() + 10);
                        load_edit();
                        
                    }
                    else
                    {
                        var text = '';
                        var errors = JSON.parse(response.responseText);
                        $.each(errors.messages, function(key, value) {
                            text += `<div class='alert alert-danger text-center'>${value}</div>`;
                        });
                        $('#feedback_update').html(text);
                        $('html, body').scrollTop($("#feedback_update").scrollTop() + 10);
                        
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
            $('#feedback_update').html(text);
            $('html, body').scrollTop($("#feedback_update").scrollTop() + 10);
        }
    });

});

