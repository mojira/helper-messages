// ES6 imports
let { messages, variables } = require('./messages.json');
window.bootstrap = require('bootstrap');
window.$ = window.jQuery = require('jquery');
window.Popper = require('popper.js');

// Available projects
const projects = ["mc", "mcd", "mcl", "mcpe", "mcapi", "mce", "bds"];
for (const project of projects) {
  $("#projectDropdownMenu").append($(`<a class="dropdown-item ${project}-dropdown" href="#${project.toUpperCase()}">${project.toUpperCase()}</a>`));
}

// Timeout for popper copy tooltip
var clicktimeout;
// Currently selected project
var project = "mc";
// Currently selected message code
var code = "-1";

// map for dropdown values and their corresponding messages
var dropdownMap = new Map();

/**
 * Main app entry point
 */
$(document).ready(function () {
  // Detect project identifier in URL
  const url = window.location.href;
  if (!url.includes('#')) {
    window.location.replace(url + '#MC');
  } else {
    var id = url.substring(url.lastIndexOf('#') + 1).toLowerCase();
    if (projects.includes(id)) {
      project = id;
    } else {
      window.location.replace(url.substring(0, url.lastIndexOf('#')) + '#MC');
    }
  }

  // Sort messages by shown name
  const sorted = {};
  Object.keys(messages).sort().forEach(key => { sorted[key] = messages[key]; });
  messages = sorted;

  // Initialize popper tooltips
  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'manual'
  });
  $("#copybutton").tooltip('disable');

  // JavaScript vertical center
  $(".main").css("margin-top", getMargin() + "px");

  // Declare dropdown onClick events for each project in the dropdown list
  for (let i in projects) {
    $("." + projects[i] + "-dropdown").click(function () {
      if (project != projects[i]) {
        project = projects[i];
        updateDisplay();
      }
    });
  }

  // Update messages in dropdown
  updateDisplay();
});

/**
 * Fired whenever the copy button is pressed
 */
$("#copybutton").click(function () {
  // get selected message id
  var id = $("select").val();
  if (id == "-1" || !dropdownMap.has(id)) {
    // impossibru, copy button isn't enabled when there is no message selected
    alert('you dirty hacker');
    return;
  }

  const message = dropdownMap.get(id);
  let messageBody = message.message.replace(/\\n/g, '\n');
  // Replace predefined variables in the message body
  for (const variable in variables) {
    for (const { project: expected, value } of variables[variable]) {
      if (isExpectedProject(expected, project)) {
        messageBody = messageBody.replace(new RegExp(`%${variable}%`, 'g'), value);
      }
    }
  }
  // TODO: Allow more than one variable
  if (message.fillname.length >= 1) {
    if (!$("#fill").val()) {
      wiggle($("#fill"));
      return;
    } else {
      copyTextToClipboard(messageBody.replace(/%s%/g, $("#fill").val()));
    }
  } else {
    copyTextToClipboard(messageBody);
  }

  // Show tooltip, set timeout
  clearTimeout(clicktimeout);
  $(this).tooltip('enable');
  $(this).tooltip('show');
  clicktimeout = setTimeout(function () {
    $("#copybutton").tooltip('hide');
    $("#copybutton").tooltip('disable');
  }, 1000);
});

/**
 * Fired whenever the selected message is changed
 */
$("select").change(function () {
  // Get dropdown value
  code = $(this).val();
  // No message selected?
  if (code == "-1" || !dropdownMap.has(code)) {
    $(".stdtext").html('<p class="text-muted" id="msginfo">Please select a message.</p>');
    $("#copybutton").attr("disabled", "");
    return;
  }

  // Does the message require extra filling info?
  const message = dropdownMap.get(code);
  if (message.fillname.length >= 1) {
    $(".stdtext").html('<input class="form-control" type="text" placeholder="' + message.fillname[0] + '" id="fill">');
  } else {
    $(".stdtext").html('<p class="text-muted" id="msginfo">This message doesn\'t require any extra info.</p>');
  }

  // Enable copy button
  $("#copybutton").removeAttr("disabled");
});

/**
 * Check if the current project matches the expected projects.
 * @param {string | string[]} expected The expected projects.
 * @param {string} current The current project.
 */
function isExpectedProject(expected, current) {
  if (typeof expected === 'string') {
    return expected === current;
  } else {
    return expected.includes(current);
  }
}

/**
 * Updates messages in the message dropdown according to the currently selected project
 */
function updateDisplay() {
  var text = '<option value="-1">Select a message...</option>';
  var selected = false;
  // Clear dropdown map
  dropdownMap = new Map();
  // Set project dropdown title
  $("#dropdownMenuButton").text("Project: " + project.toUpperCase());
  // Loop through message objects
  for (let i in messages) {
    // Select array in array
    var messageArray = messages[i];
    for (let j in messageArray) {
      // Only get messages for current project
      if (isExpectedProject(messageArray[j].project, project)) {
        if (i == code) {
          selected = true;
        }
        text += `<option value="${i}" ${i == code ? 'selected': ''}>` + messageArray[j].name + '</option>';
        // Map message to dropdown ID for later recognition
        dropdownMap.set(i, messageArray[j]);
      }
    }
  }

  // Update dropdown HTML
  $(".custom-select").html(text);
  if (!selected) {
    // Set default panel body
    $(".stdtext").html('<p class="text-muted" id="msginfo">Please select a message.</p>');
    // Disable copy button (as no message is selected yet)
    $("#copybutton").attr("disabled", "");
  }
}

/**
 * Calculate margin for vertical center
 */
function getMargin() {
  var height = $(".main").css("height");
  return (height.substring(0, height.length - 2) / 2) * -1;
}

/**
 * Wiggles an HTML element by adding a CSS wiggle animation to it
 * @param {HTMLElement} htmlobj the HTML element to be wiggled
 */
function wiggle(htmlobj) {
  $(htmlobj).addClass("shake");
  setTimeout(function () {
    $(htmlobj).removeClass("shake");
  }, 820);
}

/**
 * Copies text to the keyboard of a user; s/o to Dean Taylor!
 * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 * @param {string} text 
 */
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var s = document.execCommand('copy');
    document.body.removeChild(textArea);
    return s;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}
