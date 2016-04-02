var tl1,tl2,data,data2;
/*$(function(){
  var title = $("#title"),
    assignee = $("#assignee");
  $("#dialog-form").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons:{
      "Confirm": function(){
        $( this ).dialog( "close" );
      },
      "Cancel": function() {
        $( this ).dialog( "close" );
      }
    },
  });
});*/

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

/*            data.addRows([
      [new Date(2010,7,23), , '<div>Conversation</div><img src="img/comments-icon.png" style="width:32px; height:32px;">'],
      [new Date(2010,7,23,23,0,0), , '<div>Mail from boss</div><img src="img/mail-icon.png" style="width:32px; height:32px;">'],
      [new Date(2010,7,24,16,0,0), , 'Report'],
      [new Date(2010,7,26), new Date(2010,8,2), 'Traject A'],
      [new Date(2010,7,28), , '<div>Memo</div><img src="img/notes-edit-icon.png" style="width:48px; height:48px;">'],
      [new Date(2010,7,29), , '<div>Phone call</div><img src="img/Hardware-Mobile-Phone-icon.png" style="width:32px; height:32px;">'],
      [new Date(2010,7,31), new Date(2010,8,3), 'Traject B'],
      [new Date(2010,8,4,12,0,0), , '<div>Report</div><img src="img/attachment-icon.png" style="width:32px; height:32px;">']
  ]);*/

  // specify options
  var options = {
    'width':  "100%",
    'height': "200px",
    'editable': true, // make the events dragable
    'layout': "box"
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

function editEvent() {

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

/**
 * Add a new event using drag and drop
 */
function add() {
  //var range = tl1.getVisibleChartRange();
  //var start = new Date((range.start.valueOf() + range.end.valueOf()) / 2);
  //var content = document.getElementById("txtContent").value;
  $('#dialog-form').dialog('open');
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
  var content = options.NEW;
  var group = tl1.getGroupFromHeight(y);   // (group may be undefined)
  var preventRender = true;
  tl1.addItem({
      'start': xstart,
      'content': content,
      'group': tl1.getGroupName(group)
    }, preventRender);
  params.itemIndex = (tl1.items.length - 1);
  tl1.selectItem(params.itemIndex);

  tl1.applyAdd = true;
  // fire an add event.
  // Note that the change can be canceled from within an event listener if
  // this listener calls the method cancelAdd().
  tl1.trigger('add');

  if (tl1.applyAdd) {
      // render and select the item
      tl1.render({animate: false});
      tl1.selectItem(params.itemIndex);
  }
  else {
      // undo an add
      tl1.deleteItem(params.itemIndex);
  }
  links.Timeline.preventDefault(event);
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

var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  this.style.opacity = '0.4';
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

  // Don't do anything if dropping the same column we're dragging.
/*  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }*/

  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.

  [].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });
}

var cols = document.querySelectorAll('#columns .column');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false)
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', add, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});

var dropzs = document.querySelectorAll('.dropzone');
[].forEach.call(dropzs, function(zon) {
  //zon.addEventListener('dragstart', handleDragStart, false);
  zon.addEventListener('dragenter', handleDragEnter, false)
  zon.addEventListener('dragover', handleDragOver, false);
  zon.addEventListener('dragleave', handleDragLeave, false);
  zon.addEventListener('drop', add, false);
  zon.addEventListener('drop', handleDrop, false);
});