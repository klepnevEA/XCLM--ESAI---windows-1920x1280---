/**
 * [RUS] Namespace для движка xclm
 * [ENG] Namesapce for xclm engine
 * @version 2014-06-24
 * @TODO
 */

var xclm = 
{
	pathToSlides: 		'slides',
	userId:				false,
	userFio:			null,
	isVisit:			false,
    clickEvent:         false,
    error_toggler_count: 0,
    geo:                {longitude: 0, latitude: 0},
    local_debug:        false,
    local_debug_data:   {
        server:         'vetmag',
        user_id:        206,
        // Москва, ул. Киевская, д. 19
        geo:            {
            longitude:      37.55596747253331,
            latitude:       55.7414314263003
        }
    },
    isMenuLoaded:       false,
    isSequenceLoaded:   false,
    isConfigLoaded:     false,


    /* XCLM3 */

    /*
    Сведения о пользователе
     "fio": "Иванов Илья Игоревич",
     "org": "test1",
     "org_title": "ООО \"Мечта\"",
     "org_logo": "http:://test.ru/1.jpg",
     "user_id": 17,
     "session_id": "askdlasj90",
     "is_developer": 1
     */
    user:               {}  // Сведения о пользователе
};



/**
 * XCLM 2.0
 * Вернуться в главное меню презентации 
 */
xclm.endShow = function()
{
	// Прячем меню выхода
	xclm.popupmenu.toggle();
	xclm.stat.slideEnd();
	xclm.stat.presentationEnd();
	xclm.nav.clear();
	
	$('.xclmStartForm').removeClass('xclmHidden');
	$('.xclmPresentation').addClass('xclmHidden');
}

/**
 * XCLM 3.0. Получены сведения о пользователе
 * @param data
 */
xclm.onUserDataLoaded = function(data)
{
    try {
        xclm.user = JSON.parse(data.result);
    }
    catch (ex)
    {
        xclm.showException(ex);
    }
}

/**
 * Запустить при загрузке GPS координат
 * @param data
 */
xclm.onGPSLoaded = function(data)
{
 /*   try {
        xclm.geo = JSON.parse(data.result);
        xclm.log('Определены GPS координаты longitude: '+xclm.geo.longitude+', latitude: '+xclm.geo.latitude);
        if (xclm.geo.latitude == 0)
            xclm.showPopup('GPS координаты не определены');
    }
    catch (ex)
    {
        xclm.showException(ex);
    }*/
}

/**
 * Проверить, начат ли уже визит
 */
xclm.isVisitStarted = function()
{
}


xclm.startVisit = function()
{
}

/**
 * -----------------------------------  XCLM3 -----------------------------
 */

/**
 * XCLM 3.0
 * Начать показ презентации (в любом режиме)
 *
 */
xclm.startShow = function()
{
    var folder = 'slides';

    $('.xclmSF').addClass('xclmHidden');
    $('.xclmPresentation').removeClass('xclmHidden');

    xclm.pathToSlides = folder+'/';

    xclm.stat.presentationStart(folder);
    xclm.nav.goByIndex(0);
}

/**
 * XCLM 3.0
 * Загрузить последовательность слайдов
 */

xclm.loadSequence = function()
{
    xclm.nav.createWorkflow(xclm.workflow);
    xclm.isSequenceLoaded = true;

    xclm.tryStartPresentation();
}

/**
 * XCLM 3.0
 * Загружаем меню
 */

xclm.loadMenu = function()
{
    console.log('menuLoaded', xclm.menuconfig);
    if (xclm.menuconfig != false)
        xclm.menu.create({}, xclm.menuconfig);
    else
    {
        $('#menu').addClass('xclmHidden');
    }
    xclm.isMenuLoaded = true;
    xclm.tryStartPresentation();
}

xclm.tryStartPresentation = function()
{
    console.log('Try Start Presentation (Config:'+xclm.isConfigLoaded+', Menu:'+xclm.isMenuLoaded+', Sequence: '+xclm.isSequenceLoaded+')');
    if (xclm.isConfigLoaded && xclm.isMenuLoaded && xclm.isSequenceLoaded)
        xclm.startShow();

}

/**
 * XCLM 3.0
 * Загружена конфигурация приложения
 */

xclm.loadConfig = function()
{
    $('#xclmTitle').html(xclm.config.presentationTitle);
    $('#xclmLogo').attr('src', xclm.config.presentationLogo);
    $('#xclmDescr').html(xclm.config.presentationDescription);
    xclm.isConfigLoaded = true;
    
    if (xclm.config.swipeController)
        xclm.swipe.init();

    xclm.tryStartPresentation();
}

/**
 * XCLM 3.0
 * Показать загрузчик
 * @param message текст сообщения
 */
xclm.showLoader = function(message)
{
    xclm.log('Loader show with message "'+message+'"');
    $('#xclmLoaderMessage').text(message);
    $('.xclmLoader').removeClass('xclmHidden');
}

/**
 * XCLM 3.0
 * Показать всплывающее окно
 * @param message
 */
xclm.showPopup = function(message)
{
    $('#modal-14').addClass('md-show');
    $('#xclmPopupMessage').text(message);
    setTimeout(function() {$('#modal-14').removeClass('md-show');}, 1000);
}

/**
 * XCLM 3.0
 * Спрятать загрузчик
 * @param message
 */
xclm.hideLoader = function()
{
    xclm.log('Loader hide');
    $('.xclmLoader').addClass('xclmHidden');
}

/**
 * XCLM 3.0
 * Вывести ошибку
 * @param message
 */
xclm.error = function(message)
{
    $('#errors').append('<li class="error">'+message+'</li>');
}

/**
 * XCLM 3.0
 * Вывести Exception
 * @param ex
 */
xclm.showException = function(ex)
{
    $('#errors').append('<li class="error">'+ex.message+'<br /><i>'+ex.stack+'</i></li>');
}

/**
 * XCLM 3.0
 * Вывести сообщение в лог
 * @param message
 */
xclm.log = function(message)
{
    $('#errors').append($('<li>'+message+'</li>'));
}

/**
 * Обновить GPS координаты
 */
xclm.refreshGPS = function()
{
    if (xclm.local_debug)
    {
        xclm.geo = xclm.local_debug_data.geo;
    }
    else
        xclm.app.getGPSData(xclm.onGPSLoaded);
}


/**
 * 
 * XCLM 3.0. Инициализируем компоненты
 *  
 */

xclm.init = function(presentationName)
{
	try
	{
        /** TODO Определяем среду исполнения и выбираем событие */

        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome)
            xclm.clickEvent = 'click';
        else
            xclm.clickEvent     = 'touchstart';
$('h1').text('1');

        // Инициализируем панель ошибок
        $('#error_toggler').on(xclm.clickEvent, function() {
            xclm.error_toggler_count++;
            console.log(xclm.error_toggler_count);
            if (xclm.error_toggler_count == 5)
            {
                $('#error_panel').removeClass('xclmHidden')
            }
            if (xclm.error_toggler_count > 5)
            {
                $('#error_panel').addClass('xclmHidden')
                xclm.error_toggler_count = 0;
            }
        });
        $('h1').text('2');

        /** XCLM 3.0 */
        xclm.app			= new xclmApp();
        xclm.app.getUserData(xclm.onUserDataLoaded);
        //xclm.refreshGPS();
        $('h1').text('3');
        xclm.visit          = new xclmVisit();
        xclm.visit.init();
        $('h1').text('4');
        xclm.database       = new xclmDatabase();

        $('h1').text('5');
        // Задем фон отладочного режима
        if (xclm.local_debug == true)
        {
            $('body').addClass('localdebug')
        }
        $('h1').text('6');
        /** Инициализируем начало визита
         * 1. Если визит не начат
         * 2. и если в конфиге нет указания о запуске без начала визита
         */

        /*if (!xclm.visit.isStarted())
        {
            xclm.start = new xclmStart();
            xclm.start.init();
        }*/

        $('h1').text('7');

        /** XCLM 2.0 */

		//xclm.presentationName = presentationName;
        /* OK */

		$('#xclm_username').text(xclm.userFio);
		xclm.data			= new xclmData();	
		xclm.profiling		= new xclmProfiling();
		xclm.swipe			= new xclmSwipe();
		xclm.actions 		= new xclmActions();
		xclm.stat			= new xclmStat();
        $('h1').text('8');
		xclm.popupmenu	= new xclmPopupMenu();
//		$('#closeEndVisit').bind('click touchstart',xclm.popupmenu.toggle);

		xclm.events		= new xclmEvents();
		xclm.nav		= new xclmNav();
		xclm.menu		= new xclmMenu();
	
		$('#canvas').load('config.html', xclm.loadConfig);
        $('#canvas').load('slides_menu.html', xclm.loadMenu);
        $('#canvas').load('slides_workflow.html', xclm.loadSequence);

        $('h1').text('9');
        if (window.app != undefined)
		{
			app.init(xclm.events);
		}
		
		// $('#canvas').load('config.html', xclm.load);
	}
    catch (ex)
    {
        xclm.error(ex.message);
    }
}


