//Here the only needed informations
//Note that the theme is generate only one time and it owned by a enyo.Component subclass (enyo.Notification)

enyo.kind({
	//use "notification" name space to avoid conflict
	name: "notification.*",

	//MUST have event "onTap" and "onClose"
	events: {
		onTap: "",//The notification have been tapped
		onClose: ""//The notification closed (after a tap or not)
	},

	//The request method
	newNotification: function(notification, uid) {
		/*
			the "notification" object and the "uid"
			is send in "onClose" and "onTap" event :
				this.doTap({"notification": notification, "uid": uid});
		*/
	}
});