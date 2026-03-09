import { setAlarm, startAlarmChecker } from "./core.js";

const alarmToggle = document.getElementById("alarmToggle");
const alarmDate = document.getElementById("alarmDate");
const alarmTime = document.getElementById("alarmTime");
const setAlarmBtn = document.getElementById("setAlarm");
const status = document.getElementById("alarmStatus");

function updateStatus(message){

status.innerText = message;

}

setAlarmBtn.addEventListener("click",()=>{

if(!alarmToggle.checked){

updateStatus("Turn on the alarm first");

return;

}

const date = alarmDate.value;
const time = alarmTime.value;

if(!date || !time){

updateStatus("Select date and time");

return;

}

setAlarm(date,time,updateStatus);

});

startAlarmChecker(updateStatus);
