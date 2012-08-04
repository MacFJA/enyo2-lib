/**
 * Enyo Core
 * @see http://enyojs.com
 * @name enyo
 * @namespace
 */

/**
 * Undo and Redo abilities
 * @name enyo.UndoRedo
 * @class
 * @author MacFJA
 * @version 1.0 (22/07/2012)
 */
enyo.kind({
	name: "enyo.UndoRedo",
	kind: "enyo.Object",
	
	published: {
		/** @lends enyo.UndoRedo# */
		/**
		 * The parent object
		 * @field
		 * @name enyo.UndoRedo#parent
		 * @type Object
		 * @default null
		 */
		parent: null,
		/**
		 * The name of the property
		 * @type String
		 * @default ""
		 */
		property: ""
	},
	
	statics: {
		/** @lends enyo.UndoRedo */
		/**
		 * Prepare the object <code>inObject</code> to recieve undo/redo function
		 * @static
		 * @private
		 * @param {Object} inObject the object to prepare
		 */
		prepare: function(inObject){
			// Create, if needed, an object in in _inObject_ that recieve all data
			if (!inObject["undoRedo"]) {
				inObject["undoRedo"] = { originalFunction: [] };
			}
			// Create, if needed, an attribute that contain the actual state id of undo/redo history
			if (!inObject.undoRedo["selected"]) {
				inObject.undoRedo["selected"] = -1;
			}
			// Create, if needed, an array that contain the name of properties that have been changed (in chronological order)
			// For example :
			//     ["var1", "var1", "var2", "var1", "var2"]
			// means
			// var1 was modified, and after var1 again, and after var2, and after var1 (again), and finally var1
			// var1 -> var1 -> var2 -> var1 -> var2
			if (!inObject.undoRedo["history"]) {
				inObject.undoRedo["history"] = [];
			}
			// Create, if needed, a function that save the value of a property
			if (!inObject.undoRedo["save"]) {
				inObject.undoRedo["save"] = function(inName, inValue) {
					// First : save the new value
					// the method return true = saving success
					if (this.mems[inName].save(inValue)) {
						//Remove all unneccesary history
						while (this.selected != -1 && this.selected < this.history.length-1) {
							this.history.pop();
						}
						//Add this change
						this.history.push(inName);
						this.selected++;
						
						//Remove all unneccesary history of each propertie's memory
						for (var tour in this.mems) {
							this.mems[tour].removeHistory();
						}
					}
				};
			}
			
			// Create, if needed, a function that restore the previous state of the object
			if (!inObject["undo"]) {
				inObject["undo"] = function() {
					// At first, check if undo can be make
					if (this.undoRedo.selected < 0) {
						return false;
					}
					//Get the name of the property to undone
					var property = this.undoRedo.history[this.undoRedo.selected];
					this.undoRedo.selected--;
					return this.undoRedo.mems[property].undo();
				}
			}
			if (!inObject["redo"]) {
				inObject["redo"] = function() {
					//At first, check if redo can be make
					if (this.undoRedo.selected == this.undoRedo.history.length-1) {
						return false;
					}
					this.undoRedo.selected++;
					//Get the name of the property to re-done
					var property = this.undoRedo.history[this.undoRedo.selected];
					return this.undoRedo.mems[property].redo();
				}
			}
		},
		/**
		 * Add undo/redo abilities to the property <code>inProperty</code> of the object <code>inObject</code>
		 * @param {Object} inObject the object
		 * @param {String} inProperty the name of the property
		 * @returns {Boolean} <code>false</code> if the object <code>inObject</code> don't have the published property <code>inProperty</code>
		 */
		add: function(inObject, inProperty) {
			//Check if the object and the property are ok
			if (!(inObject && inObject.published && inObject.published[inProperty])) {
				return false;
			}
			//Prepare the object to receive undo/redo abilities
			enyo.UndoRedo.prepare(inObject);
			
			enyo.setObject("undoRedo.mems."+inProperty, new enyo.UndoRedo({parent: inObject, property: inProperty}), inObject);
			
			return true;
		}
	},

	/** @lends enyo.UndoRedo# */
	/**
	 * Copy <code>inValue</code> (copy value, not the reference).
	 * Make shadow copy if needed.
	 * For object, the object need to implement <b>compareTo</b> function in order to be copied
	 * @private
	 * @param {Everything?} inValue The value to copied
	 * @return {Everything?} The copie of the value or <code>undefined</code> is the value is an object and don't implement <code>compareTo</code>
	 */
	copyOf: function(inValue) {
		if (typeof(inValue) != "object") {
			//if typeof is not object we assume that the value is copy and not the reference
			return inValue;
		}
		else if (inValue.compareTo) {
			//if inValue don't have the method compareTo, undo/redo will not work,
			//due to shadow copy that implied original != shadowCopy
			return enyo.clone(inValue);
		}
		else {
			return undefined;
		}
	},
	
	/**
	 * Indicate if the value can be undone
	 * @return {Boolean} <code>true</code> if the value can be undone, <code>false</code> otherwise.
	 */
	canUndo: function() {
		return this.selected >= 0;
	},
	/**
	 * Indicate if the value can be re-done
	 * @return {Boolean} <code>true</code> if the value can be re-done, <code>false</code> otherwise.
	 */
	canRedo: function() {
		return this.selected < this.savedStates.length-1;
	},
	/**
	 * Undone the value of the property
	 * @return {Boolean} <code>true</this> if the property have been undone, <code>false</code> otherwise.
	 */
	undo: function() {
		if (!this.canUndo()) {
			return false;
		}
		this.selected--;
		this.setPropertyValue();
		return true;
	},
	/**
	 * Re-done the value of the property
	 * @return {Boolean} <code>true</this> if the property have been re-done, <code>false</code> otherwise.
	 */
	redo: function() {
		if (!this.canRedo()) {
			return false;
		}
		this.selected++;
		this.setPropertyValue();
		return true;
	},
	/**
	 * Set the property to the selectde saved values
	 * @private
	 */
	setPropertyValue: function() {
		if (this.selected == -1) {
			var value = this.initialValue;
		}
		else {
			var value = this.savedStates[this.selected];
		}
		this.parent["set"+enyo.cap(this.property)](value);
	},
	/**
	 * Prepare the parent object to undo/redo function.
	 * modified the setter of the property
	 * @private
	 */
	prepareParent: function() {		
		var setName = "set"+enyo.cap(this.property);
		var name = this.property;
		this.parent.undoRedo.originalFunction[setName] = enyo.bind(this.parent, this.parent[setName]);
		this.parent[setName] = function(v) {
			//Reinject original set function
			this.undoRedo.originalFunction[setName](v);
			//memento catching
			this.undoRedo.save(name, v);
		};
	},
	/**
	 * Get the selected save value
	 * @private
	 */
	getSelected: function() {
		if (this.selected == -1) {
			return this.initialValue;
		}
		else {
			return this.savedStates[this.selected];
		}
	},
	/**
	 * Save the new value
	 * @param {Everything?} inValue The new value of the property
	 * @return {boolean} <code>false</code> if the object can not be saved (cf. copyOf) or the new value is the actual stored value (happend on undo/redo), <code>true</code> if the value have been saved
	 */
	save: function(inValue) {
		var selectedValue = this.getSelected();
		if (
			selectedValue && (
			//Protect from undo/redo
			inValue == selectedValue ||
			//Protect saving from object than don't implement compareTo
			typeof(inValue) == "object" && !inValue.compareTo ||
			//Protect from undo/redo of object
			typeof(inValue) == "object" && inValue.compareTo(selectedValue)
		)) {
			return false;
		}

		//Remove all forward history
		this.removeHistory();

		//Save the new value
		this.savedStates.push(this.copyOf(inValue));

		this.selected++;

		return true;
	},

	/**
	 * Remove all value of the redo part.<br />
	 * <pre>
	1  2  3  4  5  6  7
	[Undo ]  ^  [ Redo]
	         |
	      Actual
	</pre>
	 * @private
	 */
	removeHistory: function() {
		//Remove all index after the selected value
		while (this.canRedo()) {
			this.savedStates.pop();
		}
	},

	/**
	 * The constructor of the class
	 * @constructor
	 * @param {Object} inProps The properties of the new object
	 * @ignore
	 */
	constructor: function(inProps) {
		this.inherited(arguments);
		
		//Read inProps data
		this.parent = inProps.parent;
		this.property = inProps.property;
		
		//Initialise data
		this.savedStates = [];
		this.selected = -1;
		
		//Get the initial value of the property
		this.initialValue = this.copyOf(this.parent[this.property]);
		
		//Prepare parent (edit setter)
		this.prepareParent();
	}
});