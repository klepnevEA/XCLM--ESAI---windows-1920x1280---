/**
 * Обработка всплывающего меню выхода
 * @returns
 */
var xclmPopupMenu = function()
{
	var that = this;
	
	this.toggle = function()
	{
		if ($('#sysmenu').hasClass('xclmHidden'))
			window.setTimeout(that.enableAction, 200)
		else
			$('#endVisit').unbind('click touchstart', xclm.endShow);
		
		$('#sysmenu').toggleClass('xclmHidden');
	}
	
	/**
	 * Устанавливаем задержку на кнопку выхода, чтобы избежать мгновенного срабатывания
	 */
	this.enableAction = function()
	{
		$('#endVisit').bind('click touchstart', xclm.endShow);
	}
}
