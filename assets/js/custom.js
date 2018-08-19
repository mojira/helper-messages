var clicktimeout;
var project = "mc";

const projects = ["mc", "mcl", "mcpe", "mcapi"];

$(document).ready(function() {
  var url = window.location.href;
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
  msg.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'manual'
  });
  $("#copybutton").tooltip('disable');
  $(".main").css("margin-top", getMargin() + "px");
  updateDisplay();
});

// Declare dropdown onClick events for each project in the dropdown list
for (let i in projects) {
  $("." + projects[i] + "-dropdown").click(function() {
    if (project != projects[i]) {
      project = projects[i];
      updateDisplay();
    }
  });
}

$("#copybutton").click(function() {
  var id = $("select").val();
  if (id == "-1") {
    // just no
    return;
  }
  var m = msg[id].message.replace(/\\n/g, '\n');

  if (msg[id].needfill == "1") {
    if (!$("#fill").val()) {
      wiggle($("#fill"));
      return;
    } else {
      copyTextToClipboard(m.replace("%s%", $("#fill").val()));
    }
  } else {
    copyTextToClipboard(m);
  }

  clearTimeout(clicktimeout);
  $(this).tooltip('enable');
  $(this).tooltip('show');
  clicktimeout = setTimeout(function() {
    $("#copybutton").tooltip('hide');
    $("#copybutton").tooltip('disable');
  }, 1000);
});

$("select").change(function() {
  var code = $(this).val();
  if (code == "-1") {
    $(".stdtext").html('<p class="text-muted" id="msginfo">Please select a message.</p>');
    $("#copybutton").attr("disabled", "");
    return;
  }

  if (msg[code].needfill == "1") {
    $(".stdtext").html('<input class="form-control" type="text" placeholder="' + msg[code].fillname + '" id="fill">');
  } else {
    $(".stdtext").html('<p class="text-muted" id="msginfo">This message doesn\'t require any extra info.</p>');
  }

  $("#copybutton").removeAttr("disabled");
});

function updateDisplay() {
  var text = "";
  text += '<option value="-1" selected>Select a message...</option>';
  for (let i in projects) {
    if (projects[i] === project.toLowerCase()) {
      $("#dropdownMenuButton").text("Project: " + projects[i].toUpperCase());
      for (let j in msg) {
        if (msg[j].project === projects[i]) {
          text += '<option value="' + j + '">' + msg[j].name + '</option>';
        }
      }
    }
  }
  $(".stdtext").html('<p class="text-muted" id="msginfo">Please select a message.</p>');
  $(".custom-select").html(text);
  $("#copybutton").attr("disabled", "");
}

function getMargin() {
  var height = $(".main").css("height");
  return (height.substring(0, height.length - 2) / 2) * -1;
}

function wiggle(textbox) {
  $(textbox).addClass("shake");
  setTimeout(function() {
    $(textbox).removeClass("shake");
  }, 820);
}

// thanks to Dean Taylor! https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
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
