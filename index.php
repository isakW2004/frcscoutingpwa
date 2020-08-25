<?php $title = "Home"; $header = "2530 Events"; require_once("includes/head.php");?>
<h1 class="welcome">Welcome.</h1>
<h3 class="text-center">What would you like this device to do?</h1>
<div class="welcome-links container">
    <a href="kiosk.php" class="mdc-ripple-surface--primary ripple">
        <i class="material-icons">dock</i>
        <h2>Pit Kiosk</h2>
    </a>
    <a href="scout.php" class="mdc-ripple-surface--primary">
        <i class="material-icons">search</i>
        <h2>Scouting</h2>
    </a>
    <a href="data.php" class="mdc-ripple-surface--primary">
        <i class="material-icons">table_chart</i>
        <h2>View Data</h2>
    </a>
    </div><br>
<noscript class="text-center noscript">
    <h4><i class="material-icons align-bottom">error</i> Enable Javascript</h4>
    <p>This app will not scout, view data, or install without Javascript. Until you enable Javascript, only basic Pit Kiosk functionality is available. <a href="https://support.google.com/answer/23852?hl=en&co=GENIE.Platform%3DAndroid&oco=0">Learn More</a></p>
</noscript>
<div class="mdc-dialog" id="help">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-describedby="my-dialog-content">
      <div class="mdc-dialog__content" id="my-dialog-content">
        Select a function for this device. Pit Kiosk mode is an informational kiosk for scouters on other teams.
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
</script>