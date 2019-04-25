const URL = "http://localhost/rest-api/public/api/";
$(document).ready(function(){
    var user = localStorage.getItem('token');
    if(user != null)
    {
        
       load();

    }
    else
    {
        window.location.href = "index.html";
    }
    

});

function load()
{
    $.ajax({
        type: "GET",
        url: URL + "article/by_user",
        data: {
            "token": localStorage.getItem('token')
        },
        dataType: "application/json",
        complete: function (response) {
            if(response.status == 200)
            {
                var json = JSON.parse(response.responseText);
                var articles = '';
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
                if(json.last_page != 1)
                {
                    var links = '<ul class="pagination">';
                    for(var i = 1; i <= json.last_page; i++)
                    {
                        var url_link = `${URL}article/by_user?page=${i}`
                        links += `<li class="page-item"><a class="page-link pagination-user" href="#" data-id="${url_link}">${i}</a></li>`;
                    }
                    links += "</ul>";
                    $('#pagination_user').html(links);

                }

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
                $('#user_articles').hide();
            }

            
        }
    });
}