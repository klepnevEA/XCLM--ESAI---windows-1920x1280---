/**
 * [RUS] События и взаимодействие с сервером
 * [ENG] Server interactions
 */
var xclmEvents = function()
{
	var that = this;
	this.events = {};
	this.slideTimer = false;
	this.slideReaction = false;
	this.stat = {};

	/**
	 * Добавить событие обработчик
	 */
	this.add = function (slideName, eventName, callback)
	{
		if (that.events[slideName] == undefined)
			that.events[slideName] = {};

		that.events[slideName][eventName] = callback;
	}
	
	/**
	 * Установить пользовательскую реакцию на слайд
	 */
	this.setSlideReaction = function(mark)
	{
		that.slideReaction = mark;
	}
	
	/**
	 * Сворачивание приложения
	 */
	this.onAppCollapse = function(slideName)
	{
		xclm.stat.slidePause();
		xclm.stat.presentationPause();
	}
	
	/**
	 * Разворачивание приложения
	 */
	this.onAppExpand = function(slideName)
	{
		xclm.stat.presentationResume();		
		xclm.stat.slideResume();
	}
	
	/**
	 * После загрузки, но перед отображением слайда
	 */
	this.onBeforeLoad = function(slideName)
	{
		if (that.events[slideName] != undefined)
			if (that.events[slideName]['onBeforeLoad'] != undefined)
				that.events[slideName]['onBeforeLoad']();
	}

	/**
	 * После отображения слайда
	 */
	this.onAfterLoad = function()
	{
		var slideName = xclm.nav.currentSlide;
		if (that.events[slideName] != undefined)
			if (that.events[slideName]['onAfterLoad'] != undefined)
				that.events[slideName]['onAfterLoad']();
		
		xclm.stat.slideStart(slideName);
		xclm.profiling.end('slideload', {slideName: slideName});
//
	}

	/**
	 * Уход со слайда
	 */
	this.onLeave = function(slideName)
	{
		if (that.events[slideName] != undefined)
			if (that.events[slideName]['onLeave'] != undefined)
				that.events[slideName]['onLeave']();
		
		xclm.stat.slideEnd();
	}

}
