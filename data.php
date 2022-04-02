<?php $title = "Data"; $header = "View Data"; require_once("includes/head.php");?>
<script src="assets/pouchdb.js"></script>
<script src="assets/pouchdb-worker.js"></script>
<script type="text/javascript" src="/assets/data.js"></script>
<script src="/assets/charts.js" crossorigin="anonymous"></script>
<div hidden id="offline">
<img class="offline" src="/assets/images/offline.svg">
<div class="text-center">
<h2 >You're Offline</h2>
<p>Internet is required to view the latest data.</p>
</div></div>
<div class="text-center" id="login">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="login" viewBox="0, 0, 700, 500">
  <defs>
    <linearGradient id="Gradient_1" gradientUnits="userSpaceOnUse" x1="393.791" y1="357.807" x2="480.864" y2="417.614">
      <stop offset="0" stop-color="#000000" stop-opacity="0.371"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="Gradient_2" gradientUnits="userSpaceOnUse" x1="319.673" y1="360.484" x2="439.846" y2="418.073">
      <stop offset="0" stop-color="#000000" stop-opacity="0.371"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="Clip_1">
      <path d="M60.328,46.857 L639.672,46.857 L639.672,412.689 L60.328,412.689 z M627.054,54.857 L625.763,55.067 L625.756,55.07 L571.611,75.469 C569.085,76.254 570.21,75.858 529.865,90.848 C527.344,93.37 527.344,97.458 529.865,99.98 L546.752,116.867 L324.965,338.654 L102.302,115.991 C99.78,113.469 95.692,113.469 93.17,115.991 L68.22,140.941 C65.698,143.463 65.698,147.551 68.22,150.073 L293.171,375.024 C294.122,377.357 293.518,376.415 294.784,377.966 L319.735,402.916 C321.395,404.272 320.344,403.579 323.068,404.689 L326.862,404.689 C329.585,403.579 328.535,404.272 330.195,402.916 L355.145,377.966 C356.412,376.415 355.808,377.357 356.759,375.024 L580.834,150.949 L597.698,167.813 C600.22,170.335 604.308,170.335 606.83,167.813 L633.671,61.518 L633.011,62.463 L633.672,59.633 C632.521,56.597 630.362,54.932 627.054,54.857 z"/>
    </clipPath>
    <filter id="Shadow_2">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feFlood flood-color="#595959"/>
      <feComposite in2="offsetblur" operator="in"/>
    </filter>
  </defs>
  <g id="Layer_1">
    <g>
      <path d="M265.863,430 C263.923,429.929 264.645,430.022 263.682,429.88 C163.505,425.999 86.417,347.306 85.154,249.704 C85.154,150.129 167.769,69.408 269.68,69.408 C371.59,69.408 454.205,150.129 454.205,249.704 L454.181,251.54 L485.6,251.54 C495.416,251.54 503.373,257.289 503.373,264.381 L503.373,417.159 C503.373,424.251 495.416,430 485.6,430 L265.863,430 z" fill="#B2B1B1"/>
    </g>
    <path d="M433.179,430 C433.179,430 498.898,430 498.898,430 L434.725,345.421 L375.758,379.9" fill="url(#Gradient_1)"/>
    <path d="M347.675,430 C347.675,430 464.735,430 464.735,430 L357.69,348.558 L294.785,377.966 z" fill="url(#Gradient_2)"/>
    <g>
      <path d="M627.054,54.857 C630.362,54.932 632.521,56.597 633.672,59.633 L633.011,62.463 L633.671,61.518 L606.83,167.813 C604.308,170.335 600.22,170.335 597.698,167.813 L580.834,150.949 L356.759,375.024 C355.808,377.357 356.412,376.415 355.145,377.966 L330.195,402.916 C328.535,404.272 329.585,403.579 326.862,404.689 L323.068,404.689 C320.344,403.579 321.395,404.272 319.735,402.916 L294.784,377.966 C293.518,376.415 294.122,377.357 293.171,375.024 L68.22,150.073 C65.698,147.551 65.698,143.463 68.22,140.941 L93.17,115.991 C95.692,113.469 99.78,113.469 102.302,115.991 L324.965,338.654 L546.752,116.867 L529.865,99.98 C527.344,97.458 527.344,93.37 529.865,90.848 C570.21,75.858 569.085,76.254 571.611,75.469 L625.756,55.07 L625.763,55.067 L627.054,54.857 z" clip-path="url(#Clip_1)" filter="url(#Shadow_2)" fill="rgba(0,0,0,0.75)"/>
      <path d="M323.068,404.689 C320.344,403.579 321.395,404.272 319.735,402.916 L294.785,377.966 C293.518,376.415 294.122,377.357 293.171,375.024 L68.22,150.073 C65.698,147.551 65.698,143.463 68.22,140.941 L93.17,115.991 C95.692,113.469 99.78,113.469 102.302,115.991 L324.965,338.654 L546.752,116.867 L529.865,99.98 C527.344,97.458 527.344,93.37 529.865,90.848 C570.21,75.858 569.085,76.254 571.611,75.469 L625.756,55.07 L625.763,55.067 L627.054,54.857 C630.362,54.932 632.521,56.597 633.672,59.633 L633.011,62.463 L633.671,61.518 L606.83,167.813 C604.308,170.335 600.22,170.335 597.698,167.813 L580.834,150.949 L356.759,375.024 C355.808,377.357 356.412,376.415 355.145,377.966 L330.195,402.916 C328.535,404.272 329.585,403.579 326.862,404.689 L323.068,404.689 z" fill="#3582FF"/>
    </g>
    <g>
      <path d="M480.837,430 C407.294,430 347.675,371.747 347.675,299.889 C347.675,228.031 407.294,169.779 480.837,169.779 C554.381,169.779 614,228.031 614,299.889 C614,371.747 554.381,430 480.837,430 z" fill="#817C7C"/>
    </g>
    <path d="M536.387,50.186" fill="#FF0000"/>
  </g>
</svg>
<h2 >Log In</h2>
<label class="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon" id="urlSetter" hidden>
          <span class="mdc-text-field__ripple"></span>
          <input class="mdc-text-field__input" value="http://">
          <span class="mdc-floating-label" id="password-label">Server Address</span>
          <span class="mdc-line-ripple"></span>
        </label><br>
<label class="mdc-text-field mdc-text-field--filled log-in-field">
          <span class="mdc-text-field__ripple"></span>
          <input class="mdc-text-field__input" type="text" id='username' aria-labelledby="my-label-id">
          <span class="mdc-floating-label" id="my-label-id">Name</span>
          <span class="mdc-line-ripple"></span>
        </label><br>
        <label class="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon log-in-field">
          <span class="mdc-text-field__ripple"></span>
          <input class="mdc-text-field__input" type="password" id='password' aria-labelledby="password-label" aria-controls="password-helper" aria-describedby="password-helper">
          <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button" onclick="logIn(document.getElementById('username').value, document.getElementById('password').value)">arrow_forward</i>
          <span class="mdc-floating-label" id="password-label">Password</span>
          <span class="mdc-line-ripple"></span>
        </label>
</div>
<div class="container d-none" id='tableContainer' ><br>
<div class="mdc-data-table">
  <table class="mdc-data-table__table">
    <thead>
      <tr class="mdc-data-table__header-row" id="header-row">
        <th
          class="mdc-data-table__header-cell"
          role="columnheader"
          scope="col"
          data-column-id="team"
          id="bigbrain"
        >
          <div class="mdc-data-table__header-cell-wrapper">
            <div class="mdc-data-table__header-cell-label">
              Team
            </div>
            <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="dessert-status-label">
            </div>
          </div>
        </th>
        <th
          class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort"
          role="columnheader"
          scope="col"
          data-column-id="bigbrain" 
          id="bigbrain"
        >
          <div class="mdc-data-table__header-cell-wrapper">
            <button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button"
                    aria-label="Sort by big brain score" aria-describedby="bigbrain-status-label">arrow_upward</button>
            <div class="mdc-data-table__header-cell-label">
              <strong>bigBrain</strong> Score
            </div>
            <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="bigbrain-status-label"></div>
          </div>
        </th>
    </thead>
    <tbody class="mdc-data-table__content" id='tableBody'>
    </tbody>
  </table>

</div>
<br><br>
<div class="table-actions">
<a class="mdc-button" onclick="exportData(this)">
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true"
    >get_app</i
  >
  <span class="mdc-button__label">Export as JSON</span>
</a>
<button class="mdc-button" onclick="window.location = localStorage.getItem('couchUrl')+ ':5984/_utils'">
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true"
    >launch</i
  >
  <span class="mdc-button__label">Manage Database</span>
</button>
<button class="mdc-button">
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true"
    >compare_arrows</i
  >
  <span class="mdc-button__label">Compare</span>
</div>
</div>
<script>
const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action, .mdc-list-item';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
  return new mdc.ripple.MDCRipple(el);
});
var button= document.getElementById('menuButton')
var title= document.getElementById('title')

</script>
<style>
body{
    background-color: var(--mdc-theme-background, white);
    overflow-x:hidden;
}
.mdc-card{
    animation-name: slide-up;
    animation-duration: 0.5s;
    display: inline-block;
    width: 100%;
}
@keyframes slide-up{
    from{transform: translate(0, 100vh);}
    to{transform: translate(0, 0);}
}
.mdc-data-table__sort-status-label{
  margin-left: 3px;
}
.mdc-card-columns .mdc-card{margin-bottom:.75rem; margin-left:0;}@media (min-width:556px){.mdc-card-columns{-webkit-column-count:2;-moz-column-count:2;column-count:2;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.mdc-card-columns .mdc-card{display:inline-block;width:100%}}@media (min-width:900px){.mdc-card-columns{-webkit-column-count:3;-moz-column-count:3;column-count:3;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.mdc-card-columns .mdc-card{display:inline-block;width:100%}} .mdc-card-columns{margin: 0px;}
</style>
<div class="mdc-dialog" id="help">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="my-dialog-title"
      aria-describedby="my-dialog-content">
      <div class="mdc-dialog__content" id="my-dialog-content">
        Data view shows the teams that have data. Teams that only have pit scounting data don't show anything on the table.<br>For checkbox fields, refer to this key.
        <div class="key">
        <div class="key-icon">highlight_off</div>
        <strong>No Data</strong>
        <div class="key-icon">close</div>
        <strong>Never</strong>
        <div class="key-icon">done</div>
        <strong>Sometimes</strong>
        <div class="key-icon">done_all</div>
        <strong>Always</strong>
        </div><br>
        Click on a team to see more data. You can also select Export as JSON to view all data as a JSON file.
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
<div class="container" id="teamInfoContainer" hidden>
<div class="mdc-card-columns" id="teamInfoColumns">

</div>

</div>
<div class="mdc-snackbar" id="snackbar"><div class=mdc-snackbar__surface><div class=mdc-snackbar__label aria-live=polite role=status>There was an error</div></div></div>
<script> 
    const login = [].map.call(document.querySelectorAll('.log-in-field'), function(el) {
  return new mdc.textField.MDCTextField(el);
});
  const helpWindow = new mdc.dialog.MDCDialog(document.getElementById('help'));
  const dataTable = new mdc.dataTable.MDCDataTable(document.querySelector('.mdc-data-table'));
  login[1].root.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    logIn(document.getElementById('username').value, document.getElementById('password').value)
  }
}); 
const snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById('snackbar'));
</script>
<br><br><br>
<style>
  .login{
    display:block;
    align-self:center;
    margin-left: auto;
    margin-right: auto;
    width: 70vw;
    max-width: 500px;
}
.mdc-text-field{
  width: 90vw;
  max-width: 400px;
}
.table-actions {
	overflow-y: scroll;
	text-align: center;
	white-space: nowrap;
}
.mdc-button a {
  text-decoration: none;
}
.key{
  padding-top: 20px;
  columns: 4;
  text-align: center;
}
.key-icon{
  font-size: 50px;
  font-family: 'Material Icons';
  color: var(--mdc-theme-primary, black);
  padding-bottom: 20px;
}
.disappearing{
  animation-name: fade-out;
  animation-duration: 0.2s;
}
.appearing{
  filter: none;
  animation-name: fade-out;
  animation-direction: reverse;
  animation-duration: 0.2s;
  position: fixed;
}

@keyframes fade-out{
  from{filter: opacity(100%); transform:scale(1.0);}
  to{filter: opacity(0%); transform:scale(0.7);}
}
#comments{
  padding-top: 16px;
  display: none;
  list-style-type: none;
}
#comments li{
  padding-bottom: 8px !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>