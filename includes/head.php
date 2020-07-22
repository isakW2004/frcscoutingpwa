<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="manifest" href="/manifest.json">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="2530 Events">
  <meta name="theme-color" content="#7DC834"/>
  <link rel="apple-touch-icon" href="/assets/images/icon-512-mask.png">
  <title>Welcome - 2530 Scouting</title>
  <link rel="stylesheet" href="/assets/bootstrapcustom.min.css">
  <link href="/assets/material.css" rel="stylesheet">
  <script type="text/javascript" src="/assets/material.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="/assets/style.css">
  <script type="text/javascript" src="/assets/sitewide.js"></script>
  <meta name="description" content="Scouting and more for FRC Team 2530">
  <script type="text/javascript" src="/assets/jquery.js"></script>
  <script type="text/javascript" src="/assets/darkmode.js"></script>
</head>
<script>
//service worker for Progressive Web App mode
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('👍', 'beforeinstallprompt', event);
  window.deferredPrompt = event;
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
</script>
    <body>
      <div class="drawer-frame-root">
        <aside class="mdc-drawer mdc-drawer--modal" id="drawer">
          <div class="mdc-drawer__content">
            <nav class="mdc-list" data-mdc-auto-init="MDCList">
              <a class="mdc-list-item <?php if ($title == "Home"){echo "mdc-list-item--activated";}?>" href="/" aria-current="page" tabindex="0">
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>
                <span class="mdc-list-item__text">Home</span>
              </a>
              <a class="mdc-list-item <?php if ($title == "Scouting"){echo "mdc-list-item--activated";}?>" href="scout.php">
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">search</i>
                <span class="mdc-list-item__text">Scouting</span>
              </a>
              <a class="mdc-list-item <?php if ($title == "Kiosk"){echo "mdc-list-item--activated";}?>" href="kiosk.php">
                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">dock</i>
                <span class="mdc-list-item__text">Pit Kiosk Mode</span>
              </a>
                <a class="mdc-list-item <?php if ($title == "Data"){echo "mdc-list-item--activated";}?>" href="data.php">
                  <i class="material-icons mdc-list-item__graphic" aria-hidden="true">trending_up</i>
                  <span class="mdc-list-item__text">View Data</span>
                </a>
                <hr class="mdc-list-divider">
                <a class="mdc-list-item <?php if ($title == "Settings"){echo "mdc-list-item--activated";}?>" href="settings.php">
                  <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>
                  <span class="mdc-list-item__text">Settings</span>
                </a>
                <h6 class="mdc-list-group__subheader">FRC Team 2530</h6>
    </nav>
            </nav>
          </div>
        </aside>
        <div class="mdc-drawer-scrim"></div>

        <div class="drawer-main-content drawer-frame-app-content" id="main-content">
          <header class="mdc-top-app-bar drawer-top-app-bar head" data-mdc-auto-init="MDCTopAppBar" id="app-bar">
            <div class="mdc-top-app-bar__row">
              <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <button href="#" class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button" data-mdc-auto-init="MDCRipple">menu</button>
                <span class="mdc-top-app-bar__title"><?php echo "$header";?></span>
              </section>
              <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                  <?php if ($title == "Kiosk"){?>
                  <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Hide App Bar" onclick="document.getElementById('app-bar').style.display = 'none'">visibility_off</button>
                  <?php }?>
                  <div id="toolbar" class="toolbar mdc-menu-surface--anchor">
                  <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Change Event" onclick="openEventPicker();">event</button>
                    <div class="mdc-menu mdc-menu-surface">
                      <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1" id="eventList">
                        <li class="mdc-list-item" role="menuitem">
                          <span class="mdc-list-item__text">Fetch Events</span>
                        </li>
                      </ul>
                    </div>
                    </div>
                  <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Get Help" onclick="helpWindow.open()">help</button>
                </div>
              </section>
            </div>
          </header>

            <div class="mdc-top-app-bar--fixed-adjust"></div>
          </div>
    </body>

<div class="mdc-dialog">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content">
      <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
      <h2 class="mdc-dialog__title" id="my-dialog-title"><!--
     -->Choose an Event<br>
     <small class="text-muted text-center">Changing events will delete unsaved data.</small><!--
   --></h2>
      <div class="mdc-dialog__content" id="my-dialog-content">
        <ul class="mdc-list" id="eventlist">
        </ul>
      </div>
      <div class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Cancel</span>
        </button>
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept" onclick="setEvent()">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">OK</span>
        </button>
      </div>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
<style id="display"></style>
<main class="main-content" id="main-content" tabindex="-1">
<script type="text/javascript">
          window.mdc.autoInit();
          const list = document.querySelector('.mdc-list').MDCList;
          list.wrapFocus = true;
          const drawer = new mdc.drawer.MDCDrawer(document.getElementById('drawer'));
          const topAppBar =  document.querySelector('.mdc-top-app-bar').MDCTopAppBar;
          topAppBar.setScrollTarget(document.getElementById('main-content'));
          topAppBar.listen('MDCTopAppBar:nav', () => {
            drawer.open = !drawer.open;
          });
          const listEl = document.querySelector('.mdc-drawer .mdc-list');
          const mainContentEl = document.querySelector('.main-content');

          listEl.addEventListener('click', (event) => {
            drawer.open = false;
          });

          document.body.addEventListener('MDCDrawer:closed', () => {
            mainContentEl.querySelector('input, button').focus();
          });
          const eventPicker = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));
          if(getCookie("darkmode") == "true"){
            DarkReader.enable();
          }else{
            DarkReader.disable();
          }
</script>
