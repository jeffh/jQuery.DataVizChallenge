(function($, document, window, undefined){
	
function td(content){
	var td = document.createElement('td');
	return $(td).html(content);
}
function process_datatype(value, datatype){
	if(value === true || value === false){
		value = value.readable_string();
	} else if(datatype !== undefined){
		if (datatype === 'large-int'){
			value = value.readable_string();
		} else if(datatype === 'percent')
			value = String(value).to_float().readable_percent_string(4);
	}
	if(value === NaN || value === 'NaN')
		value = "";
	return String(value)
}
function add_rows_to(selector){
	return function(rows){
		var fields = [];
		var largeNumberFields = [];
		var dataTypes = {};
		var enumFields = {};
		var $selector = $(selector);
		$selector.find('th').each(function(){
			var $this = $(this);
			var name = $this.attr('data-field');
			fields.push(name);
			if($this.attr('data-type'))
				dataTypes[name] = $this.attr('data-type');
			if($this.attr('data-enum')){
				enumFields[name] = $this.attr('data-enum');
			}
		});
		$.each(rows, function(i, item){
			setTimeout(function(){
				var $row = $(document.createElement('tr'));
				$.each(fields, function(i, name){
					var value = item[name] === undefined ? "" : item[name];
					if(enumFields[name]){
						value = DataViz[enumFields[name]][value] || "";
					} else {
						value = process_datatype(value, dataTypes[name])
					}
					$row.append(td(value));
				});
				$('table').append($row);
			}, 10 * i);
		});
	};
}

$(function(){
	if($('#getBudgetAccount').length){
		DataViz.getBudgetAccount({
			showChange: 1,
			showExtra:1
		}).done(add_rows_to('table'));
	}
	else if($('#getBudgetAggregate').length){
		DataViz.getBudgetAggregate({
			group: "function",
			showChange: 1,
			showExtra:1
		}).done(add_rows_to('table'));
	}
	else if($('#getReceiptAccount').length){
		DataViz.getReceiptAccount({
			year: 2005,
			showChange: 1,
			showExtra:1
		}).done(add_rows_to('table'));
	}
	else if($('#getReceiptAggregate').length){
		DataViz.getReceiptAggregate({
			year: 2007,
			showChange: 1,
			showExtra:1,
			group: 'category'
		}).done(add_rows_to('table'));
	}
});

})(jQuery, document, window);