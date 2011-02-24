(function($, document, window, undefined){
	$.extend(Number.prototype, {
		in_thousands: function(){ return this / 1000.0; },
		in_millions: function(){ return this / 1000000.0; },
		in_billions: function(){ return this / 1000000000.0; },
		round: function(dec){
			return Math.round(this * Math.pow(10, dec)) / Math.pow(10, dec);
		},
		readable_string: function(){
			var types = {
				'in_billions':'B',
				'in_millions':'M',
				'in_thousands':'k'
			};
			var result;
			var self = this;
			$.each(types, function(name, postfix){
				var val = self[name]();
				if(val > 1 || val < -1){
					result = val + postfix;
					return false; // break
				}
			});
			return result || String(this);
		},
		readable_percent_string: function(dec){
			if(this === NaN)
				return "";
			return (this * 100).round(dec) + "%";
		}
	});
	
	$.extend(String.prototype, {
		readable_string: function(){
			return this;
		},
		to_int: function(){
			return parseInt(this, 10);
		},
		to_float: function(){
			return parseFloat(this);
		}
	});
	
	$.extend(Boolean.prototype, {
		readable_string: function(){
			return this ? "Yes" : "No";
		}
	})
	
})(jQuery, document, window);