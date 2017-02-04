/**
 * Created by Xor on 27.06.2016.
 */
var xclmRecursiveWorker = function()
{
    var that = this;

    this.database = false;
    this.path = [];
    this.collected_data = {};

    this.init = function(database)
    {
        that.db = database;
    }

    /**
     * Запустить рекурсивный обход
     */
    this.run = function(node)
    {
        //console.log('Recursive run');
        if (typeof node == 'undefined')
            node = that.db;

        //console.log('+', node);
        for (id in node)
        {
            that.path.push(node[id]);
            that.onNode(id, node[id], that.path);
            //console.log(id, node[id]);
            if ('children' in node[id]) {

                that.run(node[id]['children']);
            }
            that.path.pop();
        }
    }

    this.onNode = function(id, current_node, path)
    {
        //console.log('Path', path);
        var breadcrumbs = [];
        for (var z in path)
        {
            breadcrumbs.push(path[z]['title']);
        }
        //console.log(id, breadcrumbs);
    }
}