<?php
//-----------------------------------------------------------
global $grillex, $grilley, $onearray, $therequete;
$grillex = 8;  $grilley = 4;
//-----------------------------------------------------------
$str_json = file_get_contents('php://input');
$therequete= json_decode($str_json, TRUE);
//-----------------------------------------------------------
if (isset($therequete["command"]))
  if ($therequete["command"]=="resetgame") {
    unlink("onearray.json");
    unset($therequete["command"]);
  }
//-----------------------------------------------------------
load_game();
auth_user();
//-----------------------------------------------------------
if ($onearray["yourturn"]==1)
  if (isset($therequete["command"]))
    call_user_func($therequete["command"]);
//-----------------------------------------------------------
$onearray_json= json_encode($onearray);
file_put_contents("onearray.json", $onearray_json);
header('Content-Type: application/json');
echo $onearray_json;
//-----------------------------------------------------------
//-----------------------------------------------------------
function auth_user() {
  global $onearray;
  if (isset($_COOKIE["idid"]))
    if (isset($onearray["users"][$_COOKIE["idid"]])) {
      if ($_COOKIE["idid"]==$onearray["turnid"])
        $onearray["yourturn"]= 1;
      else
        $onearray["yourturn"]= 0;
      return;
    }
  //file_put_contents ( "cookie.log" , $_COOKIE["idid"]);
  if ($onearray["users"].length>1) unset($onearray["users"]);
  $uniqidcook= uniqid('', true);
  $onearray["users"][$uniqidcook]= "date";
  if (!isset($onearray["turnid"])) {
    $onearray["turnid"]= $uniqidcook;
    $onearray["yourturn"]= 1;
  } else
    $onearray["yourturn"]= 0;
  setcookie("idid", $uniqidcook);
}
//-----------------------------------------------------------
function load_game() {
  global $onearray, $grillex, $grilley;
  if ($onearray = json_decode(file_get_contents("onearray.json"), TRUE)) {
  } else {
    for ($i = 0; $i < $grillex; $i++) {
      for ($j = 0; $j < $grilley; $j++) {
        $grille[$i][$j]['carte']= 0;
      }
    }
    $grille[0][0]['carte']= 1;
    $grille[1][1]['carte']= 1;
    $grille[2][1]['carte']= 1;
    $onearray = array(1=>'case11', 2=>'case12', 3=>'case13', 'd' => 4, 'grille' => $grille);
  }
}
//-----------------------------------------------------------
function gomove() {
  global $onearray, $therequete;
  if (isset($therequete["srcx"]) && isset($therequete["srcy"]) && isset($therequete["desx"]) && isset($therequete["desy"])) {
    $onearray['grille'][intval($therequete["srcx"])][intval($therequete["srcy"])]['carte']= 0;
    $onearray['grille'][intval($therequete["desx"])][intval($therequete["desy"])]['carte']= 1;
    //$onearray['command']='moveok';
  }
}
//-----------------------------------------------------------
function endturn() {
  global $onearray;//, $therequete;
  $onearray["yourturn"]= 0;
  foreach ($onearray["users"] as $key => $value)
    if ($key!=$_COOKIE["idid"]) $onearray["turnid"]= $key;
  //$onearray['command']='endturnok';
}
//-----------------------------------------------------------
?>
