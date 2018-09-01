var clouds = (function(){

	var theClimb,
		altitude,
		connectionStatus,
		sceneHeight,
		currentAltitude = 0,
		lastUpdate = 0,
		timeUpdate;


	var socket = io.connect('http://176.58.111.85:8080');

	function getSocket(){
		return socket;
	}

	function updateAltitude(height){
		altitude.getElementsByTagName('h3')[0].innerHTML = height + "m high";
	}

	function updateGive(accuracy){
		altitude.getElementsByTagName('p')[0].innerHTML = "(give or take " + accuracy + "m)";
	}

	function updateTimeSinceUpdate(newTime){
		lastUpdate = newTime;
		clearInterval(timeUpdate);

		timeUpdate = setInterval(function(){
			if(Math.floor(((new Date().getTime() / 1000) - (parseInt(lastUpdate) / 1000))) <= 5){
				document.getElementById('connectionStatus').getElementsByTagName('p')[0].innerHTML = "(Last updated just now :D)";
			} else {
				document.getElementById('connectionStatus').getElementsByTagName('p')[0].innerHTML = "(Last updated " + Math.floor(((new Date().getTime() / 1000) - (parseInt(lastUpdate) / 1000))) + " seconds ago)";
			}

		}, 1000);
	}

	function recalculateScene(){
		sceneHeight = window.innerHeight - 140 - 100;
		climbToPoint(currentAltitude);
	}

	function climbToPoint(heightToGoTo){

		var ceilingHeight = 150,
			currentPercentage = (currentAltitude / ceilingHeight) * 100,
			percentageToAchieve = (heightToGoTo / ceilingHeight) * 100;

		var percentageDifference = (currentPercentage - percentageToAchieve) * -1;

			updateAltitude(heightToGoTo);
			currentAltitude = heightToGoTo;

			if(heightToGoTo > ceilingHeight){
				percentageToAchieve = 100;
			}

			var calc = 0 + (sceneHeight / 100) * percentageToAchieve + theClimbHeight;

			theClimb.style.height = calc + "px";

			// console.log("0 + (%f / 100) * %f + %f", sceneHeight, percentageToAchieve, theClimbHeight);

			//console.log(percentageToAchieve, percentageDifference);

	}

	function init(){
		theClimb = document.getElementById('theClimb');
		theClimbHeight = 140;
		altitude = document.getElementById('altitude');
		connectionStatus = document.getElementById('connectionStatus');

		sceneHeight = window.innerHeight - theClimbHeight - 100;

		window.addEventListener('resize', recalculateScene, false);

		console.log(sceneHeight);

		socket.on('altitude', function (data) {

			//console.log(data);

			if(data.currentAltitude !== undefined){
				climbToPoint(data.currentAltitude);
			}

			if(data.acc !== undefined){
				updateGive(data.acc);
			}

			if(data.updateTime !== undefined){
				// console.log(data.updateTime);
				updateTimeSinceUpdate(data.updateTime);
			}

		});

		//climb();
	}

	return {
		init : init,
		climbToPoint : climbToPoint,
		getSocket : getSocket
	};
})();

(function(){
	clouds.init();
})();