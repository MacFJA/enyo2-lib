enyo.localize.addArray([
	{ key: "decimalSeparator", en: ".", fr: ","},
	{ key: "longTimeWithSecondFormat",
		fr: "{$hours|0:minuit|1:1 heure|*:$hours heures} {$minutes|00:0 minute|01:1 minute|*:$minutes minutes} {$seconds|00:0 seconde|01:1 seconde|*:$seconds secondes}",
		en: "{$hours|0:midnight|1:1 hour|*:$hours hours} {$minutes|00:0 minute|01:1 minute|*:$minutes minutes} {$seconds|00:0 second|01:1 second|*:$seconds seconds}",
		default: "{$hours|0:midnight|1:1 hour|*:$hours hours} {$minutes|00:0 minute|01:1 minute|*:$minutes minutes} {$seconds|00:0 second|01:1 second|*:$seconds seconds} (this is the default format)"
	}
]);