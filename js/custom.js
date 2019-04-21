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

});