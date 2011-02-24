jQuery DataViz
===========

This is a simple jquery-based API wrapper to whatwepayfor.com, specifically,
the competition for the `Data Viz Challenge`_. This library is licensed under MIT,
but I would like some credit if possible ;)

.. _Data Viz Challenge: http://www.datavizchallenge.org/using-api

To Use
---------

Simply include *jquery.dataviz.js* after including jQuery::

    <script src="path/to/jquery.dataviz.js" type="text/javascript" charset="utf-8"></script>
    
Then you can use it! The this plugin provides a global DataViz object close
to this::

    DataViz = {
      // API Functions
      getBudgetAccount: function(options){},
      getBudgetAggregate: function(options){},
      getReceiptAccount: function(options){},
      getReceiptAggregate: function(options){},
      
      // constants for readable code
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
  		},
  		
  		// for english-friendly enums of "spendingType"
  		SPENDING_TYPES: {
  			0: 'All',
  			1: 'Mandatory',
  			2: 'Discretionary',
  			3: 'Net Interest'
  		}
    }

The API Functions
----------

Each API Function returns a `deferred object`_ with resolve(json) being called on completion,
where *json* is javascriptified version of the XML.

The *options* that the functions accept are **identical to the API reference**! Keep that in
mind that certain keywords (eg - function) will not work unless you quote them::

    // doesn't work
    DataViz.getBudgetAccount({function: 3902});
    
    // much better
    DataViz.getBudgetAccount({'function': 3902});

But the calls above don't actually do anything with the data received. We need to attach
a function to .done()::

    DataViz.getBudgetAccount().done(function(items){
      console.log(items); // array of objects, where each attribute is a key-value pair.
    });
    
That's all, you can check out the examples (application.js) for a slightly more complex example.
    
.. _deferred object: http://api.jquery.com/category/deferred-object/