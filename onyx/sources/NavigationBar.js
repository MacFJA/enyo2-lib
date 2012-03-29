/**
 * Enyo UI
 * @see http://enyojs.com
 * @name onyx
 * @namespace
 */

/**
 * A navigation bar (path bar)
 * @name onyx.NavigationBar
 * @class
 * @author MacFJA
 * @version 1.0 (30/03/2012)
 * @requires enyo.Scroller
 */
enyo.kind({
	/** @lends onyx.NavigationBar# */
	name: "onyx.NavigationBar",
	kind: "enyo.Control",
	classes: "enyo-unselectable onyx-navigationbar",

	published: {},

	handlers: {},

	/*a*
	 * Events send by the NavigationBar control
	 */
	events: {
		/** @lends onyx.NavigationBar# */
		/**
		 * Inform that the selected part of the path changed
		 * @event
		 * @param {Object} inSender Event's sender
		 * @param {Object} inEvent <tt>inEvent.old</tt> is the previously selected id, and <tt>inEvent.new</tt> is the new one
		 * @see enyojs.com for more information about events
		 */
		onSelected: "",
		/**
		 * Inform that a part of the path has been removed
		 * @event
		 * @param {Object} inSender Event's sender
		 * @param {Object} inEvent <tt>inEvent.path</tt> the name (label) of the remove part, <tt>inEvent.id</tt> the id of the remove part
		 * @see enyojs.com for more information about events
		 */
		onPathRemove: ""
	},
	/** @lends onyx.NavigationBar# */
	
	/**
	 * The id of the actual selected path
	 * @private
	 * @type Number
	 * @default -1
	 */
	selected: -1,
	
	/**
	 * List of part of the path {label, node, uid}
	 * @private
	 * @type Array
	 * @default []
	 */
	items: [],
	
	/**
	 * The last uid (only increase)
	 * @private
	 * @type Number
	 * @default 0
	 */
	uid: 0,
	
	/**
	 * Components of the control
	 * @ignore
	 * @type Array
	 * @default the scroller
	 */
	components: [
		{kind: "enyo.Scroller", strategyKind: "TouchScrollStrategy", vertical: false, name: "scroller"}
	],
	
	/**
	 * create function, init the object
	 * @private
	 */
	create: function() {
		this.inherited(arguments);
		this.$.scroller.addClass("onyx-navigationbar-scroller")
	},
	
	/**
	 * At a "level" to the path (<=> add a folder), remove all level after the selected part before adding
	 * @name onyx.NavigationBar#addToPath
	 * @function
	 * @param {String} path The name of the "level"
	 * @returns the id of the new level
	 * @type Number
	 */
	addToPath: function(path) {
		var next = this._getItemAfter(this.selected);//Get the element after the selected "level"
		if(next)
			{ this.removeItemById(next.uid); }//Remove the next element (that will remove its next element, etc.)
		
		this.uid++;//Increase the uid
		//Create a new component
		var node = this.$.scroller.createComponent({
			kind: "enyo.Control",
			classes: "onyx-navigationbar-item",
			content: path,
			index: this.uid,
			ontap: "tap",
			ondblclick: "dbltap",
		}, {owner: this});
		this.$.scroller.render();
		
		this.items.push({label: path, node: node, uid: this.uid});//Add the new "level" in the internal list
		this.selectItemById(this.uid);//Select the new "level"
		return this.uid;//Return the id of the new "level"
	},
	
	/**
	 * Handler for <q>onTap</q> event
	 * @private
	 */
	tap: function(inSender, inEvent) {
		if(inSender.hasClass("onyx-navigationbar-item") && this.selected != inSender.index) {
			this.selectItemById(inSender.index);//Select the "level"
			return true;//End event propagation
		}
	},
	/**
	 * Handler for <q>onDblClick</q> event
	 * @private
	 */
	dbltap: function(inSender, inEvent) {
		if(inSender.hasClass("onyx-navigationbar-item")) {
			this.selectItemById(inSender.index);//Select the "level"
			
			var next = this._getItemAfter(inSender.index);
			if(next)
				{ this.removeItemById(next.uid); }//Remove all "level" after
			
			return true;//End event propagation
		}
	},
	
	/**
	 * Gets an item (label, node, uid) with its id
	 * @private
	 * @param {Number} id The object's id
	 * @returns The object, or <tt><b>null</b></tt> if not found
	 * @type Object
	 */
	_getItem: function(id) {
		for(var tour=0,size=this.items.length;tour<size;tour++) {
			if(this.items[tour].uid == id) { return this.items[tour]; }
		}
		
		return null;
	},
	
	/**
	 * Selects a level with its id
	 * @param {Number} id The id to select
	 * @param {Boolean} noneIsNull If <tt><b>true</b></tt>, no selected item if the "level" with the id <q>id</q> is not found, if <tt><b>false</b></tt> the selected "level" is unchanged
	 */
	selectItemById: function(id, noneIsNull) {
		var item = this._getItem(id),
			prevUid = this.selected;//Store the old id
		
		if(this.selected > -1 && (item || noneIsNull)) {
			this._getItem(this.selected).node.removeClass("selected");//Remove the selection on the previously selected item
		}
		
		if(!!item) {//If item exist
			item.node.addClass("selected");//Then select it
			this.selected = item.uid;//And update the selected id
			
			this.doSelected({"old": prevUid, "new": item.uid});//Send event
		} else if(noneIsNull) {
			this.selected = -1;//Update the selected id
			
			this.doSelected({"old": prevUid, "new": -1});//Send event
		}
	},
	
	/**
	 * Remove a "level", and all "level" after, by a given id
	 * @param {Number} id The id of the "level" to remove
	 */
	removeItemById: function(id) {
		var item = this._getItem(id);
		if(!!item) {
			if(this.selected == id) {
				//The item to remove is the selected one
				var before = this._getItemBefore(id);
				this.selectItemById(!before?-1:before.uid, true);//If an item before select it, or select nothing
			}

			var next = this._getItemAfter(item.uid),
				path = item.label,
				oldId = item.uid;
			if(next) { this.removeItemById(next.uid); }//Remove the next item (if exist)

			this.items.pop();//Remove the last element of the array

			item.node.destroy();//Destroy the node
			this.doPathRemove({"path": path, "id": oldId});//Send event
		}
	},
	
	/**
	 * Gets the item (label, node, uid) after a given id
	 * @private
	 * @param {Number} id The reference id
	 * @returns The item after, or <tt><b>null</b></tt> if reference item doesn't exist or if no item after the reference
	 * @type Object
	 */
	_getItemAfter: function(id) {
		for(var tour=0,size=this.items.length;tour<size;tour++) {
			if(this.items[tour].uid == id) {
				if(tour == size-1) { return null; }//The last item
				return this.items[tour+1];
			}
		}
		
		return null;
	},
	
	/**
	 * Gets the item (label, node, uid) before a given id
	 * @private
	 * @param {Number} id The reference id
	 * @returns The item before, or <tt><b>null</b></tt> if reference item doesn't exist or if the reference is the first item
	 * @type Object
	 */
	_getItemBefore: function(id) {
		for(var tour=0,size=this.items.length;tour<size;tour++) {
			if(this.items[tour].uid == id) {
				if(tour == 0) { return null; }//The first item
				return this.items[tour-1];
			}
		}
		
		return null;
	},
	
	/**
	 * Gets the item (path, id) by its <q>id</q>
	 * @param {Number} id The reference id
	 * @returns An object ({"path": "...", "id": "..."}), or <tt><b>null</b></tt> if id doesn't exist
	 * @type Object
	 */
	getItemById: function(id) {
		var item = this._getItem(id);
		if(item) {
			return {"path": item.label, "id": id};
		}
		else {
			return null;
		}
	},
	/**
	 * Gets the list of items (path, id) by their <q>path</q>
	 * @param {String} path the path to find
	 * @returns An array of object ({"path": "...", "id": "..."})
	 * @type Array
	 */
	getItemsByPath: function(path) {
		var items = [],
			tour = 0,
			size = this.items.length;
		for(;tour<size;tour++) {
			if(this.items[tour].label == path) { items.push({"path": path, id: this.items[tour].uid}) }
		}
		
		return items;
	},
	
	/**
	 * Gets the item (path, id) after the selected item
	 * @returns The next object ({"path": "...", "id": "..."}), or <tt><b>null</b></tt> if the selected item is the last one
	 * @type Object
	 */
	getNextItem: function() {
		var next = this._getItemAfter(this.selected);
		return this.getItemById(next?next.uid:null);
	},
	
	/**
	 * Gets the item (path, id) before the selected item
	 * @returns The previous object ({"path": "...", "id": "..."}), or <tt><b>null</b></tt> if the selected item is the first one
	 * @type Object
	 */
	getPreviousItem: function() {
		var before = this._getItemBefore(this.selected);
		return this.getItemById(before?before.uid:null);
	},
	
	/**
	 * Selects the item (path, id) after the actual selected item
	 */
	selectNextItem: function() {
		var next = this._getItemAfter(this.selected)
		this.selectItemById(next?next.uid:null)
	},
	
	/**
	 * Selects the item (path, id) before the actual selected item
	 */
	selectPreviousItem: function() {
		var before = this._getItemBefore(this.selected)
		this.selectItemById(before?before.uid:null)
	}
});