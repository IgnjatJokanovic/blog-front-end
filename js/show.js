const URL = "http://localhost/rest-api/public/api/";
var full_url = window.location.href;
var proccessed = full_url.split("\?");
var array = proccessed[1].split("=");
var id = array[1];
$(document).ready(function(){
    const URL = "http://localhost/rest-api/public/api/";
    $.ajax({
        type: "GET",
        url: URL + "article/show",
        data: {
            "id": id
        },
        dataType: "application/json",
        complete: function (response) {
            var json = JSON.parse(response.responseText);
            var date = new Date(json.created_at);
            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();
            var header = `<div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                    <a href="#"><img class="card-img-top" src="${json.main_image}" alt="${json.alt}"></a>
                    <div class="card-body">
                        <h4 class="card-title">
                        </h4>
                        <h5>Posted by: ${json.user.name} on ${day + '/' + month + '/' + year}</h5>
                    </div>
                    </div>
                </div>`;
            $('#heading').html(header);
            $('#body').html(json.body);
            
        }
    });
    
});