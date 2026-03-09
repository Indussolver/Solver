const form = document.getElementById("alarmForm");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const time = document.getElementById("alarmTime").value;
    const label = document.getElementById("alarmLabel").value;

    createAlarm(time,label,"none");

    renderAlarms();
});

function renderAlarms(){
    const container = document.getElementById("alarmList");
    container.innerHTML = "";

    alarms.forEach(alarm=>{
        const div = document.createElement("div");
        div.innerText = alarm.time + " - " + alarm.label;
        container.appendChild(div);
    });
}