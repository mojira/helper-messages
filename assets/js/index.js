// ES6 imports
let { messages, variables, categories } = require('./messages.json');
window.bootstrap = require('bootstrap');
window.$ = window.jQuery = require('jquery');
window.Popper = require('@popperjs/core');

// Available projects
const projects = ["mc", "mcpe", "mcd", "mcl", "mclg", "bds", "realms", "web"];
for (const project of projects) {
  $("#projectDropdownMenu").append($(`<li><a class="dropdown-item ${project}-dropdown" href="#${project.toUpperCase()}">${project.toUpperCase()}</a></li>`));
}

// Timeout for popper copy tooltip
var clicktimeout;
// Currently selected project
var project = "mc";
// Currently selected message ID
var currentMessageId = "";

// map for dropdown values and their corresponding messages
var dropdownMap = new Map();

// map for category keys and their corresponding names
var categoryMap = new Map();

for (const {category, name} of categories) {
  categoryMap.set(category, name);
}

/**
 * Main app entry point
 */
$(document).ready(function () {
  // Detect project identifier in URL
  const url = window.location.href;
  if (!url.includes('#')) {
    window.location.replace(url + '#MC');
  } else {
    const id = url.substring(url.lastIndexOf('#') + 1).toLowerCase();
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
    $("." + projects[i] + "-dropdown").on("click", function () {
      if (project != projects[i]) {
        project = projects[i];
        updateDisplay();
      }
    });
  }

  // Register global Ctrl + C event
  $(document).on("keyup", e => {
    if (e.ctrlKey && e.code === "KeyC" && window.getSelection().toString().length === 0) {
      $("#copybutton").trigger("click");
    }
  });

  // Update messages in dropdown
  updateDisplay();
});

/**
 * Fired whenever the copy button is pressed
 */
$("#copybutton").on("click", function () {
  // get selected message id
  const id = $("select").val();
  if (id == "" || !dropdownMap.has(id)) {
    return;
  }

  const message = dropdownMap.get(id);
  let messageBody = getStringValue(message.message);
  // Replace predefined variables in the message body
  for (const variable in variables) {
    for (const { project: expected, value } of variables[variable]) {
      if (isExpectedProject(expected, project)) {
        messageBody = messageBody.replace(new RegExp(`%${variable}%`, 'g'), getStringValue(value));
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
$("select").on("change", function () {
  // Get dropdown value
  currentMessageId = $(this).val();
  // No message selected?
  if (currentMessageId == "" || !dropdownMap.has(currentMessageId)) {
    updateDisplayedMessage(undefined);
  } else {
    updateDisplayedMessage(dropdownMap.get(currentMessageId));
  }
});

/**
 * Updates information for the currently displayed message. Message may be `undefined`
 * if no message is currently selected.
 */
function updateDisplayedMessage(message) {
  if (!message) {
    $(".stdtext").html('<p class="text-muted" id="msginfo">Please select a message.</p>');
    $("#copybutton").attr("disabled", "");
    return;
  }

  // Does the message require extra filling info?
  if (message.fillname.length >= 1) {
    $(".stdtext").html('<input class="form-control" type="text" placeholder="' + message.fillname[0] + '" id="fill">');
    // Register Enter event
    $("#fill").on("keyup", e => {
      if (e.code === "Enter") {
        $("#copybutton").click();
      }
    });
  } else {
    $(".stdtext").html('<p class="text-muted" id="msginfo">This message doesn\'t require any extra info.</p>');
  }

  // Enable copy button
  $("#copybutton").removeAttr("disabled");
}

/**
 * Check if the message is hidden or not.
 * @param {{hidden: boolean | undefined}} message The message to be checked.
 */
function isHidden(message) {
  return message.hidden !== undefined && message.hidden;
}

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
 * Get a string value from `messages.json`.
 * @param {string | { en: string, [key: string]: string }} val The value in `messages.json`.
 */
function getStringValue(val) {
  if (typeof val === 'string') {
    return val
  } else {
    return val.en
  }
}

/**
 * Updates messages in the message dropdown according to the currently selected project
 */
function updateDisplay() {
  let text = '<option value="">Select a message...</option>';
  let selectedMessage = undefined;
  // Create a map for categorized messages
  let messageMap = new Map();
  // Clear dropdown map
  dropdownMap = new Map();
  // Set project dropdown title
  $("#dropdownMenuButton").text("Project: " + project.toUpperCase());
  // Loop through message objects
  for (const messageId in messages) {
    // Select array in array
    const messageArray = messages[messageId];
    for (const message of messageArray) {
      // Only get messages for current project
      if (!isHidden(message) && isExpectedProject(message.project, project)) {
        if (messageId == currentMessageId) {
          selectedMessage = message;
        }
        let catText = messageMap.get(message.category);
        const option = `<option value="${messageId}"${messageId == currentMessageId ? ' selected': ''}>` + message.name + '</option>';
        // Append option to category
        catText = !catText ? option : catText + option;
        messageMap.set(message.category, catText);
        // Map message to dropdown ID for later recognition
        dropdownMap.set(messageId, message);
      }
    }
  }

  // Sort categorized messages alphabetically
  messageMap = new Map([...messageMap].sort());

  // Format dropdown menu labels
  for (const [category, options] of messageMap.entries()) {
    text += `<optgroup label="${categoryMap.get(category) || category}">${options}</optgroup>`
  }

  // Update dropdown HTML
  $(".form-select").html(text);

  updateDisplayedMessage(selectedMessage);
}

/**
 * Calculate margin for vertical center
 */
function getMargin() {
  const height = $(".main").css("height");
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
 * Copies text to the user's clipboard.
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 * Note: This is an asynchronous call, which can fail without notifying the caller of the failure.
 * @param {string} text
 */
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text);
}
