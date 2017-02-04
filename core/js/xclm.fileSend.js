var xclmFileSend = function()
{
	var that = this;
	
	this.init = function()
	{
		var text = '';
		var textSubmit = 'С уважением, <br/>компания "Рош"';
		// мой код
		$('#emailInput').on('focus', function() {
			console.log('Scroll focus '+$('#emailInput').val());			
			if ($('#emailInput').val() == 'E-mail получателя') 
				$('#emailInput').val('');
			
		    $('body').css({position:'absolute'});
		    $(window).scrollTop(0);
		})
		$('#emailInput').on('blur', function(){
			if ($('#emailInput').val() == '') 
			{
				$('#emailInput').val('E-mail получателя');
				$('#emailInput').css('color','#ccc');
			};

			console.log('Scroll blur');
			$('body').css({position:'fixed'});
		})
		$('#emailInput').on('keyup', function(){
			$('#emailInput').css('color','#000');
		})

		
	
		$('.xclmSentBtn').bind('click touchstart', that.open);
		$('.formSentBack').bind('click touchstart', that.close);

		$('.xclmOpenFile').each(function() {
			$(this).bind('touchstart click', function(event) {
				console.log('Try to open');
				var x = event.screenX, y = event.screenY;
				var element = $(event.currentTarget);
				xclm.app.open(element.attr('data-file'), x, y);
			});
		});
		
		// мой код
		$('.formSentMailButton').bind('touchstart click', function() {
			var mstring = 'mailto:' + $(".formSentMail").val() + '?subject=Материалы%20от%20компании%20Рош&body='+text+ '<br/><br/>' + textSubmit;
			$('.formSentMailButton').attr('href', mstring);
		});
		// мой код
		
		$('.xclmAttachFile').bind('touchend click', function(event) {
			text = 'Уважаемый коллега, <br/> в продолжении нашего разговора направляю Вам следующие файлы:';
			textSubmit = ' С уважением, <br/>компания "Рош"';
			var total = 0;
			$('.xclmAttachFile').each(function() {
				if ($(this).prop('checked')) 
				{
					total++;
					text = text+ '<br/>' +'%20<a href="http://roche.xpractice.ru'+$(this).attr('data-url')+'">'+$(this).attr('data-title')+'</a>' ;
				}
				console.log(text);
			});
			
			
			$('#xclmFileNumber').html(total);

		});
		
		
		
	}
		
		
	
	this.open = function()
	{
		$('.xclmStartForm').addClass('xclmHidden');
		$('.xclmFileSend').removeClass('xclmHidden');
	}
	
	this.close = function()
	{
		$('.xclmStartForm').removeClass('xclmHidden');
		$('.xclmFileSend').addClass('xclmHidden');
	}
}