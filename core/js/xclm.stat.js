var xclmStat = function()
{
	var presentationId = false;
	var that = this;
	this.data = {};
	
	/**
	 * Начало презентации
	 */
	this.presentationStart = function(folder)
	{
		console.log('STAT.presentationStart');
		that.loadStat();
		if (that.data != null)
		{
			if (that.data.length > 0)
				that.sendStat();
		}
		
		that.data = {};
		
		that.data.presentationStart = that.currentTime();
		that.data.presentationTotal = 0;
	}
	
	this.registerSlide = function(slideName)
	{

		if (that.data['slides'] == undefined)
			that.data['slides'] = {};
		
		that.data['slides'][slideName] = {num: 0, total: 0};
	}
	
	/**
	 * Сворачивание приложения
	 */
	this.presentationPause = function()
	{
		console.log('STAT.presentationPause');
		that.data.presentationTotal = that.data.presentationTotal*1+(that.currentTime()-that.data.presentationStart)*1;
		that.saveStat();
	}
	
	/**
	 * Разворачивание приложения
	 */
	this.presentationResume = function()
	{
		console.log('STAT.presentationResume');
		that.loadStat();		
		that.data.presentationStart = that.currentTime();
	}
	
	/*
	 * Завершение приложения
	 */
	this.presentationEnd = function()
	{
		console.log('STAT.presentationEnd');
		that.data.presentationTotal = that.data.presentationTotal*1+(that.currentTime()-that.data.presentationStart)*1;
		that.sendStat();
		that.clearStat();
	}

	/**
	 * Начало отображения слайда
	 */
	this.slideStart = function(slideName)
	{
	/*	console.log(slideName);
		console.log('STAT.slideStart');
		that.data['cSlide'] = slideName;
		that.data['slides'][slideName]['num']++;
		that.data['slides'][slideName]['start'] = that.currentTime();*/
	}

	/**
	 * Пауза отображения слайда
	 */
	this.slidePause = function()
	{
		/*console.log('STAT.slidePause');
		that.data['slides'][that.data['cSlide']]['total'] = that.data['slides'][that.data['cSlide']]['total']+(that.currentTime()-that.data['slides'][that.data['cSlide']]['start'])*/
	}
	
	this.slideResume = function()
	{
/*		console.log('STAT.slideResume');
		console.log(that.data);
		that.data['slides'][that.data['cSlide']]['start'] = that.currentTime();*/
	}
	
	/**
	 * Прекращение отображения слайда
	 */
	this.slideEnd = function()
	{
	/*	console.log('STAT.slideEnd');
		that.data['slides'][that.data['cSlide']]['total'] = that.data['slides'][that.data['cSlide']]['total']+(that.currentTime()-that.data['slides'][that.data['cSlide']]['start']) 
		that.cSlide = false;
		console.log(that.data['cSlide']+':'+that.data['slides'][that.data['cSlide']]['total'])*/
	}
	
	/*
	 * Загрузить статистику из localStorage
	 */
	this.loadStat = function()
	{
		console.log('STAT.loadStat');
		var presentationId = xclm.config.presentationName+'.stat';
		try
		{
			that.data = JSON.parse(xclm.data.load(presentationId));
		}
		catch (ex)
		{
			that.data = {};
		}
	}
	
	/*
	 * Сохранить статистику в localStorage
	 */
	this.saveStat = function()
	{
		console.log('STAT.saveStat');
		var presentationId = xclm.config.presentationName+'.stat';
		xclm.data.save(presentationId, JSON.stringify(that.data));		
	}
	
	/**
	 * Отправить собранную статистику на сервер
	 */
	this.sendStat = function()
	{
		console.log(that.data);
		console.log('STAT.sendStat');

		if (xclm.isVisit)
			that.data['visit_type'] = 1;		
		else
			that.data['visit_type'] = 0;

		xclm.app.send(that.data);
	}
	
	this.clearStat = function()
	{
		console.log('STAT.clearStat');
		that.data = {};
		that.saveStat();
	}
	
	this.currentTime = function()
	{
		var dt = new Date();
		return dt.getTime(dt);
	}
}