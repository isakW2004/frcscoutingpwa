var allTeams = JSON.parse(localStorage.getItem('allTeams'));
window.addEventListener('offline', function(){
  if(typeof db =='undefined'){
    document.getElementById('offline').hidden=false;
    document.getElementById('login').hidden = true;
  }
});
window.addEventListener('online', function(){
  if(typeof db =='undefined'){
    document.getElementById('login').hidden=false;
    document.getElementById('offline').hidden = true;
  }
});
$(document).ready(function(){
if(!navigator.onLine){
  document.getElementById('offline').hidden=false;
  document.getElementById('login').hidden = true;
}
})
if(allTeams == null){
  if(localStorage.getItem('currentEvent') != null){
  $.ajax({
    url: "https://www.thebluealliance.com/api/v3/event/"+localStorage.getItem("currentEvent")+"/teams/simple",
    type: "GET",
    dataType: "json",
    beforeSend: function(xhr){xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw ');},
    success: function(contents) { 
    localStorage.setItem('allTeams', JSON.stringify(contents))
    allTeams=contents
    },
    error: function(error) {
        window.alert("Could not reach The Blue Alliance.")
      }
 });
}else{
  openEventPicker();
}
}
var data;
var skippedTeams = [];
var dropdowni;
var dropdownteam;


Math.avg = function(array) {  //adds the missing javascript average calculation
  var sum = 0;
  for (i=0;i<array.length;i++) {
    sum += parseInt(array[i]);
  }
  avg = sum / array.length
  return avg;
};

function showData(){
    document.getElementById('tableContainer').classList.remove('d-none')
    document.getElementById('login').classList.add('d-none')
    var tableBody = document.getElementById('tableBody');
    var tableHead = document.getElementById('header-row');
    

    db.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
        data = result
        for(var i = 0;i<standFields.length;i++){
          if(standFields[i].priority){  //Priority puts value on the table
            tableHead.innerHTML= tableHead.innerHTML + '<th class="mdc-data-table__header-cell '+trueEcho(standFields[i].type == 'number' || standFields[i].type == 'rating','mdc-data-table__header-cell--numeric mdc-data-table__header-cell--with-sort')+'" role="columnheader" scope="col" data-column-id="'+standFields[i].id+'col" id="'+standFields[i].id+'"><div class="mdc-data-table__header-cell-wrapper">'+trueEcho(standFields[i].type == 'number' || standFields[i].type == 'rating','<button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button" aria-label="Sort by '+standFields[i].title+'" aria-describedby="bigbrain-status-label">arrow_upward</button>')+'<div class="mdc-data-table__header-cell-label">'+standFields[i].title+ '</div><div class="mdc-data-table__sort-status-label" aria-hidden="true" id="bigbrain-status-label"></div></div></th>'
          }
        }
        for(var i = 0;i<allTeams.length;i++){
          if(getDbByID(result.rows, 'team'+allTeams[i].team_number) !== -1){
            tableBody.innerHTML = tableBody.innerHTML + '<tr class="mdc-data-table__row" tabindex="5" onclick="teamView.show('+i+')" id='+allTeams[i].team_number+'row ><td class="mdc-data-table__cell">'+tableFavorite(allTeams[i].team_number)+allTeams[i].team_number+' '+allTeams[i].nickname+'</td>';
            document.getElementById(allTeams[i].team_number+'row').innerHTML = document.getElementById(allTeams[i].team_number+'row').innerHTML + '<td class="mdc-data-table__cell mdc-data-table__cell--numeric">'+bigBrain(allTeams[i].team_number)+'</td>';
            for(var rep = 0;rep<standFields.length;rep++){
              if(standFields[rep].priority){
              if(standFields[rep].type == 'number'){
                document.getElementById(allTeams[i].team_number+'row').innerHTML = document.getElementById(allTeams[i].team_number+'row').innerHTML + '<td class="mdc-data-table__cell mdc-data-table__cell--numeric">'+getStandAverage(standFields[rep].id, allTeams[i].team_number)+'</td>';
              }else if(standFields[rep].type == 'rating'){ 
                document.getElementById(allTeams[i].team_number+'row').innerHTML = document.getElementById(allTeams[i].team_number+'row').innerHTML + '<td class="mdc-data-table__cell mdc-data-table__cell--numeric"><i class="material-icons align-bottom">star_half</i> '+getStandAverage(standFields[rep].id, allTeams[i].team_number)+'</td>';
              }else if(standFields[rep].type == 'checkbox'){ 
                document.getElementById(allTeams[i].team_number+'row').innerHTML = document.getElementById(allTeams[i].team_number+'row').innerHTML + '<td class="mdc-data-table__cell text-center"><i class="material-icons align-bottom">'+checkboxes.allDone(standFields[rep].id, allTeams[i].team_number, 'stand')+'</i></td>';
              }
            }
            }
          }else{
            skippedTeams.push(allTeams[i].team_number+ ' '+ allTeams[i].nickname)
          }
        }
    }).catch(function (err) {
      console.log(err);
    });
    document.addEventListener("MDCDataTable:sorted", function(detail){
      sortTable(detail.detail.columnIndex, detail.detail.sortValue)
    })
    
}


const standFields = [
  {
      "type":"number",
      "title":"High Goals",
      "id":"high",
      "weight": 2,
      "priority": true
  },
  {
      "type":"number",
      "title":"Low Goals",
      "id":"low",
      "weight": 1,
      "priority": true
  },
  {
      "type":"checkbox",
      "title":"Spinner?",
      "id":"spinner"
  },
  {
      "type":"checkbox",
      "title":"Endgame?",
      "id":"endgame",
      "priority": true
  },
  {
      "type":"dropdown",
      "title":"Defense",
      "id":"defense",
      "options":["All Defense", "Some Defense", "None"],
      "default":2
  },
  {
      "type":"rating",
      "title":"Rate the Performance",
      "id":"rating",
      "priority": true
  },
  {
      "type":"text",
      "title":"Comments",
      "id":"comment",
  },
  
]

const pitFields = [
  {
      "type":"checkbox",
      "title":"Low Goals?",
      "id":"low"
  },
  {
      "type":"checkbox",
      "title":"High Goals?",
      "id":"high"
  },
  {
      "type":"checkbox",
      "title":"Spinner?",
      "id":"spinner"
  },
  {
      "type":"checkbox",
      "title":"Endgame?",
      "id":"endgame"
  },
  {
      "type":"text",
      "title":"Type of Drivetrain",
      "id":"drive"
  },
  {
      "type":"text",
      "title":"What is this team focused on?",
      "id":"focus"
  },
  {
      "type":"text",
      "title":"Any Comments?",
      "id":"comment",
  },
  
]

function trueEcho(argument, string){
  if(argument){
    return(string);
  }else{
    return('')
  }
}

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
      switchcount ++;
    }
  }
}
var db;

function logIn(uname, passwd){
  var location = window.location;
  workerPouch.isSupportedBrowser().then(function (supported) {
    if (supported) {
     db = new PouchDB(location.protocol+'//data.'+location.host+'/frc'+ localStorage.getItem('currentEvent'), {'auth': {'username':uname, 'password':passwd},},{adapter: 'worker'});
    } else { // fall back to a normal PouchDB
      db = new PouchDB(location.protocol+'//data.'+location.host+'/frc'+ localStorage.getItem('currentEvent'), {'auth': {'username':uname, 'password':passwd}});
    }
    login[0].disabled = true;
    login[1].disabled = true;
    db.info().then(function (info) {
    showData()
  }).catch(function (err) {
    login[0].disabled = false;
      login[1].disabled = false;
    if(err.error == 'unauthorized'){
      login[0].valid = false;
      login[1].valid = false;
    }else{
      console.log(err)
      document.body.innerHTML += '<div class="mdc-snackbar" id="upload-error"><div class=mdc-snackbar__surface><div class=mdc-snackbar__label aria-live=polite role=status>There was an error</div><div class=mdc-snackbar__actions><button class="mdc-button mdc-snackbar__action" type=button onclick="window.alert(error)"><div class=mdc-button__ripple></div><span class=mdc-button__label>More Info</span></button></div></div></div>'
      const snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById('upload-error'));
      snackbar.open()
      error = err;
    }
  });
  }).catch(console.log.bind(console)); 
}

function getDbByID(array, id){
  for(var i=0; i<array.length; i++){
    if(array[i].id == id){
      return i;  //if found, return number
    }
  }
  return -1;  //if not, return -1, meaning it doesn't exist
}

function getStandAverage(id, number){
  var object= data.rows[getDbByID(data.rows, 'team'+number)].doc.stand
  if(typeof object != 'undefined'){
  var keys= Object.keys(object)
  var array = [];
  for(var i=0;i<keys.length;i++){
    array.push(data.rows[getDbByID(data.rows, 'team'+number)].doc.stand[keys[i]][id+number])
  }
  return Math.round(Math.avg(array)*10)/10
  }else{
    return 'No Data'
  }
}

var chart;

function exportData(dlAnchorElem){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.rows));
  console.log('Exporting JSON File');
  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.onclick = '';
  dlAnchorElem.setAttribute("download", "data.json");
  dlAnchorElem.onclick = 'exportData(this)';
}

const teamView = {
  "close": function(){
    title.innerHTML="View Data";
    button.hidden=false;
    document.getElementById('favoriteButton').hidden=true;
    document.getElementById('eventButton').hidden=false;
    document.getElementById('tableContainer').classList.remove('disappearing')
    document.getElementById("backButton").hidden=true
    document.getElementById('tableContainer').hidden = false;
    document.getElementById('teamInfoContainer').classList.add('disappearing');
    document.getElementById('tableContainer').classList.add('appearing')
    setTimeout(function(){document.getElementById('tableContainer').classList.remove('appearing'); document.getElementById('teamInfoContainer').classList.remove('disappearing'); document.getElementById('teamInfoContainer').hidden = true;}, 200);
  },
  "show": function(i){
    var team = allTeams[i]
    teamView.construct(team)
    document.getElementById('tableContainer').classList.remove('appearing')
    document.getElementById('tableContainer').classList.add('disappearing')
    setTimeout(function(){document.getElementById('tableContainer').hidden = true;document.getElementById('tableContainer').classList.remove('disappearing')}, 200);
    document.getElementById('teamInfoContainer').hidden = false;
    if(team.team_number == 2530){
      team.nickname= "Incornceivable"
    }
    title.innerHTML="Team "+team.team_number+" "+team.nickname;
    button.hidden=true;
    document.getElementById("backButton").hidden=false
    document.getElementById('favoriteButton').hidden=false;
    document.getElementById('eventButton').hidden=true;
    document.getElementById('favoriteButton').onclick=function(){favoriteTeam(team.team_number)};
    if(localStorage.getItem('favoriteTeams')!= null){
    if(JSON.parse(localStorage.getItem('favoriteTeams')).indexOf(team.team_number) != -1){
      document.getElementById('favoriteButton').innerHTML='favorite';
    }else{
      document.getElementById('favoriteButton').innerHTML='favorite_outline';
    }
  }
  },
  "construct": function(team){
    var teamData = data.rows[getDbByID('team'+team.team_number)];
    var teamInfoColumns = document.getElementById('teamInfoColumns')
    teamInfoColumns.innerHTML=''
    if(typeof data.rows[getDbByID(data.rows, 'team'+team.team_number)].doc.stand != 'undefined'){
    for(var i=0; i<standFields.length; i++){
      if(standFields[i].type == 'checkbox'){
        if(document.getElementById('card-checkbox') == null){
          teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-checkbox"><div class="mdc-card__primary-action noselect" tabindex="0" style="padding: 16px;"><h5 style="margin-bottom: 0px;">Checkboxes</h5><div class="text-center" style="display:flex; justify-content: center;" id="checkboxCardData"></div></div></div>';
        }
        document.getElementById("checkboxCardData").innerHTML += '<div style="margin: 16px;"><h1 class="side-icon" style="margin-bottom: 0px;">'+checkboxes.allDone(standFields[i].id, team.team_number, 'stand')+'</h1><strong>'+standFields[i].title+'</strong><br><small class="text-muted">'+checkboxes.getPercentage(standFields[i].id, team.team_number, 'stand')+'% checked</small></div>'
      }else if(standFields[i].type == 'number'){
        if(document.getElementById('card-number') == null){
          teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-number"><div class="mdc-card__primary-action noselect" tabindex="0" style="padding: 16px;"><h5 style="margin-bottom: 0px;">Numbers</h5><div class="text-center" style="display:flex; justify-content: center;" id="numberCardData"></div></div></div>';
        }
        document.getElementById("numberCardData").innerHTML += '<div style="margin: 16px;"><h1 class="side-number" style="margin-bottom: 0px;">'+Math.round(getStandAverage(standFields[i].id, team.team_number))+'</h1><strong>'+standFields[i].title+'</strong><br><small class="text-muted">Average</small></div>'
      }else if(standFields[i].type == 'rating'){
        if(document.getElementById('card-rating') == null){
          teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-rating"><div class="mdc-card__primary-action noselect"  onclick="card.expand(this.parentElement, '+team.team_number+');" tabindex="0" style="padding: 16px;"><h5 style="margin-bottom: 0px;">Rating</h5><small class="text-muted" style="margin-bottom: 10px;">Click for Comments</small><i class="material-icons" id="ratingCardData"></i><i class="material-icons" style="position: absolute; right: 20px; top: 30%;">expand_more</i><div id="comments" class="text-muted"></div></div></div>';
        }
        var starsLeft = getStandAverage(standFields[i].id, team.team_number);
        var iconsLeft = 5;
        for(var rep=0;rep<Math.floor(getStandAverage(standFields[i].id, team.team_number));rep++){
          document.getElementById("ratingCardData").innerHTML += "star "
          starsLeft--;
          iconsLeft--;
        }
        if(starsLeft> 0.4){
          document.getElementById("ratingCardData").innerHTML += "star_half "
          starsLeft=0
          iconsLeft--;
        }
        for(var rep=0;rep<iconsLeft;rep++){
          document.getElementById("ratingCardData").innerHTML += "star_outline "
        }
      }else if(standFields[i].type == 'dropdown'){
        dropdowni = i;
        dropdownteam= team;
        teamInfoColumns.innerHTML += '<div class="mdc-card" style="padding: 10px; padding-bottom: 20px"id="card-'+standFields[i].id+'"><canvas id="chart-'+standFields[i].id+'">Chart showing '+standFields[i].title+' data. Your browser does not support HTML canvas</canvas></div>';
        var chartel='#chart-'+standFields[i].id;
        $(chartel).ready(function(){
          var i=dropdowni;
          var team=dropdownteam;
          var ctx= document.getElementById('chart-'+standFields[i].id);
          var dropData= dropdown.getNumbers(standFields[i].id, team.team_number, 'stand', i)
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: { 
        labels: standFields[i].options,
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
    responsiveAnimationDuration: 0 ,
    title: {
      display: true,
      text: standFields[i].title,
      position: 'top',
      padding:1
    }
    }
});

        })
      }
      
    }
  }
    if(typeof data.rows[getDbByID(data.rows, 'team'+team.team_number)].doc.pit != 'undefined'){ //checks if pit scouting is completed
      teamInfoColumns.innerHTML += '<div class="mdc-card" id="card-pitscout"><div class="noselect"><h5 style="margin: 16px; margin-bottom: 0px">Pit Scouting</h5><ul class="mdc-list" id="pitList"></ul></div></div>'
      var pitList = document.getElementById('pitList')
      const iconNames = {
        'checkbox': {
          true: 'check_circle',
          false: 'cancel'
        },
        'text': 'chat',
        'dropdown': 'list',
        'rating':'star_half',
        'number':'dialpad'
      }
      for(var i=0;i<pitFields.length;i++){
        if(pitFields[i].type == 'checkbox'){
          pitList.innerHTML += '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">'+iconNames.checkbox[data.rows[getDbByID(data.rows, 'team'+team.team_number)].doc.pit[pitFields[i].id + team.team_number]]+'</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__text">'+pitFields[i].title+'</span> </span></li>'
        }else{
          pitList.innerHTML += '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons">'+iconNames[pitFields[i].type]+'</span> <span class="mdc-list-item__text"> <span class="mdc-list-item__primary-text">'+pitFields[i].title+'</span> <span class="mdc-list-item__secondary-text">'+data.rows[getDbByID(data.rows, 'team'+team.team_number)].doc.pit[pitFields[i].id + team.team_number]+'</span> </span></li>'
        }
      }
    }
    var selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action, .mdc-list-item';
var ripples = [].map.call(document.querySelectorAll(selector), function(el) {
  return new mdc.ripple.MDCRipple(el);
});
  }
};

const checkboxes = {
  "allDone": function(id, number, type){
    if (typeof data.rows[getDbByID(data.rows, 'team'+number)] != 'undefined'){
      var object = data.rows[getDbByID(data.rows, 'team'+number)].doc[type];
    }
    if(typeof object != 'undefined'){
    var keys= Object.keys(object)
    var done = false;
    var allDone = true;
    for(var i=0;i<keys.length;i++){
      if(data.rows[getDbByID(data.rows, 'team'+number)].doc.stand[keys[i]][id+number]){
        done = true;
      }else{
        allDone = false;
      }
    }
  }else{
    return 'highlight_off'
  }
  if(done){ //returns icon name to show
    if(allDone){
      return 'done_all'
    }else{
      return 'done'
    }
  }else{
    return 'close'
  }
  },
  "getPercentage" : function(id, number, type){
    if (typeof data.rows[getDbByID(data.rows, 'team'+number)] != 'undefined'){
      var object = data.rows[getDbByID(data.rows, 'team'+number)].doc[type];
    }
    if(typeof object != 'undefined'){
      var keys= Object.keys(object)
      var done = 0;
      for(var i=0;i<keys.length;i++){
        if(data.rows[getDbByID(data.rows, 'team'+number)].doc.stand[keys[i]][id+number]){
          done++
        }
      }
    }else{
      return -1;
    }
    return Math.round((done/keys.length)*100);
  }
}

const dropdown = {
  "getNumbers" : function(id, number, type, i){
    var output = [];
    var object;
    var keys;
    if (typeof data.rows[getDbByID(data.rows, 'team'+number)] != 'undefined'){
      object = data.rows[getDbByID(data.rows, 'team'+number)].doc[type];
    }
    if(typeof object != 'undefined'){
      keys= Object.keys(object)
      for(var rep=0; rep<standFields[i].options.length; rep++){
        output.push(0)
      }
      for(var rep=0;rep<keys.length;rep++){
        output[data.rows[getDbByID(data.rows, 'team'+number)].doc.stand[keys[rep]][id+number]]++
      }
    }else{
      return [0];
    }
    return output;
  }
}
function bigBrain(team){
  var bigBrain = [];
  for(var i=0;i<standFields.length;i++){
    if(standFields[i].priority && standFields[i].type == 'number' || standFields[i].type=='rating'){
      if(typeof standFields[i].weight != 'undefined'){
        var currentWeight = standFields[i].weight
      }else{
        var currentWeight = 1
      }
      var currentNumbers = []
      if (typeof data.rows[getDbByID(data.rows, 'team'+team)] != 'undefined'){
        var object = data.rows[getDbByID(data.rows, 'team'+team)].doc.stand;
      }else{
        return 'No Data'
      }
      if(typeof object != 'undefined'){
        var keys= Object.keys(object)
        for(var rep=0;rep<keys.length;rep++){
          currentNumbers.push(object[keys[rep]][standFields[i].id+team])
        }
        bigBrain.push(Math.avg(currentNumbers) * currentWeight)
      }
    }
  }
  if(bigBrain.length==0){
    return 'No Data'
  }
  return Math.round(Math.avg(bigBrain))
}

const card =  {
  "expand":function(element, team){
      $header = $(element);
      //getting the next element
      $comments = $('#comments')
      document.getElementById('comments').innerHTML='<li role="separator" class="mdc-list-divider"></li><small style="color:var(--mdc-theme-text-primary-on-background, black)">Comments<br></small>';
      var object = data.rows[getDbByID(data.rows, 'team'+team)].doc.stand
      for(var i=0;i<Object.keys(object).length;i++){
        document.getElementById('comments').innerHTML += '<li>"'+object[Object.keys(object)[i]]['comment'+team]+'"</li>'
      }
      $comments.slideToggle(200, function () {
          //execute this after slideToggle is done
          //change text of header based on visibility of content div
      });
      

  }
}
function favoriteTeam(team){
  var favoriteTeams=JSON.parse(localStorage.getItem('favoriteTeams'))
  if(favoriteTeams == null){
    favoriteTeams=[];
  }
  if(favoriteTeams.indexOf(team) == -1){
    document.getElementById('favoriteButton').innerHTML='favorite';
    favoriteTeams.push(team)
    localStorage.setItem('favoriteTeams', JSON.stringify(favoriteTeams))
  }else{
    document.getElementById('favoriteButton').innerHTML='favorite_outline';
    favoriteTeams.splice(favoriteTeams.indexOf(team, 1));
    localStorage.setItem('favoriteTeams', JSON.stringify(favoriteTeams))
  }
}
function tableFavorite(team){
  var favoriteTeams=JSON.parse(localStorage.getItem('favoriteTeams'))
  if(favoriteTeams != null){
    if(favoriteTeams.indexOf(team) != -1){
      return '<i class="material-icons" style="font-size: 13px !important; vertical-align:middle;">favorite</i> '
    }else{
      return ''
    }
    
  }else{
    return ''
  }
}