$('.drag-pre').on('mousedown', function() {
    var position = $(this).offset();
  
    console.log('Left: ' + position.left);
    console.log('Top: ' + position.top);
    var drag_element = $('<div class="drag" style="position:fixed; width:100px; height:200px; top:'+position.top+'; left:'+position.left+'; z-index:999;border:1px solid; background-color:rgb(0,0,0)"></div>')

    var cssProperties = $(this).css(['color', 'border', 'width', 'height']);
    drag_element.css(cssProperties);
    $(this).css('opacity', 0)
    $(drag_element).draggable({
        appendTo: 'body',
        revert: function (droppable) {
            console.log(droppable)
            if (droppable === false) {
                return true
            }
            return false
        }
    }).trigger('dragstart');
    $('.drag-region').children().eq(2).before(drag_element);
    
});

$('.drag').draggable({
    appendTo: 'body',
    revert: function (droppable) {
        console.log(droppable)
        if (droppable === false) {
            return true
        }
        return false
    }
});

$('.dropzone').droppable({
    drop: function (event, ui) {
        // var draggableId = ui.draggable.hide();
        var draggableId = ui.draggable.attr("drag-index");
        var thisId = $(this).attr("drag-index");
        if (thisId != draggableId) {
            var newDiv = $('<div class="wrong-circle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div>');
            $(ui.draggable).append(newDiv);
            newDiv.animate({ width: '30px', height: '30px', opacity: 1 }, 300, function () {
                setTimeout(function () {
                    newDiv.remove()
                    $(ui.draggable).animate({ top: 0, left: 0 }, 300, function () {
                        $(ui.draggable).parent().attr('data-wrong', '1')
                    });
                }, 500); // Delay of 2000 milliseconds (adjustable)
            });
        }
        else {
            var newDiv = $('<div class="right-circle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg></div>');
            $(ui.draggable).append(newDiv);
            newDiv.animate({ width: '30px', height: '30px', opacity: 1 }, 300, function () {
                setTimeout(function () {
                    $(ui.draggable).animate({ opacity: 0 }, 300, function () {
                        $(ui.draggable).parent().attr('data-match', '1')
                        $(ui.draggable).remove()
                        check_sorting_status()
                    });
                }, 500); // Delay of 2000 milliseconds (adjustable)
            });
        }
    }
})