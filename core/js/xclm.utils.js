/**
 * Created by Xor on 01.06.2016.
 */

/**
 * Получить расстояние между двумя координатами
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns {number}
 */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

/**
 * Превратить расстояние в человекочитаемый формат
 * @param distance
 */
function distanceToHumanFormat(distance)
{
    var distance_named = '';
    if (distance < 1)
    {
        distance_named = Math.round(distance*1000)+' метров';
    }
    else
    {
        distance_named = Math.round(distance*10)/10+' км';
    }
    return distance_named;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

/**
 * Конвертируем объект в строку
 * @param o
 * @returns {string}
 */
function objectToString(o) {
    var out = '';
    for (var p in o) {
        out += p + ': ' + o[p] + "\n";
    }
    return out;
}

/**
 * Добавить к значению предшествующие нули
 * @param n - значение
 * @param width - требуемое количество знаков
 * @param z - префиксный символ. При отстутствии "0"
 * @returns {string}
 */
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/**
 * Добавляем к Date метод yyyymmdd для форматирования даты в привычном формате
 * @returns {string}
 */
Date.prototype.yyyymmdd = function() {
    var mm = pad(this.getMonth() + 1, 2); // getMonth() is zero-based
    var dd = pad(this.getDate(), 2);

    return [this.getFullYear(), mm, dd].join('-'); // padding
};