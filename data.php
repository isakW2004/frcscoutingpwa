<?php $title = "Data"; $header = "2530 Events"; require_once("includes/head.php");?><br>
<script type="text/javascript" src="/assets/data.js"></script>
<script type="text/javascript" src="/assets/charts.js"></script>
<div class="container" id='main-container'>
<img class="offline" src="/assets/images/offline.svg">
<div class="text-center">
<h2 >You're Offline</h2>
<p>Internet is required to view the latest data.</p>
</div>
</div>
<div class="mdc-dialog" id="help">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content">
      <div class="mdc-dialog__content" id="my-dialog-content">
        Scroll through the list of teams and select one for more data.
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