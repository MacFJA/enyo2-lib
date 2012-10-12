/**
 * Enyo
 * @see http://enyojs.com
 * @name enyo
 * @namespace
 */

/**
 * Grid Layout
 * @name enyo.GriddableLayout
 * @class
 * @author MacFJA
 * @version 1.0 (12/10/2012)
 */
enyo.kind({
	name: "GriddableLayout",
	kind: "Layout",
	layoutClass: "GriddableLayout",

	statics: {
		/** @lends enyo.GriddableLayout */
		/**
		 * Get bounds (external and internal)
		 * @param {enyo.instance} object The enyo object to mesaure
		 * @returns {Object} Bounds (<code>outer</code> and <code>inner</code>)
		 */
		cssSize: function(object) {
			var result = {
				//standard bounds
				outer: object.getBounds(),
				inner: {
					width: 0,
					height: 0
				}
			};
			// read CSS : border width (left and right) and padding (left and right)
			var space = parseInt(object.getComputedStyleValue("border-left-width", "0"));
			space+= parseInt(object.getComputedStyleValue("padding-left", "0"));
			space+= parseInt(object.getComputedStyleValue("border-right-width", "0"));
			space+= parseInt(object.getComputedStyleValue("padding-right", "0"));
				result.inner.width = result.outer.width - space;

			// read CSS : border width (top and bottom) and padding (top and bottom)
			space = parseInt(object.getComputedStyleValue("border-top-width", "0"));
			space+= parseInt(object.getComputedStyleValue("padding-top", "0"));
			space+= parseInt(object.getComputedStyleValue("border-bottom-width", "0"));
			space+= parseInt(object.getComputedStyleValue("padding-bottom", "0"));
				result.inner.height = result.outer.height - space;

			return result;
		}
	},

	/** @lends enyo.GriddableLayout# */
	/**
	 * Return all control of the layout
	 * @private
	 * @returns {Array} List of <code>enyo.instance</code>
	 */
	getChildren: function() {
		return this.container.getControls();
	},
	
	/**
	 * Read info form the Component that have the layout
	 * @private
	 */
	readInfos: function() {
		this.cols = this.container.cols;
		this.fittableCol = this.container.fittableCol;
	},
	
	/**
	 * List of width (one per colums)
	 * @field
	 * @private
	 * @type Array
	 */
	colsSize: [],
	/**
	 * List of height (one per rows)
	 * @field
	 * @private
	 * @type Array
	 */
	rowsSize: [],
	/**
	 * Column count
	 * @field
	 * @private
	 * @type Number
	 */
	cols: -1,
	/**
	 * The index of the column that fit all free space.
	 * If -1, the last column is choose
	 * @field
	 * @private
	 * @type Number
	 * @default -1
	 */
	fittableCol: -1,
	
	/**
	 * Calculate Columns and rows size
	 * @private
	 */
	getColsSize: function() {
		//reset stored values
		this.colsSize = [];
		this.rowsSize = [];

		//Initialize variables
		var elms = this.getChildren(),
			col = 0,
			row = 0,
			totalSize = 0;

		for (var tour=0;tour<elms.length;tour++) {
			col = tour%this.cols;
			row = Math.floor(tour/this.cols);
			//Reset components size
			elms[tour].applyStyle("height", null);
			elms[tour].applyStyle("width", null);

			var elmBounds = elms[tour].getBounds();

			if (!this.colsSize[col] || this.colsSize[col] < elmBounds.width) this.colsSize[col] = elmBounds.width;
			if (!this.rowsSize[row] || this.rowsSize[row] < elmBounds.height) this.rowsSize[row] = elmBounds.height;
		}

		//Get the width of all columns
		for (var tour in this.colsSize) { totalSize += this.colsSize[tour]; }

		//Get the available space in the layout
		var totalWidth = GriddableLayout.cssSize(this.container).inner.width;
		//Get the columns that will fit
		var fitCol = (this.fittableCol>-1&&this.fittableCol<this.cols)?this.fittableCol:this.cols-1;

		var leftWidth = totalWidth - totalSize;
		if (leftWidth < 1) { return; }
		this.colsSize[fitCol] += leftWidth; 
	},

	/**
	 * Reflow components
	 */
	reflow: function() {
		this.readInfos();
		if (this.cols < 1) return;
		this.getColsSize();

		var elms = this.getChildren(),
			col = 0,
			row = 0;
		for(var tour=0;tour<elms.length;tour++) {
			col = tour%this.cols;
			row = Math.floor(tour/this.cols);
			elms[tour].applyStyle("height", this.rowsSize[row]+"px");
			elms[tour].applyStyle("width", this.colsSize[col]+"px");
		}
	}
});