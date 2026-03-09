// Local storage for saving alarms

export function saveAlarm(time){

localStorage.setItem("solver_alarm",time);

}

export function loadAlarm(){

return localStorage.getItem("solver_alarm");

}
