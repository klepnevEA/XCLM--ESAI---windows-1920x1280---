/**
 * [RUS] Namespace для движка xclm
 * [ENG] Namesapce for xclm engine
 * @version 2014-06-24
 * @TODO
 */

var xclm = 
{	
	pathToSlides: 		false,
	userId:				false,
	userFio:			null,
	isVisit:			false
};

/**
 * Начать визит (сбор статистики)
 */

xclm.startVisit = function()
{
	xclm.isVisit = true;
	xclm.startShow('slides');
}

/**
 * Начать просмотр (без сбора статистики)
 */

xclm.startView = function()
{
	xclm.isVisit = false;
	xclm.startShow('slides');
}

/**
 * Перейти к справке 
 */

xclm.startHelp = function()
{
	xclm.isVisit = false;
	xclm.startShow('help');	
}

/**
 * Начать тестирование
 * 
 */
xclm.startTest = function()
{
	xclm.isVisit = false;
	xclm.startShow('test');	
}

/**
 * Загрузить последовательность слайдов 
 */

xclm.loadSequence = function()
{
	xclm.nav.createWorkflow(xclm.workflow);
}

/**
 * Загружаем меню
 */

xclm.loadMenu = function()
{
	if (xclm.menuconfig != false)
		xclm.menu.create({}, xclm.menuconfig);
	else
	{
		$('#menu').addClass('xclmHidden');
	}
	
	xclm.nav.goByIndex(0);	
}

/**
 * Начать показ презентации
 * 
 */
xclm.startShow = function(folder)
{
	$('.xclmStartForm').addClass('xclmHidden');
	$('.xclmPresentation').removeClass('xclmHidden');
	xclm.pathToSlides = folder+'/';

	// Загружаем порядок слайдов и строем меню
	$('#canvas').load(folder+'_workflow.html', xclm.loadSequence);
	$('#canvas').load(folder+'_menu.html', xclm.loadMenu);
	xclm.stat.presentationStart(folder);
}

/**
 * Вернуться в главное меню презентации 
 */
xclm.endShow = function()
{
	console.log('End show');
	// Прячем меню выхода
	xclm.popupmenu.toggle();
	xclm.stat.slideEnd();
	xclm.stat.presentationEnd();
	xclm.nav.clear();
	
	$('.xclmStartForm').removeClass('xclmHidden');
	$('.xclmPresentation').addClass('xclmHidden');
}

/**
 * Загружена конфигурация приложения
 */

xclm.loadConfig = function()
{
	$('.xclmExitBtn').bind('click touchstart', xclm.app.exit);
	
	$('.xclmVisitBtn').bind('click touchstart', xclm.startVisit);
	$('.xclmViewBtn').bind('click touchstart', xclm.startView);
	
	if ((xclm.config.autorun != undefined) && (xclm.config.autorun != false)) 
		xclm.startShow(xclm.config.autorun);
	
	if (xclm.config.bundleTest != false)
	{
		$('.xclmHelpBtn').removeClass('xclmHidden');
		$('.xclmHelpBtn').bind('click touchstart', xclm.startHelp);
	}
	
	if (xclm.config.bundleHelp != false)
	{
		$('.xclmTestBtn').removeClass('xclmHidden');
		$('.xclmTestBtn').bind('click touchstart', xclm.startTest);
	}
	
	$('#xclm_title').html('<p>Мониторинг</p>');
	$('#xclm_logo').attr('src', xclm.config.presentationLogo);
}

/**
 * 
 * Инициализируем компоненты
 *  
 */

xclm.init = function(presentationName)
{
	//xclm.presentationName = presentationName;
    /** Инициализируем начало визита */
    xclm.app			= new xclmApp();

    xclm.start          = new xclmStart();

	xclm.app.getUserId();
	xclm.app.getUserFIO();
	$('#xclm_username').text(xclm.userFio);
	xclm.data			= new xclmData();	
	xclm.profiling		= new xclmProfiling();
	xclm.swipe			= new xclmSwipe();
	xclm.swipe.init();	
	xclm.actions 		= new xclmActions();
	xclm.stat			= new xclmStat();
	xclm.filesend		= new xclmFileSend();
	xclm.filesend.init();
	
	xclm.popupmenu	= new xclmPopupMenu();
	$('#closeEndVisit').bind('click touchstart',xclm.popupmenu.toggle);
	
	xclm.events		= new xclmEvents();
	xclm.nav		= new xclmNav();
	xclm.menu		= new xclmMenu();

	$('#canvas').load('config.html', xclm.loadConfig);	
	
	if (window.app != undefined)
	{
		app.init(xclm.events);
	}
	
	$('#canvas').load('config.html', xclm.load);
}


