/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

/**
 * Marquee, sliding texte, vertical strategy
 * @name onyx.MarqueeVerticalStrategy
 * @class
 * @author MacFJA
 * @version 1.0 (12/07/2012)
 */

enyo.kind({
	name: "onyx.MarqueeVerticalStrategy",

	published: {
		/** @lends onyx.MarqueeVerticalStrategy# */
		
		/**
		 * Container object.
		 * It contains all object and represent visible area
		 * @type Oject
		 * @default null
		 */
		visibleControl: null,
		
		/**
		 * Sliding object, it's the object that slide
		 * @type Object
		 * @default null
		 */
		sliderControl: null,
		
		/**
		 * The main text object.
		 * @type Object
		 * @default null
		 */
		textControl: null
	},
	
	events: {
		/** @lends onyx.MarqueeVerticalStrategy# */
		/**
		 * Inform that the animation is terminated
		 * @event
		 * @param {Object} inSender Event's sender
		 * @see enyojs.com for more information about events
		 */
		onEnd: "",
	},

	endValue: 0,
	marge: 30,

	/** @lends onyx.MarqueeVerticalStrategy# */

	/**
	 * Initilize class
	 * @private
	 * @function
	 */
	create: function() {
		this.inherited(arguments);
		
		this.sliderControl.setClasses("onyx-marquee-vertical-strategy");
	},

	/**
	 * Handler for <q>onStep</q> of the animator
	 * @private
	 */
	animationStep: function(inSender) {
		this.sliderControl.setBounds({top: "-"+inSender.value*this.endValue+"px"});
	},
	
	/**
	 * Handler for <q>onEnd</q> of the animator
	 * @private
	 */
	animationEnd: function(inSender) {
		this.stop();

		this.doEnd();
	},
	
	/**
	 * Inform if the text is clipped and, so, if the text need to slide
	 * @return <tt>true</tt> if the text need to slide
	 * @function
	 * @type Boolean
	 * @name onyx.MarqueeVerticalStrategy#needToSlide
	 */
	needToSlide: function() {
		if(!this.isReady()) return false;

		var refBound = this.visibleControl.getBounds(),
			textBound = this.textControl.getBounds();

		return (refBound.height < textBound.height);
	},
	
	/**
	 * Prepare the strategy and marquee element to the animation
	 * @function
	 * @name onyx.MarqueeVerticalStrategy#prepare
	 */
	prepare: function() {
		if(!this.isReady()) return false;

		var textBound = this.textControl.getBounds();
		this.endValue = textBound.height + this.marge;
	},
	
	/**
	 * Inform if the strategy is ready to work
	 * @private
	 * @type Boolean
	 * @return <tt>true</tt> if the strategy is ready
	 */
	isReady: function() {
		return (this.visibleControl && this.textControl && this.sliderControl);
	},
	
	/**
	 * Stop the aniamtion, set sliding to 0
	 * @function
	 * @name onyx.MarqueeVerticalStrategy#stop
	 */
	stop: function() {
		this.sliderControl.setBounds({top: "0px"});
	}
});