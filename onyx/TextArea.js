/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

/**
 * Onyx UI class for input
 * @see http://enyojs.com
 * @name onyx.Input
 * @class
 */

/**
 * @name onyx.TextArea
 * @class
 * @requires onyx.Input
 * @extends onyx.Input
 * @author MacFJA
 * @version 1.1 (03/03/2012)
 */
enyo.kind({
	/** @lends onyx.TextArea */
	name: "onyx.TextArea",
	kind: "onyx.Input",

	published: {
		/** @lends onyx.TextArea# */
		/**
		 * Define the resize behavoir (use getter/setter)
		 * @type Boolean
		 * @default true
		 */
		autoResize: true,
		
		/**
		 * The minimum number of row to display (use getter/setter)
		 * @type Number
		 * @default 2
		 */
		minRows: 2,
		
		/**
		 * The maximum number of row to display (use getter/setter).<br />
		 * Set to <tt><b>null</b></tt> to don't limit.
		 * @type Number
		 * @default null
		 */
		maxRows: null
	},

	events: {
		/** @lends onyx.TextArea# */
		/**
		 * Inform that the object size has changed
		 * @event
		 * @param {Object} inSender Event's sender
		 * @param {Number} oldSize The old number of rows
		 * @param {Number} newSize The new number of rows
		 * @see enyojs.com for more information about events
		 */
		onSizeChange: ""
	},
	/** @lends onyx.TextArea# */
	
	/**
	 * The node tag name
	 * @private
	 * @type String
	 */
	tag: "textarea",

	/**
	 * Attribute that contain the actual number of rows
	 * @private
	 * @type Number
	 */
	rowsCount: 2,
	
	/**
	 * create function, init the object
	 * @private
	 */
	create: function() {
		this.inherited(arguments);
		this.doResize();
	},
	/**
	 * Do the resize calculation and update the number of row
	 * @private
	 */
	doResize: function() {
		var lastRowsCount = this.rowsCount;
		this.setAttribute("rows", this.minRows);
		this.rowsCount = this.minRows;
		
		if(!this.hasNode() || !this.autoResize)
		{
			if(this.rowsCount != lastRowsCount)
				{ this.doSizeChange({before: lastRowsCount, now: this.rowsCount}); }
			return;
		}

		var node = this.hasNode();

		while(
			node.clientHeight < node.scrollHeight &&
			(!this.maxRows || this.rowsCount < this.maxRows)
		) {
			this.rowsCount++;
			this.setAttribute("rows", this.rowsCount);
		}

		if(this.rowsCount != lastRowsCount)
			{ this.doSizeChange(lastRowsCount, this.rowsCount); }
	},
	/**
	 * Handler for <q>minRows</q> value change
	 * @private
	 */
	minRowsChanged: function() {
		if(this.minRows < 1)
			{ this.minRows = 1; }
		this.doResize();
	},
	/**
	 * Handler dor <q>maxRows</q> value change
	 * @private
	 */
	maxRowsChanged: function() {
		if(this.maxRows < this.minRows)
			{ this.maxRows = this.minRows; }
		this.doResize();
	},
	/**
	 * Handler for <q>value</q> value change
	 * @private
	 */
	valueChanged: function() {
		this.inherited(arguments);
		this.doResize();
	},
	/**
	 * Handler for <q>onyx.Input</q> <q>oninput</q> events, call <q>doResize</q>
	 * @private
	 */
	input: function() {
		this.inherited(arguments);
		this.doResize();
	}
});