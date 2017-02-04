/**
 * [RUS] Построение и работа с главным навигационным меню
 * [ENG] Building and operating with general slide navigation menu 
 * @returns
 */
var xclmMenu = function()
{
	var that = this;
	var menu = [];
	var options = {};
	var id_counter = 0;
	
	/**
	 * Создать меню
	 */
	this.create = function(options, menuitems)
	{
		that.menu = menuitems;
		that.options = options;
		that.draw();
	}

	this.changeGo = function(menuitem, go)
	{
		$(menuitem+' a').attr('data-slide-go', go);
	}
	
	/**
	 * Создать пункт меню
	 */
	this.createItem = function(info)
	{
		var d = document;
		var item = d.createElement('li');
		
		if (info['name'] != undefined)
			item.className = info['name'];
		
		var a = d.createElement('a');
		a.href='#';
		
		// Устанавливаем действие 
		var action = info['act'];
		a.setAttribute('data-act', action);
		
		if (action == 'go')
		{
			a.addEventListener('touchstart', that.actionGo);
			a.addEventListener('mousedown', that.actionGo);
			a.setAttribute('data-slide-go', info['go']);			
		}
		if (action == 'open')
		{
			a.addEventListener('touchstart', that.actionOpen);
			a.addEventListener('mousedown', that.actionOpen);
		}
		if (action == 'go/open')
		{
			a.addEventListener('touchstart', that.actionGoOpenStart);
			a.addEventListener('mousedown', that.actionGoOpenStart);
			a.addEventListener('touchend', that.actionGoOpenEnd);
			a.addEventListener('mouseup', that.actionGoOpenEnd);
			a.setAttribute('data-slide-go', info['go']);
		}
		/* Показать div с данными */
		if (action == 'show')
		{
			a.addEventListener('touchstart', that.actionShow);
			a.addEventListener('mousedown', that.actionShow);
			a.setAttribute('data-div-show', info['go']);
		}
		
		a.innerHTML = info['title'];
		item.appendChild(a);
		return item;
	}
	
	this.highlight = function(item)
	{
		$('.'+item).addClass('xclmMenuActive');
	}
	
	this.removeHighlighted = function()
	{
		$('#menu li').removeClass('xclmMenuActive');
	}

	/**
	 * Подсчитать на текущем уровне узлы, не являющиеся контейнерами
	 */
	this.calcNonContainers = function(level)
	{
		var cc = 0;
		for (var index in level)
		{
			if (level[index]['act'] == 'go') 
				cc++;
		}
		return cc;
	}
	
	/**
	 * [RUS] Отрисовать/Перерисовать меню
	 * [ENG] Draw/Redraw menu
	 */
	this.draw = function()
	{
		var menu = document.getElementById('menu');
		console.log(menu);

		// Удаляем пункты меню, если уже существуют
		if (menu.children.length > 0)
		{
			while (menu.firstChild)
			{
				menu.removeChild(menu.firstChild);
			}
		}
		
		var d = document;
		that.id_counter = 0;
		var c1 = c2 = c3 = c4 = 0;
		var crumbs = [];

		for (var index in that.menu)
		{
			var l1 = that.menu[index];
			c1++;
			crumbs.push({title: l1.title, go: l1.go});
			xclm.nav.addWorkflow(l1, 1, 1, crumbs);
			var li1 = that.createItem(l1)			
			if (l1['items'] == undefined || l1['items'] == false) {}
			else
			{
				var div1 = d.createElement('div');
				var ul1 = d.createElement('ul');
				if (l1['ulclass'] != undefined)
					div1.className = l1['ulclass'];
				
				div1.className+= ' xclmMenuHidden xclmMenuLevel1';
				
				for (subindex in l1['items'])
				{
					var l2 = that.menu[index]['items'][subindex];
					crumbs.push({title: l2.title, go: l2.go});
					c2++;
					xclm.nav.addWorkflow(l2, c2, that.calcNonContainers(l1['items']), crumbs);
					var li2 = that.createItem(l2);					
					if (l2['items'] == undefined || l2['items'] == false) {}
					else
					{
						var div2 = d.createElement('div');
						var ul2 = d.createElement('ul');
						if (l2['ulclass'] != undefined)
							div2.className = l2['ulclass'];
						
						div2.className+= ' xclmMenuHidden  xclmMenuLevel2';
						for (subsubindex in l2['items'])
						{
							var l3 = that.menu[index]['items'][subindex]['items'][subsubindex];
							crumbs.push({title: l3.title, go: l3.go});
							c3++;
							xclm.nav.addWorkflow(l3, c3, that.calcNonContainers(l2['items']), crumbs);							
							var li3 = that.createItem(l3);
							ul2.appendChild(li3);
							if (l3['items'] == undefined || l3['items'] == false)
							{}
							else
							{
								for (var item in l3['items'])
								{
									var l4 = that.menu[index]['items'][subindex]['items'][subsubindex]['items'][item]; 
									crumbs.push({title: l4.title, go: l4.go});
									c4++;									
									xclm.nav.addWorkflow(l4, c4, that.calcNonContainers(l3['items']), crumbs);
									crumbs.pop();
								} //endfor
								c4 = 0;
							} // endif
						crumbs.pop();
						} //endfor
						div2.appendChild(ul2);
						li2.appendChild(div2);
						c3 = 0;
					} //endif
					ul1.appendChild(li2);
					div1.appendChild(ul1);
					crumbs.pop();					
				} //endfor
				li1.appendChild(div1);
				c2 = 0;
			} //endif
			menu.appendChild(li1);
			crumbs.pop();
		}
		c1 = 0;
		console.log(xclm.nav.workflow);
	}
	
	/**
	 * Переход/открытие - начало события
	 */
	this.actionGoOpenStart = function(event)
	{
		var element = $(event.currentTarget);
		var ct = new Date();		
		var curTime = ct.getTime();
		var element = $(event.currentTarget);
		element.attr('data-timeout', curTime);
		event.preventDefault();				
	}
	
	this.actionGoOpenEnd = function(event)
	{
		var ct = new Date();		
		var curTime = ct.getTime();
		var element = $(event.currentTarget);

		var cur = element.closest('li').children('div');
		
		// Если меню открыто закрыть
		if (!cur.hasClass('xclmMenuHidden'))
		{
			element.attr('data-timeout', undefined);
			that.actionOpen(event);
		}
		else
		{
			var st = element.attr('data-timeout');
			if ((ct-st) > 1000)
			{
				element.attr('data-timeout', undefined);
				that.actionOpen(event);
			}
			else
			{
				element.attr('data-timeout', undefined);
				that.actionGo(event);
			}
		}
		event.preventDefault();				
	}	
	
	/**
	 * Переход к слайду по пункту меню
	 */
	this.actionGo = function(event)
	{
		var element = $(event.currentTarget);
		xclm.nav.go(element.attr('data-slide-go'));
		that.closeAll();
		event.preventDefault();		
	}

	/**
	 * Открытие вкладки методом TabOpen
	 * @param event
     */
	this.actionShow = function(event)
	{
		var element = $(event.currentTarget);
		var id_to_open = element.attr('data-div-show');

		var elem = $('#'+id_to_open);
		var tabGroup = elem.attr('data-tabgroup');
		$('div[data-tabgroup="'+tabGroup+'"]').each(function() {
			$(this).addClass('xclmHidden');
		});
		elem.removeClass('xclmHidden');

		that.closeAll();
		event.preventDefault();

	}

	/**
	 * Открытие пункта меню по нажатию
	 */
	this.actionOpen = function(event)
	{
		var element = $(event.currentTarget);
		var cur = element.closest('li').children('div');
		console.log('Open menu item action');
		
		// Если нажали на элемент первого уровня
		if (cur.hasClass('xclmMenuLevel1'))
		{
			// Если пункт меню закрыт
			if (cur.hasClass('xclmMenuHidden'))
			{
				// Закрываем все и открывем его
				that.closeAll();
				cur.removeClass('xclmMenuHidden');
			}
			else
			{
				// Если открыт, то закрываем все
				that.closeAll();
			}
		}
		else // Второй уровень меню
		{
			// Если пункт меню закрыт
			if (cur.hasClass('xclmMenuHidden'))
			{
				// Закрываем все
				that.closeAll();
				// Открываем родителя первого уровня
				element.closest('li').parent().closest('li').children('div').removeClass('xclmMenuHidden');
				// Открываем пункт второго уровня (текущий нажатый)
				cur.removeClass('xclmMenuHidden');
			}
			else
			{
				console.log('Close submenu');
				cur.addClass('xclmMenuHidden');
			}
		}
		event.preventDefault();				
	}
	
	this.closeAll = function()
	{
		$('.xclmMenuLevel1').addClass('xclmMenuHidden');
		$('.xclmMenuLevel2').addClass('xclmMenuHidden');
	}
	
	this.openMenu = function(event)
	{
		console.log('Open menu');
	}
}
