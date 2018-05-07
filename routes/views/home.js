var express = require('express');
var router = express.Router();
var request = require('request');
var redis = require("redis");
var client = redis.createClient({host : '127.0.0.1', port : 6379});
/*
	host: 'httpbin.org',
	path: '/ip'
*/
// hostname: 'openapi.airkorea.or.kr',
// path :'/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=종로구&dataTerm=daily&pageNo=1&numOfRows=1&ServiceKey=HfwoMWjEXZ%2FxxrKKfH%2FdjJNpMUpwXImRpAUHcRxH5219TkZTSrEKUcny%2F4WcVRiDUDw9eC1YQbAIbuFoAqJebQ%3D%3D&ver=1.3&_returnType=json'
// var headers = {
// // 	'User-Agent':       'Super Agent/0.0.1',
//     'Content-Type':     "application/json;charset=utf-8"	
// };
var station_name = "종로구";
var sido_name = "jongro";
var encoded_station_name = encodeURI(station_name);

// 날짜 구하기
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
var hh = today.getHours();
if(dd < 10) 
    dd = '0'+ dd;

if(mm < 10) 
    mm = '0' + mm;

if(hh < 10) 
    hh = '0' + hh;

today = yyyy + mm + dd + hh;

client.hset(today + ":seongbuk", "pm10Grade", "1");

var options = {
	url : 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=' + encoded_station_name + '&dataTerm=daily&pageNo=1&numOfRows=1&ServiceKey=HfwoMWjEXZ%2FxxrKKfH%2FdjJNpMUpwXImRpAUHcRxH5219TkZTSrEKUcny%2F4WcVRiDUDw9eC1YQbAIbuFoAqJebQ%3D%3D&ver=1.3&_returnType=json&sidoName=' + sido_name,
	method:'GET',
	json:true,
	encoding:"UTF-8",
};

var request = request(options, function(err, res, body){
	if (err) { return console.log(err); }

	var data_list = body['list'];
	var parm = body['parm'];
	//PM10
	var pm10Grade = data_list[0]['pm10Grade']; //미세먼지 24시간 등급
	var pm10Grade1h = data_list[0]['pm10Grade1h']; //미세먼지 1시간 등급
	var pm10Value = data_list[0]['pm10Value']; //미세먼지 농도
	var pm10Value24 = data_list[0]['pm10Value24']; //미세먼지 24시간 예측이동 농도
	//PM25
	var pm25Grade = data_list[0]['pm25Grade']; //미세먼지 24시간 등급
	var pm25Grade1h = data_list[0]['pm25Grade1h']; //미세먼지 1시간 등급
	var pm25Value = data_list[0]['pm25Value']; //미세먼지 농도
	var pm25Value24 = data_list[0]['pm25Value24']; //미세먼지 24시간 예측이동 농도

	client.hset(today + ":" + sido_name, 'pm10Grade', pm10Grade);
	client.hset(today + ":" + sido_name, 'pm10Grade1h', pm10Grade1h);
	client.hset(today + ":" + sido_name, 'pm10Value', pm10Value);
	client.hset(today + ":" + sido_name, 'pm10Value24', pm10Value24);
	client.hset(today + ":" + sido_name, 'pm25Grade', pm25Grade);
	client.hset(today + ":" + sido_name, 'pm25Grade1h', pm25Grade1h);
	client.hset(today + ":" + sido_name, 'pm25Value', pm25Value);
	client.hset(today + ":" + sido_name, 'pm25Value24', pm25Value24);
});



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: "Hello World!!" });
});

module.exports = router;
