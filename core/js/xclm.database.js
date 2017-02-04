/**
 * Created by Xor on 08.06.2016.
 */

var xclmDatabase = function()
{
    var that = this;

    this.dbs = {};
    this.callback = false;
    this.database_list = false;
    this.is_loaded = false;
    this.callbacks = [];
    this.loadedNumber = 0;

    /**
     * Загрузить список баз данных
     *
     * @param database_list
     * @param callback
     */
    this.loadList = function(database_list, callback)
    {
        try {
                var dblist_to_read = [];
                for (i in database_list)
                {
                    if (database_list[i] in that.dbs) {}
                    else
                    {
                        dblist_to_read.push(database_list[i]);
                    }
                }

                if (dblist_to_read.length == 0)
                    callback();
                else {
                    that.callback = callback;
                    that.database_list = dblist_to_read;

                    xclm.showLoader('Загрузка баз данных ' + that.loadedNumber + '/' + that.database_list.length)
                    for (i in that.database_list) {
                        that.callbacks[i] = Function('return function(result) { xclm.database.onDatabaseLoaded(result, "' + that.database_list[i] + '" ); }')();
                        xclm.app.getDBData(that.database_list[i], that.callbacks[i]);
                    }
                }
        }
        catch(ex)
        {
            xclm.error(ex.message);
        }
    }

    /**
     * База данных загружена
     *
     * @param result
     * @param database_name
     */
    this.onDatabaseLoaded = function(result, database_name)
    {
        try {
            that.loadedNumber++;
            xclm.showLoader('Загрузка баз данных ' + that.loadedNumber + '/' + that.database_list.length);

            if (typeof result.result == 'undefined') {
                that.dbs[database_name] = false;
                xclm.showPopup('Ошибка загрузки базы данных '+database_name);
                xclm.log('Undefined database ' + database_name);
                that.callback();
            }
            else {
                that.dbs[database_name] = jQuery.parseJSON(result.result);
                if (that.loadedNumber == that.database_list.length) {
                    xclm.hideLoader();
                    that.is_loaded = true;
                    that.callback();
                    that.loadedNumber = 0;
                }
            }
        }
        catch(ex)
        {
                xclm.error(ex.message);
        }
    }
}