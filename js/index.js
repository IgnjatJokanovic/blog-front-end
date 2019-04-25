const URL = "http://localhost/rest-api/public/api/";

$(document).ready(function(){

    $.ajax({
        type: "GET",
        url: URL + "article/all",
        complete: function (response) {
            if(response.status == 200)
            {
                var articles = '';
                $.each(response.responseJSON.data, function(key, value){
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
                if(response.responseJSON.last_page != 1)
                {
                    var links = '<ul class="pagination">';
                    for(var i = 1; i <= response.responseJSON.last_page; i++)
                    {
                        var url_link = `${URL}article/all?page=${i}`
                        links += `<li class="page-item"><a class="page-link pagination-all" href="#" data-id="${url_link}">${i}</a></li>`;
                    }
                    links += "</ul>";
                    $('#pagination_all').html(links);

                }

            }
            else
            {
                var text = '';
                $.each(response.responseJSON.messages, function(key, value) {
                    text += `<div class='alert alert-danger text-center'>${value}</div>`;
                });
                $('#feedback_index').html(text);
                $('html, body').scrollTop($("#feedback_index").scrollTop() + 10);
            }
            
            
            
        }
    });

});