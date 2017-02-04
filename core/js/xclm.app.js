/**
 * [RUS] Взаимодействие с приложением
 * [ENG] Interaction with iPad app
 */
var xclmApp = function()
{
	var that = this;

	this.bufferSize = null;
	this.internet = null;

	this.listenerUserData = false;
	this.listenerGPSData = false;
	this.listenerDBVersionsData = false;
	this.listenerDBData = false;

    this.userCollapseListener = function() {};
    this.userExpandListener = function() {};

	/**
	 * -------------------------------------------------------------------------
	 * 			События, запускаемые из приложения
	 * -------------------------------------------------------------------------
	 */

	/**
	 * Нажата кнопка "Завершить визит"
	 */
	this.endVisit = function()
	{
        setTimeout(xclm.app.exit, 500);
	}

	/**
	 * Нажата кнопка "В главное меню"
	 */
	this.mainMenu = function()
	{
        setTimeout(xclm.app.exit, 500);
	}

    /**
     * Установить пользовательский слушатель сворачивания приложения
     * @param callback
     */
    this.setCollapseListener = function(callback)
    {
        that.userCollapseListener = callback;
    }

    /**
     * Установить пользовательский слушатель разворачивания приложения
     * @param callback
     */
    this.setExpandListener = function(callback)
    {
        that.userExpandListener = callback;
    }

	/**
	 * Событие происходит при сворачивании приложения
	 * xclm3.0
	 */
	this.collapse = function()
	{
        that.userCollapseListener();
	}

	/**
	 * Событие происходит при разворачивании приложения
	 * xclm3.0
	 */
	this.expand = function()
	{
        that.userExpandListener();
	}

	/**
	 * -------------------------------------------------------------------------
	 * 			JS API
	 * -------------------------------------------------------------------------
	 */

	/**
	 * Получить сведения о пользователе
	 */
	this.getUserData = function(callback)
	{
        xclm.log('Data load');
		calliOSFunction('get_user_data', [], callback);
	}

	/**
	 * Получить широту и долготу
	 */
	this.getGPSData = function(callback)
	{
		//calliOSFunction('get_gps_coords', [], callback);
		callback();
	}

	/**
	 * Получить список баз данных
	 */
	this.getDBVersionsData = function()
	{
		calliOSFunction('get_dbversions', [], function(ret)
		{
			that.listenerDBVersionsData(ret.result);
		});
	}

	/**
	 * Получить содержимое БД
	 * @param dbname
	 */
	this.getDBData = function(dbname, callback)
	{
        console.log('getDBData: '+dbname);
        if (xclm.local_debug === false)
		    calliOSFunction('get_db', [dbname], callback);
        else {
            var request = $.ajax({
                'type':     'GET',
                dataType:   'text',
                'url':      'http://' + xclm.local_debug_data['server'] + '.xclm.ru/database/' + dbname + '/0/' + xclm.local_debug_data['user_id']+'/',
               /* xhrFields: {
                    withCredentials: true
                }*/
            }).done(function(result) {
                //console.log(result, callback);
                callback({result: result})
            });
        }
	}


	/**
	 * Отправка данных на сервер
	 * @param data
	 */
	this.sendData = function(data)
	{
        console.log(data);
        try {
            /**
             * Очищаем данные от кавычек
             */
/*            for (var i in data) {
                console.log(i, typeof data[i]);
                if (typeof data[i] == 'string')
                    data[i] = data[i].replace(/"/g, "&quot;");
            }*/

            console.log(data);

            calliOSFunction('send_data', data);
            xclm.showPopup('Данные сохранены');
        }
        catch (ex)
        {
            xclm.showException(ex);
        }
	}

    /**
     * Установить флаг принудительного обновления баз данных при выходе в главное меню
     */

    this.forceDBUpdate = function()
    {
        calliOSFunction('force_db_update', []);
    }

    /**
     * Отправить email
     * @param to
     * @param text
     * @param attachments
     */
    this.sendMail = function(to, title, text, attachments)
    {
        var data = {};
        data['to']              = to;
        data['title']           = title;
        data['text']            = text;
        data['attachments']     = attachments;
        calliOSFunction('data_send', data);
    }

    /**
     * Открыть файл средствами ОС
     * @param file
     * @param x
     * @param y
     */
    this.openFile = function(file, x, y)
    {
        data = {}; //
        data['file'] = file;
        data['x'] = x;
        data['y'] = y;
        calliOSFunction('open_file', data);
    }

    /**
     * Открыть URL в браузере
     * @param url
     */
    this.openUrl = function(url)
    {
        var data = {};
        data['url'] = url;
        calliOSFunction('open_url', data);
    }


	this.exit = function()
	{
		calliOSFunction('exit', []);
	}

	//------ Legacy ------


	this.isInternetAvailable = function()
	{
		calliOSFunction('test_internet_connection', [], function(ret)
		{
			res = jQuery.parseJSON(ret.result);
			xclm.app.internet = res;
		});
	}



}
