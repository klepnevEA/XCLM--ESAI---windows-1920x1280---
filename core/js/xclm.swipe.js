/**
 * [RUS] Поддержка жестов iPad
 * [ENG] iPad gestures support
 */
var xclmSwipe = function()
{
	var that = this;
	this.isSwipePaused = false;
	this.isTouchstart = false;
	this.startX = 0;
	this.startY = 0;
	this.distanceX = 0;
	this.distanceY = 0;
	

	this.prevTapX = -500;
	this.prevTapY = -500;
	this.currentTap = 0;
	this.currentTapTime = 0;

	
/*	this.prevTapTime = 0;
	this.doubleTapTimeOut = 500;
	this.doubleTapDistance = 40;*/
	
	
	/**
	 * [RUS] Инициализировать обработку swipe
	 * [ENG] Initialize swipe support
	 */
	this.init = function(slides)
	{
		Touchy.stopWindowBounce();
		var touchMe = document.getElementById('canvas');			
		Touchy(touchMe, true, function (hand, finger) 
		{
			finger.on('start', that.startHandler);
			finger.on('move',  that.moveHandler);
			finger.on('end' ,  that.endHandler);
		});
	}
	/**
	 * [RUS] Прекратить переходы на соседний слайд по swipe
	 * [ENG] Stop swiping slides
	 */
	this.pauseSwipe = function()
	{
		that.isSwipePaused == true;
	}

	/**
	 * [RUS] Возобновить переходы на соседний слайд по swipe
	 * [ENG] Continue swiping slides
	 */
	this.continueSwipe = function()
	{
		that.isSwipePaused == false;
	}

	/**
	 * [RUS] Событие начало swipe
	 * [ENG] Swipe start event
	 */
   	this.startHandler = function(point) 
	{
        var event = window.event;

		if (event.target.classList.contains('unBlockTouchMove')) {
            event.stopPropagation();
            return true;
        }

		
       	that.startX = point.x;
       	that.startY = point.y;
       	that.distanceX = 0;
       	that.distanceY = 0;
		that.isTouchStart = true;
		
		var timeout_id = window.setTimeout(that.testLongTouch, 500);
       	//point.preventDefault();
    }
   	

	/**
	 * [RUS] Событие движение swipe
	 * [ENG] Swipe move event
	 */   	
   	this.moveHandler = function(point) 
	{
		var event = window.event;
		if (event.target.classList.contains('unBlockTouchMove'))
		return true;
			
       	if (that.isTouchStart) 
		{
          	that.distanceX = point.x - that.startX;
          	that.distanceY = point.y - that.startY;
		}

		event.preventDefault();
    }

	/**
	 * [RUS] Событие завершения swipe
	 * [ENG] Swipe ends event
	 */   	
    this.endHandler = function(point) 
	{
		// that.testDoubleTap(point);
			
    	if (that.isSwipePaused) return false;
    	
    	var mark = 0;
    	
    	if (that.distanceY > 300)
    		mark = -1;

    	if (that.distanceY < -300)
    		mark = 1;
    	
    	xclm.events.setSlideReaction(mark);
    		

        /* Чтобы не путать движения - для смены слайда, движение по X должно быть больше, чем по Y */

        if (Math.abs(that.distanceX) > Math.abs(that.distanceY))
        {
            if (that.distanceX > 150) {
                xclm.nav.goPrev();
            }

            if (that.distanceX < -100) {
                xclm.nav.goNext();
            }
        }
       
    	that.isTouchStart = false; 
    	that.distanceX = 0;
    	that.distanceY = 0;
	}
    
    /**
     * Отлавливаем double tap
     */
}
