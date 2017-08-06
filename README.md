# Historical BTC Data from CoinDesk

Using CoinDesks historical API (see [coindesk.com/api](https://www.coindesk.com/api/))

## usage 

```javascript

var btc = require('coindesk-history')

const params = {
	start:  '2012-12-01',	// defaults to first datapoint available on CoinDesk: '2010-07-17'
	end:    '2013-01-01',	// defaults to todays date
	format: '[[]]',			// defaults to '[{}]'
	currency: 'EUR'			// defaults to 'USD'
}

function btcCallback(err, data){
	if(!err && data){
		// do something with data
	}
}

btc(params, btcCallback)

```


### Formats 

'{{}}':
```javscript
data = {
	<date>: {
		close: <close>,
		change: <change>
	},
	...
}
```

'[{}]':
```javscript
data = [
	{
		date:   <date>,
		close:  <close>,
		change: <change>
	},
	...
]
```

'[[]]':
```javscript
data = [
	[
		<date>,
		<close>,
		<change>
	],
	...
]
```