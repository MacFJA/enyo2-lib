/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

/**
 * Fold and unfold part of page
 * @name onyx.Folding
 * @class
 * @author MacFJA
 * @version 1.0 (12/07/2012)
 */
enyo.kind({
	name: "onyx.Folding",
	kind: "enyo.Control",

	classes: "onyx-folding",

	published: {
		/** @lends onyx.Folding# */

		/**
		 * The duration of the folding animation (in milliseconds)
		 * @type Number
		 * @default 350
		 */
		duration: 350,
		
		/**
		 * The label to display went is folding
		 * @type String
		 * @default ""
		 */
		label: "",
		
		/**
		 * The folding value. Use getter/setter or fold() and unfold().
		 * if set to <tt>true</tt> the content of the control is folding.
		 * @type Boolean
		 * @default false
		 */
		folding: false
	},
	
	/**
	 * Components of the control
	 * @ignore
	 * @type Array
	 */
	components: [
		{name: "client"},
		{name: "folding", classes: "onyx-folding-volume", showing: false, components: [{name: "label", classes: "onyx-folding-label"}]},
		{name: "left", classes:"onyx-folding-left", showing: false},
		{name: "right", classes:"onyx-folding-right", showing: false},
		{kind: "Animator", startValue: 0, endValue: 1, onStep: "foldStep", name: "foldAnimator",   onEnd: "animatorEnd"},
		{kind: "Animator", startValue: 1, endValue: 0, onStep: "foldStep", name: "unfoldAnimator", onEnd: "animatorEnd"}
	],
	
	/** @lends onyx.Folding# */

	/**
	 * Handler for <q>duration</q> value change
	 * @function
	 * @private
	 */
	durationChanged: function() {
		this.$.foldAnimator.setDuration(this.duration);
		this.$.unfoldAnimator.setDuration(this.duration);
	},
	/**
	 * Handler for <q>label</q> value change
	 * @function
	 * @private
	 */
	labelChanged: function() {
		this.$.label.setShowing(!(this.label == ""));
		this.$.label.setContent(this.label);
	},
	/**
	 * Handler for <q>folding</q> value change
	 * @function
	 * @private
	 */
	foldingChanged: function() {
		if(this.folding) {
			this.makeFold()
		} else {
			this.makeUnfold();
		}
	},
	/**
	 * initialize view on launch (don't use it!)
	 * @function
	 * @private
	 */
	_startupfold: function() {
		if(this.folding) {
			this.$.folding.show();
			this.$.left.show();
			this.$.right.show();
			this.$.folding.applyStyle("opacity", 1);
			this.$.client.applyStyle("opacity", 0);
			this.$.left.applyStyle("width", "10px");
			this.$.right.applyStyle("width", "10px");
			this.applyStyle("height", "60px");
		}
		else {
			this.$.left.hide();
			this.$.right.hide();
			this.$.folding.hide();
			this.$.client.applyStyle("opacity", 1);
			this.applyStyle("height", this.$.client.getBounds().height+"px");
		}
	},

	/**
	 * create function, init the object
	 * @private
	 */
	create: function() {
		this.inherited(arguments);
		this._startupfold();
		this.durationChanged();
		this.labelChanged();
	},

	/**
	 * Alias of setFolding(true)
	 * @function
	 * @name onyx.Folding#fold
	 */
	fold: function() {
		this.setFolding(true);
	},
	
	/**
	 * Alias of setFolding(false)
	 * @function
	 * @name onyx.Folding#unfold
	 */
	unfold: function() {
		this.setFolding(false);
	},

	/**
	 * Execute the folding (setup and launch animation)
	 * @private
	 */
	makeFold: function() {		
		this.$.unfoldAnimator.stop();
		this.$.folding.show();
		this.$.left.show();
		this.$.right.show();
		this.$.foldAnimator.play();
	},
	/**
	 * Execute the unfolding (setup and launch animation)
	 * @private
	 */
	makeUnfold: function() {	
		this.$.foldAnimator.stop();
		this.$.unfoldAnimator.play();
	},
	
	/**
	 * Reverse the actual value of folding
	 */
	toogleFold: function() {
		this.setFolding(!this.folding);
	},

	/**
	 * Handler for <q>onStep</q> of the animator
	 * @private
	 */
	foldStep: function(inSender) {
		var bounds = this.$.client.getBounds();
		var heightValue = (bounds.height - 60) * (1 - inSender.value) + 60,
			value = inSender.value.toFixed(8),
			reverseValue = 1-inSender.value,
			borderValue = 10*inSender.value;
		
			heightValue = heightValue.toFixed(8);
			reverseValue = reverseValue.toFixed(8);
			borderValue = borderValue.toFixed(8);

		this.applyStyle("height", heightValue+"px");
		this.$.folding.applyStyle("opacity", value);
		this.$.client.applyStyle("opacity", reverseValue);
		this.$.left.applyStyle("width",  borderValue+"px");
		this.$.right.applyStyle("width", borderValue+"px");
	},
	
	/**
	 * Handler for <q>onEnd</q> of the animator
	 * @private
	 */
	animatorEnd: function(inSender) {
		if(inSender == this.$.unfoldAnimator) {
			this.$.folding.hide();
			this.$.left.hide();
			this.$.right.hide();
		}
	}
});