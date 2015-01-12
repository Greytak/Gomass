<?
//-----------------------------------------------------------
//-----------------------------------------------------------
global $grillex, $grilley, $therequete;
global $usersarray, $partiesarray, $theparty;
$grillex = 8;  $grilley = 2;
$str_json = file_get_contents('php://input');
$therequete= json_decode($str_json, TRUE);
load_users();
auth_user();
list_parties();
if (isset($therequete["command"]))
  call_user_func($therequete["command"]);
//-----------------------------------------------------------
$onearray= array();
$onearray["partiesarray"]= $partiesarray;
$onearray_json= json_encode($onearray);
file_put_contents("onearray.json", $onearray_json);
header('Content-Type: application/json');
echo $onearray_json;
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
//-----------------------------------------------------------
function createparty() {
  global $theparty;
  $theparty= array();
  $theparty["player1"]= $usersarray[$_COOKIE["idid"]]
  $uniqidparty= uniqid('', true);
  $theparty["id"]= $uniqidparty;
  $theparty_json= json_encode($theparty);
  file_put_contents("parties/"$uniqidparty.".json", $theparty_json);
}
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
