	;(function($, window, document, undefined){
		var Attributes = function(el, opt) {
			this.$element = el;
			this.defaults = {
				'color':'red',
				'fontSize':'12px'
			},
			this.options = $.extend({}, this.defauls, opt);
		}
		Attributes.prototype = {
			changecss: function() {
				return this.$element.css({
					'color': this.options.color,
					'fontSize': this.options.fontSize
				})
			}
		}
		jQuery.fn.myPlugin = function(options){
			var myRooms = new Attributes(this, options);

			return  myRooms.changecss();
			/*	返回绑定dom 高度
			var max = 0;
				this.each(function(){
					max = Math.max(max, $(this).height());
				});

			return max;*/
		};
	})(jQuery, window, document);