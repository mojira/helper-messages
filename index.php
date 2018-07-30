<!DOCTYPE html>
<html lang="en">
<head>
  <title>Mojira Helper Messages</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
  <link rel="stylesheet" href="assets/style.css"/>
  <?php
  $conn = new mysqli("localhost", "USERNAME", "PASSWORD", "TABLE");
  $conn->set_charset('utf8mb4');

  if ($conn->connect_error) {
      header("Location: /mojira/oops/");
      die();
  }

  $sql = "SELECT * FROM messages";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
		$s = explode(",", $row["project"]);
		if(count($s) >= 2) {
			for($i = 0; $i < count($s); $i++) {
				$res[] = array("shortname"=>$row["shortname"], "project"=>$s[$i], "name"=>$row["name"], "message"=>$row["message"], "needfill"=>$row["needfill"], "fillname"=>$row["fillname"]);
			}
		} else {
			$res[] = array("shortname"=>$row["shortname"], "project"=>$row["project"], "name"=>$row["name"], "message"=>$row["message"], "needfill"=>$row["needfill"], "fillname"=>$row["fillname"]);
		}
    }
  } else {
    header("Location: /mojira/oops/");
    die();
  }

  $html = "<script>var msg = [];\n\n";

  for ($i = 0; $i < count($res); $i++) {
    $html = $html . "msg.push({";
    foreach($res[$i] as $key => $value) {
      $html = $html . $key . ": \"" . $conn->escape_string($value) . "\",\n";
    }
    $html = substr($html, 0, strlen($html) - 2);
    $html = $html . "});\n\n";
  }

  echo $html . "</script>";

   ?>
</head>
<body>
  <div class="background container-fluid">
    <div class="main">
      <h2 class="display-4">Mojira Helper Message Web Application</h2>
      <div class="selector">
        <select class="custom-select mr-sm-2">
          <option value="0" selected>Select a message</option>
        </select>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Project: MC
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item mc-dropdown" href="#MC">MC</a>
			<a class="dropdown-item mcl-dropdown" href="#MCL">MCL</a>
            <a class="dropdown-item mcpe-dropdown" href="#MCPE">MCPE</a>
            <a class="dropdown-item mcapi-dropdown" href="#MCAPI">MCAPI</a>
          </div>
        </div>
      </div>
      <div class="inputarea">
        <div class="stdtext">
          <p class="text-muted" id="msginfo">Please select a message.</p>
        </div>
      </div>
      <button type="button" class="btn btn-outline-secondary" id="copybutton" data-toggle="tooltip" data-placement="top" title="Copied!" disabled>Copy</button>
      <div class="footer">
        <small class="text-muted">Made by <a href="https://bugs.mojang.com/secure/ViewProfile.jspa?name=Bemoty" target="_blank">Bemoty</a></small>
      </div>
    </div>
  </div>
  <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <script src="assets/custom.js"></script>
</body>
</html>
