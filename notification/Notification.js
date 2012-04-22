/**
 * Enyo UI
 * @see http://enyojs.com
 * @name enyo
 * @namespace
 */

/**
 * Dynamic loaded list
 * @name enyo.Notification
 * @class
 * @author MacFJA
 * @version 1.0 (22/04/2012)
 */
enyo.kind({
	name: "enyo.Notification",
	kind: "enyo.Component",

	published: {
		/** @lends enyo.Notification# */
		/**
		 * The default notification theme (use getter/setter)
		 * @field
		 * @type String
		 * @default "notification.Bezel"
		 */
		defaultTheme: "notification.Bezel",
	},

	events: {
		/** @lends enyo.Notification# */
		/**
		 * Inform that a notification has been send
		 * @event
		 * @param {Object} inSender Event's sender
		 * @param {Object} inEvent The notification
		 * @see enyojs.com for more information about events
		 */
		onNotify: "",

		/**
		 * Inform that the notification is tap
		 * @event
		 * @param {Object} inSender Event's sender
		 * @param {Object} inEvent The notification
		 * @see enyojs.com for more information about events
		 */
		onTap: ""
	},
	/** @lends enyo.Notification# */

	/**
	 * The list of waiting notification
	 * @field
	 * @type Array
	 * @private
	 * @default <tt>[]</tt>
	 * @name enyo.Notification#pending
	 */
	pending: [],

	/**
	 * The list of loaded theme
	 * @field
	 * @type Array
	 * @private
	 * @default <tt>[]</tt>
	 * @name enyo.Notification#themes
	 */
	themes: [],

	/**
	 * The last unique identifier
	 * @field
	 * @type Number
	 * @private
	 * @default 0
	 * @name enyo.Notification#uid
	 */
	uid: 0,

	/**
	 * Send a new notification
	 * @function
	 * @name enyo.Notification#sendNotification
	 * @param {Object} notification The notification to send
	 * @param {Function} [callback] The callBack function
	 */
	sendNotification: function(notification, callback) {
		this.pending.push({
			uid: this.uid,
			notification: notification,
			callback: (typeof(callback) != "function")?enyo.nop:callback,//if no callback function, use enyo.nop
		});
		//Get the theme (or defaultTheme if no theme specified) and send the notification
		this.getTheme(notification.theme||this.defaultTheme).newNotification(notification, this.uid);
		this.doNotify(notification);//Send a event to inform about this new notification
		this.uid++;//Increment uid of notification
	},

	/**
	 * Return the theme with a specific name
	 * @function
	 * @private
	 * @param {String} name The name of the theme
	 * @returns The theme
	 * @type Object
	 * @name enyo.Notification#getTheme
	 */
	getTheme: function(name) {
		//Search the theme
		for(var tour=0,size=this.themes.length;tour<size;tour++) {
			if(this.themes[tour].name == name) {
				return this.themes[tour].component;//Return the component
			}
		}
		//If here, the theme doesn't exist, so create it.
		var newNode = this.createComponent({kind: name, onTap: "notifTap", onClose: "notifClose"}, {owner: this});
		this.themes.push({name: name, component: newNode});
		return this.themes[this.themes.length-1].component;//Return the new theme
	},

	/**
	 * Handler for <q>onTap</q> event
	 * @function
	 * @name enyo.Notification#notifTap
	 * @private
	 */
	notifTap: function(inSender, inEvent) {
		//Search the notification by its uid
		for(var tour=0,size=this.pending.length;tour<size;tour++) {
			if(this.pending[tour].uid == inEvent.uid) {
				this.pending[tour].callback(this.pending[tour].notification);//call the callback function
				this.doTap(this.pending[tour].notification);//Send a onTap event
				enyo.remove(this.pending[tour], this.pending);//Remove the pending notification
				return;//End the function
			}
		}
	},

	/**
	 * Handler for <q>onClose</q> event
	 * @function
	 * @name enyo.Notification#notifClose
	 * @private
	 */
	notifClose: function(inSender, inEvent) {
		//Search the notification by its uid
		for(var tour=0,size=this.pending.length;tour<size;tour++) {
			if(this.pending[tour].uid == inEvent.uid) {
				enyo.remove(this.pending[tour], this.pending);//Remove the pending notification
				return;//Exit the function
			}
		}
	}
});