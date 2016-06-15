    // function load_event(eventnumber){
    //     var get_event_form = document.createElement("form");
    //     get_event_form.setAttribute("method", "get");
    //     get_event_form.setAttribute("action", "/event_planning");

    //     var event_number = document.createElement("input");
    //     event_number.value = eventnumber;

    //     get_event_form.submit();
    // }
var get_event_form = document.getElementById('event_list');
var text_1 = document.createElement("div");
text_1.innerHTML = "Events:";
get_event_form.appendChild(text_1);

var l_event = ex_event_title.split(",").length,
event_title = ex_event_title.split(","),
event_id = ex_event_id.split(","); 
if (event_title[0] != ""){
    for(var index = 0; index < l_event; index++){
        var eventbox = document.createElement("div");
        eventbox.style.width = "200px";
        eventbox.style.height = "80px";
        eventbox.style.border = "1px solid #0088DD";
        eventbox.style.margin = "10px";

        var para = document.createElement("p");
        para.style.textAlign = "center";
        para.style.paddingTop = "25px";
        para.style.width = "80px";
        para.style.height = "80px";
        para.style.borderRight = "1px solid #0088DD";
        para.style.float = "left";
        var aTag = document.createElement('a');
        aTag.href = "/event_planning" + "?event_number=" + event_id[index];
        aTag.innerHTML = "Event "+event_id[index];
        para.appendChild(aTag);

        var event_display_title = document.createElement("div"),
            node_title = document.createTextNode(event_title[index]);
        event_display_title.className = "Updates"

        event_display_title.appendChild(node_title); 

        eventbox.appendChild(para);
        eventbox.appendChild(event_display_title);
        get_event_form.appendChild(eventbox);

    }
}