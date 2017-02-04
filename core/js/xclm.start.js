/**
 * Created by Xor on 01.06.2016.
 */

/**
 *
 * XCLM 3.0 Начало визита
 *
 */

var MClients = function() {
    var that = this;

    this.data = {};

    this.load = function () {
        for (var i in xclm.database.dbs['clients']) {
            if (xclm.database.dbs['clients'][i]['children']) {
                if (Object.keys(xclm.database.dbs['clients'][i]['children']).length > 0) {
                    for (var k in xclm.database.dbs['clients'][i]['children']) {
                        that.data[k] = xclm.database.dbs['clients'][i]['children'][k];
                    }
                }
            }
        }

    }

    /** Вернуть список клиентов */
    this.getAll = function ()
    {
        return that.data;
    }


    this.getClient = function(client_id)
    {
        return that.data[client_id];
    }

    this.load()
}

var MRoutingPlan = function()
{
    var that = this;

    this.data = false;
    this.today = [];

    this.route_name = false;
    this.current_day = false;

    // Загружаем маршрутный план на текущий месяц
    this.load = function()
    {
        var dt = new Date()
        var current_year = dt.getFullYear();
        var current_month = dt.getMonth();
        current_month++;

        var current_day = dt.getDate();
        that.current_day = current_day;

        that.route_name = 'route-'+current_year+'-'+current_month;

        that.data = JSON.parse(localStorage.getItem(this.route_name));

        for (var i in that.data)
        {
            if (that.data[i]['day'] == current_day)
                that.today.push(that.data[i]['point_id']);
        }

        console.log('Визиты на сегодня', that.today);
    }

    // Получить сведения о визите
    this.getVisit = function(point_id) {
        for (var i in that.data)
        {
            if ((that.data[i]['day'] == that.current_day) && (that.data[i]['point_id'] == point_id)) {
                return that.data[i];
            }
        }
    }

    // Отметить визит, как начатый
    this.markVisit = function(point_id) {
        console.log('Try mark Visit');
        for (var i in that.data)
        {
            if ((that.data[i]['day'] == that.current_day) && (that.data[i]['point_id'] == point_id)) {
                that.data[i]['done'] = true;
            }
        }
        localStorage.setItem(that.route_name, JSON.stringify(that.data));
    }

    this.load();
}

var xclmStart = function()
{
    var that = this;

    this.routing_plan = false;
    this.clients = false;


    this.all_clients_sorted_gps = [];
    this.clients_today_sorted_gps = [];
    this.clients_today = [];

    /**
     * Инициализируем интерфейс начала визита
     */
    this.init = function()
    {
        // Инициализируем прокрутку клиентов МП и общего списка
        this.initScrollMP();

        // Инициализируем все кнопки приложения
        $('#xclmStartPresentationView').on(xclm.clickEvent, this.presentationStartView);
        $('#xclmStartPresentationVisit').on(xclm.clickEvent, this.presentationStartVisit);
        
        $('#refresh_gps').on(xclm.clickEvent, this.refreshGPS);

        // Форма контактов
        $('.xclmContactFormBackBtn').on(xclm.clickEvent, this.contactBack);

        $('.xclmClientFormBackBtn').on(xclm.clickEvent, this.clientBack);

        $('.xclmAimFormBackBtn').on(xclm.clickEvent, this.aimBack)

        $('#btnVisitStart').on(xclm.clickEvent, this.startVisit)

    }

    /**
     * Запускаем при нажатии кнопки "Начать визит"
     */
    this.startVisit = function()
    {
        that.routing_plan.markVisit(xclm.visit.client_id);
        xclm.startShow();
    }
    
    this.initScrollMP = function()
    {
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
    }

    /**
     * Запрос на обновление GPS координат
     */
    this.refreshGPS = function()
    {
        xclm.refreshGPS();

        that.sortRoutingPlanClients();
        that.sortAllClients();
        that.drawAllClients();
    }

    /**
     * Начинаем визит. Все данные выбраны
     */
    this.presentationStartVisit = function(event)
    {
        try {
            // Начинаем визит
            xclm.visit.mode = 1;

            // Загружаем БД
            xclm.database.loadList(['clients', 'routing_plan', 'visit_targets'], function () {
                that.routing_plan = new MRoutingPlan();
                that.clients = new MClients();


                //xclm.error(objectToString(xclm.database.dbs['routing_plan']['2016']['6']));
                // Подготавливаем список клиентов
                that.sortRoutingPlanClients();
                that.sortAllClients();
                that.drawAllClients();

                // Показать выбор клиента
                that.showStartingForm('xclmClientSelect');
            });
        }
        catch (ex)
        {
            xclm.showException(ex);
        }

        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Подготовить список клиентов к посещению на сегодня
     */
    this.sortRoutingPlanClients = function()
    {
        try {
            that.clients_today = [];
            that.rp_clients_sorted_gps = [];

            // Получить текущую дату
            var dt = new Date();
            var year = dt.getFullYear();
            var month = dt.getMonth()+1;
            var day = dt.getDate();
            var is_empty = true;
            var distance = 0;
            var client_id = 0;

            // @TODO Проверять, есть ли маршрутный план на этот месяц

            for (var i in that.routing_plan.today)
            {
                    client_id = that.routing_plan.today[i];
                    client_info = that.clients.getClient(client_id);

                    distance = getDistanceFromLatLonInKm(
                        client_info['coords_longitude'],
                        client_info['coords_latitude'],
                        xclm.geo.latitude,
                        xclm.geo.longitude
                    );
                    that.clients_today.push([client_id, distance]);
            }
/*            else
            {
                that.emptyRouting('Отсутствует маршрутный план на текущий месяц');
            }*/

            if (that.clients_today.length === 0) {
                that.emptyRouting('Отсутствует маршрутный план на сегодня');
            }
            else {
                that.clients_today.sort(function (a, b) {
                    return a[1] - b[1];
                });
                that.drawRoutingPlanClients();
            }


            /*
                var distance = getDistanceFromLatLonInKm(
                    xclm.database.dbs['clients'][i]['coords_longitude'],
                    xclm.database.dbs['clients'][i]['coords_latitude'],
                    xclm.visit.latitude,
                    xclm.visit.longitude
                );
                xclm.database.dbs['clients'][i]['distance'] = distance;
                xclm.database.dbs['clients'][i]['distance_named'] = distanceToHumanFormat(distance);

                that.all_clients_sorted_gps.push([i, distance]);
            }
            that.all_clients_sorted_gps.sort(function (a, b) {
                return a[1] - b[1];
            });*/

        }
        catch (ex) {
            xclm.showException(ex);
        }

    }

    this.emptyRouting = function(message)
    {
        $('#xclmTodayClientsEmpty').text(message);
        $('#xclmTodayClientsEmpty').removeClass('xclmHidden');
        $('#xclmTodayClientsTab').addClass('xclmHidden');
    }

    /**
     * Подготовить список всех клиентов данного менеджера
     */
    this.sortAllClients = function()
    {
        try {
            // Сортируем по удаленности
            that.all_clients_sorted_gps = [];
            var distance = false;

            var all_clients = that.clients.getAll();

            for (var i in all_clients) {

                if ("coords_longitude" in all_clients[i]) {
                    distance = getDistanceFromLatLonInKm(
                        all_clients[i]['coords_longitude'],
                        all_clients[i]['coords_latitude'],
                        xclm.geo.latitude,
                        xclm.geo.longitude
                    );
                }
                else
                {
                    distance = 100000;
                }

                all_clients[i]['distance'] = distance;
                all_clients[i]['distance_named'] = distanceToHumanFormat(distance);

                that.all_clients_sorted_gps.push([i, distance]);
            }
            that.all_clients_sorted_gps.sort(function (a, b) {
                return a[1] - b[1];
            });
        }
        catch (ex) {
            xclm.showException(ex);
        }
    }

    /**
     * Отрисовываем список всех клиентов
     */
    this.drawAllClients = function()
    {
        try {
            var title, distance, id, btn, second_line, org = false;
            $('#xclmAllClientsTab').empty();

            var all_clients = that.clients.getAll();

            for (var i in that.all_clients_sorted_gps) {
                id = that.all_clients_sorted_gps[i][0];
                title = all_clients[id]['title'];
                distance = all_clients[id]['distance_named'];
                org = all_clients[id]['org_title'];
                btn = '<a data-id="' + id + '"  class="btn btn-primary xclmClientButton" href="#">Выбрать</a>';
                second_line = '<br /><small>'+all_clients[id]['coords_address']+'</small>'
                $('#xclmAllClientsTab').append($('<tr><td>' + title + '<span class="small"> ('+org+') </span> <span class="xclmDistance">' + distance + '</span>'+second_line+'</td><td>'+btn+'</td></tr>'));
            }

            $('.xclmClientButton').on(xclm.clickEvent, that.selectClient);
        }
        catch (ex) {
            xclm.showException(ex);
        }
    }

    /**
     * Отприсовываем вкладку клиентов по маршрутному листу
     */
    this.drawRoutingPlanClients = function()
    {
        try {

            $('#xclmTodayClientsEmpty').addClass('xclmHidden');
            $('#xclmTodayClientsTab').removeClass('xclmHidden');
            var title, distance, id, btn, second_line, client_info, mark, org = false;
            $('#xclmTodayClientsTab').empty();

            // Список клиентов на сегодня пуст
            if (that.clients_today.length == 0)
            {
                 // Вывести сообщение, что маршрутного плана на сегодня нет.
            }

            for (var i in that.clients_today) {
                id = that.clients_today[i][0];
                distance = distanceToHumanFormat(that.clients_today[i][1]);
                client_info = that.clients.getClient(id)
                title = client_info['title'];
                org = client_info['org_title'];
                btn = '<a data-id="' + id + '"  class="btn btn-primary xclmClientButton" href="#">Выбрать</a>';
                second_line = '<br /><small>'+client_info['coords_address']+'</small>'

                var visit_info = that.routing_plan.getVisit(that.clients_today[i][0]);
                console.log('State', that.clients_today[i][0], visit_info);
                    if (visit_info['done'] == true)
                        mark = '<span class="label label-success"><span class="glyphicon glyphicon glyphicon-ok" aria-hidden="true"></span></span>&nbsp;';
                    else
                        mark = '<span class="label label-default"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>&nbsp;';


                $('#xclmTodayClientsTab').append($('<tr><td>' + mark + title + '<span class="small"> ('+org+') </span> <span class="xclmDistance">' + distance + '</span>'+second_line+'</td><td>'+btn+'</td></tr>'));
            }

            $('.xclmClientButton').on(xclm.clickEvent, that.selectClient);

        }
        catch (ex) {
                xclm.showException(ex);
            }
    }

    /**
     * Нажатие кнопки "назад" из формы клиентов
     */
    this.clientBack = function(event)
    {
        that.showStartingForm('xclmModeSelect');

        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Нажатие кнопки "назад" из формы контактов
     */
    this.contactBack = function(event)
    {
        that.showStartingForm('xclmClientSelect');

        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Нажатие кнопки "Назад" из формы целей визита
     */
    this.aimBack = function(event)
    {
        try {
            if (xclm.visit.contact_id === false)
                that.showStartingForm('xclmClientSelect');
            else
                that.showStartingForm('xclmContactSelect');

            event.stopPropagation();
            event.preventDefault();
        }
        catch (ex)
        {
            xclm.showException(ex);
        }
    }



    /**
     *
     * @param form_name
     */
    this.showStartingForm = function(form_name)
    {
        $('.xclmSF').addClass('xclmHidden');
        $('.'+form_name).removeClass('xclmHidden');
    }

    /**
     * Начинаем самостоятельный просмотр
     */
    this.presentationStartView = function(event)
    {
        xclm.visit.mode = 0;
        xclm.startShow();
        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Выбран клиент
     */
    this.selectClient = function(event)
    {
        try {
            var client_id = $(this).attr('data-id');
            xclm.visit.client_id = client_id;


            that.selectVisitAims();

            /** Пока не актуально, так как контакты не поддерживаются
            if (typeof xclm.database.dbs['clients'][client_id]['children'] === 'object') {
                console.log('Has contact list');
                that.drawContacts(client_id);
                that.showStartingForm('xclmContactSelect');
            }
            else {
                console.log('No contact list');
                that.selectVisitAims();
            }
             */
        }
        catch (ex)
        {
            xclm.showException(ex);
        }

        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Вывести список контактных лиц в организации-клиенте
     */
    this.drawContacts = function(client_id)
    {
        try {
            var title = false;
            $('#xclmContactList').empty();
            for (var i in xclm.database.dbs['clients'][client_id]['children']) {
                title = xclm.database.dbs['clients'][client_id]['children'][i]['title'];
                $('#xclmContactList').append($('<tr><td data-id="' + i + '" class="xclmContactButton">' + title + '</td></tr>'));
            }

            $('.xclmContactButton').on(xclm.clickEvent, that.selectContact);
        }
        catch (ex)
        {
            xclm.showException(ex);
        }
    }

    /**
     * Выбрано контактное лицо в организации
     */
    this.selectContact = function()
    {
        var contact_id = $(this).attr('data-id');
        xclm.visit.contact_id = contact_id;
        that.selectVisitAims();
    }

    /**
     * Выбираем цели визита
     */
    this.selectVisitAims = function()
    {
        try {
            var aims = [];
            var comment = '';

            var dt = new Date();
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            var day = dt.getDate();

            var client_id = xclm.visit.client_id;
            var contact_id = xclm.visit.contact_id;

            var selected_rp_id = 0;
            var visit_date_descr = '';

            that.showStartingForm('xclmAimSelect');


            var days = {};
            if (year+'-'+month in xclm.database.dbs['routing_plan']) {
                    for (var i in xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan']) {
                        // Ищем клиента в маршрутном плане
                        if (xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan'][i]['point_id'] == client_id) {
                            days[xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan'][i]['day']] = i;
                        }

                        // Ищем контакт в маршрутном плане
                        if (xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan'][i]['client_id'] == contact_id) {
                            days[xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan'][i]['day']] = i;
                        }
                    }

                    // Массив days содержит идентификаторы всех найденных визитов
                    // Приоритетны ближайшие в будущем
                    for (var scan_day = day; scan_day < 32; scan_day++) {
                        if (scan_day in days) {
                            selected_rp_id = days[scan_day];
                            if (scan_day == day)
                                visit_date_descr = 'Визит запланирован на сегодня.';
                            else
                                visit_date_descr = 'Визит запланирован на ' + scan_day + ' число.';
                            break;
                        }
                    }

                    // Если в будущем нет визита, то ищем в прошлом
                    if (selected_rp_id == 0) {
                        for (var scan_day = 1; scan_day < day; scan_day++) {
                            if (scan_day in days) {
                                selected_rp_id = days[scan_day];
                                visit_date_descr = 'Визит пропущен. Был запланирован на ' + scan_day + ' число.';
                            }
                        }
                    }

                    if (selected_rp_id == 0) {
                        visit_date_descr = 'Визит в этом месяце запланирован не был.';
                    }
            }
            else
            {
                console.log('Маршрутный план на этот месяц отсутствует '+year + '-' + month);
                xclm.log('Маршрутный план на этот месяц отсутствует '+year + '-' + month)
            }


            // Отрисовываем список целей визита, помечая те из них, которые выбраны в МП

            var aim_name = '';
            var aim_id = 0;
            var checked = '';

            $('#xclmVisitAims').empty();

            for (aim_id in xclm.database.dbs['visit_targets'])
            {
                checked = '';
                if (selected_rp_id > 0)
                {
                    if (xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan'][selected_rp_id]['goals'].indexOf(aim_id) !== -1)
                        checked = ' checked ';
                }

                aim_name = xclm.database.dbs['visit_targets'][aim_id];

                $('#xclmVisitAims').append('<label class="xclmAimLabel"  for="aim_'+aim_id+'"><input class="xclmAim" type="checkbox" name="aims" id="aim_'+aim_id+'" value="'+aim_id+'" '+checked+'/>'+aim_name+'</label><br />');
            }

            // Отрисовываем комментарий

            if (selected_rp_id > 0)
            {
                $('#xclmVisitComment').text(xclm.database.dbs['routing_plan'][year + '-' + month]['routing_plan'][selected_rp_id]['comment']);
            }


                // Указываем сведения о визите.
            $('#visit_details').text(visit_date_descr);


        }
        catch (ex)
        {
            xclm.showException(ex);
        }
    }

}
