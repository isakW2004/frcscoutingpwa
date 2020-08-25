<?php $title = "Home"; $header = "2530 Events"; require_once("includes/head.php");?>
<script src="/assets/charts.js"></script>
<div class="container" id="teamInfoContainer">
<div class="mdc-card-columns">
<div class="mdc-card" id="card-multiselect">
<div class="my-card__media mdc-card__media mdc-card__media--square" style=" position: initial;">
  <div class="mdc-card__media-content">
<canvas id="myChart" width="100%" style="padding: 16px" height="100%"></canvas>
</div>
</div>
  <div class="mdc-card__actions">
    <div class="mdc-card__action-buttons">
      <button class="mdc-button mdc-card__action mdc-card__action--button">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">More Info</span>
      </button>
    </div>
  </div>
</div>
<div class="mdc-card" id="card-rating"><div class="mdc-card__primary-action noselect" tabindex="0" style='padding: 16px;'><h5 style="margin-bottom: 0px;">Rating</h5><small class="text-muted" style="margin-bottom: 10px;">Click for Comments</small><i class="material-icons">star star star star_half star_outline</i><i class="material-icons" style="position: absolute; right: 20px; top: 30%;">arrow_forward_ios</i></div></div>
<div class="mdc-card" id="card-pitscout">
  <div class="noselect">
  <h5 style="margin: 16px; margin-bottom: 0px">Pit Scouting</h5>
  <small class="text-muted" style="margin: 0px; margin-left: 16px;">Sumbitted by Safari on Android</small>
  <ul class="mdc-list">
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__graphic material-icons">check_circle</span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__text">Low Goals</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__graphic material-icons">cancel</span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__text">High Goals</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__graphic material-icons">cancel</span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__text">Spinner</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__graphic material-icons">check_circle</span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__text">Endgame</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__graphic material-icons">list</span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">Drive Train</span>
      <span class="mdc-list-item__secondary-text">Swerve Drive</span>
    </span>
  </li>
  <li class="mdc-list-item" tabindex="0">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__graphic material-icons">message</span>
    <span class="mdc-list-item__text">
      <span class="mdc-list-item__primary-text">What is this team focused on?</span>
      <span class="mdc-list-item__secondary-text">Endgame and Low Goals</span>
    </span>
  </li>
</ul>
  </div>
</div>
<div class="mdc-card" id="card-checkbox">
  <div class="mdc-card__primary-action noselect" tabindex="0" style='padding: 16px;'>
  <h5 style="margin-bottom: 0px;">Checkboxes</h5>
  <div class="text-center" style="display:flex; justify-content: center;" id="checkboxCardData">
        <div style="margin: 16px;"><h1 class="side-icon" style="margin-bottom: 0px;">check_circle</h1><strong>Endgame</strong><br><small class="text-muted">95% checked</small></div>
        <div style="margin: 16px;"><h1 class="side-icon" style="margin-bottom: 0px;">cancel</h1><strong>Spinner</strong><br><small class="text-muted">0% checked</small></div>
  </div>
  </div>
</div>
<div class="mdc-card" id="card-number">
  <div class="mdc-card__primary-action noselect" tabindex="0" style='padding: 16px;'>
  <h5 style="margin-bottom: 0px;">Numbers</h5>
  <small class="text-muted">Click for More Info</small>
  <div class="text-center" style="display:flex; justify-content: center;">
        <div style="margin: 16px;"><h1 class="side-number" style="margin-bottom: 0px;">4</h1><strong>High Goals</strong><br><small class="text-muted">Average</small></div>
        <div style="margin: 16px;"><h1 class="side-number" style="margin-bottom: 0px;">7</h1><strong>Low Goals</strong><br><small class="text-muted">Average</small></div>
  </div>
  </div>
</div>
</div>
</div>
</div>
</div>

<script>
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    responsive: true,
    data: {
        labels: ['All Defense', 'Some Defense', 'None'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    legend: {
            display: false,
            labels: {
                fontColor: 'var(--mdc-theme-on-primary, black)'
            }
        },
    options: {
        animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0 // animation duration after a resize
    }
});
</script>
<style>
  .mdc-card-columns .mdc-card{margin-bottom:.75rem; margin-left:0;}@media (min-width:556px){.mdc-card-columns{-webkit-column-count:2;-moz-column-count:2;column-count:2;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.mdc-card-columns .mdc-card{display:inline-block;width:100%}}@media (min-width:900px){.mdc-card-columns{-webkit-column-count:3;-moz-column-count:3;column-count:3;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.mdc-card-columns .mdc-card{display:inline-block;width:100%}} .mdc-card-columns{margin: 0px;}
</style>

<div class="mdc-card" id="card-pitscout"><div class="noselect"><h5 style="margin: 16px; margin-bottom: 0px">Pit Scouting</h5><ul class="mdc-list"></ul></div></div>
<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">check_circle</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">Low Goals</span> </span></li><li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">cancel</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">High Goals</span> </span></li><li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">cancel</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">Spinner</span> </span></li><li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">check_circle</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">Endgame</span> </span></li>s<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">message</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">What is this team focused on?</span> <span class="mdc-list-item__secondary-text">Endgame and Low Goals</span> </span></li>