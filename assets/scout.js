
var matchesScouting = [];
var allTeams;

class OnboardingManager {
    constructor(root) {
        this.root = root;
        this.strategySelect = new mdc.chips.MDCChipSet(document.getElementById("strategy-select"));
        this.positionSelect = new mdc.chips.MDCChipSet(document.getElementById("position-select"));
        OnboardingManager.instance = this;
        document.getElementById("strategy-select-container").classList.remove("setup-container--hidden");
        this.currentView = "strategy";
    }

    handleContinueClick() {
        switch (this.currentView) {
            case "strategy":
                if(this.strategySelect.selectedChipIds.length == 0){
                    snackbar.labelText = "Select a strategy before continuing."
                    snackbar.open();
                    return;
                }
                document.getElementById("strategy-select-container").classList.add("setup-container--hidden");
                switch (this.strategySelect.selectedChipIds[0]) {
                    case "position-based":
                        document.getElementById("position-select-container").classList.remove("setup-container--hidden");
                        this.currentView = "position";
                        break;
                    case "team-based":
                        document.getElementById("team-select-container").classList.remove("setup-container--hidden");
                        this.currentView = "team";
                        this.fetchTeams();
                        break;
                    case "skip-setup":
                        this.skipSetup();
                        break;
                }
                break;
            case "team":
                document.getElementById("team-select-container").classList.add("setup-container--hidden");
                this.finish();
                break;
            case "position":
                if(this.positionSelect.selectedChipIds.length == 0){
                    snackbar.labelText = "Select a position before continuing."
                    snackbar.open();
                    return;
                }
                document.getElementById("position-select-container").classList.add("setup-container--hidden");
                this.finish();
                break;
        }
    }

    async fetchTeams() {
        var teamCheck = document.getElementById("teamcheck");
        if (localStorage.getItem("currentEvent") == null) {
            snackbar.labelText = "Choose an event before scouting.";
            snackbar.open();
            return;
        }
        var contents =  await getTBAData("https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/teams/simple");
        localStorage.setItem('allTeams', JSON.stringify(contents));
        allTeams = contents;
        var i;
        for (i = 0; i < contents.length; i++) {
            teamCheck.innerHTML = teamCheck.innerHTML + '<div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="' + contents[i].key + '"/> <div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="' + contents[i].key + '">' + contents[i].team_number + " " + contents[i].nickname + '</label><br>'
        }
    }


    async skipSetup() {
        document.getElementById("button-container").classList.add("setup-container--hidden");
        document.getElementById("loading-container").classList.remove("setup-container--hidden");
        await this.fetchTeams();
        localStorage.setItem("matchDetails", "{}");
        localStorage.setItem("matchScoutStart", "true");
        matchDetails = null;
        matchesScouting = null;
        scoutingBoard();
    }

    finish() {
        document.getElementById("button-container").classList.add("setup-container--hidden");
        document.getElementById("position-select-container").classList.add("setup-container--hidden");
        document.getElementById("team-select-container").classList.add("setup-container--hidden");
        document.getElementById("loading-container").classList.remove("setup-container--hidden");
        if (this.currentView == "team") {
            var selectedTeams = [];
            for (var team of allTeams) {
                if (document.getElementById(team.key).checked) {
                    selectedTeams.push(team)
                }
            }
            progress.open();
            var selectedAssignment = {type: "team", data:selectedTeams};
            localStorage.setItem("selectedAssignment", JSON.stringify(selectedAssignment));
            fetchMatchesForTeams(selectedTeams).then(function () {
                scoutingBoard();
                progress.close();
                localStorage.setItem("matchScoutStart", true);
            }).catch(function (e) {
                document.getElementById("button-container").classList.remove("setup-container--hidden");
                document.getElementById("team-select-container").classList.remove("setup-container--hidden");
                document.getElementById("loading-container").classList.add("setup-container--hidden");
                snackbar.labelText = "There was an error getting matches. Please try again.";
                snackbar.open();
                progress.close();
                console.log(e);
            })
        } else if (this.currentView == "position") {
            progress.open();
            var selectedAssignment = {type: "position", data:this.positionSelect.selectedChipIds[0].split("chip-position-")[1]};
            localStorage.setItem("selectedAssignment", JSON.stringify(selectedAssignment));
            this.fetchTeams().then(() => {
                fetchMatchesByPosition(parseInt(this.positionSelect.selectedChipIds[0].split("chip-position-")[1])).then(function () {
                    scoutingBoard();
                    progress.close();
                    localStorage.setItem("matchScoutStart", true);
                }).catch(function (e) {
                    document.getElementById("button-container").classList.remove("setup-container--hidden");
                    document.getElementById("position-select-container").classList.remove("setup-container--hidden");
                    document.getElementById("loading-container").classList.add("setup-container--hidden");
                    snackbar.labelText = "There was an error getting matches. Please try again.";
                    snackbar.open();
                    progress.close();
                    console.log(e);
                })
            }).catch(function (e) {
                document.getElementById("button-container").classList.remove("setup-container--hidden");
                document.getElementById("position-select-container").classList.remove("setup-container--hidden");
                document.getElementById("loading-container").classList.add("setup-container--hidden");
                snackbar.labelText = "There was an error getting teams. Please try again.";
                snackbar.open();
                progress.close();
                console.log(e);
            });
        }
    }

    static instance;
}

function continueMatchScouting() {
    if (localStorage.getItem("matchScoutStart")) {
        scoutingBoard();
        continuePit();
    } else {
        new OnboardingManager(document.getElementById("onboarding"));
    }
    if (localStorage.getItem("currentEvent") == null) {
        eventPicker.open()
    }
}

function removeDuplicates(array) {
    return [...new Set(array)];
}

var matchDetails = new Object;

function pushToMatches(match, team, unixTime, alliances) {
    if (typeof matchDetails[match] == 'undefined') {
        matchDetails[match] = new Object;
        matchDetails[match].match_number = match;
        if (typeof matchDetails[match].team == "undefined") {
            matchDetails[match].alliances = { red: [], blue: [] };
        }
        matchDetails[match].time = (new Date(unixTime * 1000)).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    if (alliances.red.team_keys.indexOf("frc" + team) != -1) {
        matchDetails[match].alliances.red.push(team);
    } else {
        matchDetails[match].alliances.blue.push(team);
    }
}

async function fetchMatchesForTeams(teams) {
    for await (const team of teams) {
        const matches = await getTBAData("https://www.thebluealliance.com/api/v3/team/" + team.key + "/event/" + localStorage.getItem("currentEvent") + "/matches/simple");
        for (const match of matches) {
            if (match.comp_level === "qm") {
                pushToMatches(match.match_number, team.team_number, match.predicted_time, match.alliances);
                matchesScouting.push(match.match_number);
                matchesScouting = removeDuplicates(matchesScouting);
            }
            localStorage.setItem("matchesScouting", JSON.stringify(matchesScouting));
            localStorage.setItem("matchDetails", JSON.stringify(matchDetails));
        }
    }
}

async function fetchMatchesByPosition(position) {
    const matches = await getTBAData("https://www.thebluealliance.com/api/v3/event/" + localStorage.getItem("currentEvent") + "/matches/simple");
    for (const match of matches) {
        if (match.comp_level === "qm") {
            pushToMatches(match.match_number, ((position < 3) ? match.alliances.blue.team_keys[position - 1] : match.alliances.red.team_keys[position - 4]).split("frc")[1], match.predicted_time, match.alliances);
            matchesScouting.push(match.match_number);
        }
        localStorage.setItem("matchesScouting", JSON.stringify(matchesScouting));
        localStorage.setItem("matchDetails", JSON.stringify(matchDetails));
    }
}

function scoutingBoard() {
    matchesScouting = JSON.parse(localStorage.getItem("matchesScouting"));
    matchDetails = JSON.parse(localStorage.getItem("matchDetails"));
    document.getElementById("scouting-board-container").innerHTML = "<h2 class='text-center'>Qualifier Matches</h2>"
    document.getElementById("scouting-board-container").innerHTML += '<ul class="mdc-list mdc-list--two-line scoutlist">';
    document.getElementById("button-container").classList.add("setup-container--hidden");
    document.getElementById("loading-container").classList.add("setup-container--hidden");
    document.getElementById("scouting-board-container").classList.remove("setup-container--hidden");
    if (matchesScouting == null) {
        document.getElementById("scouting-board-container").innerHTML = "<h2 class='text-center'>No Qualifier Matches Available</h2>"
        matchesScouting = [];
    }
    matchesScouting.sort(function (a, b) { return a - b });
    for (const match of matchesScouting) {
        var listItem = document.createElement("li");
        listItem.classList.add("mdc-list-item");
        listItem.innerHTML = '<span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">Match ' + match + '</span><span class="mdc-list-item__secondary-text">' + ((matchDetails[match].alliances.red.length != 0) ? '<span class="red-alliance-text">' + matchDetails[match].alliances.red.join(" ") + ' </span>' : "") + '<span class="blue-alliance-text">' + matchDetails[match].alliances.blue.join(" ") + '</span> ~' + matchDetails[match].time + '</span></span>';
        listItem.onclick = function () {
            openMatchScoutForm(match);
        };
        document.getElementById("scouting-board-container").appendChild(listItem);
    }
    var fab = document.createElement("button");
    fab.classList.add("mdc-fab");
    fab.innerHTML = '  <div class="mdc-fab__ripple"></div><span class="mdc-fab__icon material-icons">add</span>';
    fab.onclick = function () {
        var matchNumber = window.prompt("Enter match number");
        if (isNaN(parseInt(matchNumber)) && matchNumber != null) {
            snackbar.labelText = "Match number entered isn't a number.";
            snackbar.open();
        } else if (matchNumber != null) {
            openMatchScoutForm(parseInt(matchNumber));
        }
    }
    document.getElementById("scouting-board-container").appendChild(fab);
}

function selectTab(tab) {
    document.getElementById('matchscout').classList.add("d-none");
    document.getElementById('pitscout').classList.add("d-none");
    document.getElementById(tab).classList.remove("d-none");
    tabBar.activateTab(document.getElementById(tab + "tab"), 1);
    if (tab = 'pitscout' && localStorage.getItem('pitScoutStart') !== "") {
        continuePit()
    }
}

var pitCheckboxes;
var checkedItems;

function continuePit() {
    if (localStorage.getItem("checkedItems") == null) {
        checkedItems = [];
    } else {
        checkedItems = JSON.parse(localStorage.getItem("checkedItems"));
    }
    if (localStorage.getItem("matchScoutStart")) {
        document.getElementById("pitscout").innerHTML = "<h2 class='text-center'>Pit Scouting</h2>"
        document.getElementById("pitscout").innerHTML = document.getElementById("pitscout").innerHTML + '<ul class="mdc-list mdc-list--two-line scoutlist">';
        if (allTeams == null) {
            allTeams = JSON.parse(localStorage.getItem('allTeams'));
        }
        for (var i = 0; i < allTeams.length; i++) {
            document.getElementById("pitscout").innerHTML = document.getElementById("pitscout").innerHTML + '<li class="mdc-list-item pitScoutItem" role="checkbox"><span class="mdc-list-item__graphic"><div class="mdc-checkbox"><input name="team' + allTeams[i].team_number + '"type="checkbox" id="pit' + allTeams[i].team_number + 'checkbox"class="mdc-checkbox__native-control"'+((checkedItems.indexOf("team"+allTeams[i].team_number) != -1)?"checked":"")+'/><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark"viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path"fill="none"d="M1.73,12.91 8.1,19.28 22.79,4.59"/></svg><div class="mdc-checkbox__mixedmark"></div></div></div></span><label style="width: 100%" id="pit' + allTeams[i].team_number + 'item"onclick="openPitScoutForm(' + allTeams[i].team_number + ')"><span class="mdc-list-item__primary-text">' + allTeams[i].team_number + ' ' + allTeams[i].nickname + '</span><span class="mdc-list-item__secondary-text">' + allTeams[i].city + ', ' + allTeams[i].state_prov + '</span></label></li>'
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
        node.querySelector(".mdc-text-field__icon").onclick = function () {
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
        var label = document.createElement("label");
        label.classList.add("scale-label")
        label.innerText = field.title;
        node.appendChild(label);
        wrapper.classList.add("scale-wrapper");
        var minLabel = document.createElement("span");
        minLabel.innerText = field.min;
        wrapper.appendChild(minLabel);
        var slider = document.createElement("div");
        slider.classList.value = "mdc-slider mdc-slider--discrete form-slider";
        slider.innerHTML = '<input class="mdc-slider__input"max="' + field.max + '"min="' + field.min + '"type="range"value="' + (Math.floor((field.max + field.min) / 2)) + '"><div class="mdc-slider__track"><div class="mdc-slider__track--inactive"></div><div class="mdc-slider__track--active"><div class="mdc-slider__track--active_fill"></div></div></div><div class="mdc-slider__thumb"><div class="mdc-slider__value-indicator-container"aria-hidden="true"><div class="mdc-slider__value-indicator"><span class="mdc-slider__value-indicator-text">50</span></div></div><div class="mdc-slider__thumb-knob"></div></div>';
        wrapper.appendChild(slider);
        var maxLabel = document.createElement("span");
        maxLabel.innerText = field.max;
        wrapper.appendChild(maxLabel);
        element = new mdc.slider.MDCSlider(slider);
        node.appendChild(wrapper);
        setTimeout(function () { element.layout() }, 150);
    } else if (field.type == "text") {
        node.classList.value = "mdc-text-field mdc-text-field--outlined";
        if (field.isTextArea) {
            node.classList.add("mdc-text-field--textarea");
            node.innerHTML += '<span class=mdc-notched-outline><span class=mdc-notched-outline__leading></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label"></span></span><span class=mdc-notched-outline__trailing></span> </span><span class=mdc-text-field__resizer><textarea aria-label=Label class=mdc-text-field__input></textarea></span>';
            node.querySelector("textarea").dataset.team = team;
            node.querySelector("textarea").dataset.id = field.id;
        } else {
            node.innerHTML += '<input type="text" class="mdc-text-field__input" tabindex="1"><span class="mdc-notched-outline"><span class="mdc-notched-outline__leading"></span><span class="mdc-notched-outline__notch"><span class="mdc-floating-label"></span></span><span class="mdc-notched-outline__trailing"></span></span>';
            node.querySelector("input").dataset.team = team;
            node.querySelector("input").dataset.id = field.id;
        }
        node.querySelector(".mdc-floating-label").innerText = field.title;
        element = new mdc.textField.MDCTextField(node);
    } else if (field.type == "dropdown") {
        node.classList.value = "mdc-select mdc-select--outlined";
        node.innerHTML += '<div class=mdc-select__anchor><span class=mdc-notched-outline><span class=mdc-notched-outline__leading></span> <span class=mdc-notched-outline__notch><span class=mdc-floating-label></span> </span><span class=mdc-notched-outline__trailing></span> </span><span class=mdc-select__selected-text-container><span class="mdc-select__selected-text"></span> </span><span class=mdc-select__dropdown-icon><svg class=mdc-select__dropdown-icon-graphic focusable=false viewBox="7 10 10 5"><polygon class=mdc-select__dropdown-icon-inactive fill-rule=evenodd points="7 10 12 15 17 10"stroke=none></polygon><polygon class=mdc-select__dropdown-icon-active fill-rule=evenodd points="7 15 12 10 17 15"stroke=none></polygon></svg></span></div><div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth" role="listbox"><ul class="mdc-deprecated-list"></ul>';
        node.dataset.team = team;
        node.dataset.id = field.id;
        node.querySelector(".mdc-floating-label").innerText = field.title;
        var list = node.querySelector(".mdc-deprecated-list");
        for (var i = 0; i < field.options.length; i++) {
            var item = document.createElement("li");
            item.classList.value = "mdc-deprecated-list-item";
            item.setAttribute("role", "option")
            item.innerHTML = '<span class="mdc-deprecated-list-item__text">' + field.options[i] + '</span>';
            item.dataset.value = i;
            list.appendChild(item)
        }
        element = new mdc.select.MDCSelect(node);
    } else if (field.type == "multi-select") {
        node.classList.value = "mdc-select mdc-select--outlined";
        node.innerHTML += '<div class=mdc-select__anchor><span class=mdc-notched-outline><span class=mdc-notched-outline__leading></span> <span class=mdc-notched-outline__notch><span class=mdc-floating-label></span> </span><span class=mdc-notched-outline__trailing></span> </span><span class=mdc-select__selected-text-container><span class="mdc-select__selected-text"></span> </span><span class=mdc-select__dropdown-icon><svg class=mdc-select__dropdown-icon-graphic focusable=false viewBox="7 10 10 5"><polygon class=mdc-select__dropdown-icon-inactive fill-rule=evenodd points="7 10 12 15 17 10"stroke=none></polygon><polygon class=mdc-select__dropdown-icon-active fill-rule=evenodd points="7 15 12 10 17 15"stroke=none></polygon></svg></span></div><div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth" role="listbox"><ul class="mdc-deprecated-list"></ul>';
        node.querySelector(".mdc-floating-label").innerText = field.title;
        var list = node.querySelector(".mdc-deprecated-list");
        element = [];
        for (var i = 0; i < field.options.length; i++) {
            var item = document.createElement("li");
            item.classList.value = "mdc-list-item";
            item.dataset.value = i;
            item.setAttribute("role", "option")
            item.innerHTML = '<span class=mdc-list-item__ripple></span> <span class=mdc-list-item__graphic><div class=mdc-checkbox><input class=mdc-checkbox__native-control type=checkbox><div class=mdc-checkbox__background><svg class=mdc-checkbox__checkmark viewBox="0 0 24 24"><path class=mdc-checkbox__checkmark-path d="M1.73,12.91 8.1,19.28 22.79,4.59"fill=none /></svg><div class=mdc-checkbox__mixedmark></div></div></div></span><label class=mdc-list-item__text></label>';
            item.querySelector(".mdc-list-item__text").innerText = field.options[i];
            item.querySelector("input").dataset.value = i;
            list.appendChild(item);
            element.push(item.querySelector("input"));
        }
        var select = new mdc.select.MDCSelect(node);
        node.addEventListener("change", function (e) {
            select.foundation.blur = function () { select.root.classList.remove("mdc-select--focused") };
            select.selectedText.innerText = getValueOfField([node, element, field.type]).length + " Items Selected"
        })
    }
    return [node, element, field.type];
}

var allFormRows = [];

function makeTeamFormRow(team, isMatch) {
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
    if (isMatch) {
        var titleButton = document.createElement("button");
        titleButton.innerHTML = '<span class="mdc-button__ripple"></span><i class="material-icons mdc-button__icon" aria-hidden="true">close</i><span class="mdc-button__label">Remove</span>';
        titleButton.classList.add("mdc-button");
        titleButton.onclick = function () {
            removeTeamFromMatch(team);
        }
        titleRow.appendChild(titleButton)
    }
    formRow.appendChild(titleRow);
    if (isMatch) {
        for (var field of matchFields) {
            var fieldObject = createField(field);
            formRow.appendChild(fieldObject[0]);
            row.fields.push(fieldObject);
        }
    } else {
        for (var field of pitFields) {
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

function openMatchScoutForm(match) {
    document.getElementById("saveButton").onclick = saveMatchAnswers;
    allFormRows = [];
    currentMatch = match;
    var form = scoutDialog.root.querySelector("form")
    form.innerHTML = "";
    scoutDialog.open();
    scoutDialog.root.querySelector(".mdc-dialog__title").innerText = "Match " + match;
    document.getElementById("addTeamButton").hidden = false;
    if (matchDetails != null && matchDetails[match] != null) {
        var teams = matchDetails[match].alliances.red.concat(matchDetails[match].alliances.blue)
        for (var team of teams) {
            form.appendChild(makeTeamFormRow(team, true));
        }
    }
}

function openPitScoutForm(team) {
    document.getElementById("saveButton").onclick = savePitAnswers;
    allFormRows = [];
    var form = scoutDialog.root.querySelector("form")
    form.innerHTML = "";
    scoutDialog.open();
    document.getElementById("addTeamButton").hidden = true;
    scoutDialog.root.querySelector(".mdc-dialog__title").innerText = "Team " + team + " Pit Scouting";
    form.appendChild(makeTeamFormRow(team, false));
}

function addTeamToMatch() {
    var team = window.prompt("Enter team number");
    if (typeof allTeams.find(el => el.team_number == parseInt(team)) != "undefined") {
        scoutDialog.root.querySelector("form").appendChild(makeTeamFormRow(parseInt(team), true));
        for(var row of allFormRows){
            for(var field of row.fields){
                if(field[2] == "scale"){
                    field[1].layout();
                }
            }
        }
    } else {
        snackbar.labelText = "Team " + team + " isn't at this event.";
        snackbar.open();
    }
}

function removeTeamFromMatch(team) {
    for (var i = 0; i < allFormRows.length; i++) {
        if (allFormRows[i].team == team) {
            allFormRows[i].el.remove()
            allFormRows.splice(i, 1);
            return;
        }
    }
}

function getValueOfField(field) {
    if (field[2] == "number" || field[2] == "text") {
        return field[1].value;
    } else if (field[2] == "checkbox") {
        return field[1].checked;
    } else if (field[2] == "dropdown") {
        return field[1].selectedIndex;
    } else if (field[2] == "scale") {
        return field[1].getValue();
    } else if (field[2] == "multi-select") {
        var selectedIndexes = [];
        for (var checkbox of field[1]) {
            if (checkbox.checked) {
                selectedIndexes.push(parseInt(checkbox.dataset.value));
            }
        }
        return selectedIndexes;
    }
    return null;
}

function saveMatchAnswers() {
    var matchData;
    if (localStorage.getItem("matchData") == null) {
        matchData = {};
    } else {
        matchData = JSON.parse(localStorage.getItem("matchData"));
    }
    for (const row of allFormRows) {
        var currentTeamMatchData = new Object;
        for (var i = 0; i < matchFields.length; i++) {
            currentTeamMatchData[matchFields[i].id] = getValueOfField(row.fields[i]);
        }
        currentTeamMatchData.matchNumber = currentMatch;
        if (!matchData["team" + row.team]) {
            matchData["team" + row.team] = [];
        }
        matchData["team" + row.team].push(currentTeamMatchData);
    }
    localStorage.setItem("matchData", JSON.stringify(matchData));
    snackbar.labelText = "Answers Saved. Thank You!";
    snackbar.open();
}

function savePitAnswers() {
    var pitData;
    if (localStorage.getItem("pitData") == null) {
        pitData = {};
    } else {
        pitData = JSON.parse(localStorage.getItem("pitData"));
    }
    var currrentPitData;
    for (const row of allFormRows) {
        currentPitData = new Object;
        for (var i = 0; i < pitFields.length; i++) {
            currentPitData[pitFields[i].id] = getValueOfField(row.fields[i]);
        }
        pitData["team" + row.team] = currentPitData;
        var checkedItems = JSON.parse(localStorage.getItem("checkedItems"));
        if (checkedItems == null) {
            checkedItems = [];
        }
        checkedItems.push("team" + row.team);
        localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
        document.getElementById("pit" + row.team + "checkbox").checked = true;
    }
    localStorage.setItem("pitData", JSON.stringify(pitData));
    snackbar.labelText = "Answers Saved. Thank You!";
    snackbar.open();
}

function makeQR(text) {
    var wd = window.innerWidth;
    var ht = window.innerHeight;
    var elem = document.getElementById('qrcanv');
    var qrc = elem.getContext('2d');
    qrc.canvas.width = wd > ht ? wd : ht;
    qrc.canvas.height = wd > ht ? wd : ht;
    qrc.fillStyle = '#eee';
    qrc.fillRect(0, 0, wd, ht);
    qf = genframe(text);
    qrc.lineWidth = 1;

    var i, j;
    px = wd > ht ? wd : ht;;
    px /= width + 10;
    px = Math.round(px - 0.5);
    qrc.clearRect(0, 0, wd, ht);
    qrc.fillStyle = '#fff';
    qrc.fillRect(0, 0, px * (width + 8), px * (width + 8));
    qrc.fillStyle = '#000';
    for (i = 0; i < width; i++) {
        for (j = 0; j < width; j++) {
            if (qf[j * width + i]) {
                qrc.fillRect(px * (4 + i), px * (4 + j), px, px)
            }
        }
    }
}

function qrShare() {
    qrDialog.open();
    var options = document.getElementById("qrTeamOptions");
    matchData = localStorage.getItem("matchData")
    options.innerHTML = "";
    var teamList = document.createElement("form")
    if (matchData != null) {
        for (var key of Object.keys(JSON.parse(matchData))) {
            var listItem = document.createElement("div");
            var radioButton = document.createElement("div");
            radioButton.classList.add("mdc-radio")
            radioButton.innerHTML = "<input class=mdc-radio__native-control name=radios data-value=" + key.split("team")[1] + " type=radio><div class=mdc-radio__background><div class=mdc-radio__outer-circle></div><div class=mdc-radio__inner-circle></div></div><div class=mdc-radio__ripple></div>";
            listItem.appendChild(radioButton);
            var label = document.createElement('label');
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

function updateQR(e) {
    var radios = document.getElementById("qrTeamOptions").querySelectorAll('.mdc-radio__native-control');
    var teamToExport;
    for (var radio of radios) {
        if (radio.checked) {
            teamToExport = radio.dataset.value;
            break;
        }
    }
    if (teamToExport == "pit") {
        document.getElementById("autoQr").checked = true;
        customRangeText.root.hidden = true;
        document.getElementById("autoQr").disabled = true;
        if (typeof matchesToSkip == "undefined") {
            if (localStorage.getItem("qrExportedData") == null) {
                matchesToSkip = { match: {}, pit: [] };
            } else {
                matchesToSkip = JSON.parse(localStorage.getItem("qrExportedData"));
            }
        }
        var data = JSON.parse(localStorage.getItem("pitData"))
        if (typeof matchesToSkip.pit != "undefined") {
            for (var i = 0; i < data.length; i++) {
                if (matchesToSkip.indexOf(teamToExport) != -1) {
                    data.splice(i, 1);
                }
            }
        }
        data.type = "pit";
    } else {
        document.getElementById("autoQr").disabled = false;
        if (document.getElementById("autoQr").checked) {
            customRangeText.root.hidden = true;
            if (typeof matchesToSkip == "undefined") {
                if (localStorage.getItem("qrExportedData") == null) {
                    matchesToSkip = { match: {}, pit: [] };
                } else {
                    matchesToSkip = JSON.parse(localStorage.getItem("qrExportedData"));
                }
            }
        } else {
            customRangeText.root.hidden = false;
            var customRange = customRangeText.value.split("-")
            if (customRangeText.value.split("-").length == 2) {
                matchesToSkip.match["team" + teamToExport] = [];
                for (var i = customRange[0]; i <= customRange[1]; i++) {
                    matchesToSkip.match["team" + teamToExport].push(i);
                }
            } else {
                customRangeText.valid = false;
            }
        }
        var matchesExported = [];
        var data = JSON.parse(localStorage.getItem("matchData"))["team" + teamToExport];
        if (typeof matchesToSkip.match["team" + teamToExport] != "undefined") {
            for (var i = 0; i < data.length; i++) {
                if (matchesToSkip.match["team" + teamToExport].indexOf(data[i].matchNumber) != -1) {
                    data.splice(i, 1);
                } else {
                    matchesExported.push(data[i].matchNumber);
                }
            }
        } else {
            matchesToSkip.match["team" + teamToExport] = [];
        }
        currentQrExport["team" + teamToExport] = matchesExported;
        qrExportType = "match";
        qrExportTeam = teamToExport;
        data.unshift({ team: teamToExport });
    }
    makeQR(JSON.stringify(data));
}

function addToScanned() {
    if (localStorage.getItem("qrExportedData") == null) {
        matchesToSkip = { match: {}, pit: [] };
    } else {
        matchesToSkip = JSON.parse(localStorage.getItem("qrExportedData"));
    }
    if (qrExportType == "match") {
        if (typeof matchesToSkip.match["team" + qrExportTeam] == "undefined") {
            matchesToSkip.match["team" + qrExportTeam] = [];
        }
        for (var match of currentQrExport["team" + qrExportTeam]) {
            matchesToSkip.match["team" + qrExportTeam].push(match);
        }
    } else {
        for (var team of currentQrExport.pit) {
            matchesToSkip.pit.push(team);
        }
    }
    localStorage.setItem("qrExportedData", JSON.stringify(matchesToSkip));
}

var downloader = document.createElement("a")
function downloadData(el) {
    try {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("matchData"));
        downloader.setAttribute("href", dataStr);
        downloader.setAttribute("download", "match-scouting-" + (new Date).getTime() + ".json");
        downloader.click();
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("pitData"));
        downloader.setAttribute("href", dataStr);
        downloader.setAttribute("download", "pit-scouting-" + (new Date).getTime() + ".json");
        downloader.click();
    } catch (err) {
        snackbar.labelText = "There was an error downloading data";
        snackbar.open();
    } finally {
        snackbar.labelText = "Scouting data exported";
        snackbar.open();
    }
}

function nativeShare() {
    var files = [];
    if (localStorage.getItem("matchData") != null) {
        files.push(new File([localStorage.getItem("matchData")], "match-data" + (new Date).getTime() + ".json", { type: "application/json" }));
    }
    if (localStorage.getItem("pitData") != null) {
        files.push(new File([localStorage.getItem("pitData")], "pit-data" + (new Date).getTime() + ".json", { type: "application/json" }));
    }
    var data = { files: files, title: "Scouting Data", text: "Here's some cool scouting data" };
    if (navigator.canShare(data)) {
        navigator.share(data).catch(err => {
            if (err.name != "AbortError") {
                snackbar.labelText = "An error occured while sharing.";
                snackbar.open();
            }
            console.log(err);
        });
    } else {
        snackbar.labelText = "Unable to share scouting data.";
        snackbar.open();
    }
}

async function refreshSchedule(){
    var selectedAssignment = JSON.parse(localStorage.getItem("selectedAssignment"));
    progress.open();
    if(selectedAssignment == null){
        snackbar.labelText = "No assignment strategy was selected during setup.";
        snackbar.open();
        progress.close();
        return;
    }
    if(!navigator.onLine){
        snackbar.labelText = "You're offline.";
        snackbar.open();
        return;
    }
    matchDetails = new Object;
    matchesScouting = [];
    try{
        switch(selectedAssignment.type){
            case "team":
                await fetchMatchesForTeams(selectedAssignment.data);
                scoutingBoard();
                break;
            case "position":
                await fetchMatchesByPosition(parseInt(selectedAssignment.data));
                scoutingBoard();
                break;
        }
        snackbar.labelText = "Match Schedule Refreshed";
        snackbar.open();
        progress.close()
    }catch(e){
        snackbar.labelText = "An error occured while refreshing the match schedule.";
        console.log(e);
        snackbar.open();
        progress.close()
    }
}

function redoOnboarding(){
    matchDetails = new Object;
    matchesScouting = [];
    if(OnboardingManager.instance){
        OnboardingManager.instance.strategySelect.destroy()
        OnboardingManager.instance.positionSelect.destroy()
        document.getElementById("teamcheck").innerHTML = "";
    }
    document.getElementById("scouting-board-container").classList.add("setup-container--hidden");
    document.getElementById("button-container").classList.remove("setup-container--hidden");
    new OnboardingManager(document.getElementById("onboarding"));
}