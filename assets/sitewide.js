var events;
function openEventPicker(){
  var today = new Date();
  document.getElementById('eventButton').innerHTML='hourglass_empty';
  document.getElementById('eventButton').disabled=true;
  if(document.getElementById("eventlist").innerHTML == "\n        "){
    $.ajax({
      url: "https://www.thebluealliance.com/api/v3/team/frc2530/events/"+ /*today.getFullYear()*/2019  +"/simple",
      type: "GET",
      dataType: "json",
      beforeSend: function(xhr){xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw ');},
      success: function(contents) { 
      events = contents.reverse(); 
      var i;
      eventPicker.open();
      for (i = 0; i < events.length; i++) {
        document.getElementById("eventlist").innerHTML = document.getElementById("eventlist").innerHTML + '<li class="mdc-list-item" tabindex="0"><span class="mdc-list-item__graphic"><div class="mdc-radio"><input class="mdc-radio__native-control"type="radio" id="' + events[i].key + '" name="test-dialog-baseline-confirmation-radio-group" checked><div class="mdc-radio__background"><div class="mdc-radio__outer-circle"></div><div class="mdc-radio__inner-circle"></div></div></div></span><label for="'+events[i].key+'" class="mdc-list-item__text">'+events[i].year+" "+events[i].name+'</label></li>'
      } 
      document.getElementById('eventButton').innerHTML='event';
      document.getElementById('eventButton').disabled=false;
      },
      error: function(error) {
          eventPicker.open();
          document.getElementById("eventlist").innerHTML = "<h3>Error</h3><p>Check your internet connection and try again</p>"
          document.getElementById('eventButton').innerHTML='event';
          document.getElementById('eventButton').disabled=false;
        }
   });
  }else{
  document.getElementById('eventButton').innerHTML='event';
  document.getElementById('eventButton').disabled=false;
  eventPicker.open()
  }
}
function setEvent(){
  if(localStorage.getItem("currentEvent") != null){
    clearCookies()
  }
  for(var i = 0; i < events.length; i++){
    if (document.getElementById(events[i].key).checked){
      localStorage.setItem("currentEvent", events[i].key)
    }
  }
  document.location.reload()
}
function clearCookies() {
  localStorage.clear();
}
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
  document.documentElement.classList.toggle("dark-mode");
} else if (currentTheme == "light") {
  document.documentElement.classList.toggle("light-mode");
}

