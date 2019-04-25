$(document).ready(function(){
    const URL = "http://localhost/rest-api/public/api/";
    var user = localStorage.getItem('token');
    if(user != null)
    {
        
        load_edit();
        CKEDITOR.replace( 'edit', {
        height: 300,
        });

    }
    else
    {
        window.location.href = "index.html";
    }
    
});

function load_edit()
{
    var user = localStorage.getItem('token');
    var full_url = window.location.href;
    var proccessed = full_url.split("\?");
    var array = proccessed[1].split("=");
    var id = array[1];
    $.ajax({
        type: "GET",
        url: URL + "article/edit",
        data: {
            "token": user,
            "id": id
        },
        dataType: "application/json",
        complete: function (response) {
            if(response.status != 401)
            {
                
                var json = JSON.parse(response.responseText)
                $('#title_edit').val(json.title);
                $('#current_image').attr('src', json.main_image);
                $('#article_id').val(json.id);
                CKEDITOR.instances.edit.setData(json.body);

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


const URL = "http://localhost/rest-api/public/api/";