$(document).ready(function () {

    var slides = scorm_content.slides
    var scorm_title = scorm_content.title
    var scorm_sections = scorm_content.sections
    var slide_count = slides.length
    var current_slide = 0;
    var slide_nextable = true
    var audio_auto_play = 1
    var audio_play_speed = 1
    var question_count = 0
    var question_right_count = 0
    var question_result = []
    var current_question = -1

    var check_question = function() {
        question_count = 0
        question_right_count = 0
        current_question = -1
        for ( i = 0; i < slide_count; i++ )
        {
            slide_data = slides[i].data
            for ( j = 0; j < slide_data.length; j++ ){
                data_item = slide_data[j]
                if ( data_item.type == 'sorting' || data_item.type == 'matching' || data_item.type == 'multichoice') {
                    question_result[question_count] = -1
                    question_count++
                }
            }
        }
    }

    $('.scorm-restart-btn').click(function(){
        check_question()
        current_slide = 0
        set_slide(current_slide)
    })

    var finish_lesson = function() {
        console.log(question_result)
        question_right_count = 0
        for( i = 0; i < question_count; i++ ) {
            if( question_result[i] == 1) {
                question_right_count++;
            }
        }
        pro = 100*question_right_count/question_count
        $('.question-result-text').html('' + question_right_count + '/' + question_count)
        $('.question-result-bar').css('width', ''+pro.toFixed(2)+'%')
        $('.question-result-pro').html('' + pro.toFixed(2)+'%')
        $('#finishModal').modal()
    }
    $('.scorm-down-btn').click(function () {
        if(!slide_nextable) return
        if (current_slide == slide_count - 1){
            console.log('23423432')
            finish_lesson()
            return
        }
        current_slide++
        set_slide(current_slide)
    });

    $('.scorm-up-btn').click(function () {
        if (current_slide == 0) return
        current_slide--
        set_slide(current_slide)
    });

    var set_slide = function (slide_no) {
        if(slide_no < 0) return
        slide_nextable = true
        console.log(slide_no)
        $('.slide-container').html('')

        var slide_content_data = slides[slide_no]
        var slide_type = slide_content_data.type
        var slide_data = slide_content_data.data
        var slide_data_count = slide_data.length
        var slide_content_wrap = slide_content_data.content
        $('.slide-container').html(slide_content_wrap)


        /**
         * Making Slide Content
         */

        var slide_element = ''
        for ( i = 0; i < slide_data_count; i++ ) {
            data_item = slide_data[i]
            data_type = data_item.type
            data_data = data_item.data

            /** Accordian */
            if (data_type == 'accordian') {
                acord_box = $('.accord-box')
                
                slide_element = 
                '<div class="accordion flex w-full flex-col items-start justify-between border border-solid text-left text-xl transition-all  rounded-xl" data-no-navigate="true" style="background-color: rgba(255, 82, 116, 0.1); border-color: rgba(255, 82, 116, 0.3);">'
                
                for ( i = 0; i < data_data.count; i++ ){
                    acccord_element = 
                    '<button class="w-full rounded-lg bg-transparent focus:outline-none focus:ring  focus:ring-white focus:ring-opacity-50"> <div class="flex w-full items-center justify-between p-4 text-left" style="color: white;"> <div class="whitespace-pre-wrap text-xl MuiBox-root css-0">'+data_data.accord[i].tag+'</div> <div variant="blend" tabindex="-1" class="p-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path> </svg></div> </div> </button> <div class="MuiCollapse-root MuiCollapse-vertical w-full MuiCollapse-entered css-c4sutr" style="min-height: 0px;"> <div class="MuiCollapse-wrapper MuiCollapse-vertical css-hboir5"> <div class="MuiCollapse-wrapperInner MuiCollapse-vertical css-8atqhb"> <div class="flex items-start justify-between p-4 pt-1 text-base"> <div class="whitespace-pre-wrap w-full break-words text-base MuiBox-root css-0">'+data_data.accord[i].exp+'</div> </div> </div> </div> </div>'
                    slide_element += acccord_element
                }
                slide_element += '</div>'
                acord_box.html(slide_element)
                $( ".accordion" ).accordion({
                    collapsible: true
                });
            }

            /** Sorting */
            if( data_type == 'sorting') {
                current_question = data_item.question_id
                slide_nextable = false
                sorting_box = $('.sorting-box')
                sorting_wrap = $('.sorting-wrap')
                sorting_card = $('.sorting-card')

                slide_element = ''

                for ( i = 0; i < data_data.data.length; i++ )
                {
                    drag_item = 
                    '<div class="absolute top-0 left-0 right-0 bottom-0 transition-all duration-300 z-[40]"><div class="absolute top-0 left-0 right-0 bottom-0"><div class="drag" drag-index="'+data_data.data[i].sort+'" role="button" tabindex="0" aria-disabled="false" aria-roledescription="draggable" aria-describedby="DndDescribedBy-0" style="opacity: 1;"><div style="opacity: 1; transform: none;"><div class="rounded-lg border bg-card text-card-foreground shadow-sm relative flex aspect-[4/3] w-[225px] flex-col items-center justify-center p-2 text-center"><div class=""><div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="my-2 mr-2 h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path></svg></div></div><div class="flex-grow"></div><div class="text-base">'+data_data.data[i].text+'</div><div class="flex-grow"></div><div class=" flex h-8 justify-center"></div><div class="absolute bottom-0 flex h-12 w-12 items-center justify-center"><div class="relative scale-0" style="transform: translateX(0px) translateY(0px) scale(0) rotate(0deg) translateZ(0px);"><div class="relative z-10 flex h-8 w-8 flex-none select-none items-center justify-center border-2 border-solid text-base rounded-full group" style="border-color: rgb(175, 45, 45); color: rgb(255, 255, 255); background: rgb(175, 45, 45);"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div></div></div></div></div></div></div></div>'

                    slide_element += drag_item
                }
                result_item = 
                '<div class="absolute top-0 left-0 right-0 bottom-0 flex aspect-[4/3] w-[225px] scale-95 flex-col items-center justify-center rounded-md border border-dashed" style="opacity: 1;"><div class="flex flex-col gap-4" style="opacity: 0;"><div class="font-bold match-result"  data-match="0" data-wrong="0" data-index="-1" >2/4 cards correct</div><button class="retry-btn inline-flex bg-transparent items-center gap-2 justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-white/10 hover:bg-gray-500/10 dark:text-white h-10 px-4 py-2">Retry</button></div></div></div>'
                slide_element += result_item

                sorting_wrap.html(slide_element)

                slide_element = '<div class="flex w-full flex-wrap justify-center gap-4 md:grid-cols-3 lg:grid-cols-4">'
                for ( i = 0; i < data_data.sorting.length; i++ ) {
                    drop_item = 
                    '<button class="dropzone relative w-[calc(50%-8px)] cursor-default bg-transparent md:w-[250px]" tabindex="2" drag-index="'+data_data.sorting[i].id+'"><div class="relative" style="opacity: 1;"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all flex aspect-[5/4] h-full items-center text-center"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 flex aspect-[5/4] h-full items-center text-center" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all flex aspect-[5/4] h-full items-center text-center" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="h-full w-full overflow-hidden overflow-ellipsis text-sm md:text-lg" style="align-content: center">'+data_data.sorting[i].text+'</div></div></div></div></div></button>'
                    slide_element += drop_item
                }
                slide_element += '</div>'
                sorting_card.html(slide_element)

                make_draggable()
            }

            /** Card */
            if (data_type == 'card') {
                card_box = $('.card-box')
                slide_element = ''
                for (i = 0; i < data_data.count; i++ ) {
                    card_element = 
                    '<div class="relative w-full p-2 sm:w-[275px]"><div data-no-navigate="true" class="relative flex aspect-square w-full flex-col items-center justify-center text-center"><div class="flip-card h-full w-full bg-transparent" style="perspective: 1000px;"><div class="flip-card-inner relative h-full w-full rounded-xl text-center transition-all  shadow-lg" style=""><div class="flip-card-front absolute h-full w-full overflow-hidden rounded-xl bg-white text-black pointer-events-auto" style="background: rgba(255, 82, 116, 0.1); color: rgb(255, 255, 255);"><div class="absolute top-0 left-0 right-0 h-3" style="background: rgb(255, 82, 116);"></div><div class="absolute bottom-0 left-0 right-0 z-10 flex w-full justify-between p-2"><button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeMedium css-1deacqj" tabindex="0" type="button"  style="background:transparent"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path></svg><span class="MuiTouchRipple-root css-w0pj6f"></span></button></div><div class="pointer-events-auto absolute flex h-full w-full items-center justify-center overflow-auto rounded-xl border border-solid p-4 py-8" style="background-color: rgba(255, 82, 116, 0.1); border-color: rgba(255, 82, 116, 0.3);"><div class="absolute top-0 left-0 bottom-0 right-0 overflow-auto"><div class="relative flex min-h-full w-full items-center  p-2 py-10"><div class="whitespace-pre-wrap w-full text-center text-2xl MuiBox-root css-0">'+data_data.card[i].front+'</div></div></div></div></div><div class="absolute flex h-full w-full items-center justify-center rounded-xl border-2 border-solid border-gray-800/20 bg-white p-4 text-black pointer-events-none flip-card-back"><div class="absolute top-0 left-0 bottom-0 right-0 overflow-auto"><div class="relative flex min-h-full w-full items-center  p-2 py-10"><div class="whitespace-pre-wrap w-full  text-center text-lg MuiBox-root css-0">'+data_data.card[i].back+'</div></div></div><div class="pointer-events-auto absolute bottom-0 left-0 right-0 z-10 flex w-full justify-between p-2"><button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit MuiIconButton-sizeMedium css-1deacqj" tabindex="0" type="button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path></svg><span class="MuiTouchRipple-root css-w0pj6f"></span></button></div></div></div></div></div></div>'
                    slide_element += card_element
                }
                slide_element += ''            
                card_box.html(slide_element)
                $('.flip-card-inner').click(function(){
                    console.log('12312312')
                    $(this).toggleClass('flipped');
                });
            }

            /** Multichoice */
            if( data_type == 'multichoice' ) {
                current_question = data_item.question_id
                slide_nextable = false
                multichoice_box = $('.multichoice-box')
                $('.choice-check').html('<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" aria-hidden=\"true\" class=\"h-5 w-5 stroke-2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5\"></path></svg>Check')
                slide_element = ''

                for ( i = 0; i < data_data.count; i++ ){
                    choice_element = 
                    '<div><button tabindex="2" data-index="'+data_data.choice[i].id+'" class="choice-btn hover:border-3 focused:border-4 group relative flex w-full flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer"><div class="choice-back absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-[0.15]" style="background: rgb(255, 82, 116);"></div><div class="choice-border absolute top-0 left-0 right-0 bottom-0 rounded-md border border-solid opacity-60" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex w-full items-center gap-2"><div class="choice-id-display relative z-10 flex h-8 w-8 flex-none select-none items-center justify-center border-2 border-solid text-base rounded-full group" style="border-color: rgb(255, 82, 116); color: rgb(255, 82, 116); background: transparent;"><span class="font-semibold">'+(i+1)+'</span></div><div class="choice-text flex-grow" style="color: rgb(255, 255, 255);"><div class="MuiTypography-root MuiTypography-body1 w-full font-semibold css-p1nhi4"><div class="DraftEditor-root"><div class="DraftEditor-editorContainer"><div class="public-DraftEditor-content" contenteditable="false" spellcheck="false" style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"><div data-contents="true">'+data_data.choice[i].text+'</div></div></div></div></div></div></div></button></div>'

                    slide_element += choice_element
                }


                multichoice_box.html(slide_element)
                
                $('.choice-btn').click(function(){
                    if( $('.choice-check').text() == 'Next' )
                        return
                    $('.choice-id-display').css('background', 'transparent')
                    $('.choice-id-display').css('color', 'rgb(255, 82, 116)')
                    $(this).find('.choice-id-display').css('background', 'rgb(255, 82, 116)')
                    $(this).find('.choice-id-display').css('color', 'rgb(0, 0, 0)')

                    $('button.choice-btn[data-selected]').removeAttr('data-selected')
                    
                    $(this).attr('data-selected', '1')
                    $('.choice-check').removeAttr('disabled')
                })

                $('.choice-check').click(function(){
                    if( $(this).text() == 'Next') {
                        $('.scorm-down-btn').click()
                    }
                    slide_content = data_data
                    sel_item = $('button.choice-btn[data-selected][data-index]')
                    sel_id = parseInt($(sel_item).attr('data-index'))
                    console.log(slide_content.value)
                    sel_item.find('.choice-back').css('background', 'rgb(255, 255, 255)')
                    sel_item.find('.choice-border').css('border-color', 'black')
                    sel_item.find('.choice-back').css('opacity', '1')
                    sel_item.find('.choice-text').css('color', 'black')
                    
                    console.log('current_question', current_question)
                    if( question_result[current_question] == -1){
                        if( slide_content.value == sel_id ){
                            question_result[current_question] = 1
                        } else {
                            question_result[current_question] = 0
                        }
        
                    }
                    if( slide_content.value == sel_id) {
                        
                        sel_item.find('.choice-id-display').css({'border-color': 'rgb(78, 124, 71)', 'color': 'rgb(255, 255, 255)', 'background': 'rgb(78, 124, 71)'})
                        sel_item.find('.choice-id-display').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>')
                    } else {
                        sel_item.find('.choice-id-display').css({'border-color': 'rgb(175, 45, 45)', 'color': 'rgb(255, 255, 255)', 'background': 'rgb(175, 45, 45)'})
                        sel_item.find('.choice-id-display').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>')
                    }
                    choice_items = $('button.choice-btn[data-index]:not([data-selected])')
                    for( i = 0; i < choice_items.length; i++ ){
                        if( parseInt($(choice_items[i]).attr('data-index')) != slide_content.value) {
                            $(choice_items[i]).find('.choice-id-display').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>')
                        } else {
                            $(choice_items[i]).find('.choice-id-display').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>')
                        }
                    }
                    $(this).html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path></svg>Next')
                    $(this).attr('data-checked', '1')
                    slide_nextable = true
                })
            }

            /** Matching */
            if( data_type == 'matching') {
                current_question = data_item.question_id
                slide_nextable = false
                matching_box = $('.matching-box')
                $('.matching-check').html('<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" aria-hidden=\"true\" class=\"h-5 w-5 stroke-2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5\"></path></svg>Check')
                slide_element = ''

                for ( i = 0; i < data_data.count; i++ ){
                    match_item = 
                    '<div class="grid grid-cols-2 gap-4"><button tabindex="2" class="match-first" style="background: transparent;"><div role="button" tabindex="-1" aria-disabled="false" aria-roledescription="draggable" aria-describedby="DndDescribedBy-1" style="opacity: 1;"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center overflow-hidden"><div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="my-2 mr-2 h-5 w-5 rotate-90"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path></svg></div><div class="relative flex flex-shrink items-center overflow-hidden"><div class="min-h-0 max-w-full break-words text-left text-base">'+data_data.matches[i].first+'</div></div><div></div></div></div></div></div></div></button><div class="relative" style="opacity: 1;"><button class="match-second w-full bg-transparent" tabindex="-1"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center justify-start"><div class="min-h-0 overflow-hidden break-words text-left text-base">'+data_data.matches[i].second+'</div></div></div></div></div></button></div></div>'
                    slide_element += match_item
                }

                matching_box.html(slide_element)
                matching_box.addClass('match-container')
                matching_box.attr('data-retry', '0')
                
                $('.match-first').click(function(){
                    make_matching_first(this)
                    
                })
                $('.match-second').click(function(){
                    make_matching_second(this, data_data)
                })

                $('button.matching-check').click(function(){
                    slide_nextable = true
                    if($(this).text() == 'Next'){
                        current_slide++
                        set_slide(current_slide)
                        return
                    }
                    $('.match-container').attr('data-retry', "1")
                    $('button.matching-check').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path></svg>Next')
                    var first_match = $('.match-first')
                    
                    match_right_count = 0
                    for ( i = 0; i < first_match.length; i++ ){
                        var wrap_element = $(first_match[i]).parent().parent().parent()
                        var first_text = $(first_match[i]).text()
                        var second_text = wrap_element.find('.match-second:first').text()
                        
                        console.log("First Text " + slide_content.count);
                        console.log("Second Text " + second_text);
                        matching_element = ''
                        this_element_html = ''
                        slide_content = slides[current_slide].data
                        for ( j = 0; j < data_data.count; j++ ) {
                            if( data_data.matches[j].first == first_text) {
                                if ( data_data.matches[j].second == second_text ){
                                    matching_element = 
                                    '<div class="relative z-10 flex h-8 w-8 flex-none select-none items-center justify-center border-2 border-solid text-base rounded-full group" style="border-color: rgb(78, 124, 71); color: rgb(255, 255, 255); background: rgb(78, 124, 71);"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg></div>'
                                    match_right_count++;
                                } else {
                                    matching_element = 
                                    '<div class="relative z-10 flex h-8 w-8 flex-none select-none items-center justify-center border-2 border-solid text-base rounded-full group" style="border-color: rgb(175, 45, 45); color: rgb(255, 255, 255); background: rgb(175, 45, 45);"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div>'
                                }
                                break
                            }
                        }
                        this_element_html = 
                        '<div></div><div class="relative" style="opacity: 1;"><div class="match-first absolute top-0 left-0 right-0 bottom-0 -translate-x-full"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer rounded-r-none h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-100 rounded-r-none h-16" style="background: rgb(255, 255, 255);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all rounded-r-none h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: black;"><div class="relative w-full"><div class="flex items-center gap-2"><div class="flex items-center">'+matching_element+'</div><div class="flex flex-shrink items-center overflow-hidden"><div class="min-h-0 max-w-full break-words text-base">'+first_text+'</div></div></div></div></div></div></div><button class="match-second w-full bg-transparent" tabindex="-1"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer rounded-l-none h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 rounded-l-none h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all rounded-l-none h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center justify-start"><div class="min-h-0 overflow-hidden break-words text-left text-base">'+second_text+'</div></div></div></div></div></button></div>'
                        wrap_element.html(this_element_html)

                    }
                    if( question_result[current_question] == -1){
                        if( match_right_count == first_match.length){
                            question_result[current_question] = 1
                        } else {
                            question_result[current_question] = 0
                        }

                    }
                    
                    $('button.match-first').off()
                    $('button.match-second').off()
                    $('button.match-first').click(function(){
                        make_matching_first(this)
                        
                    })
                    $('button.match-second').click(function(){
                        make_matching_second(this, data_data)
                    })
                })
            }

        }

        audio_element = $('.audio-panel')
        $('.audio-source').attr('src', 'scorm/' + slide_content_data.audio.src)
        if(slide_content_data.audio.src == '') {
            audio_element.hide()
        } else {
            $('.audio-clip').attr('src', 'scorm/' + slide_content_data.audio.src)
            audio_element.show()
            $('.audio-progress').css('width', 0)
            if( audio_auto_play == 0){
                $('.audio-play-btn').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[2px]"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path></svg>')
                $('.audio-play-btn').attr('audio-playing', '0')
            } else {
                document.getElementById('audio-clip').play()
                $('.audio-play-btn').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[2px]"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>')
                $('.audio-play-btn').attr('audio-playing', '1')
            }
        }

        $('button:contains("Begin")').click(function(){
            $('.scorm-down-btn').click()
        })
        return
    }
    $(function () {
        $(".accordion").accordion({
            collapsible: true
        });
    });
    
    var check_sorting_status = function () {
        var match_count = parseInt($('.match-result').attr('data-match'))
        var wrong_count = parseInt($('.match-result').attr('data-wrong'))
        var drag_count = $('.drag').length
        if( drag_count == 0) {
            $('.match-result').html('' + (match_count - wrong_count) + '/' + match_count + ' cards correct')
            $('.match-result').css('opacity', '1')
            $('.match-result').parent().css('opacity', '1')

            if( question_result[current_question] == -1){
                if( wrong_count == 0){
                    question_result[current_question] = 1
                } else {
                    question_result[current_question] = 0
                }

            }
            slide_nextable = true
        }

    }

    var make_draggable = function() {
        $('.retry-btn').click(function(){
            set_slide(current_slide)
        })
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
                    console.log('not match')
                    var newDiv = $('<div class="wrong-circle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div>');
                    $(ui.draggable).append(newDiv);
                    newDiv.animate({ width: '30px', height: '30px', opacity: 1 }, 300, function () {
                        setTimeout(function () {
                            newDiv.remove()
                            $(ui.draggable).animate({ top: 0, left: 0 }, 300, function () {
                                if( $('.match-result').attr('data-index') != draggableId) {
                                    $('.match-result').attr('data-wrong', parseInt($('.match-result').attr('data-wrong')) + 1)
                                    
                                }
                                $('.match-result').attr('data-index', draggableId)
                            });
                        }, 500); // Delay of 2000 milliseconds (adjustable)
                    });
                }
                else {
                    console.log('match')
                    var newDiv = $('<div class="right-circle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg></div>');
                    $(ui.draggable).append(newDiv);
                    newDiv.animate({ width: '30px', height: '30px', opacity: 1 }, 300, function () {
                        setTimeout(function () {
                            $(ui.draggable).animate({ opacity: 0 }, 300, function () {
                                $('.match-result').attr('data-match', parseInt($('.match-result').attr('data-match')) + 1)
                                $('.match-result').attr('data-index', draggableId)
                                $(ui.draggable).parent().parent().remove()
                                check_sorting_status()
                            });
                        }, 500); // Delay of 2000 milliseconds (adjustable)
                    });
                }
            }
        })
    }
    var make_matching_first = function(obj) {
        console.log($(obj).text())
        $('.match-selected').css('background-color', 'transparent')
        $('.match-selected').removeClass('match-selected')
        $(obj).addClass('match-selected')
        $(obj).css('background-color', 'rgba(255, 82, 116, 0.25)')
    }
    var make_matching_second = function(obj, data_data) {
        var selected_first = $('.match-selected')
        if( selected_first.length != 0) {
            orig_first_text = $(obj).parent().parent().find('.match-first:first').text();
            orig_element = $(selected_first[0]).parent()
            orig_second_text = orig_element.find('.match-second:first').text();
            if(orig_element.hasClass('absolute')){
                orig_second_text = orig_element.parent().find('.match-second:first').text();
            }
            
            first_text = $(selected_first[0]).text()
            second_text = $(obj).text()

            matching_element = ''
            match_first_check = ''
            this_element_html = ''
            slide_content = slides[current_slide].data
            first_time = parseInt($('.match-container').attr('data-retry'))
            if(first_time == 1) {
                for ( i = 0; i < data_data.count; i++ ) {
                    if( data_data.matches[i].first == first_text) {
                        console.log(data_data.matches[i])
                        if ( data_data.matches[i].second == second_text ){
                            matching_element = 
                            '<div class="relative z-10 flex h-8 w-8 flex-none select-none items-center justify-center border-2 border-solid text-base rounded-full group" style="border-color: rgb(78, 124, 71); color: rgb(255, 255, 255); background: rgb(78, 124, 71);"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg></div>'
                        } else {
                            matching_element = 
                            '<div class="relative z-10 flex h-8 w-8 flex-none select-none items-center justify-center border-2 border-solid text-base rounded-full group" style="border-color: rgb(175, 45, 45); color: rgb(255, 255, 255); background: rgb(175, 45, 45);"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[3px]"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div>'
                        }
                        break
                    }
                }
                this_element_html = 
                '<div></div><div class="relative" style="opacity: 1;"><div class="match-first absolute top-0 left-0 right-0 bottom-0 -translate-x-full"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer rounded-r-none h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-100 rounded-r-none h-16" style="background: rgb(255, 255, 255);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all rounded-r-none h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: black;"><div class="relative w-full"><div class="flex items-center gap-2"><div class="flex items-center">'+matching_element+'</div><div class="flex flex-shrink items-center overflow-hidden"><div class="min-h-0 max-w-full break-words text-base">'+first_text+'</div></div></div></div></div></div></div><button class="match-second w-full bg-transparent" tabindex="-1"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer rounded-l-none h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 rounded-l-none h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all rounded-l-none h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center justify-start"><div class="min-h-0 overflow-hidden break-words text-left text-base">'+second_text+'</div></div></div></div></div></button></div>'
            } else {
                this_element_html = 
                '<div></div><div class="relative" style="opacity: 1;"><div class="absolute top-0 left-0 right-0 bottom-0 -translate-x-full"><button tabindex="2" class="match-first w-full" style="background: transparent;"><div role="button" tabindex="-1" aria-disabled="false" aria-roledescription="draggable" aria-describedby="DndDescribedBy-1" style="opacity: 1;"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer rounded-r-none h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 rounded-r-none h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all rounded-r-none h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center overflow-hidden"><div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="my-2 mr-2 h-5 w-5 rotate-90"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path></svg></div><div class="relative flex flex-shrink items-center overflow-hidden"><div class="min-h-0 max-w-full break-words text-left text-base">'+first_text+'</div></div><div></div></div></div></div></div></div></button></div><button class="match-second w-full bg-transparent" tabindex="-1"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer rounded-l-none h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 rounded-l-none h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all rounded-l-none h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center justify-start"><div class="min-h-0 overflow-hidden break-words text-left text-base">'+second_text+'</div></div></div></div></div></button></div>'
            }

            
            $(obj).parent().parent().html(this_element_html)

            
            if(orig_second_text != second_text){
                console.log('second_text ' + orig_second_text)
                console.log("Orig First", orig_first_text)
                orig_element_html = 
                '<button tabindex="2" class="match-first" style="background: transparent;"><div role="button" tabindex="-1" aria-disabled="false" aria-roledescription="draggable" aria-describedby="DndDescribedBy-1" style="opacity: 1;"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center overflow-hidden"><div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="my-2 mr-2 h-5 w-5 rotate-90"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path></svg></div><div class="relative flex flex-shrink items-center overflow-hidden"><div class="min-h-0 max-w-full break-words text-left text-base">'+orig_first_text+'</div></div><div></div></div></div></div></div></div></button><div class="relative" style="opacity: 1;"><button class="match-second w-full bg-transparent" tabindex="-1"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center justify-start"><div class="min-h-0 overflow-hidden break-words text-left text-base">'+orig_second_text+'</div></div></div></div></div></button></div>'
                if(orig_element.hasClass('absolute')){
                    orig_element.parent().parent().html(orig_element_html)
                } else {
                    orig_element.html(orig_element_html)
                }
                    
            }

            



        }
        else {
            orig_first_text = $(obj).parent().parent().find('.match-first:first').text();
            second_text = $(obj).text()
            orig_element_html = 
            '<button tabindex="2" class="match-first" style="background: transparent;"><div role="button" tabindex="-1" aria-disabled="false" aria-roledescription="draggable" aria-describedby="DndDescribedBy-1" style="opacity: 1;"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center overflow-hidden"><div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="my-2 mr-2 h-5 w-5 rotate-90"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"></path></svg></div><div class="relative flex flex-shrink items-center overflow-hidden"><div class="min-h-0 max-w-full break-words text-left text-base">'+orig_first_text+'</div></div><div></div></div></div></div></div></div></button><div class="relative" style="opacity: 1;"><button class="match-second w-full bg-transparent" tabindex="-1"><div class="hover:border-3 focused:border-4 group relative flex flex-col items-start gap-2 rounded-md border-none bg-transparent p-3 text-xl transition-all cursor-pointer h-16"><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border transition-all group-aria-selected:border-solid opacity-10 group-hover:opacity-20 h-16" style="background: rgb(255, 82, 116);"></div><div class="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-md border border-solid opacity-60 transition-all h-16" style="border-color: rgba(255, 82, 116, 0.3);"></div><div class="relative z-10 flex h-full w-full items-center" style="color: rgb(255, 255, 255);"><div class="relative w-full"><div class="flex items-center justify-start"><div class="min-h-0 overflow-hidden break-words text-left text-base">'+second_text+'</div></div></div></div></div></button></div>'
            $(obj).parent().parent().html(orig_element_html)
        }

        /** Check Whether Finish */
        var cancheck = true;
            
        var first_match = $('.match-first')
        for ( i = 0; i < first_match.length; i++ ){
            if($(first_match[i]).parent().hasClass('grid')) {
                cancheck = false
                break
            }
        }
        if(cancheck) {
            $('button.matching-check').removeAttr('disabled')
        } else {
            $('button.matching-check').attr('disabled',"true")
        }

        $('button.match-first').off()
        $('button.match-second').off()
        $('button.match-first').click(function(){
            make_matching_first(this)
            
        })
        $('button.match-second').click(function(){
            make_matching_second(this, data_data)
        })
        console.log($(obj).text())
    }

    $('#audio-setting-btn').click(function(){
       
    })

    $('.audio-play-btn').click(function(){
        playing = parseInt($(this).attr('audio-playing'))
        if(!playing) {
            document.getElementById('audio-clip').play()
            // $('.audio-clip').play()
            $(this).html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[2px]"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg>')
            $(this).attr('audio-playing', '1')
        } else {
            document.getElementById('audio-clip').pause()
            $(this).html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[2px]"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path></svg>')
            $(this).attr('audio-playing', '0')
        }
    })
    document.getElementById('audio-clip').addEventListener("timeupdate", function() {
        var currentTime = this.currentTime;
        var duration = this.duration;
        var progressPercent = (currentTime / duration) * 100;
        if( currentTime == duration ){
            $('.audio-play-btn').html('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 stroke-[2px]"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path></svg>')
            $('.audio-play-btn').attr('audio-playing', '0')
            progressPercent = 0
        }
        $('.audio-progress').css('width', progressPercent)
      });

    $('.audio-autoplay-btn').click(function(){
        $('.audio-autoplay-btn').attr('data-state', 'inactive')
        $(this).attr('data-state', 'active')
        audio_auto_play = parseInt($(this).attr('data-index'))
        // localStorage.setItem("ivan_scorm_audio_autoplay", parseInt($(this).attr('data-index')));
    })
    $('.audio-speed-btn').click(function(){
        $('.audio-speed-btn').attr('data-state', 'inactive')
        $(this).attr('data-state', 'active')
        document.getElementById('audio-clip').playbackRate  = parseInt($(this).attr('data-index')) / 100
        // localStorage.setItem("ivan_scorm_audio_speed", parseInt($(this).attr('data-index')) / 100);
    })
    $('.audio-autoplay-btn').attr('data-state', 'inactive')
    $('.audio-autoplay-btn[data-index="'+audio_auto_play+'"]').attr('data-state', 'active')
    
    $('.audio-speed-btn').attr('data-state', 'inactive')
    $('.audio-speed-btn[data-index="'+parseInt(audio_play_speed*100)+'"]').attr('data-state', 'active')
    document.getElementById('audio-clip').playbackRate  = audio_play_speed

    // Set Menu
    var set_menu = function(){
        console.log(scorm_title)
        $('.menu-title').html(scorm_title)

        section_group = ''
        for( i = 1; i < scorm_sections.length; i++ ) {
            section_group += '<button class="section-btn flex w-full items-center bg-white p-4 py-3 text-sm transition-all hover:bg-gray-100" style="border-color: rgb(0, 0, 0);" section-no="'+scorm_sections[i].slide_no+'"><div class="w-full truncate text-left text-lg" data-dismiss="modal">'+ scorm_sections[i].text+'</div></button>'
        }
        $('.section-button-group').html(section_group)

        $('.section-btn').click(function(){
            current_slide = $(this).attr('section-no')
            set_slide($(this).attr('section-no'))
        })
    }

    set_menu()
    check_question()
    $('.scorm-title-text').html(scorm_title)
    $('.audio-source').attr('src', 'scorm/' + slides[0].audio.src)
    set_slide(0)
    // $('.scorm-down-btn').click()
});

