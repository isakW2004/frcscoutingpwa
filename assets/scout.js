var teamsStandScouting = [];
var matchesStandScouting = [];
var teamsStand = []; //Variable for cookie
var matchesStand = [];

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function continueStand(){
    if(getCookie("standScoutStart")){
        scoutingBoard();
        continuePit()
    }else{
        console.log("Setting up stand scouting");
    }
    if(getCookie("currentEvent") == ""){
        openEventPicker();
    }
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    if (msie > 0 || trident > 0) {
            window.alert("Unfortunately, this app does not support Internet Explorer. For a full experience, switch to a modern browser.")
        }
}

function fetchTeams(){
    var buttonLabel = document.getElementById("fetch-label");
    var teamCheck = document.getElementById("teamcheck");
    buttonLabel.innerHTML = "Fetching...";
    $.ajax({
        url: "https://www.thebluealliance.com/api/v3/event/"+getCookie("currentEvent")+"/teams/simple",
        type: "GET",
        dataType: "json",
        beforeSend: function(xhr){xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw ');},
        success: function(contents) { 
        document.getElementById("fetch-button").disabled = 'true';
        document.getElementById("fetch-label").innerHTML = 'Fetched';
        teams = contents; 
        localStorage.setItem('allTeams', JSON.stringify(contents))
        var i;
        for (i = 0; i < contents.length; i++) {
            teamCheck.innerHTML = teamCheck.innerHTML + '<div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="' + contents[i].key + '"/> <div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="' + contents[i].key +'">'+ contents[i].team_number + " " +contents[i].nickname  +'</label><br>'
        } 
        
        
        },
        error: function(error) {
            buttonLabel.innerHTML = "Error. Check Internet ";
          }
     });
}

function startScouting(){
    var i;
    var j;
    for(i = 0; i < teams.length; i++){
        if (document.getElementById(teams[i].key).checked){
            j++
            teamsStandScouting.push(teams[i])
        }
    }
    console.log("You are scouting " + teamsStandScouting.length + " teams.");
    document.getElementById("standscout").innerHTML = "<h1 class='loading'>Fetching Matches</h1>";
    setCookie("teamsStand", JSON.stringify(teamsStandScouting), 10);
    setCookie("standScoutStart", true, 10)
    setCookie("savedMatches", {}, 10)
    fetchMatches()
}

function removeDuplicates(array){
    let unique = [...new Set(array)];
    return unique;
}

var matchesStandDetails = []

function pushToMatches(match, team){
    if (matchesStandDetails[match] == 'null' || typeof matchesStandDetails[match] === 'undefined'){
        matchesStandDetails[match]= {"match_number": match, 'teams':[],}
        matchesStandDetails[match].teams.push(team);
    }else{
        matchesStandDetails[match].teams.push(team);
    }
}

function fetchMatchesAjax(i, matches, _callback){
    $.ajax({
        url: "https://www.thebluealliance.com/api/v3/team/"+ teamsStandScouting[i].key +"/event/"+ getCookie("currentEvent") +"/matches/simple",
        type: "GET",
        dataType: "json",
        beforeSend: function(xhr){xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw ');},
        success: function(contents) { 
        var j;
        console.log(matches)
        for (j = 0; j < contents.length; j++) {
            if(contents[j].comp_level === "qm"){
            pushToMatches(contents[j].match_number, matches);
            matchesStandScouting.push(contents[j].match_number);
            matchesStandScouting = removeDuplicates(matchesStandScouting);
            }
            setCookie("matchesStand", JSON.stringify(matchesStandScouting), 10);
            setCookie("matchesStandDetails", JSON.stringify(matchesStandDetails), 10);
        }    
        _callback();
        },
    })
}

function fetchMatches(){
    fetchMatchesSync(function() {
        snackbar.open()
        scoutingBoard();
    });    
}
function fetchMatchesSync(_callback){
    var complete = 0;
    for(var i = 0; i < teamsStandScouting.length; i++){
        fetchMatchesAjax(i, teamsStandScouting[i].team_number, function() {
            complete++;
        });    
    }
    function waitForIt(){
        if (complete != teamsStandScouting.length) {
            console.log(complete)
            setTimeout(function(){waitForIt()},100);
        } else {
            _callback();
        };
    }
    waitForIt()
}

function scoutingBoard(){
    if(getCookie("matchesStand") === ""){
        document.getElementById("standscout").innerHTML = "<div class='text-center container'><h1>Couldn't get Matches.</h1><br><p>There appears to be no matches to scout. If this is an error, re-select the event you want to scout using <i class='material-icons align-bottom'>event</i>. Events that were cancelled or suspended don't work.</p></div>"
    }else{
    teamsStand = JSON.parse(getCookie("teamsStand"));
    matchesStand = JSON.parse(getCookie("matchesStand"));
    matchesStandDetails = JSON.parse(getCookie("matchesStandDetails"));
    matchesStand.sort(function(a, b){return a-b});
    document.getElementById("standscout").innerHTML = "<h2 class='text-center'>Qualifier Matches</h2>"
    document.getElementById("standscout").innerHTML = document.getElementById("standscout").innerHTML + '<ul class="mdc-list mdc-list--two-line scoutlist">';
    var i;
    for(i = 0; i < matchesStand.length; i++){
        document.getElementById("standscout").innerHTML= document.getElementById("standscout").innerHTML + '<li class="mdc-list-item" tabindex="1" id="stand'+matchesStand[i]+ 'item" onclick="showStandForm('+ matchesStand[i] +')"><span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">Match '+ matchesStand[i] +'</span><span class="mdc-list-item__secondary-text">'+matchesStandDetails[matchesStand[i]].teams.toString()+'</span></span></li>';
    }
    document.getElementById("standscout").innerHTML= document.getElementById("standscout").innerHTML + "</ul>"
    const listItemRipples = [].map.call(document.querySelectorAll('.mdc-list-item'), function(el) {
        return new mdc.ripple.MDCRipple(el);
      });
    
}
}

function selectTab(tab){
    document.getElementById('standscout').classList.add("d-none");
    document.getElementById('pitscout').classList.add("d-none");
    document.getElementById(tab).classList.remove("d-none");
    tabBar.activateTab(document.getElementById(tab + "tab"), 1);
    if(tab='pitscout' && getCookie('pitScoutStart')!== ""){
        continuePit()
    }
}


/* Field IDs can't contain numbers! */
const standFields = [
    {
        "type":"number",
        "title":"High Goals",
        "id":"high"
    },
    {
        "type":"number",
        "title":"Low Goals",
        "id":"low"
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
        "type":"dropdown",
        "title":"Defense",
        "id":"defense",
        "options":["All Defense", "Some Defense", "None"],
        "default":2
    },
    {
        "type":"rating",
        "title":"Rate the Performance",
        "id":"rating"
    },
    {
        "type":"text",
        "title":"Comments",
        "id":"comment",
    },
    
]

var ratings, dropdowns;
function showStandForm(match){
        var standForm = document.getElementById("form");
        standForm.innerHTML ="<div id='formContainer'><h1 class='match-number'>Match "+match+"</h1><div class='row justify-content-center' id='formRow'</div></div>"
        formOpen(true);
    for(var rep = 0; rep < matchesStandDetails[match].teams.length; rep++){
        document.getElementById("formRow").innerHTML = document.getElementById("formRow").innerHTML + "<div class='col-md-" + 12/matchesStandDetails[match].teams.length + "col-xs-12 standRow' id='"+ matchesStandDetails[match].teams[rep] +"form'><h3>Team "+matchesStandDetails[match].teams[rep]+"</h3></div>"
        var form = document.getElementById(matchesStandDetails[match].teams[rep]+"form")
        for(var i = 0; i < standFields.length; i++){
            form.innerHTML = form.innerHTML + "<br><h5>"+standFields[i].title+"</h5>"
            addField(form, standFields[i].type, standFields[i].id, matchesStandDetails[match].teams[rep], i, standFields)
        }
    }
        document.getElementById("formContainer").innerHTML = standForm.innerHTML + '<button class="mdc-button mdc-button--outlined" onclick="formOpen(false)"><div class="mdc-button__ripple"></div><span class="mdc-button__label">Back</span></button> <button class="mdc-button mdc-button--raised" onclick="saveStandAnswers('+match+')"><div class="mdc-button__ripple"></div><span class="mdc-button__label">Done</span></button><br><br>'
        ratings = [].map.call(document.querySelectorAll('.rating'), function(el) {
            return new mdc.select.MDCSelect(el);
          });
          const textboxes = [].map.call(document.querySelectorAll('.input-text'), function(el) {
            return new mdc.textField.MDCTextField(el);
          });
            dropdowns = [].map.call(document.querySelectorAll('.dropdown'), function(el) {
            return new mdc.select.MDCSelect(el);
          });
          
}

function formOpen(bool){
    textFields = [];
    var standForm = document.getElementById("form");
    if(bool){
        window.focus(standForm);
        standForm.style.display = "block";
        standForm.classList.add("opening");
        standForm.classList.remove("closing");
    }else{
        window.focus(document.querySelector(".main-content"));
        standForm.style.display = "";
        standForm.classList.remove("opening");
        standForm.classList.add("closing");
    }
}

function addField(element, type, id, team, currentrep, fields){
    function ifDefault(i, j){if(i==standFields[j].default){return("mdc-list-item--selected");}else{return("")}}
    if(type == "number"){
        element.innerHTML = element.innerHTML + '<div class="mdc-text-field mdc-text-field--outlined"><input id='+id+team+' type="number" class="mdc-text-field__input" aria-labelledby="my-label-id" tabindex="1"><i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing noselect" tabindex="1" role="button" onclick='+"'"+'+addToNumber("'+id+team+'")'+"'"+'>add_circle</i><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"></span><span class="mdc-notched-outline__trailing"></span></span></div>';
    }else if(type=="checkbox"){
        element.innerHTML = element.innerHTML + '<div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="'+id+team+'"/> <div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div>'
    }else if(type=="rating"){
        element.innerHTML = element.innerHTML + '<div class="mdc-select mdc-select--outlined rating" id='+id+team+'><div class="mdc-select__anchor" aria-labelledby="outlined-select-label"><div class="mdc-select__selected-text" style="padding: 14px 52px 12px 0" tabindex="0" aria-disabled="false" aria-expanded="false"></div><i class="mdc-select__dropdown-icon"></i><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span id="outlined-select-label" class="mdc-floating-label">Rating</span></span><span class="mdc-notched-outline__trailing"></span></span></div><div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox"><ul class="mdc-list"><li class="mdc-list-item" data-value="5" role="option"><span class="mdc-list-item__text">Excellent</span></li><li class="mdc-list-item" data-value="4" aria-disabled="true" role="option"><span class="mdc-list-item__text">Good</span></li><li class="mdc-list-item" data-value="3" role="option"><span class="mdc-list-item__text">Okay</span></li><li class="mdc-list-item" data-value="2" role="option"><span class="mdc-list-item__text">Bad</span></li><li class="mdc-list-item" data-value="1" role="option"><span class="mdc-list-item__text">Pitiful</span></li></ul></div></div>'
    }else if(type=="text"){
        element.innerHTML = element.innerHTML + '<label class="mdc-text-field mdc-text-field--outlined input-text"><input id='+id+team+' type="text" class="mdc-text-field__input" aria-labelledby="my-label-id"><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label" id="my-label-id">Your Answer</span></span><span class="mdc-notched-outline__trailing"></span></span></label>'
    }else if(type=="dropdown"){
        element.innerHTML = element.innerHTML + '<div class="mdc-select mdc-select--outlined dropdown" id='+id+team+'><div class="mdc-select__anchor" aria-labelledby="outlined-select-label"><div class="mdc-select__selected-text" style="padding: 14px 52px 12px 0" tabindex="0" aria-disabled="false" aria-expanded="false" value="'+standFields[currentrep].options[standFields[currentrep].default]+'"></div><i class="mdc-select__dropdown-icon"></i><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span id="outlined-select-label" class="mdc-floating-label">Answer</span></span><span class="mdc-notched-outline__trailing"></span></span></div><div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox"><ul class="mdc-list" id="'+id+team+'listbox"></ul></div></div>'
        for(var i = 0; i < standFields[currentrep].options.length;i++){
            document.getElementById(id+team+'listbox').innerHTML= document.getElementById(id+team+'listbox').innerHTML + '<li class="mdc-list-item '+ifDefault(i, currentrep)+'" data-value="'+i+'"role="option"><span class="mdc-list-item__text">'+fields[currentrep].options[i]+'</span>'
        }
    }
}
function addToNumber(id){
    window.focus(document.querySelector("mdc-button"))
    var element= document.getElementById(id);
    if (element.value.isNaN){
        element.value=1;
    }else{
        element.value = Number(element.value) + 1;
    };
}
function saveStandAnswers(match){
    var standForm = document.getElementById("form");
    var dropdownValues = {};
    var ratingValues = {};
    var otherValues = {};
    /* Gather Values of Different Fields */
    for(var i = 0; i < dropdowns.length; i++){
        dropdownValues[dropdowns[i].root.id] = dropdowns[i].value
    }
    for(var i = 0; i < ratings.length; i++){
        ratingValues[ratings[i].root.id] = ratings[i].value
    }
    for(var i = 0; i < standFields.length; i++){
        if(standFields[i].type != 'dropdown' && standFields[i].type != 'rating'){
            for(var rep = 0; rep < matchesStandDetails[match].teams.length; rep++){
                if(standFields[i].type != 'checkbox'){
                    otherValues[standFields[i].id+matchesStandDetails[match].teams[rep]] = document.getElementById(standFields[i].id+matchesStandDetails[match].teams[rep]).value
                }else{
                    otherValues[standFields[i].id+matchesStandDetails[match].teams[rep]] = document.getElementById(standFields[i].id+matchesStandDetails[match].teams[rep]).checked
                }
            }
        }
    }
    var allFields = {...dropdownValues, ...ratingValues, ...otherValues}; /* Merges All Together */

    for(var rep = 0; rep < Object.size(allFields); rep++){
        var ids = Object.keys(allFields);
        var team = ids[rep].split(/([0-9]+)/)[1];
        var value = localStorage.getItem(team+'stand')
            console.log(value)
            var newValue;
            if(!value){
                newValue = new Object;
            }else{
                newValue = JSON.parse(value);
            }
            if(typeof newValue[match]==='undefined'){
                newValue[match]= new Object;
            }
            newValue[match][ids[rep]] = allFields[ids[rep]]
            localStorage.setItem(team+'stand',JSON.stringify(newValue))
    }
    /* Hero Checkmark Animation */
    standForm.innerHTML = '<svg class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xml:space="preserve"><polyline class="checkmark-animation" fill="none" points="20,6 9,17 4,12" stroke="#000000" stroke-miterlimit="10" stroke-width="2"/></svg><br><h1>Thank You!</h1><br><p>Your Answers were Saved</p>'
    setTimeout(function(){formOpen(false)},2500);
    document.getElementById('stand'+match+'item').onclick = '';
    completedItems.push('match'+match);
}

//Pit Scouting

const allTeams = JSON.parse(localStorage.getItem('allTeams'));
var completedItems = JSON.parse(localStorage.getItem('completedItems'));
var checkedItems = JSON.parse(localStorage.getItem('checkedItems'));
if(!completedItems){ //if null
    var completedItems = [];
}
if(!checkedItems){ //if null
    var checkedItems = [];
}


function checkCheck(team){
    console.log('check checking')
    if(completedItems.indexOf('team'+team) !== -1){
        $('#pit'+team+'checkbox').ready(function () {       //Waits until checkbox is ready before checking
            document.getElementById('pit'+team+'checkbox').checked = true;
            document.getElementById('pit'+team+'checkbox').disabled = true;
            document.getElementById('pit'+team+'item').onclick = '';s
          });          
        }else if(checkedItems.indexOf('team'+team)!= -1){  //If team is in checkedItems
            $('#pit'+team+'checkbox').ready(function () {       //Waits until checkbox is ready before checking
                $('#pit'+team+'checkbox').prop('checked',true);
              });          
            console.log('check checked')
        }
}

var pitCheckboxes;
function continuePit(){
    if(getCookie("standScoutStart")){
    
    console.log('Pit Scouting Continued')
    document.getElementById("pitscout").innerHTML = "<h2 class='text-center'>Pit Scouting</h2>"
    document.getElementById("pitscout").innerHTML = document.getElementById("pitscout").innerHTML + '<ul class="mdc-list mdc-list--two-line scoutlist">';
    for(var i = 0; i < allTeams.length; i++){
        document.getElementById("pitscout").innerHTML= document.getElementById("pitscout").innerHTML + '<li class="mdc-list-item pitScoutItem" role="checkbox"><span class="mdc-list-item__graphic"><div class="mdc-checkbox"><input name="team'+allTeams[i].team_number+'"type="checkbox"id="pit'+allTeams[i].team_number+'checkbox"class="mdc-checkbox__native-control"id="demo-list-checkbox-item-1"  /><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark"viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path"fill="none"d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div></div></span><label style="width: 100%" id="pit'+allTeams[i].team_number+ 'item"onclick="showPitForm('+allTeams[i].team_number+')"><span class="mdc-list-item__primary-text">'+allTeams[i].team_number +' ' + allTeams[i].nickname+'</span><span class="mdc-list-item__secondary-text">'+allTeams[i].city + ', '+ allTeams[i].state_prov+'</span></label></li>'
        checkCheck(allTeams[i].team_number)
    };
    const pitItemRipples = [].map.call(document.querySelectorAll('.pitScoutItem'), function(el) {
        return new mdc.ripple.MDCRipple(el);
    });
    document.getElementById("pitscout").innerHTML= document.getElementById("pitscout").innerHTML + "</ul>"
      pitCheckboxes = document.getElementById('pitscout').querySelectorAll("input[type=checkbox]");
    };
for (var i = 0 ; i < pitCheckboxes.length; i++) {
    pitCheckboxes[i].addEventListener('change' , function(type) {
        console.log(type.srcElement)
        if(type.srcElement.checked) {
            if(checkedItems.indexOf(type.srcElement.name) == -1){
                checkedItems.push(type.srcElement.name);
            }
        } else {
            checkedItems.splice(checkedItems.indexOf(type.srcElement.name), 1);
        }
        localStorage.setItem('checkedItems', JSON.stringify(checkedItems))
    });
}
}

function showPitForm(team){
    var pitForm = document.getElementById("form");
    pitForm.innerHTML ="<div id='formContainer'><h1 class='match-number'>Team "+team+"</h1><div class='row justify-content-center' id='formRow'</div></div>"
    formOpen(true);
    var form = document.getElementById('formContainer')
    for(var i = 0; i < pitFields.length; i++){
        form.innerHTML = form.innerHTML + "<br><h5>"+pitFields[i].title+"</h5>"
        addField(form, pitFields[i].type, pitFields[i].id, team, i, pitFields)
    }
    form.innerHTML = form.innerHTML + '<br><button class="mdc-button mdc-button--outlined" onclick="formOpen(false)"><div class="mdc-button__ripple"></div><span class="mdc-button__label">Back</span></button> <button class="mdc-button mdc-button--raised" onclick="savePitAnswers('+team+')"><div class="mdc-button__ripple"></div><span class="mdc-button__label">Done</span></button><br><br>'
    ratings = [].map.call(document.querySelectorAll('.rating'), function(el) {
        return new mdc.select.MDCSelect(el);
      });
      const textboxes = [].map.call(document.querySelectorAll('.input-text'), function(el) {
        return new mdc.textField.MDCTextField(el);
      });
        dropdowns = [].map.call(document.querySelectorAll('.dropdown'), function(el) {
        return new mdc.select.MDCSelect(el);
      });
}

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
function savePitAnswers(team){
    var form = document.getElementById("form");
    var dropdownValues = {};
    var ratingValues = {};
    var otherValues = {};
    /* Gather Values of Different Fields */
    for(var i = 0; i < dropdowns.length; i++){
        dropdownValues[dropdowns[i].root.id] = dropdowns[i].value
    }
    for(var i = 0; i < ratings.length; i++){
        ratingValues[ratings[i].root.id] = ratings[i].value
    }
    for(var i = 0; i < pitFields.length; i++){
        if(pitFields[i].type != 'dropdown' && pitFields[i].type != 'rating'){
                if(pitFields[i].type != 'checkbox'){
                    otherValues[pitFields[i].id+team] = document.getElementById(pitFields[i].id+team).value
                }else{
                    otherValues[pitFields[i].id+team] = document.getElementById(pitFields[i].id+team).checked
            }
        }
    }
    var allFields = {...dropdownValues, ...ratingValues, ...otherValues}; /* Merges All Together */

    for(var rep = 0; rep < Object.size(allFields); rep++){
        var ids = Object.keys(allFields);
        var value = localStorage.getItem(team+'pit')
            console.log(value)
            var newValue;
            if(!value){
                newValue = new Object;
            }else{
                newValue = JSON.parse(value);
            }
            newValue[ids[rep]] = allFields[ids[rep]]
            localStorage.setItem(team+'pit',JSON.stringify(newValue))
    }
    /* Hero Checkmark Animation */
    form.innerHTML = '<svg class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xml:space="preserve"><polyline class="checkmark-animation" fill="none" points="20,6 9,17 4,12" stroke="#000000" stroke-miterlimit="10" stroke-width="2"/></svg><br><h1>Thank You!</h1><br><p>Your Answers were Saved</p>'
    setTimeout(function(){formOpen(false)},2500);
    document.getElementById('pit'+team+'checkbox').checked = true;
    document.getElementById('pit'+team+'checkbox').disabled = true;
    document.getElementById('pit'+team+'item').onclick = '';
    completedItems.push('team'+team);
    localStorage.setItem('completedItems', JSON.stringify(completedItems))
}