
const chai    = require('chai')
const should  = chai.should()
const sinon   = require('sinon')
var request   = require('request')

const btc = require('../src/coindesk-history')

const sampleResponse = {"bpi":{
	"2013-09-01":128.2597,
	"2013-09-02":127.3648,
	"2013-09-03":127.5915,
	"2013-09-04":120.5738,
	"2013-09-05":120.5333},
	"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index. BPI value data returned as USD.",
	"time":{
		"updated":"Sep 6, 2013 00:03:00 UTC",
		"updatedISO":"2013-09-06T00:03:00+00:00"
		}
	}

	
describe('btc()', function(){
	
	beforeEach(function(){
		const body = JSON.stringify(sampleResponse)
		const statusCode = {statusCode: 200}
		sinon.stub(request, 'get')
			 .yields(null, statusCode, body)
	})
	
	afterEach(function(){
		request.get.restore()
	})
	
	it('should get data as [[]]', function(){
		
		const params = {
			start: 	  '2013-09-01',
			end:	  '2013-09-05',
			format:   '[[]]',
			currency: 'USD'
		}
		
		btc(params, (err, data) => {
			
			(err == null).should.eql(true)
			
			data.should.be.instanceof(Array)
			data.length.should.eql(5)
			data.should.all.be.instanceof(Array)
			data.forEach(row => {
				row.length.should.eql(3)
			})
			
		})
		
	})
	
	it('should get data as [{}]', function(){
		
		const params = {
			start: 	  '2013-09-01',
			end:	  '2013-09-05',
			format:   '[{}]',
			currency: 'USD'
		}
		
		btc(params, (err, data) => {
			
			(err == null).should.eql(true)
			
			data.should.be.instanceof(Array)
			data.length.should.eql(5)
			data.should.all.be.instanceof(Object)
			data.forEach(row => {
				row.should.own.property('date')
				row.should.own.property('close')
				row.should.own.property('change')
			})
			
		})
		
	})
	
	it('should get data as {{}}', function(){
		
		const params = {
			start: 	  '2013-09-01',
			end:	  '2013-09-05',
			format:   '{{}}',
			currency: 'USD'
		}
		
		btc(params, (err, data) => {
			
			(err == null).should.eql(true)
			
			data.should.be.instanceof(Object)			
			data['2013-09-01'].should.be.instanceof(Object)
			data.should.own.property('2013-09-01')
			data['2013-09-01'].should.own.property('close')
			data['2013-09-01'].should.own.property('change')
			
			
		})
		
	})
	
})
