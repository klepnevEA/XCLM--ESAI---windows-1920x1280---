/**
 * [RUS] Реализация механизмов действий, основнных на классах
 * [ENG] Class defined actions
 */
var xclmActions = function()
{
	var that = this;
	
	this.attach = function()
	{
		
		
		$('#canvas .xclmAct').each(function() 
		{
            if ($(this).hasClass('xclmScrollableVContainer'))
            {
                that.actInstallVScroll();
            }

			/* Открыть pop-up */
			if ($(this).hasClass('xclmPopupOpen'))
			{
				$(this).bind('click touchstart',that.actPopupOpen);
			}
			
			/* Закрыть pop-up */
			if ($(this).hasClass('xclmPopupClose'))
			{
				$(this).bind('click touchstart',that.actPopupClose);
			}
			
			/* Установить следующий слайд в последовательности */
			if ($(this).hasClass('xclmSlideNext'))
			{
				that.actSlideNext($(this).attr('data-slide-next'));
			}

			/* Кнопка для перехода на произвольный слайд по имени */
			if ($(this).hasClass('xclmSlideGo'))
			{
				$(this).bind('click touchstart',that.actSlideGo);
			}

			/* Кнопка для перехода назад */
			if ($(this).hasClass('xclmSlideBack'))
			{
				$(this).bind('click touchstart',that.actSlideGoBack);
			}
			
			/* Скопировать хлебные крошки */
			if ($(this).hasClass('xclmBreadCrumbs'))
			{
				$('#xclmBreadCrumbs').html($(this).html());
				if ($(this).attr('data-menu-highlight') != 'undefined')
				{
					xclm.menu.removeHighlighted();
					xclm.menu.highlight($(this).attr('data-menu-highlight'));
				}
			}
			
			/* Кнопка для октрытия табов */
			if ($(this).hasClass('xclmTabOpen'))
			{
				$(this).bind('click touchstart',that.actTabOpen);
			}
			
			/* Отправка формы на сервер */
			if ($(this).hasClass('xclmFormSend'))
			{
				$(this).bind('click touchstart',that.actFormSend);
			}
		});
		
		window.setTimeout(that.startAnimation, 1);
		window.setTimeout(xclm.events.onAfterLoad, 2);
	}
	
	this.startAnimation = function()
	{
		$('#canvas article').addClass('xclmAnimationRun');
	}
	
	/**
	 * [RUS] Открыть вкладку
	 * [ENG] Open tab
	 */
	this.actTabOpen = function(e)
	{
		var elem = $('#'+$(this).attr('data-tab'));
		var tabGroup = elem.attr('data-tabgroup');
		$('div[data-tabgroup="'+tabGroup+'"]').each(function() {
			$(this).addClass('xclmHidden');
		});
		elem.removeClass('xclmHidden');
		e.preventDefault();
	}
	
	/**
	 * [RUS] Открыть popup
	 * [ENG] Open popup
	 */
	this.actPopupOpen = function(e)
	{
		$('#'+$(this).attr('data-popup')).removeClass('xclmHidden');
		e.preventDefault();
	}

	/**
	 * [RUS] Закрыть popup
	 * [ENG] Close popup
	 */	
	this.actPopupClose = function(e)
	{
		$('#'+$(this).attr('data-popup')).addClass('xclmHidden');
		e.preventDefault();
	}
	
	/**
	 * [RUS] Переход к слайду по имени
	 * [ENG] Follow to the slide identified by name
	 */	
	this.actSlideGo = function(e)
	{
		xclm.nav.go($(this).attr('data-slide-go'));
		e.preventDefault();
	}	

	this.actSlideGoBack = function(e)
	{
		xclm.nav.back();
		e.preventDefault();
	}

	/**
	 * [RUS] Изменить последовательность слайдов, установив следующий по системному названию
	 * [ENG] Change slides order and set next to go by system name
	 */
	this.actSlideNext = function(slideNext)
	{
		xclm.nav.addAfter(xclm.nav.currentSlide, slideNext);
	}
	
	/**
	 * [RUS] Отправка формы на сервер
	 * [ENG] Send form to server
	 */
	this.actFormSend = function()
	{
		//$(this).parent
	}

    this.actInstallVScroll = function()
    {
        console.log('action VScroll installed');
            var scroll = document.getElementsByClassName("xclmScrollableVContainer");

            var scrollStartPos=0;

            for(var i = 0, j=scroll.length; i<j; i++){

                scroll[i].addEventListener("touchstart", function(event) {

                    scrollStartPos=this.scrollTop+event.touches[0].pageY;

                },false);

                scroll[i].addEventListener("touchmove", function(event) {

                    this.scrollTop=scrollStartPos-event.touches[0].pageY;

                },false);
            };
        };
}
