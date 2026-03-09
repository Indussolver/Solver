const modal = document.getElementById("alarmModal")
const openBtn = document.getElementById("openAlarm")
const closeBtn = document.getElementById("closeModal")

openBtn.onclick = ()=>{

modal.style.display="flex"

}

closeBtn.onclick = ()=>{

modal.style.display="none"

}



const picker = flatpickr("#alarmPicker",{

enableTime:true,

dateFormat:"Y-m-d H:i",

time_24hr:true

})



document.getElementById("saveAlarm").onclick = ()=>{

const time = picker.selectedDates[0]

if(!time){

alert("Select time")

return

}

alert("Alarm set for "+time.toLocaleString())

modal.style.display="none"

}
