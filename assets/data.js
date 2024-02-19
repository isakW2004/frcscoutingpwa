var allTeams = JSON.parse(localStorage.getItem('allTeams'));

if (allTeams == null) {
  if (localStorage.getItem('currentEvent') != null) {
    getTBAData("https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/teams/simple").then((teams => allTeams = teams));
  } else {
    eventPicker.open()
  }
}
var matchData;
var pitData;
var skippedTeams = [];

function showData() {
  document.getElementById('tableContainer').hidden = false;
  document.getElementById('main-tab').hidden = true;
  var tableBody = document.getElementById('tableBody');
  var tableHead = document.getElementById('header-row');
  for (var field of matchFields) {
    if (field.type == "number" || field.type == "scale" || field.type == "checkbox") {
      tableHead.innerHTML += '<th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort" role="columnheader" scope="col" data-column-id="' + field.id + 'col" id="' + field.id + '"><div class="mdc-data-table__header-cell-wrapper"><button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button" aria-label="Sort by ' + field.title + '">arrow_upward</button><div class="mdc-data-table__header-cell-label">' + field.title + '</div><div class="mdc-data-table__sort-status-label" aria-hidden="true"></div></div></th>';
    }
  }
  for (var team of allTeams) {
    if (typeof matchData["team" + team.team_number] != "undefined" || typeof pitData["team" + team.team_number] != "undefined") {
      var row = new Row(team);
      var teamCell = new Cell(team.team_number, team.team_number + " " + team.nickname);
      teamCell.setNumeric(false);
      row.addCell(teamCell);
      tableBody.appendChild(row.root);
      for (var field of matchFields) {
        if (field.type == 'number' || field.type == "scale") {
          var cell = new Cell(getAverageOfMatch(field.id, team.team_number));
          row.addCell(cell)
        } else if (field.type == 'checkbox') {
          if (matchData["team" + team.team_number]) {
            var cell = new Cell(checkboxes.getPercentage(field.id, team.team_number, 'match'), checkboxes.getPercentage(field.id, team.team_number, 'match').toLocaleString("en-US", { style: "percent" }));
          } else {
            var cell = new Cell(-1, "-");
          }
          row.addCell(cell)
        }
      }
    } else {
      skippedTeams.push(team.team_number + ' ' + team.nickname);
    }
  }
  document.addEventListener("MDCDataTable:sorted", function (detail) {
    Row.sortRowsByMetric(detail.detail.columnIndex);
    if (detail.detail.sortValue == "descending") {
      Row.allRows.reverse();
    }
    tableBody.innerHTML = "";
    for (var row of Row.allRows) {
      tableBody.appendChild(row.root);
      row.rebuild();
    }
    console.log(Row.allRows);
  })
}

function getAverageOfMatch(id, number) {
  try {
    var matches = matchData['team' + number];
    var sum = 0;
    var nonAnsers = 0;
    for (var match of matches) {
      if (match[id] != -1 && !isNaN(parseInt(match[id]))) {
        sum += parseInt(match[id]);
      } else {
        nonAnsers++;
      }
    }
    if (matches.length - nonAnsers == 0) {
      return "-";
    }
    return Math.floor(sum / (matches.length - nonAnsers) * 100) / 100;
  } catch {
    return "-";
  }
}

class Window{
  constructor(contents){
    this.root = document.createElement("div");
    this.root.classList.add("window");
    this.title = document.createElement("h4");
    this.title.classList.add("window__title");
    this.title.innerText = contents.title;
    this.root.appendChild(this.title);
    this.root.appendChild(contents.root);
    this.contents = contents;
  }
  
  handleDisplayChange(){
    if(this.contents.handleDisplayChange){
      this.contents.handleDisplayChange();
    }
  }
}

class WindowManager{
  constructor(root){
    this.root = root;
    window.addEventListener("resize", () => WindowManager.handleWindowResize(this));
  }
  
  windows = [];

  static handleMouseDown(e, x){
    if(document.documentElement.clientWidth){
      var totalWidth = 0;
    }
    var target = e.target || e.srcElement || e.originalTarget;
    for(var i = 0; i < windowManager.windows.indexOf(target.windowToResize); i++){
      totalWidth += windowManager.windows[i].root.clientWidth;
    }
    if(x - totalWidth > 375 && document.documentElement.clientWidth - (x - totalWidth) >= (windowManager.windows.length - 1) * 375){
      target.windowToResize.root.style.width = x - totalWidth + "px";
      target.windowToResize.root.style.maxWidth = x - totalWidth + "px";
      target.windowToResize.root.style.minWidth = x - totalWidth + "px";
      for(var windowEl of windowManager.windows){
        windowEl.handleDisplayChange();
      }
    }
  }

  static handleWindowResize(managerInstance){
    if(managerInstance.windows.length > 1  && managerInstance.root.offsetWidth < managerInstance.windows.length * 375){
      snackbar.labelText = "Closed window \"" + managerInstance.windows[managerInstance.windows.length - 1].title.innerText + "\" due to insufficient width";
      snackbar.open();
      managerInstance.closeWindow(managerInstance.windows.length - 1);
    }
    for(const windowEl of managerInstance.windows){
      windowEl.root.style.width = managerInstance.root.offsetWidth / managerInstance.windows.length + "px";
      windowEl.root.style.minWidth = "";
      windowEl.root.style.maxWidth = ""; 
    }
    for(const windowEl of managerInstance.windows){
      windowEl.handleDisplayChange();
    }
  }

  addWindow(windowEl){
    this.windows.push(windowEl);
    this.root.appendChild(windowEl.root);
    var resizer = document.createElement("span");
    resizer.classList.add("window__resizer");
    resizer.windowToResize = this.windows[this.windows.length - 1];
    resizer.addEventListener("mousedown", function(e) {
      var target = e.target || e.srcElement || e.originalTarget;
      target.classList.add("window__resizer--active");
      e.preventDefault();
      var originalX = target.offsetLeft;
      document.onmousemove = (f) => WindowManager.handleMouseDown(e, f.clientX, originalX);
      document.onmouseup = () => {document.onmousemove = null; target.classList.remove("window__resizer--active")};
    });
    windowEl.resizer= resizer;
    this.root.appendChild(resizer);
    for(const windowEl of this.windows){
      windowEl.root.style.width = this.root.offsetWidth / this.windows.length + "px";
      windowEl.root.style.minWidth = "";
      windowEl.root.style.maxWidth = ""; 
      windowEl.resizer.hidden = false;
    }
    windowEl.resizer.hidden = true;
    for(const windowEl of this.windows){
      windowEl.handleDisplayChange();
    }
  }

  closeWindow(index){
    this.windows[index].root.remove();
    this.windows[index].resizer.remove();
    this.windows.splice(index,1);
  }

  closeAllWindows(){
    this.root.innerHTML = "";
    this.windows = [];
  }
}

class TeamView{
  constructor(team) {
    this.team = team;
    if (this.team == 2530) {
      this.teamName = "Incornceivable";
    }else{
      this.teamName = allTeams.find((t) => t.team_number == team).nickname;
    }
    this.title = "Team " + this.team + " " + this.teamName;
    this.root = document.createElement("div");
    this.root.classList.value = "mdc-card-columns team-info-columns";
    this.data = { match: matchData["team" + team], pit: pitData["team" + team] };
    try{
      this.reconstruct();
    }catch(e){
      console.log(e);
      snackbar.labelText = "There was an error opening team view. Make sure you are using the correct configuration.";
      snackbar.open();
      throw new Error(e);
    }
  }

  reconstruct() {
    this.root.innerHTML = "";
    if(!matchData["team" + this.team] && !pitData["team" + this.team] && !blueAllianceStats){
      var card = document.createElement("div");
      card.style.padding = "10px";
      card.classList.add('mdc-card')
      card.appendChild(this._makeCardTitle("There's no data for this team :("));
      this.root.appendChild(card);
    }else{
      if (matchData["team" + this.team]) {
        this.root.appendChild(this._makeCheckboxCard(matchFields.filter(field => field.type == "checkbox")));
        this.root.appendChild(this._makeNumberCard(matchFields.filter(field => field.type == "number" || field.type == "scale")));
        for (var field of matchFields) {
          switch (field.type) {
            case "text":
              this.root.appendChild(this._makeTextCard(field));
              break;
            case "dropdown":
              this.root.appendChild(this._makeDropdownCard(field))
              break;
            case "multi-select":
              this.root.appendChild(this._makeMultiSelectCard(field));
              break;
          }
        }
      }
      if (pitData && pitData["team" + this.team]) {
        console.log("pd=" + JSON.stringify(pitData));
        this.root.appendChild(this._makePitCard());
      }
      if(blueAllianceStats){
        this.root.appendChild(this._makeTBACard());
      }
    }
    this.masonry = new Masonry(this.root, {itemSelector:".mdc-card", fitWidth:true, transitionDuration:"0.2s"});
  }

  _makeCheckboxCard(fields) {
    var card = document.createElement("div");
    card.style.padding = "10px";
    card.classList.add('mdc-card')
    card.appendChild(this._makeCardTitle("Checkboxes"));
    var data = document.createElement("div");
    data.classList.add("data-card");
    for (var field of fields) {
      var metric = document.createElement("div");
      var icon = document.createElement("h1");
      icon.style.marginBottom = 0;
      icon.classList.value = "side-icon";
      icon.innerText = checkboxes.allDone(field.id, this.team, "match");
      var title = document.createElement("h6");
      title.style.marginBottom = 0;
      title.style.breakAfter = "right";
      title.innerText = field.title;
      var helper = document.createElement("small")
      helper.classList.value = "text-muted";
      helper.innerText = checkboxes.getPercentage(field.id, this.team, 'match').toLocaleString(undefined, { style: "percent" }) + " Checked";
      metric.appendChild(icon);
      metric.appendChild(title);
      metric.appendChild(helper);
      data.appendChild(metric)
    }
    card.appendChild(data);
    return card;
  }

  handleDisplayChange(){
    this.masonry.layout();
  }

  _makeNumberCard(fields) {
    var card = document.createElement("div");
    card.style.padding = "10px";
    card.classList.add('mdc-card')
    card.appendChild(this._makeCardTitle("Numbers"));
    var data = document.createElement("div");
    data.classList.add("data-card");
    for (var field of fields) {
      var metric = document.createElement("div");
      var value = document.createElement("h1");
      value.style.marginBottom = 0;
      value.classList.value = "side-number";
      value.innerText = getAverageOfMatch(field.id, this.team).toLocaleString(undefined, { maximumFractionDigits: 2, notation: "compact" });
      if (value.innerText.length > 4) {
        value.innerText = getAverageOfMatch(field.id, this.team).toLocaleString(undefined, { maximumFractionDigits: 2, notation: "scientific" });
      }
      var title = document.createElement("h6");
      title.style.marginBottom = 0;
      title.style.breakAfter = "right";
      title.innerText = field.title;
      var helper = document.createElement("small")
      helper.classList.value = "text-muted";
      helper.innerText = (field.type != "scale") ? "Average" : "Average Out Of " + field.max;
      metric.appendChild(value);
      metric.appendChild(title);
      metric.appendChild(helper);
      data.appendChild(metric)
    }
    card.appendChild(data);
    return card;
  }

  _makeTextCard(field) {
    var card = document.createElement("div");
    card.style.padding = "10px";
    card.classList.add('mdc-card')
    card.appendChild(this._makeCardTitle(field.title));
    for (var match of matchData["team" + this.team]) {
      if (match[field.id] && match[field.id] != "") {
        var listItem = document.createElement("li");
        listItem.style.listStyle = "none";
        listItem.classList.add("text-quote");
        listItem.innerText = "“" + match[field.id] + "”";
        card.appendChild(listItem);
      }
    }
    return card;
  }

  _makeDropdownCard(field) {
    var card = document.createElement("div");
    card.classList.value = "mdc-card chart-card";
    card.style.padding = "10px";
    var chart = document.createElement("canvas");
    chart.innerText = "This is a chart showing " + field.title + " data.";
    var dropData = dropdown.getNumbers(field, this.team, matchData);
    new Chart(chart, { type: 'doughnut', data: { labels: field.options, datasets: [{ data: dropData, backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'] }] }, options: { maintainAspectRatio: true, responsive: false, aspectRatio: 1, animation: { duration: 0 }, hover: { animationDuration: 0 }, responsiveAnimationDuration: 0, title: { display: true, text: field.title, position: 'top', padding: 1 } } });
    card.appendChild(chart);
    return card;
  }

  _makeMultiSelectCard(field) {
    var card = document.createElement("div");
    card.classList.value = "mdc-card chart-card";
    card.style.padding = "10px";
    var chart = document.createElement("canvas");
    chart.innerText = "This is a chart showing " + field.title + " data.";
    var dropData = getMultiSelectData(field, this.team, matchData);
    new Chart(chart, { type: 'bar', data: { labels: field.options, datasets: [{ data: dropData, backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'] }] }, options: { maintainAspectRatio: true, responsive: false, aspectRatio: 1, animation: { duration: 0 }, hover: { animationDuration: 0 }, responsiveAnimationDuration: 0, title: { display: true, text: field.title + " (%)", position: 'top', padding: 1 }, scales: { yAxes: [{ ticks: { beginAtZero: true, max: 100 } }] }, legend: { display: false } } });
    card.appendChild(chart);
    return card;
  }

  _makePitCard() {
    var card = document.createElement("div");
    card.classList.add("mdc-card");
    var pitList = document.createElement("ul");
    pitList.classList.value = "mdc-list--two-line mdc-list";
    for (var field of pitFields) {
      if (field.type == 'checkbox') {
        pitList.innerHTML += '<li class="mdc-list-item pit-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + TeamView._pitIcons.checkbox[pitData['team' + this.team][field.id]] + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">' + field.title + '</span> </span></li>';
      } else if (field.type == "dropdown") {
        pitList.innerHTML += '<li class="mdc-list-item pit-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + TeamView._pitIcons.dropdown + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">' + field.title + '</span><span class="mdc-list-item__secondary-text">' + field.options[pitData['team' + this.team][field.id]] + '</span></span></li>';
      } else if (field.type == "multi-select") {
        var selectedText = [];
        for (var response of pitData['team' + this.team][field.id]) {
          selectedText.push(field.options[response]);
        }
        pitList.innerHTML += '<li class="mdc-list-item pit-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + TeamView._pitIcons.multiSelect + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">' + field.title + '</span><span class="mdc-list-item__secondary-text">' + selectedText.join(", ") + '</span></span></li>';
      } else {
        pitList.innerHTML += '<li class="mdc-list-item pit-list-item" tabindex="0" onclick="this.querySelector(\'\'"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">' + TeamView._pitIcons[field.type] + '</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">' + field.title + '</span> <span class="mdc-list-item__secondary-text">' + pitData['team' + this.team][field.id] + '</span> </span></li>';
      }
    }
    card.appendChild(pitList);
    return card;
  }

  _makeTBACard(){
    var tbaCard = document.createElement("div");
    tbaCard.classList.value = "mdc-card blue-alliance-text";
    tbaCard.innerHTML = '<h5 style="margin: 16px; margin-bottom: 0px">Blue Alliance Stats</h5>';
    var list = document.createElement("ul");
    list.classList.value = "mdc-list mdc-list--two-line";
    for (var stat of blueAllianceStats["frc" + this.team]) {
      var listItem = document.createElement("li");
      listItem.classList.value = "mdc-list-item";
      listItem.innerHTML = '<span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">' + stat.name + '</span><span class="mdc-list-item__secondary-text">' + stat.value + (stat.name != "Overall Rank" ? ' (Rank ' + stat.rank + ')' : '') + '</span></span>';
      list.appendChild(listItem);
    }
    tbaCard.appendChild(list);
    return tbaCard;
  }

  static _pitIcons = {
    'checkbox': {
      true: 'check_circle',
      false: 'cancel'
    },
    'text': 'chat',
    'dropdown': 'list',
    'scale': 'linear_scale',
    'number': 'dialpad',
    'multiSelect': 'done_all'
  }

  _makeCardTitle(text) {
    var title = document.createElement("h5");
    title.innerText = text;
    title.style.paddingBottom = 0;
    return title;
  }

  static open(instance) {
    document.getElementById('tableContainer').classList.remove('appearing');
    document.getElementById('tableContainer').classList.add('disappearing');
    setTimeout(function () { document.getElementById('tableContainer').hidden = true; document.getElementById('tableContainer').classList.remove('disappearing') }, 200);
    document.getElementById('window-container').hidden = false;
    windowManager.addWindow(new Window(instance));
    title.innerHTML = "Team View";
    navButton.hidden = true;
    document.getElementById("backButton").hidden = false
    document.getElementById('newWindowButton').hidden = false;
    document.getElementById('eventButton').hidden = true;
  }

  static close(purge) {
    title.innerHTML = "View Data";
    navButton.hidden = false;
    document.getElementById('newWindowButton').hidden = true;
    document.getElementById('eventButton').hidden = false;
    document.getElementById('tableContainer').classList.remove('disappearing')
    document.getElementById("backButton").hidden = true;
    document.getElementById('tableContainer').hidden = false;
    document.getElementById('window-container').classList.add('disappearing');
    document.getElementById('tableContainer').classList.add('appearing');
    setTimeout(function () { document.getElementById('tableContainer').classList.remove('appearing'); document.getElementById('window-container').classList.remove('disappearing'); document.getElementById('window-container').hidden = true; 
      if(purge){
        windowManager.closeAllWindows()
      }
    }, 200);
  }
  static newWindow(){
    if(windowManager.root.offsetWidth >= (windowManager.windows.length + 1) * 375){
      TeamView.close(false);
      snackbar.labelText = "Select a team to split view";
      snackbar.open();
    }else{
      snackbar.labelText = "Your screen is too small for another window. Zoom out and try again.";
      snackbar.open();
    }
  }
}

function getMultiSelectData(field, team, dataset) {
  var data = [];
  for (var i = 0; i < field.options.length; i++) {
    var numChecked = 0;
    for (var match of dataset["team" + team]) {
      if (match[field.id].indexOf(i) != -1) {
        numChecked++;
      }
    }
    data.push((numChecked / dataset["team" + team].length) * 100);
  }
  return data;
}

const checkboxes = {
  "allDone": function (id, number) {
    if (typeof matchData != "undefined" && typeof matchData['team' + number] != 'undefined') {
      var object = matchData["team" + number];
    }
    if (typeof object != 'undefined') {
      var done = false;
      var allDone = true;
      for (var i = 0; i < object.length; i++) {
        if (object[i][id]) {
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
    if (typeof matchData != "undefined" && typeof matchData["team" + number] != undefined) {
      var checked = 0;
      for (var match of matchData["team" + number]) {
        if (match[id]) {
          checked++
        }
      }
    } else {
      return -1;
    }
    return checked / matchData["team" + number].length;
  }
}

const dropdown = {
  "getNumbers": function (field, team, dataset) {
    var output = [];
    if (typeof dataset != "undefined" && typeof dataset['team' + team] != 'undefined') {
      var matches = dataset['team' + team]
      for (var rep = 0; rep < field.options.length; rep++) {
        output.push(0)
      }
      for (var match of dataset["team" + team]) {
        output[match[field.id]]++
      }
    } else {
      return [0];
    }
    return output;
  }
}

var qrCtx;
var videoStream;
var qrStopped = false;

function initializeQrReader() {
  navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } }).then(function (stream) {
    videoStream = stream;
    document.getElementById("qr-v").srcObject = videoStream;
    document.getElementById("qr-v").play();
    qrCtx = document.getElementById("qr-canvas").width = 800;
    qrCtx = document.getElementById("qr-canvas").height = 600;
    qrCtx = document.getElementById("qr-canvas").getContext("2d");
    qrcode.callback = qrCodeDetected;
    readQR();
    qrDialog.open();
  }).catch(function (err) {
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
          if (typeof match.matchNumber != "undefined") {
            matchNums.push(match.matchNumber);
          }
        }
        listItem.innerText = "Team " + team + "- Matches " + matchNums.join(", ");
        list.appendChild(listItem);
      } else {
        for (var key of Object.keys(data)) {
          var listItem = document.createElement("li");
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

function saveQRData() {
  var totalPitData = new Object;
  var totalMatchData = new Object;
  for (var data of scannedCodesData) {
    if (Array.isArray(data)) {
      var team = data[0].team
      data.splice(0, 1);
      totalMatchData["team" + team] = data;
    } else {
      for (var key of Object.keys(data)) {
        if (key != "type") {
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
function readQR() {
  if (!qrStopped) {
    try {
      qrCtx.drawImage(document.getElementById("qr-v"), 0, 0);
      try {
        qrcode.decode();
      }
      catch (e) {
        console.log(e);
      } finally {
        setTimeout(readQR, 500);
      }
    }
    catch (e) {
      console.log(e);
      setTimeout(readQR, 500);
    };
  }
}

function stopQR() {
  qrStopped = true;
  document.getElementById("qr-v").pause();
  document.getElementById("qr-v").src = "";
  videoStream.getTracks().forEach(function (track) {
    track.stop();
  })
}

async function compileData(files) {
  matchData = new Object;
  pitData = new Object;
  var matchFileObjs = [];
  var pitFileObjs = [];
  try {
    var i = 0;
    for await (const file of files) {
      if (file.type == "application/json") {
        if (file.name.search("match") != -1) {
          matchFileObjs.push(JSON.parse(await file.text()));
        } else {
          pitFileObjs.push(JSON.parse(await file.text()));
        }
      }
      i++;
    }
    for (var obj of matchFileObjs) {
      for (var key of Object.keys(obj)) {
        if (typeof matchData[key] == "undefined") {
          matchData[key] = [];
        }
        for (var match of obj[key]) {
          var isDuplicate = matchData[key].includes(match);
          for (var allMatch of matchData[key]) {
            if (JSON.stringify(allMatch) == JSON.stringify(match)) {
              isDuplicate = true;
            }
          }
          if (!isDuplicate) {
            matchData[key].push(match);
          }
        }
      }
    }
    for (var obj of pitFileObjs) {
      for (var key of Object.keys(obj)) {
        pitData[key] = obj[key];
      }
    }
    showData();
  } catch (err) {
    console.log(err);
    snackbar.labelText = "An error occured while importing files.";
    snackbar.open();
  }
}
var downloader = document.createElement("a")
function consolidateData() {
  if(!matchData && !pitData){
    snackbar.labelText = "There is no scouting data to export";
    snackbar.open();
    return;
  }
  try {
    if (matchData) {
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(matchData));
      downloader.setAttribute("href", dataStr);
      downloader.setAttribute("download", "match-scouting.json");
      downloader.click();
    }
    if (pitData) {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pitData));
      downloader.setAttribute("href", dataStr);
      downloader.setAttribute("download", "pit-scouting.json");
      downloader.click();
    }
  } catch (err) {
    snackbar.labelText = "There was an error downloading data";
    snackbar.open();
  } finally {
    snackbar.labelText = "Scouting data exported";
    snackbar.open();
  }
}

var blueAllianceStats;

async function getBlueAllianceStats() {
  var stats = await getTBAData("https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/teams/statuses");
  blueAllianceStats = new Object;
  for (var key of Object.keys(stats)) {
    blueAllianceStats[key] = [];
    for (var i = 0; i < stats[key].qual.sort_order_info.length; i++) {
      var stat = new Object;
      stat.value = stats[key].qual.ranking.sort_orders[i];
      stat.name = stats[key].qual.sort_order_info[i].name;
      blueAllianceStats[key].push(stat);
    }
    var rank = new Object;
    rank.value = stats[key].qual.ranking.rank
    rank.name = "Overall Rank";
    blueAllianceStats[key].push(rank);
  }
  var oprs = await getTBAData("https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/oprs");
  for (var key of Object.keys(oprs.ccwms)) {
    blueAllianceStats[key].push({ name: "CCWM", value: oprs.ccwms[key] });
  }
  for (var key of Object.keys(oprs.oprs)) {
    blueAllianceStats[key].push({ name: "OPR", value: oprs.oprs[key] });
  }
  for (var key of Object.keys(oprs.dprs)) {
    blueAllianceStats[key].push({ name: "DPR", value: oprs.dprs[key] });
  }
  var rankedStats = [];
  for (var key of Object.keys(blueAllianceStats)) {
    if (rankedStats.length < blueAllianceStats[key].length) {
      for (var i = 0; i < blueAllianceStats[key].length; i++) {
        rankedStats.push([]);
      }
    }
    for (var i = 0; i < blueAllianceStats[key].length; i++) {
      rankedStats[i].push(blueAllianceStats[key][i].value);
    }
  }
  for (var i = 0; i < rankedStats.length; i++) {
    rankedStats[i] = rankedStats[i].sort(function (a, b) {
      return a - b;
    }).reverse();
  }
  for (var key of Object.keys(blueAllianceStats)) {
    for (var i = 0; i < blueAllianceStats[key].length; i++) {
      blueAllianceStats[key][i].rank = rankedStats[i].indexOf(blueAllianceStats[key][i].value) + 1;
    }
  }
}

class Cell {
  constructor(value, text) {
    this.root = document.createElement("th");
    this.value = value;
    this.root.classList.value = "mdc-data-table__cell mdc-data-table__cell--numeric";
    if (!isNaN(value)) {
      this.root.innerText = text || value.toFixed(2);
    } else {
      this.root.innerText = "-";
      this.value = -1;
    }
    this.blue = false;
  }
  setBlue(val) {
    if (val) {
      this.root.classList.add("blue-alliance-text");
    } else {
      this.root.classList.remove("blue-alliance-text");
    }
    this.blue = val;
  }
  setNumeric(val) {
    if (val) {
      this.root.classList.add("mdc-data-table__cell--numeric");
    } else {
      this.root.classList.remove("mdc-data-table__cell--numeric");
    }
  }
}

class Row {
  constructor(team) {
    this.team = team;
    this.root = document.createElement("tr");
    this.root.classList.add("mdc-data-table__row");
    this.root.onclick = () => TeamView.open(new TeamView(team.team_number));
    this.cells = [];
    Row.allRows.push(this);
  }

  addCell(cell) {
    this.cells.push(cell);
    this.root.appendChild(cell.root);
  }

  rebuild() {
    for (var cell of this.cells) {
      this.root.appendChild(cell.root);
    }
  }

  removeBlueCells() {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].blue) {
        this.cells[i].root.remove();
        this.cells.splice(i, 1);
        i--;
      }
    }
  }

  static getTeamRow(teamNumber) {
    return Row.allRows.find(row => row.team.team_number == teamNumber);
  }

  static allRows = [];

  static sortRowsByMetric(metric) {
    return this.allRows.sort((a, b) => {
      if (a.cells[metric].value < b.cells[metric].value) {
        return -1;
      } else if (a.cells[metric].value > b.cells[metric].value) {
        return 1;
      }
      return 0;
    })
  }
}

function updateTable(valueIndexes, rankIndexes) {
  document.querySelector("thead").querySelectorAll(".blue-alliance-text").forEach((el) => el.remove())
  for (var row of Row.allRows) {
    row.removeBlueCells();
  }
  for (var dataIndex of valueIndexes) {
    var headerName = blueAllianceStats[Object.keys(blueAllianceStats)[0]][dataIndex].name;
    var cell = document.createElement("th");
    cell.classList.value = "mdc-data-table__header-cell mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort blue-alliance-text";
    cell.innerHTML = '<div class="tablesorter-header-inner"><div class="mdc-data-table__header-cell-wrapper"><button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button" aria-label=Sort by"' + headerName + '">arrow_upward</button><div class="mdc-data-table__header-cell-label">' + headerName + '</div><div class="mdc-data-table__sort-status-label" aria-hidden="true"></div></div></div>';
    document.getElementById("header-row").appendChild(cell);
  }
  for (var dataIndex of rankIndexes) {
    var headerName = blueAllianceStats[Object.keys(blueAllianceStats)[0]][dataIndex].name + " Rank";
    var cell = document.createElement("th");
    cell.classList.value = "mdc-data-table__header-cell mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort blue-alliance-text";
    cell.innerHTML = '<div class="tablesorter-header-inner"><div class="mdc-data-table__header-cell-wrapper"><button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button" aria-label=Sort by"' + headerName + '">arrow_upward</button><div class="mdc-data-table__header-cell-label">' + headerName + '</div><div class="mdc-data-table__sort-status-label" aria-hidden="true"></div></div></div>';
    document.getElementById("header-row").appendChild(cell);
  }
  for (var row of Row.allRows) {
    var team = row.team.team_number;
    for (var dataIndex of valueIndexes) {
      var cell = new Cell(blueAllianceStats["frc" + team][dataIndex].value);
      cell.setBlue(true);
      row.addCell(cell);
    }
    for (var dataIndex of rankIndexes) {
      var cell = new Cell(blueAllianceStats["frc" + team][dataIndex].rank, blueAllianceStats["frc" + team][dataIndex].rank)
      cell.setBlue(true);
      row.addCell(cell);
    }
  }
}

var fieldsToShow = [];
var ranksToShow = [];

function tbaDialogInitialize() {
  snackbar.labelText = "Getting TBA Data. This may take a moment.";
  snackbar.open();
  getBlueAllianceStats().then(function () {
    var fieldList = document.getElementById("tuneList");
    var i = 0;
    for (var field of blueAllianceStats[Object.keys(blueAllianceStats)[0]]) {
      var listItem = document.createElement("ul");
      var checkbox = document.createElement("div");
      listItem.classList.add("mdc-list-item");
      checkbox.classList.add("mdc-checkbox");
      checkbox.innerHTML = '<input type="checkbox" class="mdc-checkbox__native-control" data-rank=false data-value=' + i + '><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div>';
      listItem.appendChild(checkbox);
      var label = document.createElement('label');
      label.classList.add("mdc-list-item__text")
      label.innerText = field.name;
      listItem.appendChild(label);
      fieldList.appendChild(listItem);
      i++;
    }
    i = 0;
    for (var field of blueAllianceStats[Object.keys(blueAllianceStats)[0]]) {
      if (field.name != "Overall Rank") {
        var listItem = document.createElement("ul");
        var checkbox = document.createElement("div");
        listItem.classList.add("mdc-list-item");
        checkbox.classList.add("mdc-checkbox");
        checkbox.innerHTML = '<input type="checkbox" class="mdc-checkbox__native-control" data-rank=true data-value=' + i + '><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div>';
        listItem.appendChild(checkbox);
        var label = document.createElement('label');
        label.classList.add("mdc-list-item__text")
        label.innerText = "Rank in " + field.name;
        listItem.appendChild(label);
        fieldList.appendChild(listItem);
      }
      i++;
    }
    tuneList.addEventListener("change", function (e) {
      if (e.target.checked) {
        if (e.target.dataset.rank == "true") {
          ranksToShow.push(parseInt(e.target.dataset.value));
        } else {
          fieldsToShow.push(parseInt(e.target.dataset.value));
        }
      } else {
        if (e.target.dataset.rank == "true") {
          ranksToShow.splice(ranksToShow.indexOf(parseInt(e.target.dataset.value)));
        } else {
          fieldsToShow.splice(ranksToShow.indexOf(parseInt(e.target.dataset.value)));
        }
      }
      updateTable(fieldsToShow.sort(function (a, b) { return a - b }), ranksToShow.sort(function (a, b) { return a - b }));
    })
    document.getElementById("tbaDownloadButton").hidden = true;
  }).catch(function (err) {
    console.log(err);
    snackbar.labelText = "There was an error getting Blue Alliance Data.";
    snackbar.open();
  });
}

function csvExport() {
  var matchSheet = [];
  var columnNames = ["Team #", "Match #"];
  for (var field of matchFields) {
    columnNames.push(field.title);
  }
  matchSheet.push(columnNames)
  for (var key of Object.keys(matchData)) {
    for (var match of matchData[key]) {
      var column = [];
      column.push(key.split("team")[1]);
      column.push(match.matchNumber);
      for (var field of matchFields) {
        if (typeof match[field.id] != "undefined") {
          switch (field.type) {
            case "dropdown":
              column.push(field.options[match[field.id]]);
              break;
            case "multi-select":
              var selections = [];
              for (var option of match[field.id]) {
                selections.push(field.options[option]);
              }
              column.push(selections.join(", "));
              break;
            default:
              column.push(match[field.id]);
          }
        } else {
          column.push("Error!")
        }
      }
      matchSheet.push(column);
    }
  }
  var pitSheet = [];
  var columnNames = ["Team #"];
  for (var field of pitFields) {
    columnNames.push(field.title);
  }
  pitSheet.push(columnNames);
  for (var key of Object.keys(pitData)) {
    if (key.indexOf("team") != -1) {
      var column = [];
      column.push(key.split("team")[1]);
      for (var field of pitFields) {
        if (typeof pitData[key][field.id] != "undefined") {
          switch (field.type) {
            case "dropdown":
              column.push(field.options[pitData[key][field.id]]);
              break;
            case "multi-select":
              var selections = [];
              for (var option of pitData[key][field.id]) {
                selections.push(field.options[option]);
              }
              column.push(selections.join(", "));
              break;
            default:
              column.push(pitData[key][field.id]);
          }
        } else {
          column.push("Error!")
        }
      }
      pitSheet.push(column)
    }
  }
  var matchCSV = "";
  var pitCSV = "";
  for (var row of matchSheet) {
    matchCSV += "\"" + row.join("\",\"") + "\"\n";
  }
  for (var row of pitSheet) {
    pitCSV += "\"" + row.join("\",\"") + "\"\n";
  }
  var downloader = document.getElementById("dataDownloader");
  downloader.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(matchCSV));
  downloader.setAttribute("download", "match-data.csv");
  downloader.click();
  downloader.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(pitCSV));
  downloader.setAttribute("download", "pit-data.csv");
  downloader.click();
}
function listUnscoutedPitTeams() {
  let teams = allTeams.map(team => team['team_number']);
  for (var key of Object.keys(pitData)) {
    if (key.indexOf("team") == -1) {
      continue;
    }
    const teamNumber = key.split("team")[1];
    teams = teams.filter(t => t != teamNumber);
  }
  alert(JSON.stringify(teams));
}
class MatchPreview {
  constructor(root){
    this.tabComponent = new mdc.tabBar.MDCTabBar(root);
    root.addEventListener("MDCTabBar:activated", this.handleTabChange);
  }

  async getAlliances(match){
    this.alliances = {red:[], blue:[]};
    var data = await getTBAData("https://www.thebluealliance.com/api/v3/match/" + match + "/simple");
    if(data.Error){
      snackbar.labelText = (data.Error.indexOf("does not exist") != -1) ? "There is no information on this match" : "An unexpected error occured";
    }
    for(var key of data.alliances.red.team_keys){
      this.alliances.red.push(key.split("frc")[1]);
    }
    for(var key of data.alliances.blue.team_keys){
      this.alliances.blue.push(key.split("frc")[1]);
    }
    this.level = data.comp_level;
    this.number = data.match_number;
    this.round = data.set_number;
    return this.alliances;
  }

  open(match){
    this.getAlliances(match).then(function(){
      matchPreview.showAlliance(true);
      title.innerText = MatchPreview.shorthand[match.split("_")[1].split("m")[0].replace(/[0-9]/g,"")] + ((match.split("_")[1].split("m")[0].replace(/[0-9]/g,"") != "q") ? (" Round " + match.split("_")[1].split("m")[0].replace(/[a-z]/g,"")) : "" )+ " Match " + match.split("_")[1].split("m")[1];
      document.getElementById('tableContainer').classList.remove('appearing');
      document.getElementById('tableContainer').classList.add('disappearing');
      setTimeout(function () { document.getElementById('tableContainer').hidden = true; document.getElementById('tableContainer').classList.remove('disappearing'); WindowManager.handleWindowResize(windowManager)}, 200);
      document.getElementById('match-view-tabs').hidden = false;
      document.getElementById('window-container').hidden = false;
      navButton.hidden = true;
      document.getElementById("backButton").hidden = false
      document.getElementById('eventButton').hidden = true;
      document.getElementById("backButton").onclick = MatchPreview.close;
    });
  }
  
  handleTabChange(e){
    switch(e.detail.index){
      case 0:
        matchPreview.showAlliance(true);
        break;
      case 1:
        matchPreview.showAlliance(false);
        break;
    }
  }
  showAlliance(isRed){
    windowManager.closeAllWindows();
    document.documentElement.classList.value = "";
    document.documentElement.classList.add(isRed ? "red" : "blue");
    for(var team of isRed ? this.alliances.red : this.alliances.blue){
      windowManager.addWindow(new Window(new TeamView(parseInt(team))));
    }
  }

  static shorthand = {
    "q" : "Qualification",
    "sf" : "Semifinal",
    "qf" : "Quarterfinal",
    "f" : "Final"
  }
  static close() {
    title.innerHTML = "View Data";
    document.documentElement.classList.value = "";
    navButton.hidden = false;
    document.getElementById('newWindowButton').hidden = true;
    document.getElementById('eventButton').hidden = false;
    document.getElementById('tableContainer').classList.remove('disappearing')
    document.getElementById("backButton").hidden = true;
    document.getElementById("backButton").onclick = TeamView.close;
    document.getElementById('match-view-tabs').hidden = true;
    document.getElementById('tableContainer').hidden = false;
    document.getElementById('window-container').classList.add('disappearing');
    document.getElementById('tableContainer').classList.add('appearing');
    setTimeout(function () { document.getElementById('tableContainer').classList.remove('appearing'); document.getElementById('window-container').classList.remove('disappearing'); document.getElementById('window-container').hidden = true; 
      windowManager.closeAllWindows()
    }, 200);
  }
}

class matchPreviewDialog{
  constructor(root){
    this.root = root;
    this.dialog = new mdc.dialog.MDCDialog(this.root);
    this.select = new mdc.select.MDCSelect(this.root.querySelector(".mdc-select"));
    this.listInit = false;
  }

  async open(){
    this.dialog.open();
    if(!this.listInit){
      var data = await getTBAData("https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/matches/keys");
      this.list = this.root.querySelector(".mdc-deprecated-list");
      var matches = this.interpretMatches(data);
      for(var match of matches) {
        var item = document.createElement("li");
        item.classList.value = "mdc-deprecated-list-item";
        item.setAttribute("role", "option")
        item.innerHTML = '<span class="mdc-deprecated-list-item__text">' + match.name + '</span>';
        item.dataset.value = match.key;
        this.list.appendChild(item);
      }
      this.select.layoutOptions();
      this.listInit = true;
    }
  }

  interpretMatches(keys){
    var matches = [];
    for(var eventKey of keys){
      var match = {};
      match.key = eventKey;
      match.number = eventKey.split("_")[1].split("m")[1];
      var level = MatchPreview.shorthand[eventKey.split("_")[1].split("m")[0].replace(/[0-9]/g,"")];
      match.level= eventKey.split("_")[1].split("m")[0].replace(/[0-9]/g,"");
      if(eventKey.split("_")[1].split("m")[0].replace(/[0-9]/g,"") != "q"){
        match.round = eventKey.split("_")[1].split("m")[0].replace(/[a-z]/g,"");
        match.name = level + " Round " + match.round + " Match " + match.number;
      }else{
        match.name = level + " Match " + match.number;
      }
      matches.push(match);
    }
    matches.sort(function(a,b){
      if(a.level != b.level){
        return ["q","qf","sf","f"].indexOf(a.level) - ["q","qf","sf","f"].indexOf(b.level);
      }else if(a.round && a.round != b.round){
        return a.round - b.round;
      }else{
        return a.number - b.number;
      }
    });
    return matches;
  }

  continue(){
    matchPreview.open(this.select.value);
  }
}