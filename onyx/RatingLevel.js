/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

enyo.kind({
	name: "onyx.RatingLevel",
	kind: "onyx.LevelProgress",
	classes: "enyo-unselectable onyx-rating-bar",

	
	
	create: function() {
		this.inherited(arguments);
		this.margin = 7;
		enyo.asyncMethod(this, "redraw", true, true);
		//this.redraw(true, true);
	},

	build: function() {
		this.destroyComponents();
		this.createComponent({
			kind: "enyo.Control",
			onenter: "enter",
			classes: "onyx-level-element-hidden",
			value: this.minimum,
			type: "visual"
		});
		for(var tour=this.minimum+1;tour<=this.maximum;tour++) {
			this.createComponent({
				kind: "enyo.Control",
				onenter: "enter",
				classes: "onyx-rating-element",
				value: tour,
				type: "visual"
			});
		}
		this.render();
	}
});