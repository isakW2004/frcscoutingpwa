<?php $title = "Settings"; $header = "Settings";  require_once("includes/head.php");?>
<div class="container">
<ul class="mdc-list" role="group" aria-label="List with checkbox items">
  <li class="mdc-list-item" role="checkbox" aria-checked="false">
    <span class="mdc-list-item__graphic">
      <div class="mdc-checkbox">
        <input type="checkbox"
                class="mdc-checkbox__native-control"
                id="dark-mode"  />
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
                viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>
    </span>
    <label class="mdc-list-item__text" for="dark-mode"><i class="material-icons align-bottom">invert_colors</i> Dark Mode</label>
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
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">Upload Data</span>
      <span class="mdc-list-item__secondary-text">Internet Required. Upload scouting data.</span>
    </span>
  </li>
</ul>
<div class="mdc-touch-target-wrapper">
  <button class="mdc-button mdc-button--outlined">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">Cancel</span>
    <div class="mdc-button__touch"></div>
  </button>
</div>
<div class="mdc-touch-target-wrapper">
  <button class="mdc-button mdc-button--raised" onclick="applySettings()">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">Apply</span>
    <div class="mdc-button__touch"></div>
  </button>
</div>
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
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard" onclick="clearCookies()">
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
<script>
  const helpWindow = new mdc.dialog.MDCDialog(document.getElementById('help'));
  const alert = new mdc.dialog.MDCDialog(document.querySelector('.settings-alert'));
  const settings = new mdc.list.MDCList(document.querySelector('.mdc-list'));
  const listItemRipples = [].map.call(document.querySelectorAll('.mdc-list-item'), function(el) {
  return new mdc.ripple.MDCRipple(el);
});

function applySettings(){
  setCookie("darkmode", document.getElementById("dark-mode").checked, 10)
  document.location.reload()
}
</script>