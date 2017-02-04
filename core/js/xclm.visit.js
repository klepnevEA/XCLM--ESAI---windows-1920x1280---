/**
 * Created by Xor on 02.06.2016.
 */


/**
 * Работа с визитом
 */
var xclmVisit = function()
{
    var that = this;

    this.visit_id = false;
    this.mode = false;
    this.client_id = false;
    this.contact_id = false;

    /**
     * Инициализируем работу с визитом.
     */
    this.init = function()
    {

        // Загружаем идентификатор визита
        var visit_id = window.localStorage.getItem('current_visit_id');
        if (visit_id === null)
            this.visit_id = false;
        else
            this.visit_id = visit_id;
        console.log(this.visit_id);
    }

    /**
     * Запущен ли визит
     * @returns {boolean}
     */
    this.isStarted = function()
    {
        if (that.visit_id === false)
            return false;
        else
            return true;
    }

    /**
     * Запускаем визит
     */
    this.start = function()
    {

    }

    /**
     * Останавливаем визит
     */
    this.finish = function()
    {
    }

    /**
     * Отправить данные в рамках визита
     * @param data
     */
    this.sendData = function(listener, method, data)
    {
        data['mode']            = that.mode;
        data['visit_id']        = that.visit_id;
        data['client_id']       = that.client_id;
        data['contact_id']      = that.contact_id;
        data['manager_id']      = xclm.user.user_id;
        data['listener']        = listener;
        data['method']          = method;
        data['geo_longitude']   = xclm.geo.longitude;
        data['geo_latitude']    = xclm.geo.latitude;
        var date  = new Date();
        data['date']        = date.yyyymmdd();
        xclm.app.sendData(data);
    }
}