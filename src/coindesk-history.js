

const request    = require('request')
const moment     = require('moment')


/*	using coindesk api, prices in USD
 *	@params {
 *		start: <YYYY-MM-DD>, 	  default: first available datapoint: '2010-07-17'
 *		end:   <YYYY-MM-DD>, 	  default: todays date
 *		format: '[[]]' || '{{}}'  default: '[{}]'
 *		currency: ISO 4217 format default: 'USD'
 *	}
 *	@callback(Error, dataset)
 */

module.exports = function(params, callback){
	
	const f          = 'YYYY-MM-DD'	
	const fstBtcDate = '2010-07-17'
	const start      = moment(params.start).isBefore(fstBtcDate) ? fstBtcDate : params.start
	const end        = params.end ? params.end : moment().format(f)
	const currency   = params.currency ? params.currency : 'USD'
	
	function calcChange(x,y){
		return y == 0 ? 0 : (x - y) / (y / 100)
	}
	
	var url = `http://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}&currency=${currency}`

	request.get(url, (err, res, body) => {

		var parsed, data

		if(!err && res.statusCode == 200){
			
			let parsed = JSON.parse(body)

			Object.keys(parsed.bpi).forEach(
			
				(date, index) => {

					const close = parsed.bpi[date].toFixed(3)

					const yesterday = moment(date).add(-1, 'days').format(f)
					const change = index == 0 ? 0 : calcChange(parsed.bpi[yesterday], close).toFixed(3)

					if(params.format == '{{}}'){
						
						if(!(data instanceof Object))
							data = {}
						
						data[date] = {
							close: close,
							change: change
						}
						
					}
						
					if(params.format == '[[]]'){
						
						if(!(data instanceof Array))
							data = []
						
						data.push([
							date,
							close,
							change
						])
						
					}
					if(!params.format || params.format == '[{}]'){
						
						if(!(data instanceof Array))
							data = []
						
						data.push({ 
							date: date, 
							close: close,
							change: change
						})
						
					}

				})
				
		}
		
		if(data){
			if(data instanceof Array)
				data.reverse()
			callback(null, data)
		}
		else 
			callback(new Error('failed getting data from Coindesk'))

	})

}

