/**
 * [RUS] Система навигации слайдов
 * [ENG] Slide navigation system
 */
var xclmNav = function()
{
	var that = this;
	/**
	 * [RUS] Текущий отображаемый слайд (по названию и по индексу в массиве)
	 * [ENG] Current slide displayed (by name and index in array)
	 */
	this.currentSlide = false;
	this.currentSlideId = false;
	this.prevSlide = false;
	this.slideInfo = {};
	
	/**
	 * [RUS] Описание порядка слайдов и структуры навигации
	 * [ENG] Slide order and navigation description
	 */
	this.workflow = [];
	
	/**
	 * [RUS] Установить последовательность слайдов и отображение в меню
	 * [ENG] Set slide show order and menu visualisation
	 */
	this.createWorkflow = function(workflow)
	{
		that.workflow = workflow;
		for (var i in that.workflow)
		{
			xclm.stat.registerSlide(that.workflow[i]['name']);
		}
	}
	
	this.addWorkflow = function(element, num, total, crumbs)
	{
		if (element.go == undefined)
			return false;
		
		var name = element.go;
		
		element.name = name;
		element.number = num;
		element.total = total;
		element.crumbs = crumbs.slice();
		
		that.workflow[that.findSlideIdByName(name)] = element;
	}
	
	/**
	 * Перейти к слайду по порядковому номеру в последовательности
	 */
	this.goByIndex = function(slideNumber)
	{
//		console.log('Go by id to slide '+slideNumber);
		console.log()
		var slideName = that.workflow[slideNumber]['name'];
		that.go(slideName);
	}
	
	/**
	 * [RUS] Перейти к нужному слайду по его системному названию
	 * [ENG] Go to the slide defined by it's system name
	 */
	this.go = function(slideName)
	{
		xclm.profiling.start('slideload', {slideName: slideName});
		$('#canvas').load(xclm.pathToSlides+slideName+'/slide.html', that.slideLoaded);
		
		if (that.currentSlide != false)
			xclm.events.onLeave(that.currentSlide);
		
		/* xclm.events.onSlideEnter(slideName);*/
		xclm.events.onBeforeLoad(slideName);

		that.prevSlide = that.currentSlide;
		that.currentSlide = slideName;
		that.currentSlideId = that.findSlideIdByName(slideName);
		that.slideInfo = that.workflow[that.currentSlideId];
	}

	this.back = function()
	{
		if (that.prevSlide != false)
			that.go(that.prevSlide);
	}
	
	this.slideLoaded = function(responseText, textStatus, XMLReq)
	{
		if (textStatus == 'error')
		{
			$('#canvas').load('core/templates/noslide.html')
		}
		else
		{
			// Подсвечиваем пункты меню и создаем хлебные крошки
/*			if (xclm.config.showBreadCrumbs == true)
				var ul = document.createElement('ul');
			
			xclm.menu.removeHighlighted();			
			if (that.slideInfo != undefined)
				for (var i in that.slideInfo['crumbs'])
				{
					xclm.menu.highlight(that.slideInfo['crumbs'][i]['go']);
					if (xclm.config.showBreadCrumbs == true)
					{
						var li = document.createElement('li');
						li.innerHtml = that.slideInfo['crumbs'][i]['title'];
						ul.appendChild(li);
					}
				}
			
			if (xclm.config.showBreadCrumbs == true)
			{
				var crumbs = document.getElementById('xclmBreadCrumbs');
				var prevul = crumbs.getElementsByTagName('ul');
				crumbs.removeChild(prevul);
				crumbs.appendChild(ul);
			}
			
			// Вешаем обработчики событий */
			xclm.actions.attach();
		}
	}
	
	/**
	 * [RUS] Найти номер слайда в последовательности по ID
	 * [ENG] Find slide id by slide name
	 */
	this.findSlideIdByName = function(slideName)
	{
		for (var index in that.workflow) 
		{
			if (that.workflow[index]['name'] == slideName)
			{
				return index;
			}
		}
		return false;
	}
	
	/**
	 * [RUS] Перейти к следующему слайду в последовательности
	 * [ENG] Follow to the next slide in workflow
	 */
	this.goNext = function(mark)
	{
		// Проверка на переопределение порядка слайдов
		var art = $('article');
		if (art.attr('data-slide-next') != undefined)
		{
			that.go(art.attr('data-slide-next'));
			return true;
		}
		
		that.currentSlideId++;
		
		if (that.currentSlideId > that.workflow.length-1)
		{
			that.currentSlideId = that.workflow.length-1;
			// TODO Presentation ends
		}
		else
			that.goByIndex(that.currentSlideId);
	}

	
	this.goPrev = function(mark)
	{
		// Проверка на переопределение порядка слайдов
		var art = $('article');
		if (art.attr('data-slide-prev') != undefined)
		{
			that.go(art.attr('data-slide-prev'));
			return true;
		}
		
		
		that.currentSlideId--;
		
		if (that.currentSlideId < 0)
			that.currentSlideId = 0;
		else
			that.goByIndex(that.currentSlideId);
	}
	
	/**
	 * [RUS] Изменить последовательность показа слайдов, добавив слайд вслед за указанным
	 */
	this.addAfter = function(slideName, slideAfter)
	{
		console.log('TODO. Sequence change. Set "'+slideAfter+'" after "'+slideName+'"');
	}
	
	this.clear = function()
	{
		that.currentSlide = false;
		that.currentSlideId = false;
		that.prevSlide = false;
		that.slideInfo = {};
		that.workflow = [];
	}
}
