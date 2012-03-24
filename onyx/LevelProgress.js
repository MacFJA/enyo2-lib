/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

enyo.kind({
	name: "onyx.LevelProgress",
	kind: "enyo.Control",
	classes: "enyo-unselectable onyx-level-bar",

	published: {
		warning: 5,
		critical: 3,
		maximum: 8,
		minimum: 2,
		value: 5,
		editable: true,
		showValue: true,
	},

	handlers: {
		onresize: "rezise",
		ontap: "tap",
		ondragstart: "dragstart",
		ondragfinish: "dragfinish",
		onenter: "enter"
	},

	events: {
		onChange: "",
		onChanging: ""
	},
	
	margin: 6,//Left + Right
	inDrag: false,
	
	/**
	 * create function, init the object
	 * @private
	 */
	create: function() {
		this.inherited(arguments);
		enyo.asyncMethod(this, "redraw", true, true);
		//this.redraw(true, true);
	},

	  warningChanged: function() {
		this.redraw();
	},
	 criticalChanged: function() {
		this.redraw();
	},
	  maximumChanged: function() {
		if(this.maximum <= this.minimum) {
			this.maximum = this.minimum+1;
		}
		this.redraw(true, true);
	},
	  minimumChanged: function() {
		if(this.minimum >= this.maximum) {
			this.minimum = this.maximum-1;
		}
		this.redraw(true, true);
	},
	    valueChanged: function() {
		if(this.value < this.minimum) { this.value = this.minimum; }
		if(this.value > this.maximum) { this.value = this.maximum; }
		this.redraw();
	},
	
	showValueChanged: function() {
		this.redraw();
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
				classes: "onyx-level-element",
				value: tour,
				type: "visual"
			});
		}
		this.render();
	},

	redraw: function(updateWidth, force) {
		if(force) { this.build(); }
		
		var elements = this.getComponents();

		var bounds = this.getBounds()
		
		var elementWidth = Math.floor(bounds.width/(this.maximum-this.minimum)-this.margin);//-2 cause by border
		var className = "normal";
		if(this.value > this.warning)       { className = "normal"; }
		else if(this.value > this.critical) { className = "warning"; }
		else                                { className = "critical"; }
		
		for(tour=0;tour<elements.length;tour++) {
			if(updateWidth || force) { elements[tour].setBounds({width: elementWidth}, 'px'); }
			var elmValue = elements[tour].value;
			var isOn = elmValue <= this.value;
			elements[tour].setContent(this.showValue?elmValue:"");
			elements[tour].addRemoveClass("normal",   isOn && className == "normal");
			elements[tour].addRemoveClass("warning",  isOn && className == "warning");
			elements[tour].addRemoveClass("critical", isOn && className == "critical");
			elements[tour].addRemoveClass("off", !isOn);
		}
	},
	
	rezise: function() {
		this.redraw(true);
	},
	
	tap: function(inSender, inEvent) {
		if(!this.editable) { return; }
		if(inSender.type && inSender.type == "visual") {
			this.setValue(inSender.value);
			this.doChange({value: this.value});
		}
	},
	
	dragstart: function(inSender, inEvent) {
		if (this.editable && inEvent.horizontal) {
			this.inDrag = true;
			if(inSender.type && inSender.type == "visual") {
				this.setValue(inSender.value);
				this.doChanging({value: this.value});
			}
			inEvent.preventNativeDefault();
			return true;
		}
	},
	
	dragfinish: function(inSender, inEvent) {
		this.inDrag = false;
		inEvent.preventTap();
		this.doChange({value: this.value});
		return true;
	},
	
	enter: function(inSender, inEvent) {
		if(!this.editable || !this.inDrag) { return; }
		if(inSender.type && inSender.type == "visual") {
			this.setValue(inSender.value);
			this.doChanging({value: this.value});
			return true;
		}
	}
});