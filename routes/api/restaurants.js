var express = require('express');
var router = express.Router();
var redis = require("redis");
var client = redis.createClient({host : '127.0.0.1', port : 6379});


/* GET restaurants:listing. */
router.get('/', (req, res) => {
		//레디스 설정
		console.log('GET restaurant');

		client.lrange("restaurants:lists", 0, -1, function(err, reply) {
			
			var restaurant_obj = [];
			reply.forEach(function(ele, index, array){

				console.log(ele);
				client.hgetall("restaurants:info:" + ele, function(err, info){	

					 	if(info != null && info.name == ele){
					 		
					 		restaurant_obj.push(info);
					 		
						}

						if(index === reply.length - 1){
				 			res.json(restaurant_obj);
				 		}
				});
			});
		});

		client.on('error', function (err) {
			console.log('Error ' + err);
		});
});

/* GET restaurants:name listing. */
router.get('/:name', (req, res) => {
		//레디스 설정
		
		var menu_name = req.params.name;

		console.log('GET restaurant:name');

		var restaurant_name = 'restaurant:' + menu_name;
		client.hgetall(restaurant_name, function(err, reply) {
			console.log(reply);
			res.json(reply);
		});

		client.on('error', function (err) {
			console.log('Error ' + err);
		});
});
module.exports = router;
