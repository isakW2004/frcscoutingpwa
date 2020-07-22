function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;" + "sameSite=strict";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  } 
var events;
function openEventPicker(){
  var today = new Date();
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
      },
      error: function(error) {
          eventPicker.open();
          document.getElementById("eventlist").innerHTML = "<h3>Error</h3><p>Check your internet connection and try again</p>"
        }
   });
  }else{
  eventPicker.open()
  }
}
function setEvent(){
  if(getCookie("currentEvent") != ""){
    clearCookies()
  }
  for(var i = 0; i < events.length; i++){
    if (document.getElementById(events[i].key).checked){
      setCookie("currentEvent", events[i].key, 10)
    }
  }
  document.location.reload()
}
function clearCookies() {
  var cookies = document.cookie.split(";");
  localStorage.clear();
  for (var i = 0; i < cookies.length; i++)
  eraseCookie(cookies[i].split("=")[0]);
}

function eraseCookie(name) {
  setCookie(name,"",-1);
}