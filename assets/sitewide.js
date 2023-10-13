var events;
const TBA_AUTH = 'KYyfzxvdzhHGSE6ENeT6H7sxMJsO7Gzp0BMEi7AE3nTR7pHSsmKOSKAblMInnSfw';
class EventPicker {
  constructor(el) {
    this.component = new mdc.dialog.MDCDialog(el);
    this.root = el.querySelector(".mdc-dialog__surface");
    this.initialized = false;
  }
  async _getEvents(team) {
    var headers = new Headers();
    var now = new Date();
    headers.append("X-TBA-Auth-Key", TBA_AUTH);
    return await getTBAData("https://www.thebluealliance.com/api/v3/team/frc" + team + "/events/" + now.getFullYear() + "/simple");
  }
  pickCustomEvent() {
    var eventName = window.prompt("Enter custom Blue Alliance event code.\nFor example, the 2023 FIRST World Championship code is \"2023cmptx\"");
    if (eventName != null && eventName != "") {
      localStorage.clear();
      localStorage.setItem("currentEvent", eventName);
      window.location.reload();
    }
  }

  async open() {
    if (!this.initialized) {
      await this.initialize();
    }
    this.component.open();
  }

  async initialize() {
    this.teamTextField = new mdc.textField.MDCTextField(this.root.querySelector(".mdc-text-field"));
    this.teamSubmitButton = document.getElementById("team-submit-button");
    this.teamSubmitButton.onclick = async (e) => {
      var indicator = new CircularProgress(false);
      this.teamSubmitButton.querySelector(".mdc-button__indicator").innerHTML = "";
      this.teamSubmitButton.querySelector(".mdc-button__indicator").appendChild(indicator.root);
      this.teamSubmitButton.querySelector(".mdc-button__indicator").hidden = false;
      this.teamSubmitButton.querySelector(".mdc-button__icon").hidden = true;
      document.getElementById("event-picker__error-text").innerText = "";
      this.root.querySelector(".event-list").innerHTML = "";
      this.value = false;
      if (!isNaN(parseInt(this.teamTextField.value))) {
        try {
          var events = await this._getEvents(this.teamTextField.value);
        } catch (err) {
          console.log(err);
          document.getElementById("event-picker__error-text").innerText = "There was an error getting events :((";
        }
        if (events.Error) {
          document.getElementById("event-picker__error-text").innerText = events.Error;
          indicator.close();
          this.teamSubmitButton.querySelector(".mdc-button__icon").hidden = false;
          this.teamSubmitButton.querySelector(".mdc-button__indicator").hidden = true;
          return;
        }
        if (events.length == 0) {
          document.getElementById("event-picker__error-text").innerText = "This team has no events this year";
        }
        this.root.querySelector(".event-list").appendChild(this._createList(events));
      } else {
        document.getElementById("event-picker__error-text").innerText = "Enter a valid team number";
      }
      indicator.close();
      this.teamSubmitButton.querySelector(".mdc-button__icon").hidden = false;
      this.teamSubmitButton.querySelector(".mdc-button__indicator").hidden = true;
    };
  }

  _createList(events) {
    var list = document.createElement("ul");
    list.addEventListener("change", e => {
      this.value = e.target.value;
    });
    list.classList.value = "mdc-list mdc-list--two-line";
    for (var event of events) {
      var listItem = document.createElement("li");
      listItem.classList.add("mdc-list-item")
      var graphic = document.createElement("span");
      graphic.classList.add("mdc-list-item__graphic");
      var text = document.createElement("span");
      text.classList.add("mdc-list-item__text");
      text.innerText = event.name;
      var radio = document.createElement("div");
      radio.classList.add("mdc-radio");
      radio.innerHTML = '<input class="mdc-radio__native-control" type="radio"><div class="mdc-radio__background"><div class="mdc-radio__outer-circle"></div><div class="mdc-radio__inner-circle"></div> </div><div class="mdc-radio__ripple"></div>';
      radio.querySelector("input").value = event.key;
      radio.querySelector("input").name = "event";
      graphic.appendChild(radio);
      listItem.appendChild(graphic);
      listItem.appendChild(text);
      list.appendChild(listItem);
      var ripple = document.createElement("span");
      ripple.classList.add("mdc-list-item__ripple");
      listItem.appendChild(ripple);
    }
    return list;
  }

  confirmEvent() {
    if (this.value) {
      localStorage.clear();
      localStorage.setItem("currentEvent", this.value);
      window.location.reload();
    } else {
      document.getElementById("event-picker__error-text").innerText = "Pick an event first";
    }
  }
}

class CircularProgress {
  constructor(determinate) {
    this.root = document.createElement("div");
    this.root.classList.add("mdc-circular-progress");
    this.root.innerHTML = '<div class="mdc-circular-progress__determinate-container"><svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle class="mdc-circular-progress__determinate-track" cx="12" cy="12" r="8.75" stroke-width="2.5"/><circle class="mdc-circular-progress__determinate-circle" cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="54.978" stroke-width="2.5"/></svg></div><div class="mdc-circular-progress__indeterminate-container"><div class="mdc-circular-progress__spinner-layer"><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/></svg></div><div class="mdc-circular-progress__gap-patch"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2"/></svg></div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right"><svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/></svg></div></div></div>';
    this.root.style.height = "24px";
    this.root.style.width = "24px";
    this._component = new mdc.circularProgress.MDCCircularProgress(this.root);
    this._component.determinate = determinate;
  }
  open() {
    this._component.open();
  }
  close() {
    this._component.close();
  }
  setDeterminate(determinate) {
    this._component.setDeterminate(determinate);
  }
}

async function forceUpdate() {
  if (window.confirm("Do you want to force a Swerve update? No data will be lost, but you will need to be online.")) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const unregisterPromises = registrations.map(registration => registration.unregister());
    const allCaches = await caches.keys();
    const cacheDeletionPromises = allCaches.map(cache => caches.delete(cache));
    await Promise.all([...unregisterPromises, ...cacheDeletionPromises]);
    window.location.reload();
  }
}

async function getTBAData(url) {
  if (window.fetch) {
    var r = await fetch(url, {
      headers:{
        "X-TBA-Auth-Key": TBA_AUTH
      }
    });
    return await r.json();
  } else {
    return await (new Promise((resolve) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("X-TBA-Auth-Key", TBA_AUTH);
      console.log(xhr);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            throw new Error("Error: " + xhr.status);
          }
        }
      };
      xhr.send();
    }));
  }
}