
$(document).ready(function(){   
    var clickDate = "";
    var clickAgendaItem = "";
    var index_of_event = -1;
    $("#user_name").val(user_name);
    $("#club_name").val(club_name);
    $("#role_name").val(role_name);
    var jfcalplugin = $("#mycal").jFrontierCal({
        date: new Date(),
        dayClickCallback: myDayClickHandler,
        agendaClickCallback: myAgendaClickHandler,
        agendaDropCallback: myAgendaDropHandler,
        agendaMouseoverCallback: myAgendaMouseoverHandler,
        applyAgendaTooltipCallback: myApplyTooltip,
        agendaDragStartCallback : myAgendaDragStart,
        agendaDragStopCallback : myAgendaDragStop,
        dragAndDropEnabled: false
    }).data("plugin");
    
    jfcalplugin.setAspectRatio("#mycal",0.4);
    var id_list_len = ex_event_id.split(",").length,
    id_list = ex_event_id.split(","),
    title_list = ex_event_title.split(","),
    end_time_list = ex_event_end_time.split(","),
    time_list = ex_event_time.split(",");
    for (var i = 0; i < id_list_len; i++) {
        var newDate = time_string_to_date(time_list[i]);
        var new_endDate = time_string_to_date(end_time_list[i]);
        var content = title_list[i];
        jfcalplugin.addAgendaItem(
            "#mycal",
            content,
            newDate,
            new_endDate,
            false,
            {
                fname: "test",
                lname: "test",
                //leadReindeer: "Rudolph",
                myDate: new Date(),
                //myNum: 42
            },
            {
                backgroundColor: $("#colorBackground").val(),
                foregroundColor: $("#colorForeground").val()
            }
        );
    }

    function getMonthFromString(mon){

       var d = Date.parse(mon + "1, 2012");
       if(!isNaN(d)){
          return new Date(d).getMonth() + 1;
       }
       return -1;
     }

    function time_string_to_date(date){
      var month, date, year;
      var date_arr = date.split(" ");
      year = parseInt(date_arr[3]);
      month = getMonthFromString(date_arr[1])-1;
      date = parseInt(date_arr[2]);
      return new Date(year,month,date);
    }

    function myAgendaDragStart(eventObj,divElm,agendaItem){
        if(divElm.data("qtip")){
            divElm.qtip("destroy");
        }   
    };
    function myAgendaDragStop(eventObj,divElm,agendaItem){
            ;
    };
    
    function myApplyTooltip(divElm,agendaItem){
        if(divElm.data("qtip")){
            divElm.qtip("destroy");
        }
        
        
        var displayData = "";
        
        var title = agendaItem.title;
        var startDate = agendaItem.startDate;
        var endDate = agendaItem.endDate;
        var allDay = agendaItem.allDay;
        var data = agendaItem.data;
        displayData += "<br><b>" + title+ "</b><br><br>";
        if(allDay){
            displayData += "(All day event)<br><br>";
        }else{
            displayData += "<b>Starts:</b> " + startDate + "<br>" + "<b>Ends:</b> " + endDate + "<br><br>";
        }
        for (var propertyName in data) {
            displayData += "<b>" + propertyName + ":</b> " + data[propertyName] + "<br>"
        }

        var backgroundColor = agendaItem.displayProp.backgroundColor;
        var foregroundColor = agendaItem.displayProp.foregroundColor;
        var myStyle = {
            border: {
                width: 5,
                radius: 10
            },
            padding: 10, 
            textAlign: "left",
            tip: true,
            name: "dark"        
        };
        if(backgroundColor != null && backgroundColor != ""){
            myStyle["backgroundColor"] = backgroundColor;
        }
        if(foregroundColor != null && foregroundColor != ""){
            myStyle["color"] = foregroundColor;
        }

        divElm.qtip({
            content: displayData,
            position: {
                corner: {
                    tooltip: "bottomMiddle",
                    target: "topMiddle"         
                },
                adjust: { 
                    mouse: true,
                    x: 0,
                    y: -15
                },
                target: "mouse"
            },
            show: { 
                when: { 
                    event: 'mouseover'
                }
            },
            style: myStyle
        });
    };


    function myDayClickHandler(eventObj){
        var date = eventObj.data.calDayDate;
        clickDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        $('#add-event-form').dialog('open');
    };
    
    function myAgendaClickHandler(eventObj){
        var agendaId = eventObj.data.agendaId;      
        var agendaItem = jfcalplugin.getAgendaItemById("#mycal",agendaId);
        clickAgendaItem = agendaItem;
        $("#display-event-form").dialog('open');
    };
    function myAgendaDropHandler(eventObj){
        var agendaId = eventObj.data.agendaId;
        var date = eventObj.data.calDayDate;
        var agendaItem = jfcalplugin.getAgendaItemById("#mycal",agendaId);      
        alert("You dropped agenda item " + agendaItem.title + 
            " onto " + date.toString() + ". Here is where you can make an AJAX call to update your database.");
    };
    
    function myAgendaMouseoverHandler(eventObj){
        var agendaId = eventObj.data.agendaId;
        var agendaItem = jfcalplugin.getAgendaItemById("#mycal",agendaId);
    };

    function date_to_yyyymmdd(date_obj){
      var yyyy = date_obj.getFullYear().toString();
      var mm = (date_obj.getMonth()+1).toString(); // getMonth() is zero-based
      var dd  = date_obj.getDate().toString();
      due_date_string = yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
      return due_date_string;
    }

    $("#dateSelect").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy-mm-dd'
    });
    
    $("#dateSelect").datepicker('setDate', new Date());
    $("#dateSelect").bind('change', function() {
        var selectedDate = $("#dateSelect").val();
        var dtArray = selectedDate.split("-");
        var year = dtArray[0];  
        var month = dtArray[1];
        month = month.replace(/^[0]+/g,"")      
        var day = dtArray[2];
        jfcalplugin.showMonth("#mycal",year,parseInt(month-1).toString());
    }); 
    $("#BtnPreviousMonth").button();
    $("#BtnPreviousMonth").click(function() {
        jfcalplugin.showPreviousMonth("#mycal");
        // update the jqeury datepicker value
        var calDate = jfcalplugin.getCurrentDate("#mycal"); // returns Date object
        var cyear = calDate.getFullYear();
        // Date month 0-based (0=January)
        var cmonth = calDate.getMonth();
        var cday = calDate.getDate();
        // jquery datepicker month starts at 1 (1=January) so we add 1
        $("#dateSelect").datepicker("setDate",cyear+"-"+(cmonth+1)+"-"+cday);
        return false;
    });
    /**
     * Initialize next month button
     */
    $("#BtnNextMonth").button();
    $("#BtnNextMonth").click(function() {
        jfcalplugin.showNextMonth("#mycal");
        // update the jqeury datepicker value
        var calDate = jfcalplugin.getCurrentDate("#mycal"); // returns Date object
        var cyear = calDate.getFullYear();
        // Date month 0-based (0=January)
        var cmonth = calDate.getMonth();
        var cday = calDate.getDate();
        // jquery datepicker month starts at 1 (1=January) so we add 1
        $("#dateSelect").datepicker("setDate",cyear+"-"+(cmonth+1)+"-"+cday);       
        return false;
    });
    
    /**
     * Initialize delete all agenda items button
     */
    $("#BtnDeleteAll").button();
    $("#BtnDeleteAll").click(function() {   
        jfcalplugin.deleteAllAgendaItems("#mycal"); 
        return false;
    });     
    
    /**
     * Initialize iCal test button
     */
    $("#BtnICalTest").button();
    $("#BtnICalTest").click(function() {
        // Please note that in Google Chrome this will not work with a local file. Chrome prevents AJAX calls
        // from reading local files on disk.        
        jfcalplugin.loadICalSource("#mycal",$("#iCalSource").val(),"html"); 
        return false;
    }); 
    /**
     * Initialize add event modal form
     */
    $("#add-event-form").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            'Add Event': function() {
                var what = jQuery.trim($("#what").val());
            
                if(what == ""){
                    alert("Please enter a short event description into the \"what\" field.");
                }else{
                
                    var startDate = $("#startDate").val();
                    var startDtArray = startDate.split("-");
                    var startYear = startDtArray[0];
                    // jquery datepicker months start at 1 (1=January)      
                    var startMonth = startDtArray[1];       
                    var startDay = startDtArray[2];
                    // strip any preceeding 0's     
                    startMonth = startMonth.replace(/^[0]+/g,"");
                    startDay = startDay.replace(/^[0]+/g,"");
                    var startHour = jQuery.trim($("#startHour").val());
                    var startMin = jQuery.trim($("#startMin").val());
                    var startMeridiem = jQuery.trim($("#startMeridiem").val());
                    startHour = parseInt(startHour.replace(/^[0]+/g,""));
                    if(startMin == "0" || startMin == "00"){
                        startMin = 0;
                    }else{
                        startMin = parseInt(startMin.replace(/^[0]+/g,""));
                    }
                    if(startMeridiem == "AM" && startHour == 12){
                        startHour = 0;
                    }else if(startMeridiem == "PM" && startHour < 12){
                        startHour = parseInt(startHour) + 12;
                    }
                    var endDate = $("#startDate").val();
                    var endDtArray = endDate.split("-");
                    var endYear = endDtArray[0];
                    // jquery datepicker months start at 1 (1=January)      
                    var endMonth = endDtArray[1];       
                    var endDay = endDtArray[2];
                    // strip any preceeding 0's     
                    endMonth = endMonth.replace(/^[0]+/g,"");
                    endDay = endDay.replace(/^[0]+/g,"");
                    var endHour = jQuery.trim($("#endHour").val());
                    var endMin = jQuery.trim($("#endMin").val());
                    var endMeridiem = jQuery.trim($("#endMeridiem").val());
                    endHour = parseInt(endHour.replace(/^[0]+/g,""));
                    if(endMin == "0" || endMin == "00"){
                        endMin = 0;
                    }else{
                        endMin = parseInt(endMin.replace(/^[0]+/g,""));
                    }
                    if(endMeridiem == "AM" && endHour == 12){
                        endHour = 0;
                    }else if(endMeridiem == "PM" && endHour < 12){
                        endHour = parseInt(endHour) + 12;
                    }
                    
                    //alert("Start time: " + startHour + ":" + startMin + " " + startMeridiem + ", End time: " + endHour + ":" + endMin + " " + endMeridiem);
                    // Dates use integers
                    var startDateObj = new Date(parseInt(startYear),parseInt(startMonth)-1,parseInt(startDay),startHour,startMin,0,0);
                    var endDateObj = new Date(parseInt(endYear),parseInt(endMonth)-1,parseInt(endDay),endHour,endMin,0,0);
                    var start_time_string = startHour.toString() + ":" + startMin.toString() + ":" + "00";
                    var end_time_string = endHour.toString() + ":" + endMin.toString() + ":" + "00";
                    // add new event to the calendar
                    jfcalplugin.addAgendaItem(
                        "#mycal",
                        what,
                        startDateObj,
                        endDateObj,
                        false,
                        {
                            fname: "XINU",
                            lname: "LI",
                            //leadReindeer: "Rudolph",
                            myDate: new Date(),
                            //myNum: 42
                        },
                        {
                            backgroundColor: $("#colorBackground").val(),
                            foregroundColor: $("#colorForeground").val()
                        }
                    );
                    var add_event_form = document.createElement("form");
                    add_event_form.setAttribute("method", "post");
                    add_event_form.setAttribute("action", "/profile");

                    var titleField = document.createElement("input");
                    titleField.setAttribute("type", "hidden");
                    titleField.setAttribute("value", what);
                    titleField.setAttribute("name", "what");
                    add_event_form.appendChild(titleField);

                    var timeField = document.createElement("input");
                    timeField.setAttribute("type", "hidden");
                    var start_date_val = startDate+" "+start_time_string;
                    timeField.setAttribute("value", start_date_val);
                    timeField.setAttribute("name", "startDate");
                    add_event_form.appendChild(timeField);

                    var endTimeField = document.createElement("input");
                    endTimeField.setAttribute("type", "hidden");
                    var end_date_val = endDate+" "+end_time_string;
                    endTimeField.setAttribute("value", end_date_val);
                    endTimeField.setAttribute("name", "endDate");
                    add_event_form.appendChild(endTimeField);

                    var clubField = document.createElement("input");
                    clubField.setAttribute("type", "hidden");
                    clubField.setAttribute("value", club_idNum);
                    clubField.setAttribute("name", "club_idNum");
                    add_event_form.appendChild(clubField);

                    add_event_form.submit();

                    $(this).dialog('close');
                }
                
            },
            Cancel: function() {
                $(this).dialog('close');
            }
        },
        open: function(event, ui){
            // initialize start date picker
            $("#startDate").datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                dateFormat: 'yy-mm-dd'
            });
            // initialize end date picker
            $("#endDate").datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                showButtonPanel: true,
                dateFormat: 'yy-mm-dd'
            });
            // initialize with the date that was clicked
            $("#startDate").val(clickDate);
            $("#endDate").val(clickDate);
            // initialize color pickers
            $("#colorSelectorBackground").ColorPicker({
                color: "#333333",
                onShow: function (colpkr) {
                    $(colpkr).css("z-index","10000");
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $("#colorSelectorBackground div").css("backgroundColor", "#" + hex);
                    $("#colorBackground").val("#" + hex);
                }
            });
            //$("#colorBackground").val("#1040b0");     
            $("#colorSelectorForeground").ColorPicker({
                color: "#ffffff",
                onShow: function (colpkr) {
                    $(colpkr).css("z-index","10000");
                    $(colpkr).fadeIn(500);
                    return false;
                },
                onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
                },
                onChange: function (hsb, hex, rgb) {
                    $("#colorSelectorForeground div").css("backgroundColor", "#" + hex);
                    $("#colorForeground").val("#" + hex);
                }
            });
            //$("#colorForeground").val("#ffffff");             
            // put focus on first form input element
            $("#what").focus();
        },
        close: function() {
            // reset form elements when we close so they are fresh when the dialog is opened again.
            $("#startDate").datepicker("destroy");
            $("#endDate").datepicker("destroy");
            $("#startDate").val("");
            $("#endDate").val("");
            $("#startHour option:eq(0)").attr("selected", "selected");
            $("#startMin option:eq(0)").attr("selected", "selected");
            $("#startMeridiem option:eq(0)").attr("selected", "selected");
            $("#endHour option:eq(0)").attr("selected", "selected");
            $("#endMin option:eq(0)").attr("selected", "selected");
            $("#endMeridiem option:eq(0)").attr("selected", "selected");            
            $("#what").val("");
            //$("#colorBackground").val("#1040b0");
            //$("#colorForeground").val("#ffffff");
        }
    });
    
    /**
     * Initialize display event form.
     */
    $("#display-event-form").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {      
            Cancel: function() {
                $(this).dialog('close');
            },
            'Edit': function() {
                var what = jQuery.trim($("#edit_what").val());
            
                if(what == ""){
                    alert("Please enter a short event description into the \"what\" field.");
                }else{
                
                    var startDate = $("#edit_startDate").val();
                    var startDtArray = startDate.split("-");
                    var startYear = startDtArray[0];
                    // jquery datepicker months start at 1 (1=January)      
                    var startMonth = startDtArray[1];       
                    var startDay = startDtArray[2];
                    // strip any preceeding 0's     
                    startMonth = startMonth.replace(/^[0]+/g,"");
                    startDay = startDay.replace(/^[0]+/g,"");
                    var startHour = jQuery.trim($("#edit_startHour").val());
                    var startMin = jQuery.trim($("#edit_startMin").val());
                    var startMeridiem = jQuery.trim($("#edit_startMeridiem").val());
                    startHour = parseInt(startHour.replace(/^[0]+/g,""));
                    if(startMin == "0" || startMin == "00"){
                        startMin = 0;
                    }else{
                        startMin = parseInt(startMin.replace(/^[0]+/g,""));
                    }
                    if(startMeridiem == "AM" && startHour == 12){
                        startHour = 0;
                    }else if(startMeridiem == "PM" && startHour < 12){
                        startHour = parseInt(startHour) + 12;
                    }
                    var endDate = $("#edit_startDate").val();
                    var endDtArray = endDate.split("-");
                    var endYear = endDtArray[0];
                    // jquery datepicker months start at 1 (1=January)      
                    var endMonth = endDtArray[1];       
                    var endDay = endDtArray[2];
                    // strip any preceeding 0's     
                    endMonth = endMonth.replace(/^[0]+/g,"");
                    endDay = endDay.replace(/^[0]+/g,"");
                    var endHour = jQuery.trim($("#edit_endHour").val());
                    var endMin = jQuery.trim($("#edit_endMin").val());
                    var endMeridiem = jQuery.trim($("#edit_endMeridiem").val());
                    endHour = parseInt(endHour.replace(/^[0]+/g,""));
                    if(endMin == "0" || endMin == "00"){
                        endMin = 0;
                    }else{
                        endMin = parseInt(endMin.replace(/^[0]+/g,""));
                    }
                    if(endMeridiem == "AM" && endHour == 12){
                        endHour = 0;
                    }else if(endMeridiem == "PM" && endHour < 12){
                        endHour = parseInt(endHour) + 12;
                    }
                    
                    //alert("Start time: " + startHour + ":" + startMin + " " + startMeridiem + ", End time: " + endHour + ":" + endMin + " " + endMeridiem);
                    // Dates use integers
                    var startDateObj = new Date(parseInt(startYear),parseInt(startMonth)-1,parseInt(startDay),startHour,startMin,0,0);
                    var endDateObj = new Date(parseInt(endYear),parseInt(endMonth)-1,parseInt(endDay),endHour,endMin,0,0);
                    var start_time_string = startHour.toString() + ":" + startMin.toString() + ":" + "00";
                    var end_time_string = endHour.toString() + ":" + endMin.toString() + ":" + "00";
                    // add new event to the calendar
                    // jfcalplugin.addAgendaItem(
                    //     "#mycal",
                    //     what,
                    //     startDateObj,
                    //     endDateObj,
                    //     false,
                    //     {
                    //         fname: "XINU",
                    //         lname: "LI",
                    //         //leadReindeer: "Rudolph",
                    //         myDate: new Date(),
                    //         //myNum: 42
                    //     },
                    //     {
                    //         backgroundColor: $("#colorBackground").val(),
                    //         foregroundColor: $("#colorForeground").val()
                    //     }
                    // );
                    var add_event_form = document.createElement("form");
                    add_event_form.setAttribute("method", "post");
                    add_event_form.setAttribute("action", "/profile");

                    var titleField = document.createElement("input");
                    titleField.setAttribute("type", "hidden");
                    titleField.setAttribute("value", what);
                    titleField.setAttribute("name", "what");
                    add_event_form.appendChild(titleField);

                    var timeField = document.createElement("input");
                    timeField.setAttribute("type", "hidden");
                    var start_date_val = startDate+" "+start_time_string;
                    timeField.setAttribute("value", start_date_val);
                    timeField.setAttribute("name", "startDate");
                    add_event_form.appendChild(timeField);

                    var endTimeField = document.createElement("input");
                    endTimeField.setAttribute("type", "hidden");
                    var end_date_val = endDate+" "+end_time_string;
                    endTimeField.setAttribute("value", end_date_val);
                    endTimeField.setAttribute("name", "endDate");
                    add_event_form.appendChild(endTimeField);

                    var clubField = document.createElement("input");
                    clubField.setAttribute("type", "hidden");
                    clubField.setAttribute("value", club_idNum);
                    clubField.setAttribute("name", "club_idNum");
                    add_event_form.appendChild(clubField);

                    var editField = document.createElement("input");
                    editField.setAttribute("type", "hidden");
                    editField.setAttribute("value", "is_edit_event");
                    editField.setAttribute("name", "edit_event");
                    add_event_form.appendChild(editField);

                    var editField = document.createElement("input");
                    editField.setAttribute("type", "hidden");
                    editField.setAttribute("value",  id_list[index_of_event].toString());
                    editField.setAttribute("name", "eventID");
                    add_event_form.appendChild(editField);

                    add_event_form.submit();

                    $(this).dialog('close');
                }
            }         
        },
        open: function(event, ui){
            if(clickAgendaItem != null){
                $("#edit_startDate").datepicker({
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                    showButtonPanel: true,
                    dateFormat: 'yy-mm-dd'
                });

                
                var title = clickAgendaItem.title;
                index_of_event = title_list.indexOf(title);
                var startDate = new Date(time_list[index_of_event]),
                    endDate = new Date(end_time_list[index_of_event]);
                // in our example add agenda modal form we put some fake data in the agenda data. we can retrieve it here.
                var eve_title = $("#edit_what");
                eve_title.val(title);
                

                var eve_startDate = $("#edit_startDate");
                var dateVal = date_to_yyyymmdd(startDate);
                eve_startDate.val(dateVal);

                var eve_edit_startHour = $("#edit_startHour");
                var hours_val = startDate.getHours();
                var ampm = hours_val >= 12 ? 'pm' : 'am';
                hours_val = hours_val % 12;
                hours_val = hours_val ? hours_val : 12; // the hour '0' should be '12'
                //minutes = minutes < 10 ? '0'+minutes : minutes;
                eve_edit_startHour.val(hours_val.toString());

                var eve_edit_startMin = $("#edit_startMin");
                var mind_val = startDate.getMinutes();
                mind_val = mind_val < 10 ? '0'+ mind_val : mind_val;
                eve_edit_startMin.val(mind_val.toString());

                var eve_edit_startMeridiem = $("#edit_startMeridiem");
                eve_edit_startMeridiem.val(ampm);



                var eve_edit_endHour = $("#edit_endHour");
                hours_val = endDate.getHours();
                ampm = hours_val >= 12 ? 'pm' : 'am';
                hours_val = hours_val % 12;
                hours_val = hours_val ? hours_val : 12; // the hour '0' should be '12'
                //minutes = minutes < 10 ? '0'+minutes : minutes;
                eve_edit_endHour.val(hours_val.toString());

                var eve_edit_endMin = $("#edit_endMin");
                mind_val = endDate.getMinutes();
                mind_val = mind_val < 10 ? '0'+ mind_val : mind_val;
                eve_edit_endMin.val(mind_val.toString());

                var eve_edit_endMeridiem = $("#edit_endMeridiem");
                eve_edit_endMeridiem.val(ampm);     
          
            }       
        },
        close: function() {
            // clear agenda data
            $("#edit_startDate").datepicker("destroy");
            $("#edit_endDate").datepicker("destroy");
            $("#edit_startDate").val("");
            $("#edit_endDate").val("");
            $("#edit_startHour option:eq(0)").attr("selected", "selected");
            $("#edit_startMin option:eq(0)").attr("selected", "selected");
            $("#edit_startMeridiem option:eq(0)").attr("selected", "selected");
            $("#edit_endHour option:eq(0)").attr("selected", "selected");
            $("#edit_endMin option:eq(0)").attr("selected", "selected");
            $("#edit_endMeridiem option:eq(0)").attr("selected", "selected");            
            $("#edit_what").val("");
        }
    });  
    /**
     * Initialize our tabs
     */
    $("#tabs").tabs({
        /*
         * Our calendar is initialized in a closed tab so we need to resize it when the example tab opens.
         */
        show: function(event, ui){
            if(ui.index == 1){
                jfcalplugin.doResize("#mycal");
            }
        }   
    });
    
});
  