var timeline;
        var data;

        google.load("visualization", "1");

        // Set callback to run when API is loaded
        google.setOnLoadCallback(drawVisualization);

        // Called when the Visualization API is loaded.
        function drawVisualization() {
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
                'height': "300px",
                'editable': true, // make the events dragable
                'layout': "box"
            };

            // Instantiate our timeline object.
            timeline = new links.Timeline(document.getElementById('mytimeline'), options);

            // Make a callback function for the select event
            var onselect = function (event) {
                var row = undefined;
                var sel = timeline.getSelection();
                if (sel.length) {
                    if (sel[0].row != undefined) {
                        var row = sel[0].row;
                    }
                }

                if (row != undefined) {
                    var content = data.getValue(row, 2);
                    document.getElementById("txtContent").value = content;
                    document.getElementById("info").innerHTML += "event " + row + " selected<br>";

                }
            };

            // callback function for the change event
            var onchange = function () {
                var sel = timeline.getSelection();
                if (sel.length) {
                    if (sel[0].row != undefined) {
                        var row = sel[0].row;
                        document.getElementById("info").innerHTML += "event " + row + " changed<br>";
                    }
                }
            };

            // callback function for the delete event
            var ondelete = function () {
                var sel = timeline.getSelection();
                if (sel.length) {
                    if (sel[0].row != undefined) {
                        var row = sel[0].row;
                        document.getElementById("info").innerHTML += "event " + row + " deleted<br>";
                    }
                }
            };

            // callback function for the add event
            var onadd = function () {
                var count = data.getNumberOfRows();
                document.getElementById("info").innerHTML += "event " + (count-1) + " added<br>";
            };

            // Add event listeners
            google.visualization.events.addListener(timeline, 'select', onselect);
            google.visualization.events.addListener(timeline, 'change', onchange);
            google.visualization.events.addListener(timeline, 'delete', ondelete);
            google.visualization.events.addListener(timeline, 'add', onadd);

            // Draw our timeline with the created data and options
            timeline.draw(data);
        }

        /**
         * Add a new event
         */
        function add() {
            var range = timeline.getVisibleChartRange();
            var start = new Date((range.start.valueOf() + range.end.valueOf()) / 2);
            //var content = document.getElementById("txtContent").value;

            timeline.addItem({
                'start': start,
                'content': 'new'
            });

            var count = data.getNumberOfRows();
            timeline.setSelection([{
                'row': count-1
            }]);
        }

        /**
         * Change the content of the currently selected event
         */
        function change() {
            // retrieve the selected row
            var sel = timeline.getSelection();
            if (sel.length) {
                if (sel[0].row != undefined) {
                    var row = sel[0].row;
                }
            }

            if (row != undefined) {
                var content = document.getElementById("txtContent").value;
                timeline.changeItem(row, {
                    'content': content
                    // Note: start, end, and group can be added here too.
                });
            } else {
                alert("First select an event, then press remove again");
            }
        }

        /**
         * Delete the currently selected event
         */
        function doDelete() {
            // retrieve the selected row
            var sel = timeline.getSelection();
            if (sel.length) {
                if (sel[0].row != undefined) {
                    var row = sel[0].row;
                }
            }

            if (row != undefined) {
                timeline.deleteItem(row);
            } else {
                alert("First select an event, then press remove again");
            }
        }
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
  //zon.addEventListener('dragend', handleDragEnd, false);
});

/*interact('.slider')                   // target the matches of that selector
  .origin('self')                     // (0, 0) will be the element's top-left
  .restrict({drag: 'self'})           // keep the drag within the element
  .inertia(true)                      // start inertial movement if thrown
  .draggable({                        // make the element fire drag events
    max: Infinity                     // allow drags on multiple elements
  })
  .on('dragmove', function (event) {  // call this function on every move
    var sliderWidth = interact.getElementRect(event.target.parentNode).width,
        value = event.pageX / sliderWidth;

    event.target.style.paddingLeft = (value * 100) + '%';
    event.target.setAttribute('data-value', value.toFixed(2));
  });

interact.maxInteractions(Infinity);   // Allow multiple interactions*/
    


/*    // target elements with the "draggable" class
interact('.draggable')
    .draggable({
// enable inertial throwing
        snap: {
            targets: [
                interact.createSnapGrid({ x: 30, y: 30 })
            ],
            range: 500,
            relativePoints: [ { x: 0, y: 0 } ],
            //endOnly: true
        },
        inertia: true,
// keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
// enable autoScroll
        autoScroll: true,

// call this function on every dragmove event
        onmove: dragMoveListener,
// call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');

            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(event.dx * event.dx +
                            event.dy * event.dy)|0) + 'px');
        }
});

function dragMoveListener (event) {
    var textEl = event.target.querySelector('p');

    var target = event.target,
// keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '#yes-drop',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    draggableElement.textContent = 'Dragged in';

    //draggableElement.snap.range

  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = 'Dropped';
    //event.relatedTarget.restriction = {left:10000,right: 100000,top : 0,bottom: 0};
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});
// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;    */
