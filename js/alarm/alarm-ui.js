import { setAlarm } from "./core.js";

const openBtn = document.getElementById("openAlarm");
const modal = document.getElementById("alarmModal");
const closeBtn = document.getElementById("closeAlarm");

const saveBtn = document.getElementById("saveAlarm");

const alarmDate = document.getElementById("alarmDate");
const alarmTime = document.getElementById("alarmTime");


openBtn.onclick = ()=>{

modal.style.display="flex";

}

closeBtn.onclick = ()=>{

modal.style.display="none";

}



saveBtn.onclick = ()=>{

const date = alarmDate.value;
const time = alarmTime.value;

if(!date || !time){

alert("Select date and time");

return;

}

setAlarm(date,time,()=>{});

modal.style.display="none";

alert("Alarm Created");

}
