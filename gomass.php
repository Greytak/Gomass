<?
//-----------------------------------------------------------
//-----------------------------------------------------------
global $grillex, $grilley, $therequest, $array4js;
global $usersarray, $partiesarray, $theparty, $debug;
$grillex = 8;  $grilley = 2;  $debug = '';
$str_json = file_get_contents('php://input');
$therequest= json_decode($str_json, TRUE);
$array4js= array();
load_users();
auth_user();
list_parties();
if (isset($therequest["command"])) if ($therequest["command"]!='')
  call_user_func($therequest["command"]);
//-----------------------------------------------------------
$partiesarray_json= json_encode($partiesarray);
file_put_contents("partiesarray.json", $partiesarray_json);
$array4js["partiesarray"]= $partiesarray;
//-----------------------------------------------------------
if (isset($theparty)) {
  $array4js["theparty"]= $theparty;
  $theparty_json= json_encode($theparty);
  file_put_contents("parties/".$theparty["id"].".json", $theparty_json);
}
//-----------------------------------------------------------
//if ($therequest["command"]=='joinparty')
//  file_put_contents("debug", $debug);//$array4js["debug"]= $debug;
//-----------------------------------------------------------
$array4js_json= json_encode($array4js);
header('Content-Type: application/json');
echo $array4js_json;
//-----------------------------------------------------------
//-----------------------------------------------------------
function endturn() {
  loadparty();
  global $theparty, $array4js;
  $array4js["yourturn"] = 0;
  if ($theparty["player1"] == $_COOKIE["idid"])
    $theparty["turnid"]= $theparty["player2"];
  else
    $theparty["turnid"]= $theparty["player1"];
}
//-----------------------------------------------------------
function gomove() {
  loadparty();
  global $theparty, $array4js, $therequest;
  if (isset($therequest["srcx"]) && isset($therequest["srcy"]) && isset($therequest["desx"]) && isset($therequest["desy"])) {
    $theparty['grille'][intval($therequest["srcx"])][intval($therequest["srcy"])]['carte']= 0;
    $theparty['grille'][intval($therequest["desx"])][intval($therequest["desy"])]['carte']= 1;
  }
}
//-----------------------------------------------------------
function joinparty() {
  global $theparty, $array4js, $therequest, $partiesarray, $debug;
  //$debug.= "-joinparty-";
  loadparty();
  $array4js["yourturn"] = 0;
  if (!isset($theparty["player1"])) {
    $theparty["player1"] = $_COOKIE["idid"];
    $partiesarray[$theparty["id"]]["player1"]= $_COOKIE["idid"];
    $array4js["current_party"] = $therequest["selected_party"];
    //$debug.= "player1";
    return;
  }
  //$debug.= '-'.$theparty["player1"].'-';
  if (!isset($theparty["player2"])) {
    $theparty["player2"] = $_COOKIE["idid"];
    $partiesarray[$theparty["id"]]["player2"]= $_COOKIE["idid"];
    $array4js["current_party"] = $therequest["selected_party"];
    //$debug.= "player2";
    return;
  }
  //$debug.= '-'.$theparty["player2"].'-';
}
//-----------------------------------------------------------
function loadparty() {
  global $theparty, $array4js, $therequest, $debug;
  if ($theparty = json_decode(file_get_contents("parties/".$therequest["selected_party"].".json"), TRUE)) {} else return;
  //$debug.= '+'.$theparty["player1"].'+'.$theparty["player2"].'+';
  if (($theparty["player1"]==$_COOKIE["idid"]) or ($theparty["player2"]==$_COOKIE["idid"])) {
    $array4js["current_party"] = $therequest["selected_party"];    
    if ($theparty["turnid"] == $_COOKIE["idid"])
      $array4js["yourturn"] = 1;
    else
      $array4js["yourturn"] = 0;
    return;
  }
}
//-----------------------------------------------------------
function resetgame() {
  unlink("partiesarray.json");
  unlink("usersarray.json");
  array_map('unlink', glob("parties/*.json"));
  //use GLOBALS otherwise partiesarray is not unset outside of this function
  unset($GLOBALS['partiesarray']); 
}
//-----------------------------------------------------------
function quitparty() {
  global $therequest;
  unlink("parties/".$therequest["selected_party"].".json");
  //use GLOBALS otherwise partiesarray is not unset outside of this function
  unset($GLOBALS['partiesarray'][$therequest["selected_party"]]);
}
//-----------------------------------------------------------
function createparty() {
  global $theparty, $partiesarray, $usersarray, $array4js;
  global $grillex, $grilley;
  $theparty= array();
  $uniqidparty= uniqid('', true);
  $theparty["id"]= $uniqidparty;
  $theparty["player1"]= $_COOKIE["idid"];
  $theparty["turnid"]= $_COOKIE["idid"];
  for ($i = 0; $i < $grillex; $i++) {
    for ($j = 0; $j < $grilley; $j++) {
      $theparty['grille'][$i][$j]['carte']= 0;
    }
  }
  $theparty['grille'][0][0]['carte']= 1;
  $theparty['grille'][1][1]['carte']= 1;
  $theparty['grille'][2][1]['carte']= 1;  
  //$theparty_json= json_encode($theparty);
  //file_put_contents("parties/".$uniqidparty.".json", $theparty_json);
  $partiesarray[$uniqidparty]["id"]= $uniqidparty;
  $partiesarray[$uniqidparty]["player1"]= $_COOKIE["idid"];
  $array4js["current_party"] = $uniqidparty;
  $array4js["yourturn"] = 1;
}
//-----------------------------------------------------------
//-----------------------------------------------------------
function list_parties() {
  global $partiesarray;
  if ($partiesarray = json_decode(file_get_contents("partiesarray.json"), TRUE)) {
  } else {
      $partiesarray = array();
    }
}
//-----------------------------------------------------------
function auth_user() {
  global $usersarray;
  if (isset($_COOKIE["idid"]))
  if (isset($usersarray[$_COOKIE["idid"]])) {
    //refresh date ?
    return;
  }
  //file_put_contents ( "cookie.log" , $_COOKIE["idid"]);
  $uniqidcook= uniqid('', true);
  $usersarray[$uniqidcook]= "date";
  setcookie("idid", $uniqidcook);
  $usersarray_json= json_encode($usersarray);
  file_put_contents("usersarray.json", $usersarray_json);
}
//-----------------------------------------------------------
function load_users() {
  global $usersarray;
  if ($usersarray = json_decode(file_get_contents("usersarray.json"), TRUE)) {
  } else {
      $usersarray = array();
    }
}
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------

/*
Gomass :
--------------------------------------------
setTimeout ("goajaxrequete()", 750);
click destination => command move
click end turn => command endturn
click reset => command resetgame

--------------------------------------------
liste des parties -> joindre, créer partie -> créer

--------------------------------------------
Users : liste d'IDs
Parties : ID_partie, ID_joueur1, ID_joueur2
Partie : ID_partie, ID_joueur1, ID_joueur2, grille

--------------------------------------------
- load_users "usersarray.json"
- authenticate user
- appel vide : liste parties
- joindre/vérif partie (ID_partie) : load/send partie
- action partie (ID_partie, src, dest) : load partie , action, save partie, send partie
- créer partie : créer partie, load/send partie

--------------------------------------------
authenticate user :
  foreach Users :
    if ID_joueur==ID_cookie OK else
      setcookie
      save_Users

liste parties : ID_joueur1==null OR ID_joueur1==ID_cookie OR ID_joueur2==null OR ID_joueur2==ID_cookie

load partie(ID_partie) :
  foreach partie :
    if ID_partie==ID_partie if ID_joueur1==ID_cookie OR ID_joueur2==ID_cookie
      jsondecode

save partie : jsonencode

send partie : jsonencode
--------------------------------------------
*/
?>
