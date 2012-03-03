enyo.kind({
	name: "demoApp",
	kind: enyo.Control,
	components: [
		{tag: "h1", content: "enyo.localize"},
		{tag: "p", content: "enyo.localize is an object for translation, in the same way that webOS Mojo."},
		{tag: "hr"},
		{content: "Translate from: \"en_US\""},
		{content: "Sentence to translate:"},
		{tag: "select", name: "from", onchange: "selectChange", components: [
			{tag: "option", content: "{$month}/{$day}/{$year}"},
			{tag: "option", content: "Taxi cab"},
			{tag: "option", content: "{$count|0:No comments|1:One comment|*:$count comments} for the topic \"{$topic}\"", attributes: {selected: "selected"}},
			{tag: "option", content: "{$car|0:No car|1:One car|*:$car cars} and {$truck|0:no truck|1:one truck|*:$truck trucks}"},
			{tag: "option", content: "decimalSeparator"},
			{tag: "option", content: "longTimeWithSecondFormat"}
		]},
		{content: "Value of attributes (in JSON):"},
		{
			tag: "textarea",
			attributes: {rows: 6, width: "200em"},
			name: "contextString",
			content: "{\n\t\"count\": 123,\n\t\"topic\": \"hello world\"\n}"
		},
		{tag: "hr"},
		{content: "Translate to:"},
		{tag: "select", name: "toLanguage", components: [
			{tag: "option", content: "en_US"},
			{tag: "option", content: "en_UK"},
			{tag: "option", content: "en", attributes: {selected: "selected"}},
			{tag: "option", content: "fr_FR"},
			{tag: "option", content: "fr_CH"},
			{tag: "option", content: "fr"},
			{tag: "option", content: "jp"}
		]},
		{tag: "button", ontap: "autoD", content: "Auto Detect Language", classe: "blue"},
		{tag: "hr"},
		{content: "", name: "translateBox"},
		{tag: "button", ontap: "translate", content: "Go!", classes: "green"}
	],
	
	translateFrom: null,
	contextObj: null,
	
	updateData: function() {
		this.contextObj = enyo.json.parse(this.$.contextString.hasNode().value);
		this.translateFrom = this.$.from.hasNode().value;
		enyo.localize.destination = this.$.toLanguage.hasNode().value;
	},
	
	selectChange: function() {
		if(this.$.from.hasNode().value == "{$month}/{$day}/{$year}") {
			this.$.contextString.hasNode().value = "{\n\t\"day\": \"03\",\n\t\"month\": \"03\",\n\t\"year\": \"2012\"\n}";
		}
		else if(this.$.from.hasNode().value == "Taxi cab") {
			this.$.contextString.hasNode().value = "";
		}
		else if(this.$.from.hasNode().value == "{$count|0:No comments|1:One comment|*:$count comments} for the topic \"{$topic}\"") {
			this.$.contextString.hasNode().value = "{\n\t\"count\": 123,\n\t\"topic\": \"hello world\"\n}";
		}
		else if(this.$.from.hasNode().value == "{$car|0:No car|1:One car|*:$car cars} and {$truck|0:no truck|1:one truck|*:$truck trucks}") {
			this.$.contextString.hasNode().value = "{\n\t\"car\": 2,\n\t\"truck\": 0\n}";
		}
		else if(this.$.from.hasNode().value == "decimalSeparator") {
			this.$.contextString.hasNode().value = "";
		}
		else if(this.$.from.hasNode().value == "longTimeWithSecondFormat") {
			this.$.contextString.hasNode().value = "{\n\t\"hours\": \"14\",\n\t\"minutes\": \"13\",\n\t\"seconds\": \"32\"\n}";
		}
	},
	
	translate: function() {
		this.updateData();
		this.$.translateBox.setContent(enyo.T(this.translateFrom,this.contextObj));
	},
	autoD: function() {
		enyo.localize.autoDetectDestination();
		this.$.toLanguage.hasNode().value = enyo.localize.destination;
	}
});