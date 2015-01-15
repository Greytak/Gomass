<?
//-----------------------------------------------------------
//-----------------------------------------------------------
global $grillex, $grilley, $therequest, $array4js;
global $usersarray, $partiesarray, $theparty;
$grillex = 8;  $grilley = 2;
$str_json = file_get_contents('php://input');
$therequest= json_decode($str_json, TRUE);
$array4js= array();
load_users();
auth_user();
list_parties();
if (isset($therequest["command"]))
  call_user_func($therequest["command"]);
//-----------------------------------------------------------
$array4js["partiesarray"]= $partiesarray;
if (isset($theparty)) $array4js["theparty"]= $theparty;
$array4js_json= json_encode($array4js);
header('Content-Type: application/json');
echo $array4js_json;
//-----------------------------------------------------------
//-----------------------------------------------------------
function joinparty() {
  global $theparty, $array4js;
  if ($theparty = json_decode(file_get_contents("parties/".$therequest["selected_party"].".json"), TRUE)) {} else return;
  if (($theparty["player1"]==$_COOKIE["idid"]) or ($theparty["player2"]==$_COOKIE["idid"])) {
    $array4js["current_party"] = $therequest["selected_party"];
    return;
  }
  if (!isset($theparty["player1"])) {
    $theparty["player1"] = $_COOKIE["idid"];
    $array4js["current_party"] = $therequest["selected_party"];
    return;
  }
  if (!isset($theparty["player2"])) {
    $theparty["player2"] = $_COOKIE["idid"];
    $array4js["current_party"] = $therequest["selected_party"];
    return;
  }
}
//-----------------------------------------------------------
function resetgame() {
  unlink("partiesarray.json");
  unlink("usersarray.json");
  array_map('unlink', glob("parties/*.json"));
}
//-----------------------------------------------------------
function createparty() {
  global $theparty, $partiesarray, $usersarray, $array4js;
  $theparty= array();
  $theparty["player1"]= $usersarray[$_COOKIE["idid"]];
  $uniqidparty= uniqid('', true);
  $theparty["id"]= $uniqidparty;
  $theparty_json= json_encode($theparty);
  file_put_contents("parties/".$uniqidparty.".json", $theparty_json);
  $partiesarray[$uniqidparty]["id"]= $uniqidparty;
  $partiesarray[$uniqidparty]["player1"]= $usersarray[$_COOKIE["idid"]];
  $partiesarray_json= json_encode($partiesarray);
  file_put_contents("partiesarray.json", $partiesarray_json);
  $array4js["current_party"] = $uniqidparty;
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
- joindre partie (ID_partie) : load/send partie
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
