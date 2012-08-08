enyo.kind({
	name: "layout.FlexableLayout",
	kind: "Layout",
	
	getChildren: function() {
		return this.container.getControls();
	},

	getFreeSpace: function() {
		var items = this.getChildren();
		var occupied = 0;
		for (var tour=0;tour<items.length;tour++) {
			if (!items[tour].flex || items[tour].flex <= 0) {
				var bounds = items[tour].getBounds();
				var margin = layout.FlexableLayout.calcMarginExtents(items[tour].hasNode());
					margin["h"] = margin.left + margin.right;
					margin["v"] = margin.top + margin.bottom;
				occupied += (this.orient == "h")?bounds.width:bounds.height;
				occupied += margin[this.orient];
			}
		}
		var bounds = this.container.getBounds();
		var padding = layout.FlexableLayout.calcPaddingExtents(this.container.hasNode());
			padding["h"] = padding.left + padding.right;
			padding["v"] = padding.top + padding.bottom;
		var totalSpace = (this.orient == "h")?bounds.width:bounds.height;
		totalSpace -= padding[this.orient];

		return totalSpace-occupied;
	},

	getTotalFlex: function() {
		var total = 0;
		var items = this.getChildren();
		for(var tour in items) {
			if(items[tour].flex && items[tour].flex > 0) {
				total += items[tour].flex;
			}
		}

		return total;
	},

	reflow: function() {
		this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
		var freeSpace = this.getFreeSpace();
		var totalFlex = this.getTotalFlex();
		var items = this.getChildren();

		for (var tour in items) {
			if (items[tour].flex && items[tour].flex > 0) {
				var margin = layout.FlexableLayout.calcMarginExtents(items[tour].hasNode());
					margin["h"] = margin.left + margin.right;
					margin["v"] = margin.top + margin.bottom;
				var space = ((freeSpace/totalFlex)*items[tour].flex) - margin[this.orient];

				items[tour].applyStyle((this.orient == "h")?"width":"height", space+"px");
			}
		}
	},

	statics: {
		//Copied from FittableLayout
		//* @protected
		_ieCssToPixelValue: function(inNode, inValue) {
			var v = inValue;
			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
			var s = inNode.style;
			// store style and runtime style values
			var l = s.left;
			var rl = inNode.runtimeStyle && inNode.runtimeStyle.left;
			// then put current style in runtime style.
			if (rl) {
				inNode.runtimeStyle.left = inNode.currentStyle.left;
			}
			// apply given value and measure its pixel value
			s.left = v;
			v = s.pixelLeft;
			// finally restore previous state
			s.left = l;
			if (rl) {
				s.runtimeStyle.left = rl;
			}
			return v;
		},
		_pxMatch: /px/i,
		getComputedStyleValue: function(inNode, inProp, inBoundary, inComputedStyle) {
			var s = inComputedStyle || enyo.dom.getComputedStyle(inNode);
			if (s) {
				return parseInt(s.getPropertyValue(inProp + "-" + inBoundary));
			} else if (inNode && inNode.currentStyle) {
				var v = inNode.currentStyle[inProp + enyo.cap(inBoundary)];
				if (!v.match(this._pxMatch)) {
					v = this._ieCssToPixelValue(inNode, v);
				}
				return parseInt(v);
			}
			return 0;
		},
		//* Gets the boundaries of a node's margin or padding box.
		calcBoxExtents: function(inNode, inBox) {
			var s = enyo.dom.getComputedStyle(inNode);
			return {
				top: this.getComputedStyleValue(inNode, inBox, "top", s),
				right: this.getComputedStyleValue(inNode, inBox, "right", s),
				bottom: this.getComputedStyleValue(inNode, inBox, "bottom", s),
				left: this.getComputedStyleValue(inNode, inBox, "left", s)
			};
		},
		//* Gets the calculated padding of a node.
		calcPaddingExtents: function(inNode) {
			return this.calcBoxExtents(inNode, "padding");
		},
		//* Gets the calculated margin of a node.
		calcMarginExtents: function(inNode) {
			return this.calcBoxExtents(inNode, "margin");
		}
	}
});

enyo.kind({
	name: "layout.FlexableColumnsLayout",
	kind: "layout.FlexableLayout",
	orient: "h",
	layoutClass: "enyo-fittable-columns-layout"
});


enyo.kind({
	name: "layout.FlexableRowsLayout",
	kind: "layout.FlexableLayout",
	layoutClass: "enyo-fittable-rows-layout",
	orient: "v"
});