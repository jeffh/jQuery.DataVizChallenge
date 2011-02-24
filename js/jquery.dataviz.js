var DataViz = (function($, document, window, undefined){

	var root = 'http://www.whatwepayfor.com/api/';
	
	var constants = {
		SORT_BY: {
			TOTAL: 0,
			CHANGE_IN_VALUE: 1,
			CHANGE_IN_PERCENT: 2,
			NAME: 3
		},
		SORTDIR: {
			DSC: 0,
			ASC: 1
		},
		TYPE: {
			ALL: 0,
			MANDATORY: 1,
			DISCRETIONARY: 2,
			NET_INTEREST: 3
		},
		FILING: {
			SINGLE: 0,
			MARRIED_FILING_JOINED: 1,
			MARRIED_FILING_SEPARATELY: 2,
			HEAD_OF_HOUSEHOLD: 3,
			WIDOW: 4
		}
	};
	
	var enumMaps = {
		SPENDING_TYPES: {
			0: 'All',
			1: 'Mandatory',
			2: 'Discretionary',
			3: 'Net Interest'
		}
	}
	
	$.fn.getAttributes = function(){
		var attributes = [];
		this.each(function(){
			var a = this.attributes;
			for(var i=0; i<a.length; i++){
				if (attributes.indexOf(a[i].name) === -1){
					attributes.push(a[i].name);
				}
			}
		});
		return attributes;
	};
	
	$.extend(String.prototype, {
		ends_with: function(str){
			return this.indexOf(str) + str.length === this.length;
		},
		begins_with: function(str){
			return this.indexOf(str) === 0;
		}
	});
	
	function strToBoolean(val){
		return (/^(true|yes|t|y|[1-9])/i).test(val);
	};
	
	var defaultProcessor = function(val){ return val; }

	function query(name, options, processor){ 
		processor = processor || defaultProcessor;
		options = options || {};
		//window.params = {};
		var url = root + name + '?' + $.param(options);
		return $.Deferred(function($d){
			$.ajax({
				url: url,
				dataType: 'jsonp',
				success: function(data){
					$d.resolve(processor(data));
				}
			});
		});
	}

	// performs a "mass assignment" from a given element to a given object
	// dictionary from a comma-separated string of fields.
	// processor is an optional function to modify the string value.
	function assignFields(from_element, to_obj, fields, processor){
		if (processor === undefined){
			processor = defaultProcessor;
		}	
		var $from_element = $(from_element);
		$.each($.isArray(fields)? fields : fields.split(','), function(i, name){
			to_obj[name] = processor($from_element.attr(name), name);
		});
	}

	function parseItems(xml, yield){
		var items = [];
		// not to most fault tolerant, but requires no plugin
		var $xml = $($.parseXML(xml));//$.xmlDOM(xml);
		$xml.find('item').each(function(){
			var $el = $(this);
			var item = yield($el);
		
			items.push(item);
		});
		return items;
	}
	
	function genericProcessor(value, name){
		if(name.ends_with("ID") || name.ends_with("i") || name.ends_with("TYI") || name.ends_with('I') || name === 'year' || name.ends_with("Type")){
			return parseInt(value, 10);
		} else if(name.ends_with('p') || name.ends_with('P')){
			return parseFloat(value);
		} else if(name === 'onBudget'){
			return strToBoolean(value);
		} else {
			return value;
		}
	}
	
	function genericParse(xml){
		return parseItems(xml, function($el){
			var item = {};
			var fields = $el.getAttributes();
			assignFields($el, item, fields, genericProcessor);
			return item;
		});
	}

	// public API
	return $.extend({}, constants, enumMaps, {
		root: root,
		query: query,
		getBudgetAccount: function(options){
			return query('getBudgetAccount', options, genericParse);
		},
		getBudgetAggregate: function(options){
			return query('getBudgetAggregate', options, genericParse);
		},
		getReceiptAccount: function(options){
			return query('getReceiptAccount', options, genericParse);
		},
		getReceiptAggregate: function(options){
			return query('getReceiptAggregate', options, genericParse);
		},
	});

})(jQuery, document, window);