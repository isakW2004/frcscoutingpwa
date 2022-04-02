<?php $title = "Home"; $header = "2530 Events"; require_once("includes/head.php");?>
<div class="actions">
<h1 class="welcome">Hello.</h1>
<h3 class="text-center">What would you like this device to do?</h1>
<div class="welcome-links container">
    <a href="kiosk.php">
        <i class="material-icons">dock</i>
        <h2>Pit Kiosk</h2>
    </a>
    <a href="scout.php">
        <i class="material-icons">search</i>
        <h2>Scouting</h2>
    </a>
    <a href="data.php">
        <i class="material-icons">trending_up</i>
        <h2>View Data</h2>
    </a>
    <a hidden id="installPrompt">
        <i class="material-icons">get_app</i>
        <h2>Install</h2>
    </a>
    </div><br>
</div>
<noscript class="text-center noscript">
    <h4><i class="material-icons align-bottom">error</i> Enable Javascript</h4>
    <p>This app requires Javascript. Javascript isn't used to track you on this site. To enable Javascript, find instructions for your browser.</p>
    <style>.actions{display:none;} html{--mdc-theme-primary: red !important}</style>
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
    var installButton= document.getElementById("installPrompt")
    const helpWindow = new mdc.dialog.MDCDialog(document.getElementById('help'));
    window.addEventListener("beforeinstallprompt", function(beforeInstallPromptEvent) {
      // Shows prompt after a user clicks an "install" button
      installButton.addEventListener("click", function(mouseEvent) {
        // you should not use the MouseEvent here, obviously
        beforeInstallPromptEvent.prompt();
      });

      installButton.hidden = false; // Make button operable
    });
</script>