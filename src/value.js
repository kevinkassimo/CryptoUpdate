var webPage = require('webpage');
var fs = require('fs');
var system = require('system');
var args = system.args;
var page = webPage.create();

var CURRENCY = args[1];
var PURCHASE_AMT = parseFloat(args[2]);
var COST = parseFloat(args[3]);

// console.log("hello my friend " + CURRENCY + PURCHASE_AMT + COST);

// Log rrror messages
function log_error(msg) {
	console.log("ERROR: " + msg);
}

// variable exposing whether the page is loading or not
var isLoading = false;
page.onLoadStarted = function() {
	isLoading = true;
	//console.log('Loading ' + page.url + ' started');
};
page.onLoadFinished = function() {
	isLoading = false;
	//console.log('Loading ' + page.url + ' finished');
};
page.onConsoleMessage = function(msg) {
	var noise = /(^::.*$)|(regHelp)/;
	if (!noise.test(msg)) {
		if (msg.substring(0, 5) === "ERROR") {
			phantom.exit();
		}
		console.log(msg);
	}
}

function timeout() {
	setTimeout(function () {
		page.evaluate(function eval_func(PURCHASE_AMT, COST, log_error) {
			try {
				var element = $('#quote_price');
				if (element.length < 0) {
					log_error("cannot capture price OR invalid currency name");
					return;
				}
				var price = PURCHASE_AMT * parseFloat($('#quote_price').text().substring(1));
				if (price >= COST) {
					console.log("$ " + price + "    (+)");
				} else {
					console.log("$ " + price + "    (-)");
				}
			} catch (err) {
				log_error("webpage evaluation error OR invalid currency name");
			}
		}, PURCHASE_AMT, COST, log_error)
	}, 5000);
	
	setTimeout(function () {
		page.open("https://coinmarketcap.com/assets/" + CURRENCY, function (status) {
			if (status !== "success") {
				log_error("cannot connect to page OR invalid currency name");
				phantom.exit();
			}
		});
		timeout();
	}, 10000)
}

page.open("https://coinmarketcap.com/assets/" + CURRENCY, function (status) {
	if (status !== "success") {
		log_error("cannot connect to page OR invalid currency name");
		phantom.exit();
	}
});

timeout();

