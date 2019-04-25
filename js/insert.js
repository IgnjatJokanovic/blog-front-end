$(document).ready(function(){
    var user = localStorage.getItem('token');
    if(user != null)
    {
        CKEDITOR.replace( 'content', {
        height: 300,
        });

    }
    else
    {
        window.location.href = "index.html";
    }
});
const URL = "http://localhost/rest-api/public/api/";