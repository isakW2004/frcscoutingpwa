<?php $title = "Scouting"; $header = "Scouting"; require_once("includes/head.php");?>
<div class="mdc-tab-bar" role="tablist">
  <div class="mdc-tab-scroller">
    <div class="mdc-tab-scroller__scroll-area">
      <div class="mdc-tab-scroller__scroll-content">
        <button class="mdc-tab mdc-tab--active" role="tab" id="standscouttab" aria-selected="true" tabindex="0" onclick="selectTab('standscout')">
          <span class="mdc-tab__content">
            <span class="mdc-tab__icon material-icons" aria-hidden="true">visibility</span>
            <span class="mdc-tab__text-label">Stand</span>
          </span>
          <span class="mdc-tab-indicator mdc-tab-indicator--active">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
          </span>
          <span class="mdc-tab__ripple"></span>
        </button>
        <button class="mdc-tab" role="tab" aria-selected="false" id="pitscouttab" tabindex="0" onclick="selectTab('pitscout')">
          <span class="mdc-tab__content">
            <span class="mdc-tab__icon material-icons" aria-hidden="true">mood</span>
            <span class="mdc-tab__text-label">Pit</span>
          </span>
          <span class="mdc-tab-indicator">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
          </span>
          <span class="mdc-tab__ripple"></span>
        </button>
      </div>
    </div>
  </div>
</div><br>

<script type="text/javascript" src="/assets/scout.js"></script>
<div id="standscout" onload="continueStand()" class="">
<div class="container text-center">
    <h3 class="text-center">Choose which teams you are scouting.</h3><br>
    
      <div class="teamcheck" id="teamcheck">
      </div>
    <div class="mdc-touch-target-wrapper">
  <button class="mdc-button mdc-button--outlined" onclick="fetchTeams()" id="fetch-button">
    <div class="mdc-button__ripple"></div>
    <i class="material-icons mdc-button__icon" aria-hidden="true">cached</i>
    <span class="mdc-button__label" id="fetch-label">Fetch Teams</span>
    <div class="mdc-button__touch"></div>
  </button>
</div>
<div class="mdc-touch-target-wrapper">
  <button class="mdc-button mdc-button--raised" onclick="startScouting()">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">Continue</span>
    <div class="mdc-button__touch"></div>
  </button>
</div><br><br>
<p class="text-center text-muted">You'll need internet access for this part.</p>
</div>
</div>
<div id="pitscout" class="d-none">
<div class="container text-center">
    <h3 class="text-center">Pit Scouting</h3><br>
      <div class="teamcheck" id="teamcheck">
      </div>
<p class="text-center text-muted">Set up stand scouting then come back</p>
</div>
</div>
<div class="mdc-snackbar">
  <div class="mdc-snackbar__surface">
    <div class="mdc-snackbar__label"
         role="status"
         aria-live="polite">
      All set up. Internet is no longer needed.
    </div>
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
        First, set up scouting. You'll need internet to get data from The Blue Alliance. Press Fetch Teams and check all the teams you want to scout. Once your done press continue. Tap the match you want to scout.<br><br> To Pit Scout, set up stand scouting. As you scout, collaborate with other Pit Scouters and check the boxes of the teams that have already been scouted. To scout, tap a team that has not been scouted to fill out the form. 
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

<div class="scouting-form text-center" id="form" tabindex="0" aria-modal="true">
</div>

<script>
    const helpWindow = new mdc.dialog.MDCDialog(document.getElementById('help'));
    window.onload = continueStand();
    const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
    const tabIndicator = new mdc.tabIndicator.MDCTabIndicator(document.querySelector('.mdc-tab-indicator'));
    const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
</script>
<style>
  .checkmark-animation {
  stroke-linecap: round;
  stroke-dasharray: 27;
  stroke-dashoffset: -23;
  animation: dash 500ms ease forwards;
  stroke:var(--mdc-theme-primary);
  } 
  .checkmark-svg{
    width: 60vw;
    height: 60vw;
    max-width: 500px;
    max-height: 500px;
  }
  @keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>