var eventStart;
var editcontent;
var isTask=false,
  isPayment = false;

var tl1,tl2,data,data2;

google.load("visualization", "1");

// Set callback to run when API is loaded
google.setOnLoadCallback(drawVisualization);

// Called when the Visualization API is loaded.
function createtimeline1(){
  // Create and populate a data table.
  data = new google.visualization.DataTable();
  data.addColumn('datetime', 'start');
  data.addColumn('datetime', 'end');
  data.addColumn('string', 'content');

  // specify options
  var options = {
    'width':  "100%",
    'height': "200px",
    'editable': true, // make the events dragable
    'snapEvents': false,
    'layout': "box",
    'showMajorLabels': true,
  };

  // Instantiate our timeline object.
  tl1 = new links.Timeline(document.getElementById('mytimeline'), options);

  // Make a callback function for the select event
  var onselect = function (event) {
    var row = undefined;
    var sel = tl1.getSelection();
    if (sel.length) {
        if (sel[0].row != undefined) {
            var row = sel[0].row;
        }
    }

    if (row != undefined) {
        var content = data.getValue(row, 2);
        //document.getElementById("txtContent").value = content;
        document.getElementById("info").innerHTML += "event " + row + " selected<br>";

    }
  };

  // callback function for the change event
  var onchange = function () {
    var sel = tl1.getSelection();
    if (sel.length) {
        if (sel[0].row != undefined) {
            var row = sel[0].row;
            document.getElementById("info").innerHTML += "event " + row + " changed<br>";
        }
    }
  };

  // callback function for the add event
  var onadd = function () {
    var count = data.getNumberOfRows();
    document.getElementById("info").innerHTML += "event " + (count-1) + " added<br>";
  };

  // Add event listeners
  google.visualization.events.addListener(tl1, 'select', onselect);
  google.visualization.events.addListener(tl1, 'change', onchange);
  google.visualization.events.addListener(tl1, 'complete', oncomplete1);
  google.visualization.events.addListener(tl1, 'add', onadd);
  google.visualization.events.addListener(tl1, 'rangechange', onrangechange1);
  google.visualization.events.addListener(tl1, 'editEvent', editEvent);
  // Draw our tl1 with the created data and options
  tl1.draw(data);
}

function createtimeline2(){
    // Create and populate a data table.
  data2 = new google.visualization.DataTable();
  data2.addColumn('datetime', 'start');
  data2.addColumn('datetime', 'end');
  data2.addColumn('string', 'content');

  // specify options
  var options = {
    'axisOnTop': true,
    'width':  "100%",
    'height': "200px",
    'editable': false, // make the events dragable
    'snapEvents': false,
    'layout': "box",
    'showMajorLabels': false,
    'showMinorLabels': false  
  };

  // Instantiate our timeline object.
  tl2 = new links.Timeline(document.getElementById('mytimeline2'), options);

  google.visualization.events.addListener(tl2, 'rangechange', onrangechange2);
  google.visualization.events.addListener(tl2, 'complete', oncomplete2);
  // Draw our tl1 with the created data and options
  tl2.draw(data2);
}

function drawVisualization() {
  createtimeline1();
  createtimeline2();
}

/**
 * link 2 timeline together
 */

function onrangechange1() {
  document.getElementById("info").innerHTML+="range changed"
  var range = tl1.getVisibleChartRange();
  tl2.setVisibleChartRange(range.start, range.end);  
}

function onrangechange2() {
  document.getElementById("info").innerHTML+="range changed"
  var range = tl2.getVisibleChartRange();
  tl1.setVisibleChartRange(range.start, range.end);
}

function getPosition(){
  var params = tl1.eventParams,
    options = tl1.options,
    dom = tl1.dom,
    size = tl1.size;
  var event = event || window.event;
  // get mouse position
  params.mouseX = links.Timeline.getPageX(event);
  params.mouseY = links.Timeline.getPageY(event);
  var x = params.mouseX - links.Timeline.getAbsoluteLeft(dom.content);
  var y = params.mouseY - links.Timeline.getAbsoluteTop(dom.content);
  // create a new event at the current mouse position
  var xstart = tl1.screenToTime(x);
  if (options.snapEvents) {
    tl1.step.snap(xstart);
  }
  return xstart;
}


$(function(){
  var title = $("#title"),
    title_p = $("#title_p"),
    asignee = $("#asignee"),
    allFields = $( [] ).add( title ).add( asignee );

  $("#dialog-form-task").dialog({
    autoOpen: false,
    height: 600,
    width: 350,
    modal: true,
    buttons:{
      "Confirm": function(){
        addTask(title);
        tl1.eventParams.itemIndex = (tl1.items.length - 1);
        tl1.selectItem(tl1.eventParams.itemIndex);

        tl1.applyAdd = true;
        tl1.trigger('add');

        if (tl1.applyAdd) {
            // render and select the item
            tl1.render({animate: false});
            tl1.selectItem(tl1.eventParams.itemIndex);
        }
        else {
            // undo an add
            tl1.deleteItem(tl1.eventParams.itemIndex);
        }
        links.Timeline.preventDefault(event);
        $( this).dialog( "close" );
        },
      "Cancel": function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
        allFields.val( "" );
    }
  });
  $("#dialog-form-payment").dialog({

    autoOpen: false,
    height: 600,
    width: 500,
    modal: true,
    dialogClass: "MyClass",
    buttons:{
      "Confirm": function(){
        addPayment(title_p);
        tl1.eventParams.itemIndex = (tl1.items.length - 1);
        tl1.selectItem(tl1.eventParams.itemIndex);

        tl1.applyAdd = true;
        // fire an add event.
        // Note that the change can be canceled from within an event listener if
        // this listener calls the method cancelAdd().
        tl1.trigger('add');

        if (tl1.applyAdd) {
            // render and select the item
            tl1.render({animate: false});
            tl1.selectItem(tl1.eventParams.itemIndex);
        }
        else {
            // undo an add
            tl1.deleteItem(tl1.eventParams.itemIndex);
        }
        links.Timeline.preventDefault(event);
        $( this).dialog( "close" );
        },
      "Cancel": function() {
        $( this ).dialog( "close" );
      }
    },
    create: function(e, ui) {
      // 'this' is #dialog
      // get the whole widget (.ui-dialog) with .dialog('widget')
      $(this).dialog('widget')
          // alter the css classes
          .removeClass('ui-corner-all')
          .addClass('payclass');
    },
    close: function() {
        allFields.val( "" );
    }
  });
});

function addTask(title){
  var content = "<img src='/images/task-undone-outline.png' style='width:16px; height:16px;float:left'>"+title.val();
  tl1.addItem({
    'start': eventStart,
    'content': content,
  }, true);
}

function addPayment(title){
  var content = "<img src='/images/payment.png' style='width:16px; height:16px;float:left'>"+title.val();
  tl1.addItem({
    'start': eventStart,
    'content': content,
  }, true);
}
function openDialog(){
  if (isTask){
    openDialogForTask();
  }
  else if(isPayment){
    openDialogForPayment();
  }
}

function openDialogForTask(){
  eventStart = getPosition();
  $('#dialog-form-task').dialog('open');
}

function openDialogForPayment(){
  eventStart = getPosition();
  $('#dialog-form-payment').dialog('open');
}

// callback function for the delete event. add the deleted item to the complicated timeline
function oncomplete1() {
  var sel = tl1.getSelection();
  var row = sel[0].row;
  var item = tl1.items[row];
  var start = item.start;
  var content = item.content;
  tl2.addItem({
    'start': start,
    'content': content,
    'editable': true
  });
};

// callback function for the delete event. add the deleted item to the to-do timeline
function oncomplete2() {
  var sel = tl2.getSelection();
  var row = sel[0].row;
  var item = tl2.items[row];
  var start = item.start;
  var content = item.content;
  tl1.addItem({
    'start': start,
    'content': content
  });
};

function editEvent() {
  var sel = tl1.getSelection();
  var row = sel[0].row;
  var item = tl1.items[row];
  var start = item.start;
  var content = item.content;
  var itemTitles = document.getElementById("title");
  var titleVal = itemTitles.innerHTML;
  eventStart = start;
  $('#dialog-form').dialog('open');
  var title = $("#title");
  var assign = $("#asignee");
  title.val(titleVal); 
  //tl1.openDialog();

}

var dragSrcEl = null;

function handleDragTaskStart(e) {
  // Target (this) element is the source node.

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  isTask = true;
}

function handleDragPaymentStart(e) {
  // Target (this) element is the source node.

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  isPayment = true;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.

  [].forEach.call(tas, function (tas) {
    tas.classList.remove('over');
  });
  isPayment=false;
  isTask = false;
}

var tas = document.querySelectorAll('#columns .column');
[].forEach.call(tas, function(tas) {
  tas.addEventListener('dragstart', handleDragTaskStart, false);
  //tas.addEventListener('dragenter', handleDragEnter, false)
  //tas.addEventListener('dragover', handleDragOver, false);
  //tas.addEventListener('dragleave', handleDragLeave, false);
  //tas.addEventListener('drop', openDialogForTask, false);
  //tas.addEventListener('drop', handleDrop, false);
  tas.addEventListener('dragend', handleDragEnd, false);
});

var pay = document.querySelectorAll('#columns .columnpay');
[].forEach.call(pay, function(pay) {
  pay.addEventListener('dragstart', handleDragPaymentStart, false);
  //pay.addEventListener('dragenter', handleDragEnter, false)
  //pay.addEventListener('dragover', handleDragOver, false);
  //pay.addEventListener('dragleave', handleDragLeave, false);
  //pay.addEventListener('drop', openDialogForPayment, false);
  //pay.addEventListener('drop', handleDrop, false);
  pay.addEventListener('dragend', handleDragEnd, false);
});

var dropzs = document.querySelectorAll('.dropzone');
[].forEach.call(dropzs, function(zon) {
  zon.addEventListener('dragenter', handleDragEnter, false)
  zon.addEventListener('dragover', handleDragOver, false);
  zon.addEventListener('dragleave', handleDragLeave, false);
  zon.addEventListener('drop', openDialog, false);
});
