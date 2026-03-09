import { startChallenge } from "./challenges.js";

let alarmTimeValue = null;

export function setAlarm(date,time,updateStatus){

alarmTimeValue = new Date(`${date}T${time}`);

updateStatus("Alarm set for " + alarmTimeValue.toLocaleString());

}

export function startAlarmChecker(updateStatus){

setInterval(()=>{

if(!alarmTimeValue) return;

const now = new Date();

if(now >= alarmTimeValue){

startChallenge();

alarmTimeValue = null;

updateStatus("Alarm finished");

}

},1000);

}
