var xclmData = function()
{
	var that = this;

	this.save = function(paramName, value)
	{
		localStorage.setItem(paramName, value);
	}

	this.load = function(paramName)
	{
		return localStorage.getItem(paramName);
	}
}
