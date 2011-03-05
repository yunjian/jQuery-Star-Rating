/*
*  @Name 		jQuery Rating Plugin
*  @Version 	0.1.1-beta
*  @Author 		Irfan Durmus
*/

(function($){
	$.fn.rating = function(uo, callback){
	    
	    if (!callback) {
		    callback = function(){};
		}
		
	    if (typeof uo === 'function') {
	        callback = uo;
	    }
	    
		if (!uo || typeof uo !== 'object') {
		    uo = {};
		}
		
		uo.callback = callback;
				
		// each for all item
		this.each(function(i, v){
			
			// if UserOptions.callback undefined...
			if (!uo.callback) {
				uo.callback = function(){};
			};
			
			var options = $.extend({}, defaults, uo);
			
			$(v).data('rating', options)
				.unbind('init.rating')
				.bind('init.rating', $.fn.rating.init)
				.trigger('init.rating');
		});
	};
	
	$.extend($.fn.rating, {
		init: function(e){
			
			var el = $(this),
				list = '',
				isChecked = null,
				isReadOnly = null,
				childs = el.children();
			
			for (var i=0; i < childs.length; i++) {
				list = list + '<a class="star" title="' + $(childs[i]).val() + '" />';
				if ($(childs[i]).is(':checked')) {
					isChecked = $(childs[i]).val();
				};
				if ($(childs[i]).attr('readonly')) {
					isReadOnly = $(childs[i]).val();
				};
			};
			
			childs.hide();
			
			el
				.append('<div class="stars">' + list + '</div>')
				.unbind('set.rating')
				.bind('set.rating', $.fn.rating.set)
				.trigger('set.rating', isChecked, isReadOnly);
			
			$('a', el).live('click', function(e){
				
				if (!isReadOnly) {
					$(this)
						.unbind('clickAct.rating')
						.bind('clickAct.rating', $.fn.rating.clickAct)
						.trigger('clickAct.rating');
				}
			});
			
			el.data('rating').callback(e);
		},
		set: function(e, val, readonly) {
			//console.log(e, val)
			var el = $(this);
			
			if (val) {
				el.find('a').removeClass('fullStar');
				
				var input = $('a', el).filter(function(i){
					if ($(this).attr('title') == val)
						return $(this);
					else
						return false;
				});
				
				input
					.addClass('fullStar')
					.prevAll()
					.addClass('fullStar');
			}
			
			if (readonly) {
				el
					.unbind('hoverAct.rating')
					.bind('hoverAct.rating', $.fn.rating.hoverAct)
					.trigger('hoverAct.rating', val);
			}
			
			el.data('rating').callback(e);
			return;
		},
		hoverAct: function(e, i){
			//console.log(e, i, this);
			var el = $(this),
				stars = $('a', el);
			
			stars.live('mouseenter', function(e){
				// add tmp class when mouse enter
				$(this)
					.addClass('tmp_fs')
					.prevAll()
					.addClass('tmp_fs');
				
				$(this).nextAll()
					.addClass('tmp_es');
			});
			
			stars.live('mouseleave', function(e){
				// remove all tmp class when mouse leave
				$(this)
					.removeClass('tmp_fs')
					.prevAll()
					.removeClass('tmp_fs');
				
				$(this).nextAll()
					.removeClass('tmp_es');
			});
			el.data('rating').callback(e);
		},
		clickAct: function(e){
			e.preventDefault();
			var el = $(e.target),
				inputs = $(e.target).parent().parent().children('input'),
				
				matchInput = inputs.filter(function(i){
					if ($(this).val() == el.attr('title'))
						return true;
					else
						return false;
				});
			
			matchInput.attr('checked', true);
			
			el.parent().parent()
				.trigger('set.rating', matchInput.val(), 'readonly')
				.data('rating').callback(e);
		}
	});
	
	defaults = {};
	
})(jQuery)