<?php $title = "Settings"; $header = "Settings";  require_once("includes/head.php");?>
<script src="assets/pouchdb.js"></script><script src="assets/pouchdb-worker.js"></script>
<div class="container">
<ul class="mdc-list" role="group" aria-label="List with checkbox items">
  <li class="mdc-list-item">
    <label class="mdc-list-item__text" for="dark-mode"><i class="material-icons align-bottom">invert_colors</i> Dark Mode</label>
    <div style='right: 20px; position: absolute;'>
    <div class="mdc-switch">
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb-underlay">
        <div class="mdc-switch__thumb"></div>
        <input type="checkbox" id="dark-mode" class="mdc-switch__native-control" role="switch">
      </div>
    </div>
</div>
  </li>
  <li role="separator" class="mdc-list-divider"></li>
  <li class="mdc-list-item" tabindex="0" onclick="alert.open()">
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">Delete All Data</span>
      <span class="mdc-list-item__secondary-text">All scouting data and settings that have not been uploaded will be LOST</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0" onclick="openEventPicker()">
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">Choose an Event</span>
      <span class="mdc-list-item__secondary-text">Change current event and delete data</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0" onclick="upload.open()">
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">Upload Data</span>
      <span class="mdc-list-item__secondary-text">Internet Required. Upload scouting data.</span>
    </span>
  </li>
</ul>
</div>
</body>
<div class="mdc-dialog settings-alert">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content">
      <div class="mdc-dialog__content" id="my-dialog-content">
        All data that has not been uploaded will be deleted.
      </div>
      <div class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Cancel</span>
        </button>
        <button type="button" style='background-color: red'class="mdc-button mdc-dialog__button mdc-button--raised" data-mdc-dialog-action="discard" onclick="clearCookies()">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Delete</span>
        </button>
      </div>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
<div class="mdc-dialog" id="help">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content">
      <div class="mdc-dialog__content" id="my-dialog-content">
        Change Settings here. Some settings will reset scouting data on this device.
      </div>
      <div class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">OK</span>
        </button>
      </div>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
<div class="mdc-dialog upload-data text-center" id='uploadDialog'>
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      id="upload"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content">
      <div class="mdc-dialog__content" id="login-dialog-content">
        Log in to upload scouting data<br><br>
        <label class="mdc-text-field mdc-text-field--filled" id="urlSetter" hidden>
          <span class="mdc-text-field__ripple"></span>
          <input class="mdc-text-field__input" value="http://">
          <span class="mdc-floating-label" id="password-label">Server Address</span>
          <span class="mdc-line-ripple"></span>
        </label><br>
        <label class="mdc-text-field mdc-text-field--filled">
          <span class="mdc-text-field__ripple"></span>
          <input class="mdc-text-field__input" type="text" id='username' aria-labelledby="my-label-id">
          <span class="mdc-floating-label" id="my-label-id">Name</span>
          <span class="mdc-line-ripple"></span>
        </label><br>
        <label class="mdc-text-field mdc-text-field--filled">
          <span class="mdc-text-field__ripple"></span>
          <input class="mdc-text-field__input" type="password" id='password' aria-labelledby="password-label" aria-controls="password-helper" aria-describedby="password-helper">
          <span class="mdc-floating-label" id="password-label">Password</span>
          <span class="mdc-line-ripple"></span>
        </label>
      </div>
      <div class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel" id="upload-cancel-button">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Cancel</span>
        </button>
        <button type="button" class="mdc-button mdc-dialog__button mdc-button--raised" onclick="logIn(document.getElementById('username').value, document.getElementById('password').value, this);">
          <div class="mdc-button__ripple"></div>
          <i class="material-icons mdc-button__icon" id="button-icon" aria-hidden="true">cloud_upload</i>
          <span class="mdc-button__label">Upload</span>
        </button>
      </div>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
<div class="mdc-snackbar" id="success">
  <div class="mdc-snackbar__surface">
    <div class="mdc-snackbar__label"
         role="status"
         aria-live="polite">
      Data Uploaded Successfully!
    </div>
  </div>
</div>
<script>
  const helpWindow = new mdc.dialog.MDCDialog(document.getElementById('help'));
  const alert = new mdc.dialog.MDCDialog(document.querySelector('.settings-alert'));
  const upload = new mdc.dialog.MDCDialog(document.querySelector('.upload-data'));
  const settings = new mdc.list.MDCList(document.querySelector('.mdc-list'));
  const snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById('success'));
  const listItemRipples = [].map.call(document.querySelectorAll('.mdc-list-item'), function(el) {
  return new mdc.ripple.MDCRipple(el);
});
  const login = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
  return new mdc.textField.MDCTextField(el);
});

const chk = new mdc.switchControl.MDCSwitch(document.querySelector('.mdc-switch'));

  if(document.documentElement.classList.contains("dark-mode")){
    chk.checked = true;
  }else{
    chk.checked = false;
  }

chk.root.addEventListener("change", function() {
    document.documentElement.classList.toggle("dark-mode");
    var theme = document.documentElement.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

var db;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
var progress;
var err;
var data = new Object;

function logIn(uname, passwd, btn){
  btn.onclick = '';
  if(localStorage.getItem("couchUrl") == null){
    localStorage.setItem("couchUrl", urlSetter.value)
  }
  try{
    workerPouch.isSupportedBrowser().then(function (supported) {
      if (supported) {
     db = new PouchDB(localStorage.getItem("couchUrl")+':5984/frc'+ localStorage.getItem('currentEvent'), {'auth': {'username':uname, 'password':passwd},},{adapter: 'worker'});
    } else { // fall back to a normal PouchDB
      db = new PouchDB(localStorage.getItem("couchUrl")+':5984/frc'+ localStorage.getItem('currentEvent'), {'auth': {'username':uname, 'password':passwd}});
    }
      login[0].disabled = true;
    login[1].disabled = true;
    db.info().then(function (info) {
    console.log(info);
    document.getElementById('button-icon').outerHTML = '<div class="mdc-circular-progress mdc-circular-progress--indeterminate mdc-button__icon" style="width:24px;height:24px; --mdc-theme-primary: white" role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1"><div class="mdc-circular-progress__determinate-container"> <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <circle class="mdc-circular-progress__determinate-circle" cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="54.978" stroke-width="2.5"/> </svg></div><div class="mdc-circular-progress__indeterminate-container"><div class="mdc-circular-progress__spinner-layer"><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left"> <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/> </svg></div><div class="mdc-circular-progress__gap-patch"> <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2"/> </svg></div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right"> <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/> </svg></div></div></div></div>'
    progress= new mdc.circularProgress.MDCCircularProgress(document.querySelector('.mdc-circular-progress'));
    db.allDocs({include_docs: true}).then(function(result){data=result; uploadData()})
    }).catch(function (err) {
    login[0].disabled = false;
      login[1].disabled = false;
    if(err.error == 'unauthorized'){
      login[0].valid = false;
      login[1].valid = false;
    }else{
      console.log(err)
      snackbar.labelText = "Sorry, there was an error. Your data was not uploaded."
      snackbar.open()
      error = err;
      btn.onclick=  function(){logIn(document.getElementById('username').value, document.getElementById('password').value, this)}
    }
  }).catch(console.log.bind(console)); 
});
}catch{

}
}
var bulkArray;
var teamsPitScouted = [];
function uploadData(){
  bulkArray = data.rows;
  for(var i=0; i < JSON.parse(localStorage.getItem('completedItems')).length; i++){
    if(JSON.parse(localStorage.getItem('completedItems'))[i].split(/([0-9]+)/)[0] == 'team'){
      teamsPitScouted.push(JSON.parse(localStorage.getItem('completedItems'))[i].split(/([0-9]+)/)[1]);
    }
  }
  for(var i=0; i < localStorage.length; i++){
    var team = Object.keys(localStorage)[i].split(/([0-9]+)/)[1];
    if(Object.keys(localStorage)[i].split(/([0-9]+)/)[2] == 'stand'){  //checks that the team is actually a team number and that it is a stand scouting match
      var currentTeamObject = new Object;
      currentTeamObject._id = 'team'+team;
      currentTeamObject.stand = JSON.parse(localStorage.getItem(team+'stand'))
      bulkArray.push(currentTeamObject)
    }
  }
  for(var i=0; i < teamsPitScouted.length; i++){
    if(getDbByID(bulkArray, 'team'+teamsPitScouted[i]) !== -1){
      bulkArray[getDbByID(bulkArray, 'team'+teamsPitScouted[i])].pit = JSON.parse(localStorage.getItem(teamsPitScouted[i]+'pit'))
    }else{
      var currentTeamObject = new Object;
      currentTeamObject._id = 'team'+teamsPitScouted[i];
      currentTeamObject.pit = JSON.parse(localStorage.getItem(teamsPitScouted[i]+'pit'))
      bulkArray.push(currentTeamObject)
    }
  }
  db.bulkDocs(bulkArray);
  success.open()
  upload.close()
}
function getDbByID(array, id){
  for(var i=0; i<array.length; i++){
    if(array[i]._id == id){
      return i;  //if found, return number
    }
  }
  return -1;  //if not, return -1, meaning it doesn't exist
}
if(localStorage.getItem("couchUrl") == null){
  document.getElementById("urlSetter").hidden=false
  urlSetter = new mdc.textField.MDCTextField(document.getElementById("urlSetter"))
}
</script>
