function triggerAlarm(alarm){

    alert("Alarm: " + alarm.label);

    startMathChallenge();
}

function startMathChallenge(){

    let correct = 0;

    while(correct < 3){

        let a = Math.floor(Math.random()*10);
        let b = Math.floor(Math.random()*10);

        let ans = prompt(`${a} + ${b} = ?`);

        if(parseInt(ans) === a+b){
            correct++;
        }
    }

    alert("Alarm dismissed!");
}