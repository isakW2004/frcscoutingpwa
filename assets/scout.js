var teamsStandScouting = [];
var matchesStandScouting = [];
var teamsStand = [];
var matchesStand = [];
var allTeams;

function getSizeOfObject(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function continueStand() {
    if (localStorage.getItem("standScoutStart")) {
        scoutingBoard();
        continuePit();
    } else {
        console.log("Setting up stand scouting");
    }
    if (localStorage.getItem("currentEvent") == null) {
        openEventPicker();
    }
}

function fetchTeams() {
    var buttonLabel = document.getElementById("fetch-label");
    var teamCheck = document.getElementById("teamcheck");
    buttonLabel.innerHTML = "Fetching...";
    if(localStorage.getItem("currentEvent") == null){
        snackbar.labelText = "Choose an event before scouting.";
        snackbar.open();
    }
    $.ajax({
        url: "https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/teams/simple",
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) { xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw '); },
        success: function (contents) {
            document.getElementById("fetch-button").disabled = 'true';
            document.getElementById("fetch-label").innerHTML = 'Fetched';
            teams = contents;
            localStorage.setItem('allTeams', JSON.stringify(contents));
            allTeams = contents;
            var i;
            for (i = 0; i < contents.length; i++) {
                teamCheck.innerHTML = teamCheck.innerHTML + '<div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="' + contents[i].key + '"/> <div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="' + contents[i].key + '">' + contents[i].team_number + " " + contents[i].nickname + '</label><br>'
            }
        },
        error: function (error) {
            snackbar.labelText = "There was an error. Check your network connection and try again.";
            snackbar.open();
            buttonLabel.innerHTML = "Retry";
        }
    });
}

function startScouting() {
    var j;
    for (var i = 0; i < teams.length; i++) {
        if (document.getElementById(teams[i].key).checked) {
            j++
            teamsStandScouting.push(teams[i])
        }
    }
    document.getElementById("standscout").innerHTML = "<h1 class='loading'>Fetching Matches</h1>";
    localStorage.setItem("teamsStand", JSON.stringify(teamsStandScouting));
    localStorage.setItem("standScoutStart", true);
    progress.open();
    fetchMatches().then(function(){
        console.log(matchesStand);
        scoutingBoard();
        progress.close();
    }).catch(function(){
        document.getElementById("standscout").innerHTML = "<h2>No matches to scout</h2><p>Looks like the Blue Alliance doesn't have the match schedule available or the event was cancelled.</p>";
        progress.close();
    })
}

function removeDuplicates(array) {
    let unique = [...new Set(array)];
    return unique;
}

var matchesStandDetails = []

function pushToMatches(match, team) {
    if (typeof matchesStandDetails[match] === 'undefined') {
        matchesStandDetails[match] = { "match_number": match, 'teams': [], }
        matchesStandDetails[match].teams.push(team);
    } else {
        matchesStandDetails[match].teams.push(team);
    }
}

async function fetchMatchesAjax(team, matches) {
    return new Promise(resolve => {
        $.ajax({
            url: "https://www.thebluealliance.com/api/v3/team/" + team.key + "/event/" + localStorage.getItem("currentEvent") + "/matches/simple",
            type: "GET",
            dataType: "json",
            beforeSend: function (xhr) { xhr.setRequestHeader('X-TBA-Auth-Key', 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw '); },
            success: function (contents) {
                for (var match of contents) {
                    if (match.comp_level === "qm") {
                        pushToMatches(match.match_number, matches);
                        matchesStandScouting.push(match.match_number);
                        matchesStandScouting = removeDuplicates(matchesStandScouting);
                    }
                    localStorage.setItem("matchesStand", JSON.stringify(matchesStandScouting));
                    localStorage.setItem("matchesStandDetails", JSON.stringify(matchesStandDetails));
                }
            },
        }).then(resolve);
    })
}

async function fetchMatches() {
    return new Promise(async resolve => {
        for await (const team of teamsStandScouting) {
            await fetchMatchesAjax(team, team.team_number);
        }
        resolve();
    })
}

function scoutingBoard() {
    teamsStand = JSON.parse(localStorage.getItem("teamsStand"));
    matchesStand = JSON.parse(localStorage.getItem("matchesStand"));
    matchesStandDetails = JSON.parse(localStorage.getItem("matchesStandDetails"));
    document.getElementById("standscout").innerHTML = "<h2 class='text-center'>Qualifier Matches</h2>"
    document.getElementById("standscout").innerHTML += '<ul class="mdc-list mdc-list--two-line scoutlist">';
    if(matchesStand == null){
        document.getElementById("standscout").innerHTML = "<h2 class='text-center'>No Qualifier Matches Available</h2>"
        matchesStand = [];
    }
    matchesStand.sort(function (a, b) { return a - b });
    for (const match of matchesStand) {
        var listItem = document.createElement("li");
        listItem.classList.add("`mdc-list-item`");
        listItem.innerHTML = '<span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">Match ' + match + '</span><span class="mdc-list-item__secondary-text">' + matchesStandDetails[match].teams.toString() + '</span></span>';
        listItem.onclick = function(){
            openMatchScoutForm(match);
        };
        document.getElementById("standscout").appendChild(listItem);
    }
    var ripples = [].map.call(document.querySelectorAll('.mdc-list-item'), function (el) {
        return new mdc.ripple.MDCRipple(el);
    });
    var fab = document.createElement("button");
    fab.classList.add("mdc-fab");
    fab.innerHTML = '  <div class="mdc-fab__ripple"></div><span class="mdc-fab__icon material-icons">add</span>';
    fab.onclick = function(){
        var matchNumber = window.prompt("Enter match number");
        console.log(matchNumber);
        if(!isNaN(matchNumber) && matchNumber != null){
            openMatchScoutForm(parseInt(matchNumber));
        }else{
            snackbar.labelText = "Match number entered isn't a number.";
            snackbar.open();
        }
    }
    document.getElementById("standscout").appendChild(fab);
}

function selectTab(tab) {
    document.getElementById('standscout').classList.add("d-none");
    document.getElementById('pitscout').classList.add("d-none");
    document.getElementById(tab).classList.remove("d-none");
    tabBar.activateTab(document.getElementById(tab + "tab"), 1);
    if (tab = 'pitscout' && localStorage.getItem('pitScoutStart') !== "") {
        continuePit()
    }
}

const standFields = [
    {
        "type": "number",
        "title": "Cones Scored",
        "id": "cones",
        "weight": 2
    },
    {
        "type": "number",
        "title": "Marshmallows Scored",
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
        "min" : 1,
        "max" : 10
    },
    {
        "type": "text",
        "title": "Comments",
        "id": "comment",
        "isTextArea" : true,
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
        "title": "Can Pick Up and Score Tipped Cones",
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
        "isTextArea" : true,
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
        "isTextArea" : true,
        "id": "comment",
    },
]

var pitCheckboxes;
var checkedItems;

function continuePit() {
    if(localStorage.getItem("checkedItems") == null){
        checkedItems = [];
    }else{
        checkedItems= JSON.parse(localStorage.getItem("checkedItems"));
    }
    if (localStorage.getItem("standScoutStart")) {
        console.log('Pit Scouting Continued')
        document.getElementById("pitscout").innerHTML = "<h2 class='text-center'>Pit Scouting</h2>"
        document.getElementById("pitscout").innerHTML = document.getElementById("pitscout").innerHTML + '<ul class="mdc-list mdc-list--two-line scoutlist">';
        if (allTeams == null) {
            allTeams = JSON.parse(localStorage.getItem('allTeams'));
        }
        for (var i = 0; i < allTeams.length; i++) {
            document.getElementById("pitscout").innerHTML = document.getElementById("pitscout").innerHTML + '<li class="mdc-list-item pitScoutItem" role="checkbox"><span class="mdc-list-item__graphic"><div class="mdc-checkbox"><input name="team' + allTeams[i].team_number + '"type="checkbox"id="pit' + allTeams[i].team_number + 'checkbox"class="mdc-checkbox__native-control"id="demo-list-checkbox-item-1"  /><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark"viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path"fill="none"d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div></div></span><label style="width: 100%" id="pit' + allTeams[i].team_number + 'item"onclick="openPitScoutForm(' + allTeams[i].team_number + ')"><span class="mdc-list-item__primary-text">' + allTeams[i].team_number + ' ' + allTeams[i].nickname + '</span><span class="mdc-list-item__secondary-text">' + allTeams[i].city + ', ' + allTeams[i].state_prov + '</span></label></li>'
            checkCheck(allTeams[i].team_number);
        };
        const pitItemRipples = [].map.call(document.querySelectorAll('.pitScoutItem'), function (el) {
            return new mdc.ripple.MDCRipple(el);
        });
        document.getElementById("pitscout").innerHTML = document.getElementById("pitscout").innerHTML + "</ul>"
        pitCheckboxes = document.getElementById('pitscout').querySelectorAll("input[type=checkbox]");
    };
    for (var i = 0; i < pitCheckboxes.length; i++) {
        pitCheckboxes[i].addEventListener('change', function (type) {
            if (type.srcElement.checked) {
                if (checkedItems.indexOf(type.srcElement.name) == -1) {
                    checkedItems.push(type.srcElement.name);
                }
            } else {
                checkedItems.splice(checkedItems.indexOf(type.srcElement.name), 1);
            }
            localStorage.setItem('checkedItems', JSON.stringify(checkedItems))
        });
    }
}

function createField(field, team) {
    var node = document.createElement("div");
    var element;
    if (field.type == "number") {
        node.classList.value = "mdc-text-field mdc-text-field--outlined";
        node.innerHTML += '<input type="number" class="mdc-text-field__input" tabindex="1" value="0"><i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing noselect" tabindex="1" role="button">add_circle</i><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label"></span></span><span class="mdc-notched-outline__trailing"></span></span>';
        node.querySelector("input").dataset.team = team;
        node.querySelector("input").dataset.id = field.id;
        node.querySelector(".mdc-floating-label").innerText = field.title;
        node.querySelector(".mdc-text-field__icon").onclick = function(){
            node.querySelector("input").value = parseInt(node.querySelector("input").value) + 1;
        }
        element = new mdc.textField.MDCTextField(node);
    } else if (field.type == "checkbox") {
        var checkbox = document.createElement("div");
        checkbox.classList.value = "mdc-checkbox";
        checkbox.innerHTML += '<input type="checkbox" class="mdc-checkbox__native-control"> <div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div';
        checkbox.querySelector("input").dataset.team = team;
        checkbox.querySelector("input").dataset.id = field.id;
        element = new mdc.checkbox.MDCCheckbox(checkbox);
        var label = document.createElement("label");
        label.innerText = field.title;
        node.appendChild(checkbox);
        node.appendChild(label);
    } else if (field.type == "scale") {
        var wrapper = document.createElement("div");
        wrapper.classList.add("scale-wrapper");
        var label = document.createElement("label");
        label.classList.add("scale-label")
        label.innerText = field.title;
        node.appendChild(label);
        var minLabel = document.createElement("p");
        minLabel.innerText = field.min;
        wrapper.appendChild(minLabel);
        var formField = document.createElement("form");
        element = [];
        for(var i = field.min; i <= field.max-field.min + field.min; i++){
            var radioButton = document.createElement("div");
            radioButton.classList.add("mdc-radio")
            radioButton.dataset.value = i;
            radioButton.innerHTML = "<input class=mdc-radio__native-control name=radios type=radio><div class=mdc-radio__background><div class=mdc-radio__outer-circle></div><div class=mdc-radio__inner-circle></div></div><div class=mdc-radio__ripple></div>";
            formField.appendChild(radioButton);
            element.push(new mdc.radio.MDCRadio(radioButton));
        }
        wrapper.appendChild(formField);
        var maxLabel = document.createElement("p");
        maxLabel.innerText = field.max;
        wrapper.appendChild(maxLabel);
        node.appendChild(wrapper);
    } else if (field.type == "text") {
        node.classList.value = "mdc-text-field mdc-text-field--outlined";
        if(field.isTextArea){
            node.classList.add("mdc-text-field--textarea");
            node.innerHTML += '<span class=mdc-notched-outline><span class=mdc-notched-outline__leading></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label"></span></span><span class=mdc-notched-outline__trailing></span> </span><span class=mdc-text-field__resizer><textarea aria-label=Label class=mdc-text-field__input></textarea></span>';
            node.querySelector("textarea").dataset.team = team;
            node.querySelector("textarea").dataset.id = field.id;
        }else{
            node.innerHTML += '<input type="text" class="mdc-text-field__input" tabindex="1"><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label"></span></span><span class="mdc-notched-outline__trailing"></span></span>';
            node.querySelector("input").dataset.team = team;
            node.querySelector("input").dataset.id = field.id;
        }
        node.querySelector(".mdc-floating-label").innerText = field.title;
        element = new mdc.textField.MDCTextField(node);
    } else if (field.type == "dropdown") {
        node.classList.value = "mdc-select mdc-select--outlined";
        node.innerHTML += '<div class="mdc-select mdc-select--outlined"><div class=mdc-select__anchor><span class=mdc-notched-outline><span class=mdc-notched-outline__leading></span> <span class=mdc-notched-outline__notch><span class=mdc-floating-label></span> </span><span class=mdc-notched-outline__trailing></span> </span><span class=mdc-select__selected-text-container><span class="mdc-select__selected-text"></span> </span><span class=mdc-select__dropdown-icon><svg class=mdc-select__dropdown-icon-graphic focusable=false viewBox="7 10 10 5"><polygon class=mdc-select__dropdown-icon-inactive fill-rule=evenodd points="7 10 12 15 17 10"stroke=none></polygon><polygon class=mdc-select__dropdown-icon-active fill-rule=evenodd points="7 15 12 10 17 15"stroke=none></polygon></svg></span></div><div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth" role="listbox"><ul class="mdc-deprecated-list"></ul></div>';
        node.dataset.team = team;
        node.dataset.id = field.id;
        node.querySelector(".mdc-floating-label").innerText = field.title;
        var list = node.querySelector(".mdc-deprecated-list");
        for(var i = 0; i < field.options.length; i++){
            var item = document.createElement("li");
            item.classList.value = "mdc-deprecated-list-item";
            item.setAttribute("role", "option")
            item.innerHTML = '<span class="mdc-deprecated-list-item__text">' + field.options[i] + '</span>';
            item.dataset.value =  i;
            list.appendChild(item)
        }
        element = new mdc.select.MDCSelect(node);
    }
    return [node, element, field.type];
}

var allFormRows = [];

function makeTeamFormRow(team, isMatch){
    var row = new Object;
    row.team = team;
    row.fields = [];
    var formRow = document.createElement("div");
    formRow.classList.value = "form-row";
    var titleRow = document.createElement("div");
    titleRow.classList.add("title-row")
    var title = document.createElement("h6");
    title.innerText = "Team " + team + " " + allTeams.find(el => el.team_number == team).nickname;
    titleRow.appendChild(title);
    document.getElementById("addTeamButton").hidden = !isMatch;
    if(isMatch){
        var titleButton = document.createElement("button");
        titleButton.innerHTML='<span class="mdc-button__ripple"></span><i class="material-icons mdc-button__icon" aria-hidden="true">close</i><span class="mdc-button__label">Remove</span>';
        titleButton.classList.add("mdc-button");
        titleButton.onclick = function(){
            removeTeamFromMatch(team);
        }
        titleRow.appendChild(titleButton)
    }
    formRow.appendChild(titleRow);
    if(isMatch){
        for(var field of standFields){
            var fieldObject = createField(field);
            formRow.appendChild(fieldObject[0]);
            row.fields.push(fieldObject);
        }
    }else{
        for(var field of pitFields){
            var fieldObject = createField(field);
            formRow.appendChild(fieldObject[0]);
            row.fields.push(fieldObject);
        }
    }
    row.el = formRow;
    allFormRows.push(row);
    return formRow;
}

var currentMatch;

function openMatchScoutForm(match){
    document.getElementById("saveButton").onclick = saveMatchAnswers;
    allFormRows = [];
    currentMatch = match;
    var form = scoutDialog.root.querySelector("form")
    form.innerHTML = "";
    scoutDialog.open();
    scoutDialog.root.querySelector(".mdc-dialog__title").innerText = "Match " + match;
    if(matchesStandDetails[match] != null){
        for(var team of matchesStandDetails[match].teams){
            form.appendChild(makeTeamFormRow(team, true));
        }
    }
}

function openPitScoutForm(team){
    document.getElementById("saveButton").onclick = savePitAnswers;
    allFormRows = [];
    var form = scoutDialog.root.querySelector("form")
    form.innerHTML = "";
    scoutDialog.open();
    scoutDialog.root.querySelector(".mdc-dialog__title").innerText = "Team " + team + " Pit Scouting";
    form.appendChild(makeTeamFormRow(team, false));
}

function addTeamToMatch(){
    //TODO: Make this a little less ugly
    var team = window.prompt("Enter team number");
    if(typeof allTeams.find(el => el.team_number == parseInt(team)) != "undefined"){
        scoutDialog.root.querySelector("form").appendChild(makeTeamFormRow(parseInt(team), true));
    }else{
        snackbar.labelText = "Team "+ team+ " isn't at this event.";
        snackbar.open();
    }
}

function removeTeamFromMatch(team){
    for(var i = 0; i < allFormRows.length; i++){
        if(allFormRows[i].team == team){
            allFormRows[i].el.remove()
            allFormRows.splice(i, 1);
            return;
        }
    }
}

function getValueOfField(field){
    if(field[2] == "number" || field[2] == "text"){
        return field[1].value;
    }else if(field[2] == "checkbox"){
        return field[1].checked;
    }else if(field[2] == "dropdown"){
        return field[1].selectedIndex;
    }else if(field[2] == "scale"){
        var selectedIndex = -1;
        for(const radio of field[1]){
            if(radio.checked){
                selectedIndex = parseInt(radio.root.dataset.value);
            }
        }
        return selectedIndex;
    }
    return null;
}

function saveMatchAnswers(){
    var matchData;
    if(localStorage.getItem("matchData") == null){
        matchData = {};
    }else{
        matchData = JSON.parse(localStorage.getItem("matchData"));
    }
    for(const row of allFormRows){
        var currentTeamMatchData = new Object;
        for(var i = 0; i < standFields.length; i++){
            currentTeamMatchData[standFields[i].id] = getValueOfField(row.fields[i]);
        }
        currentTeamMatchData.matchNumber = currentMatch;
        if(!matchData["team"+row.team]){
            matchData["team"+row.team] = [];
        }
        matchData["team"+row.team].push(currentTeamMatchData);
    }
    localStorage.setItem("matchData", JSON.stringify(matchData));
    snackbar.labelText= "Answers Saved. Thank You!";
    snackbar.open();
}

function savePitAnswers(){
    var pitData;
    if(localStorage.getItem("pitData") == null){
        pitData = {};
    }else{
        pitData = JSON.parse(localStorage.getItem("pitData"));
    }
    var currrentPitData;
    for(const row of allFormRows){
        currentPitData = new Object;
        for(var i = 0; i < pitFields.length; i++){
            currentPitData[pitFields[i].id] = getValueOfField(row.fields[i]);
        }
        pitData["team" + row.team] = currentPitData;
        var checkedItems = JSON.parse(localStorage.getItem("checkedItems"));
        if(checkedItems == null){
            checkedItems = [];
        }
        checkedItems.push("team" + row.team);
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        document.getElementById("pit" + row.team +"checkbox").checked=true;
    }
    localStorage.setItem("pitData", JSON.stringify(pitData));
    snackbar.labelText= "Answers Saved. Thank You!";
    snackbar.open();
}

function makeQR(text){
    var wd, ht, qrc, elem;
    wd = window.innerWidth/2;
    ht = window.innerHeight*0.9;

    var elem = document.getElementById('qrcanv');
    qrc = elem.getContext('2d');
    qrc.canvas.width = wd > ht ? ht : wd;
    qrc.canvas.height = wd > ht ? ht : wd;
    qrc.fillStyle = '#eee';
    qrc.fillRect(0,0,wd,ht);
    qf = genframe(text);
    qrc.lineWidth=1;

    var i,j;
    px = wd;
    if( ht < wd ){
        px = ht;
    }
    px /= width+10;
    px=Math.round(px - 0.5);
    qrc.clearRect(0,0,wd,ht);
    qrc.fillStyle = '#fff';
    qrc.fillRect(0,0,px*(width+8),px*(width+8));
    qrc.fillStyle = '#000';
    for( i = 0; i < width; i++ ){
        for( j = 0; j < width; j++ ){
            if( qf[j*width+i] ){
                qrc.fillRect(px*(4+i),px*(4+j),px,px)
            }
        }
    }
}

function qrShare(){
    qrDialog.open();
    var options = document.getElementById("qrTeamOptions");
    matchData = localStorage.getItem("matchData")
    options.innerHTML = "";
    var teamList = document.createElement("form")
    if(matchData != null){
        for(var key of Object.keys(JSON.parse(matchData))){
            var listItem = document.createElement("div");
            var radioButton = document.createElement("div");
            radioButton.classList.add("mdc-radio")
            radioButton.innerHTML = "<input class=mdc-radio__native-control name=radios data-value="+key.split("team")[1]+" type=radio><div class=mdc-radio__background><div class=mdc-radio__outer-circle></div><div class=mdc-radio__inner-circle></div></div><div class=mdc-radio__ripple></div>";
            listItem.appendChild(radioButton);
            var label = document.createElement('label');
            label.classList.add("mdc-radio");
            label.innerText = "Team " + key.split("team")[1];
            listItem.appendChild(label);
            teamList.appendChild(listItem);
            new mdc.radio.MDCRadio(radioButton);
        }
    }
    var listItem = document.createElement("div");
    var radioButton = document.createElement("div");
    radioButton.classList.add("mdc-radio")
    radioButton.innerHTML = "<input class=mdc-radio__native-control name=radios data-value=pit type=radio><div class=mdc-radio__background><div class=mdc-radio__outer-circle></div><div class=mdc-radio__inner-circle></div></div><div class=mdc-radio__ripple></div>";
    listItem.appendChild(radioButton);
    new mdc.radio.MDCRadio(radioButton);
    var label = document.createElement('label');
    label.classList.add("mdc-radio");
    label.innerText = "Pit Data";
    listItem.appendChild(label);
    teamList.appendChild(listItem);
    options.appendChild(teamList);
    document.getElementById("qrOptions").addEventListener("change", updateQR);
}

var currentQrExport = new Object;
var qrExportType;
var qrExportTeam;

function updateQR(e){
    var radios = document.getElementById("qrTeamOptions").querySelectorAll('.mdc-radio__native-control');
    var teamToExport;
    for(var radio of radios){
        if(radio.checked){
            teamToExport = radio.dataset.value;
            break;
        }
    }
    if(teamToExport == "pit"){
        document.getElementById("autoQr").checked = true;
        customRangeText.root.hidden=true;
        document.getElementById("autoQr").disabled = true;
        if(typeof matchesToSkip == "undefined"){ 
            if(localStorage.getItem("qrExportedData") == null){
                matchesToSkip = {match:{}, pit:[]};
            }else{
                matchesToSkip = JSON.parse(localStorage.getItem("qrExportedData"));
            }
        }
        var data = JSON.parse(localStorage.getItem("pitData"))
        if(typeof matchesToSkip.pit != "undefined"){
            for(var i = 0; i < data.length; i++){
                if(matchesToSkip.indexOf(teamToExport) != -1){
                    data.splice(i, 1);
                }
            }
        }
        data.type = "pit";
    }else{
        document.getElementById("autoQr").disabled = false;
        if(document.getElementById("autoQr").checked){
            customRangeText.root.hidden=true;
            if(typeof matchesToSkip == "undefined"){ 
                if(localStorage.getItem("qrExportedData") == null){
                    matchesToSkip = {match:{}, pit:[]};
                }else{
                    matchesToSkip = JSON.parse(localStorage.getItem("qrExportedData"));
                }
            }
        }else{
            customRangeText.root.hidden=false;
            var customRange = customRangeText.value.split("-")
            if(customRangeText.value.split("-").length == 2){
                matchesToSkip.match["team" + teamToExport] = [];
                for(var i = customRange[0]; i <= customRange[1]; i++){
                    matchesToSkip.match["team" + teamToExport].push(i);
                }
            }else{
                customRangeText.valid = false;
            }
        }
        var matchesExported = [];
        var data = JSON.parse(localStorage.getItem("matchData"))["team"+teamToExport];
        if(typeof matchesToSkip.match["team" + teamToExport] != "undefined"){
            for(var i = 0; i < data.length; i++){
                if(matchesToSkip.match["team" + teamToExport].indexOf(data[i].matchNumber) != -1){
                    data.splice(i, 1);
                }else{
                    matchesExported.push(data[i].matchNumber);
                }
            }
        }else{
            matchesToSkip.match["team" + teamToExport] = [];
        }
        currentQrExport["team" + teamToExport] = matchesExported;
        qrExportType="match";
        qrExportTeam = teamToExport;
        data.unshift({team:teamToExport});
    }
    makeQR(JSON.stringify(data));
}

function addToScanned(){
    if(localStorage.getItem("qrExportedData") == null){
        matchesToSkip = {match:{}, pit:[]};
    }else{
        matchesToSkip = JSON.parse(localStorage.getItem("qrExportedData"));
    }
    if(qrExportType == "match"){
        if(typeof matchesToSkip.match["team"+qrExportTeam] == "undefined"){
            matchesToSkip.match["team"+qrExportTeam] = [];
        }
        for(var match of currentQrExport["team"+qrExportTeam]){
            matchesToSkip.match["team"+qrExportTeam].push(match);
        }
    }else{
        for(var team of currentQrExport.pit){
            matchesToSkip.pit.push(team);
        }
    }
    localStorage.setItem("qrExportedData", JSON.stringify(matchesToSkip));
}

var downloader = document.createElement("a")
function downloadData(el){
    try{
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("matchData"));
        downloader.setAttribute("href",     dataStr);
        downloader.setAttribute("download", "match-scouting.json");
        downloader.click();
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("pitData"));
        downloader.setAttribute("href",     dataStr);
        downloader.setAttribute("download", "pit-scouting.json");
        downloader.click();
    }catch(err){
        snackbar.labelText = "There was an error downloading data";
        snackbar.open();
    }finally{
        snackbar.labelText = "Scouting data exported";
        snackbar.open();
    }
}

function nativeShare(){
    var files = [];
    if(localStorage.getItem("matchData") != null){
        files.push(new File([localStorage.getItem("matchData")], "matchData.json", {type:"application/json"}));
    }
    if(localStorage.getItem("pitData") != null){
        files.push(new File([localStorage.getItem("pitData")], "pitData.json", {type:"application/json"}));
    }
    var data = {files:files, title:"Scouting Data", text:"Here's some cool scouting data"};
    if(navigator.canShare(data)){
        navigator.share(data);
    }else{
        snackbar.labelText("Unable to share scouting data.");
        snackbar.open();
    }
}

function checkCheck(team){
    if(checkedItems.indexOf('team'+team) != -1){
        $('#pit'+team+'checkbox').ready(function () {       //Waits until checkbox is ready before checking
            $('#pit'+team+'checkbox').ready(function () {       //Waits until checkbox is ready before checking
                $('#pit'+team+'checkbox').prop('checked',true);
                });          
          });          
    }
}