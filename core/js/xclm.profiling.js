var xclmProfiling = function()
{
	var that = this;
	this.intervals = {};
	
	this.start = function(intervalName, data)
	{
		var dt = new Date();
		timestart = dt.getTime(dt);

		that.intervals[intervalName] = 
		{
			timestart: 	timestart,
			data:		data
		};
	}
	
	this.end = function(intervalName)
	{
		var dt = new Date();
		timeend = dt.getTime(dt);
		
		timelength = timeend - that.intervals[intervalName]['timestart'];
		console.log('Profiling '+intervalName+': '+timelength+' - '+JSON.stringify(that.intervals[intervalName]['data']));
//		console.log('Info: '+that.intervals[intervalName]['data']);
	}
}
