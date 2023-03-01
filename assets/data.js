var allTeams = JSON.parse(localStorage.getItem('allTeams'));

if (allTeams == null) {
  if (localStorage.getItem('currentEvent') != null) {
    $.ajax({
      url: "https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/teams/simple",
      type: "GET",
      dataType: "json",
      beforeSend: function (xhr) { xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw '); },
      success: function (contents) {
        localStorage.setItem('allTeams', JSON.stringify(contents))
        allTeams = contents
      },
      error: function () {
        window.alert("Could not reach The Blue Alliance. Check your internet connection and try again.")
      }
    });
  } else {
    openEventPicker();
  }
}
var matchData;
var pitData;
var skippedTeams = [];
var dropdowni;
var dropdownteam;

Math.avg = function (array) {
  var sum = 0;
  for (i = 0; i < array.length; i++) {
    sum += parseInt(array[i]);
  }
  avg = sum / array.length
  return avg;
};

function showData() {
  document.getElementById('tableContainer').hidden = false;
  document.getElementById('main-tab').hidden = true;
  var tableBody = document.getElementById('tableBody');
  var tableHead = document.getElementById('header-row');
  for (var field of standFields) {
    if(field.type == "number" || field.type == "scale"){
      tableHead.innerHTML +='<th class="mdc-data-table__header-cell ' + ((field.type == 'number' || field.type == 'scale') ? 'mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort' : "") + '" role="columnheader" scope="col" data-column-id="' + field.id + 'col" id="' + field.id + '"><div class="mdc-data-table__header-cell-wrapper">' + ((field.type == 'number' || field.type == 'scale') ? '<button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button" aria-label="Sort by ' + field.title + '">arrow_upward</button>': "") + '<div class="mdc-data-table__header-cell-label">' + field.title + '</div><div class="mdc-data-table__sort-status-label" aria-hidden="true"></div></div></th>'
    }
  }
  for (var team of allTeams) {
    if (typeof matchData["team"+team.team_number] != "undefined" || typeof pitData["team"+team.team_number] != "undefined") {
      tableBody.innerHTML += '<tr class="mdc-data-table__row" tabindex="5" onclick="teamView.show('+team.team_number+')"id=' + team.team_number + 'row ><td class="mdc-data-table__cell">' + tableFavorite(team.team_number) + team.team_number + ' ' + team.nickname + '</td>';
      for (var field of standFields) {
          if (field.type == 'number' || field.type == "scale") {
            document.getElementById(team.team_number + 'row').innerHTML += '<td class="mdc-data-table__cell mdc-data-table__cell--numeric">' + getStandAverage(field.id, team.team_number) + '</td>';
          } else if (field == 'checkbox') {
            document.getElementById(team.team_number + 'row').innerHTML += '<td class="mdc-data-table__cell text-center"><i class="material-icons align-bottom">' + checkboxes.allDone(field.id, team.team_number, 'stand') + '</i></td>';
          }
      }
    } else {
      skippedTeams.push(team.team_number + ' ' + team.nickname)
    }
  }
  document.addEventListener("MDCDataTable:sorted", function (detail) {
    sortTable(detail.detail.columnIndex, detail.detail.sortValue)
  })
}


const standFields = [
  {
      "type": "number",
      "title": "Cones Scored",
      "shortTitle":"Cones",
      "id": "cones",
      "weight": 2
  },
  {
      "type": "number",
      "title": "Cubes Scored",
      "shortTitle":"Cubes",
      "id": "cubes",
      "weight": 1
  },
  {
      "type": "dropdown",
      "title": "Autonomous",
      "id": "auto",
      "options" : ["No Autonomous", "Autonomous did not work", "Left Community", "Scored", "Docked not engaged", "Docked and Engaged"]
  },
      {
      "type": "dropdown",
      "title": "Endgame",
      "id": "endgame",
      "options" : ["No Endgame", "Parked within Community", "Docked", "Docked and Engaged"]
  },
  {
      "type": "scale",
      "title": "Rate the Performance",
      "id": "rating",
      "shortTitle":"Rating",
      "min" : 1,
      "max" : 10
  },
  {
      "type": "text",
      "title": "Comments",
      "id": "comment",
  },
  {
      "type": "checkbox",
      "title": "Sustainability Bonus",
      "id": "susBonus",
  },
  {
      "type": "checkbox",
      "title": "Activation Bonus",
      "id": "activationBonus",
  },
  {
      "type": "checkbox",
      "title": "Match Won?",
      "shortTitle":"Won Match",
      "id": "won",
  },
];

const pitFields = [
  {
      "type": "checkbox",
      "title": "Can Do Cones",
      "id": "cones",
  },
  {
      "type": "checkbox",
      "title": "Can Do Cubes",
      "id": "cubes",
  },
  {
      "type": "checkbox",
      "title": "Can Pick Up From Floor",
      "id": "floorPickup",
  },
  {
      "type": "checkbox",
      "title": "Can Pick Up Tipped Cones",
      "id": "tippedCones",
  },
  {
      "type": "checkbox",
      "title": "Can Pick Up From Human Player",
      "id": "humanPlayer",
  },
  {
      "type":"scale",
      "title":"Robot Speed",
      "id":"speed",
      "min":1,
      "max":5,
  },
  {
      "type": "text",
      "title": "Describe Grabber Mechanism",
      "id": "grabber",
  },
  {
      "type": "dropdown",
      "title": "Drive Type",
      "id": "drive",
      "options" : ["Tank", "West Coast Drive", "Swerve", "Mecanum", "Other (add comment)"]
  },
  {
      "type": "dropdown",
      "title": "Autonomous Strategy",
      "id": "auto",
      "options" : ["No Autonomous", "Leaving Community", "Scored", "Docked not engaged", "Docked and Engaged"]
  },
  {
      "type": "dropdown",
      "title": "Endgame Strategy",
      "id": "endgame",
      "options" : ["Parking", "Dock w/ No Auto Engaging", "Dock w/ Auto Engaging"]
  },
  {
      "type": "text",
      "title": "Comments",
      "id": "comment",
  },
]

function sortTable(n, dir) {
  var table, rows, switching, i, x, y, shouldSwitch, switchcount = 0;
  table = dataTable;
  switching = true;
  while (switching) {
    switching = false;
    rows = table.getRows();
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "ascending") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "descending") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    }
  }
}


function getStandAverage(id, number) {
  try {
    var matches = matchData['team' + number];
    var sum = 0;
    var nonAnsers = 0;
    for (var match of matches) {
      if (match[id] != -1) {
        sum += parseInt(match[id]);
      } else {
        nonAnsers++;
      }
    }
    return sum / matches.length - nonAnsers;
  } catch {
    return "-";
  }
}

var chart;

const teamView = {
  "close": function () {
    title.innerHTML = "View Data";
    button.hidden = false;
    document.getElementById('favoriteButton').hidden = true;
    document.getElementById('eventButton').hidden = false;
    document.getElementById('tableContainer').classList.remove('disappearing')
    document.getElementById("backButton").hidden = true
    document.getElementById('tableContainer').hidden = false;
    document.getElementById('teamInfoContainer').classList.add('disappearing');
    document.getElementById('tableContainer').classList.add('appearing')
    setTimeout(function () { document.getElementById('tableContainer').classList.remove('appearing'); document.getElementById('teamInfoContainer').classList.remove('disappearing'); document.getElementById('teamInfoContainer').hidden = true; }, 200);
  },
  "show": function (teamNumber) {
    team = allTeams.find(el => el.team_number == teamNumber);
    teamView.construct(team)
    document.getElementById('tableContainer').classList.remove('appearing')
    document.getElementById('tableContainer').classList.add('disappearing')
    setTimeout(function () { document.getElementById('tableContainer').hidden = true; document.getElementById('tableContainer').classList.remove('disappearing') }, 200);
    document.getElementById('teamInfoContainer').hidden = false;
    if (team.team_number == 2530) {
      team.nickname = "Incornceivable"
    }
    title.innerHTML = "Team " + team.team_number + " " + team.nickname;
    button.hidden = true;
    document.getElementById("backButton").hidden = false
    document.getElementById('favoriteButton').hidden = false;
    document.getElementById('eventButton').hidden = true;
    document.getElementById('favoriteButton').onclick = function () { favoriteTeam(team.team_number) };
    if (localStorage.getItem('favoriteTeams') != null) {
      if (JSON.parse(localStorage.getItem('favoriteTeams')).indexOf(team.team_number) != -1) {
        document.getElementById('favoriteButton').innerHTML = 'favorite';
      } else {
        document.getElementById('favoriteButton').innerHTML = 'favorite_outline';
      }
    }
  },
  "construct": function (team) {
    var teamData = matchData['team' + team.team_number];
    var teamInfoColumns = document.getElementById('teamInfoColumns')
    teamInfoColumns.innerHTML = ''
    if (typeof matchData['team' + team.team_number] != 'undefined') {
      for (var i = 0; i < standFields.length; i++) {
        if (standFields[i].type == 'checkbox') {
          if (document.getElementById('card-checkbox') == null) {
            teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-checkbox"><div class="mdc-card__primary-action noselect" tabindex="0" style="padding: 16px;"><h5 style="margin-bottom: 0px;">Checkboxes</h5><div class="text-center" style="display:flex; justify-content: center;" id="checkboxCardData"></div></div></div>';
          }
          document.getElementById("checkboxCardData").innerHTML += '<div style="margin: 16px;"><h1 class="side-icon" style="margin-bottom: 0px;">' + checkboxes.allDone(standFields[i].id, team.team_number, 'stand') + '</h1><strong>' + standFields[i].title + '</strong><br><small class="text-muted">' + checkboxes.getPercentage(standFields[i].id, team.team_number, 'stand') + '% checked</small></div>'
        } else if (standFields[i].type == 'number') {
          if (document.getElementById('card-number') == null) {
            teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-number"><div class="mdc-card__primary-action noselect" tabindex="0" style="padding: 16px;"><h5 style="margin-bottom: 0px;">Numbers</h5><div class="text-center" style="display:flex; justify-content: center;" id="numberCardData"></div></div></div>';
          }
          document.getElementById("numberCardData").innerHTML += '<div style="margin: 16px;"><h1 class="side-number" style="margin-bottom: 0px;">' + Math.round(getStandAverage(standFields[i].id, team.team_number)) + '</h1><strong>' + standFields[i].title + '</strong><br><small class="text-muted">Average</small></div>'
        } else if (standFields[i].type == 'scale') {
          if (document.getElementById('card-rating') == null) {
            teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-scale"><div class="mdc-card__primary-action noselect"  onclick="card.expand(this.parentElement, ' + team.team_number + ');" tabindex="0" style="padding: 16px;"><h5 style="margin-bottom: 0px;">Rating</h5><small class="text-muted" style="margin-bottom: 10px;">Click for Comments</small><h6 id="ratingCardData"></h6><i class="material-icons" style="position: absolute; right: 20px; top: 30%;">expand_more</i><div id="comments" class="text-muted"></div></div></div>';
          }
          var starsLeft = getStandAverage(standFields[i].id, team.team_number);
          var iconsLeft = 5;
          document.getElementById("ratingCardData").innerText = Math.floor(getStandAverage(standFields[i].id, team.team_number)) + "/" + standFields[i].max;
        } else if (standFields[i].type == 'dropdown') {
          const dropi = i;
          dropdownteam = team;
          teamInfoColumns.innerHTML += '<div class="mdc-card" style="padding: 10px; padding-bottom: 20px"id="card-' + standFields[i].id + '"><canvas id="chart-' + standFields[i].id + '">Chart showing ' + standFields[i].title + ' data. Your browser does not support HTML canvas</canvas></div>';
          const chartel = '#chart-' + standFields[i].id;
          $(chartel).ready(function () {
            const team = dropdownteam;
            console.log(dropi);
            const ctx = document.getElementById('chart-' + standFields[dropi].id);
            const dropData = dropdown.getNumbers(standFields[dropi].id, team.team_number, matchData, dropi);
            new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: standFields[dropi].options,
                datasets: [{
                  data: dropData,
                  backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                }]
              },
              options: {
                maintainAspectRatio: true,
                responsive: true,
                aspectRatio: 1,
                animation: {
                  duration: 0
                },
                hover: {
                  animationDuration: 0
                },
                responsiveAnimationDuration: 0,
                title: {
                  display: true,
                  text: standFields[dropi].title,
                  position: 'top',
                  padding: 1
                }
              }
            });

          })
        }

      }
    }
    if (pitData != null && typeof pitData['team' + team.team_number] != 'undefined') { //checks if pit scouting is completed
      teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-pitscout"><div class="noselect"><h5 style="margin: 16px; margin-bottom: 0px">Pit Scouting</h5><ul class="mdc-list mdc-list--two-line" id="pitList"></ul></div></div>'
      var pitList = document.getElementById('pitList')
      const iconNames = {
        'checkbox': {
          true: 'check_circle',
          false: 'cancel'
        },
        'text': 'chat',
        'dropdown': 'list',
        'scale': 'linear_scale',
        'number': 'dialpad'
      }
      for (var field of pitFields) {
        if (field.type == 'checkbox') {
          pitList.innerHTML += '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + iconNames.checkbox[pitData['team' + team.team_number][field.id]] + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">' + field.title + '</span> </span></li>';
        }else if(field.type == "dropdown"){
          pitList.innerHTML += '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + iconNames.dropdown + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">' + field.title + '</span><span class="mdc-list-item__secondary-text">' + field.options[pitData['team' + team.team_number][field.id]] + '</span></span></li>';
        }else{
          pitList.innerHTML += '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + iconNames[field.type] + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">' + field.title + '</span> <span class="mdc-list-item__secondary-text">' + pitData['team' + team.team_number][field.id] + '</span> </span></li>';
        }
      }
    }
    var selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action, .mdc-list-item';
    var ripples = [].map.call(document.querySelectorAll(selector), function (el) {
      return new mdc.ripple.MDCRipple(el);
    });
  }
};

const checkboxes = {
  "allDone": function (id, number, type) {
    if (typeof standData != "undefined" && typeof standData['team' + number] != 'undefined') {
      var object = data.rows[getDbByID(data.rows, 'team' + number)].doc[type];
    }
    if (typeof object != 'undefined') {
      var keys = Object.keys(object)
      var done = false;
      var allDone = true;
      for (var i = 0; i < keys.length; i++) {
        if (standData['team' + number][keys[i]]) {
          done = true;
        } else {
          allDone = false;
        }
      }
    } else {
      return 'highlight_off'
    }
    if (done) { //returns icon name to show
      if (allDone) {
        return 'done_all'
      } else {
        return 'done'
      }
    } else {
      return 'close'
    }
  },
  "getPercentage": function (id, number, type) {
    if (typeof matchData != "undefined" && typeof matchData["team" + number] != undefined){
        var checked = 0;
        for (var match of matchData["team" + number]) {
          if (match[id]) {
            checked++
          }
        }
      } else {
        return -1;
      }
      return Math.round((checked / matchData["team" + number].length) * 100);
    }
}

const dropdown = {
  "getNumbers": function (id, number, dataset, i) {
    var output = [];
    if (typeof dataset != "undefined" && typeof dataset['team' + number] != 'undefined') {
      var matches = dataset['team' + number]
      for (var rep = 0; rep < standFields[i].options.length; rep++) {
        output.push(0)
      }
      for (var match of dataset["team"+number]) {
        output[match[id]]++
      }
    }else{
      return[0];
    }
    return output;
  }
}

const card = {
  "expand": function (element, team) {
    $header = $(element);
    //getting the next element
    document.getElementById('comments').innerHTML = '<li role="separator" class="mdc-list-divider"></li><small style="color:var(--mdc-theme-text-primary-on-background, black)">Comments<br></small>';
    var object = matchData['team' + team];
    for (var match of object) {
      if (match.comment != undefined || match.comment != ""){
        var comment = document.createElement("li");
        comment.innerText = "\"" + match.comment + "\"";
        document.getElementById('comments').appendChild(comment);
      }
    }
    $("#comments").slideToggle(200, function () {
      //execute this after slideToggle is done
      //change text of header based on visibility of content div
    });


  }
}
function favoriteTeam(team) {
  var favoriteTeams = JSON.parse(localStorage.getItem('favoriteTeams'))
  if (favoriteTeams == null) {
    favoriteTeams = [];
  }
  if (favoriteTeams.indexOf(team) == -1) {
    document.getElementById('favoriteButton').innerHTML = 'favorite';
    favoriteTeams.push(team)
    localStorage.setItem('favoriteTeams', JSON.stringify(favoriteTeams))
  } else {
    document.getElementById('favoriteButton').innerHTML = 'favorite_outline';
    favoriteTeams.splice(favoriteTeams.indexOf(team, 1));
    localStorage.setItem('favoriteTeams', JSON.stringify(favoriteTeams))
  }
}
function tableFavorite(team) {
  var favoriteTeams = JSON.parse(localStorage.getItem('favoriteTeams'))
  if (favoriteTeams != null) {
    if (favoriteTeams.indexOf(team) != -1) {
      return '<i class="material-icons" style="font-size: 13px !important; vertical-align:middle;">favorite</i> '
    } else {
      return ''
    }
  } else {
    return ''
  }
}

var qrCtx;
var videoStream;
var qrStopped = false;

function initializeQrReader(){
    navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:"environment"}}).then(function(stream){
    videoStream = stream;
    document.getElementById("qr-v").srcObject = videoStream;
    document.getElementById("qr-v").play();
    qrCtx = document.getElementById("qr-canvas").width = 800;
    qrCtx = document.getElementById("qr-canvas").height = 600;
    qrCtx = document.getElementById("qr-canvas").getContext("2d");
    qrcode.callback = qrCodeDetected;
    readQR();
    qrDialog.open();
  }).catch(function(err){
    console.log(err);
    snackbar.labelText = "Error opening camera.";
    snackbar.open();
  });
}

var codesScanned = 0;
var scannedCodesData = [];
var scannedCodesText = [];

function qrCodeDetected(text) {
  var qrHelperText = document.getElementById("qrHelperText");
  var scannedDataEl = document.getElementById("scannedData");
  var data;
  try {
    data = JSON.parse(text);
    if (text != scannedCodesText[scannedCodesText.length - 1]) {
      var listItem = document.createElement("li");
      codesScanned++;
      var card = document.createElement("div");
      card.classList.value = "mdc-card qr-result";
      card.innerHTML = '<h5>Code ' + codesScanned + '</h5><ul></ul>';
      var list = card.querySelector("ul");
      if (Array.isArray(data)) {
        var team = data[0].team;
        var matchNums = [];
        for (var match of data) {
          if(typeof match.matchNumber != "undefined"){
            matchNums.push(match.matchNumber);
          }
        }
        listItem.innerText = "Team " + team + "- Matches " + matchNums.join(", ");
        list.appendChild(listItem);
      } else {
        for (var key of Object.keys(data)) {
          var listItem = document.createElement("li");
          console.log(key);
          if (key == "type") {
            listItem.innerText = "Contains " + data[key] + " data.";
          } else {
            listItem.innerText = "Team " + key.split("team")[1];
          }
          list.appendChild(listItem);
        }
      }
      scannedCodesData.push(data);
      scannedCodesText.push(text);
      scannedDataEl.appendChild(card);
    } else {
      console.log("Same QR detected")
    }
  } catch (err) {
    qrHelperText.innerText = "Error! Invalid QR Code. Currently looking for QR codes.";
    console.log([text, err]);
  }
}

function saveQRData(){
  var totalPitData = new Object;
  var totalMatchData = new Object;
  for(var data of scannedCodesData){
    if(Array.isArray(data)){
      var team = data[0].team
      data.splice(0,1);
      totalMatchData["team" + team] = data;
    }else{
      for(var key of Object.keys(data)){
        if(key != "type"){
          totalPitData[key] = data[key];
        }
      }
    }
  }
  var downloader = document.getElementById("dataDownloader");
  downloader.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(totalMatchData)));
  downloader.setAttribute("download", "match-data.json");
  downloader.click();
  downloader.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(totalPitData)));
  downloader.setAttribute("download", "pit-data.json");
  downloader.click();
  stopQR();
}
function readQR(){
  if(!qrStopped){
      try{
          qrCtx.drawImage(document.getElementById("qr-v"),0,0);
          try{
              qrcode.decode();
          }
          catch(e){       
              console.log(e);
          }finally{
            setTimeout(readQR, 500);
          }
      }
      catch(e){       
              console.log(e);
              setTimeout(readQR, 500);
      };
  }
}

function stopQR(){
  qrStopped = true;
  document.getElementById("qr-v").pause();
  document.getElementById("qr-v").src = "";
  videoStream.getTracks().forEach(function(track){
    track.stop();
  }) 
}

async function compileData(files){
  matchData = new Object;
  pitData = new Object;
  var matchFileObjs = [];
  var pitFileObjs = [];
  try{
    var i = 0;
    for await(const file of files){
      console.log(files);
      if(file.type == "application/json"){
        if(file.name.search("match") != -1){
          console.log(file.text());
          matchFileObjs.push(JSON.parse(await file.text()));
        }else{
          pitFileObjs.push(JSON.parse(await file.text()));
        }
      }
      i++;
    }
    for(var obj of matchFileObjs){
      for(var key of Object.keys(obj)){
        if(typeof matchData[key] == "undefined"){
          matchData[key] = [];
        }
        for(var match of obj[key]){
          matchData[key].push(match);
        }
      }
    }
    for(var obj of pitFileObjs){
      for(var key of Object.keys(obj)){
          pitData[key] = obj[key];
      }
    }
    showData();
  }catch(err){
    console.log(err);
    snackbar.labelText = "An error occured while importing files.";
    snackbar.open();
  }
}