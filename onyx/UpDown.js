/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

/**
 * Level progess bar
 * @name onyx.UpDown
 * @class
 * @author MacFJA
 * @version 1.0 (24/03/2012)
 */
enyo.kind({
	name: "onyx.UpDown",
	kind: "enyo.Control",
	classes: "enyo-unselectable onyx-updown",

	published: {
		/** @lends onyx.UpDown# */
		
		/**
		 * Disabled the control (use getter/setter)
		 * @type Boolean
		 * @default false
		 */
		disabled: false,
		
		/**
		 * Disabled the up button (use getter/setter)
		 * @type Boolean
		 * @default false
		 */
		disabledUp: false,
		
		/**
		 * Disabled the down button (use getter/setter)
		 * @type Boolean
		 * @default false
		 */
		disabledDown: false
	},

	/** @private */
	handlers: {
		ondown: "down",
		onup: "up",
		ontap: "tap"
	},

	events: {
		/** @lends onyx.UpDown# */
		/**
		 * Inform that the "+" (up) occurs
		 * @event
		 * @param {Object} inSender Event's sender
		 * @see enyojs.com for more information about events
		 */
		onUp: "",
		/**
		 * Inform that the "-" (down) occurs
		 * @event
		 * @param {Object} inSender Event's sender
		 * @see enyojs.com for more information about events
		 */
		onDown: ""
	},
	
	isdown: false,
	downoccur: 0,
	
	components: [
		{classes: "onyx-updown-down", name: "down", content: "-"},
		{classes: "onyx-updown-up", name: "up", content: "+"},
	],
	
	/** @lends onyx.UpDown */
	
	/**
	 * create function, init the object
	 * @private
	 */
	create: function() {
		this.inherited(arguments);
		this.disabledChanged();
		this.disabledUpChanged();
		this.disabledDownChanged();
	},

	/**
	 * Handler for <q>disabled</q> value change
	 * @private
	 */
	    disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled)
	},
	/**
	 * Handler for <q>disabledUp</q> value change
	 * @private
	 */
	  disabledUpChanged: function() {
		this.$.up.addRemoveClass("disabled", this.disabledUp);
	},
	/**
	 * Handler for <q>disabledDown</q> value change
	 * @private
	 */
	disabledDownChanged: function() {
		this.$.down.addRemoveClass("disabled", this.disabledDown);
	},
	
	/**
	 * Handler for <q>onTap</q> event
	 * @private
	 */
	tap: function(inSender, inEvent) {
		if(this.disabled ||
			inSender == this.$.up && this.disabledUp ||
			inSender == this.$.down && this.disabledDown)
			{ return false; }
			
		if(inSender == this.$.up) { this.doUp(); }
		if(inSender == this.$.down) { this.doDown(); }
	},
	
	/**
	 * Handler for <q>down</q> event
	 * @private
	 */
	down: function(inSender, inEvent) {
		if(this.disabled ||
			inSender == this.$.up && this.disabledUp ||
			inSender == this.$.down && this.disabledDown)
			{ return false; }
		this.isdown = true;
		this.downoccur = 0;
		enyo.job("press", enyo.bind(this, "askForAction", inSender == this.$.up), 500);
	},
	
	/**
	 * Handler for <q>up</q> event
	 * @private
	 */
	up: function() {
		this.isdown = false;
	},
	
	askForAction: function(isUp) {
		if(!this.isdown || this.disabled ||
			isUp && this.disabledUp ||
			!isUp && this.disabledDown)
		{
			enyo.job.stop("press");
		}
		else {
			if(isUp) { this.doUp(); }
			else { this.doDown(); }
			if(this.downoccur < 14) { this.downoccur++; }
			enyo.job("press", enyo.bind(this, "askForAction", isUp), 1000-this.downoccur*70);
		}
	}
});