const Utils = {

DOM:{
on(element,event,callback){
if(!element) return;
element.addEventListener(event,callback);
}
},

Storage:{
get(key){
try{
return JSON.parse(localStorage.getItem(key));
}catch{
return localStorage.getItem(key);
}
},

set(key,value){
localStorage.setItem(key,JSON.stringify(value));
},

remove(key){
localStorage.removeItem(key);
}

}

};

