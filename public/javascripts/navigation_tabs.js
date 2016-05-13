/*if (message == 'That email is already taken.'){
    tabcontent = document.getElementsByClassName("tabcontent");
    tabcontent[0].style.display = "none";
    tabcontent[1].style.display = "block";
    tablinks = document.getElementsByClassName("tablinks");
    tablinks[0].className = tablinks[0].className.replace(" active", "");
    tablinks[1].className += " active";
}*/

function Login_or_Signup(evt, action) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabcontent.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(action).style.display = "block";
    evt.currentTarget.className += " active";
}