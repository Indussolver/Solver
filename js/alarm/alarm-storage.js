function saveAlarms(){
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

function loadAlarms(){
    const data = localStorage.getItem("alarms");

    if(data){
        alarms = JSON.parse(data);
    }
}

loadAlarms();