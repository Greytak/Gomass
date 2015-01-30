/* 
 *Plateau object
*/
function Plateau(largeur, hauteur, posx, posy) {
  this.largeur = largeur;
  this.hauteur = hauteur;
  this.cases = new Array();
  // create all cases and cartes
  this.create = function() {
    id = 0;
    for (x = 0; x < this.largeur; x++) {
      for (y = 0; y < this.hauteur; y++) {
        var caseInstance = new Case(x, y, posx, posy, id);
        this.cases.push(caseInstance);
        document.body.appendChild(caseInstance);
        id++;
      }
    }
  };
  // display all cartes
  this.display = function() {
    for (i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].draw();
    }
  };
  // add a carte to plateau
  this.add = function(caseid, img, cout, att, def, titre, desc) {
    this.cases[caseid].carte.add(img, cout, att, def, titre, desc);
    this.cases[caseid].draw();
  };
  // remove a carte to plateau
  this.remove = function(caseid) {
    this.cases[caseid].carte.remove();
    this.cases[caseid].draw();
  };
  // clear all cartes
  this.clear = function() {
    for (i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].carte.remove();
      this.cases[i].draw();
    }
  };
  this.toString = function() {
    plateauString = "Plateau : " + "largeur : " + this.largeur + " - " + "hauteur : " + this.hauteur + "\n";
    if (this.cases.length > 0) {
      for (i = 0; i < (this.largeur*this.hauteur); i++) {
        plateauString = plateauString + this.cases[i].toString() + "\n";
      }
    }
    return plateauString;
  };
}

/* 
 * Global used to store carte begin movement
*/
var mouvementCarte = new Array();
/* 
 * Case inherit from Canvas
 * See createAllCases() function.
*/
function Case(casex, casey, posx, posy, id) {
  canvasCase = document.createElement('canvas');
  // new properties
  canvasCase.x = casex;
  canvasCase.y = casex;
  canvasCase.name = "case" + casex + "-" + casex;
  canvasCase.carte = new Carte(id, casex, casey);
  // overwrite canvas properties
  canvasCase.ctx = canvasCase.getContext("2d");
  canvasCase.id = id;
  canvasCase.width = 100;
  canvasCase.height = 150;
  canvasCase.style.zIndex = 8;
  canvasCase.style.position = "absolute";
  canvasCase.style.left = casex * canvasCase.width + posx;
  canvasCase.style.top = casey * canvasCase.height + posy;
  canvasCase.style.border = "1px solid grey";
  // overwrite canvas on click method
  canvasCase.onclick = function() {
    if (this.carte.visible) {
      carteToPush = this.carte.clone();
      mouvementCarte.push(carteToPush);
      this.carte.remove();
      this.draw();
      console.log("Let's move ! " + "\n" + "Array length : " + mouvementCarte.length + "\n" + "case.id : " + this.id + "\n" + "carte.id : " + this.carte.id);
    }
    else if (!this.carte.visible && mouvementCarte.length > 0) {
      this.carte = mouvementCarte.pop();
      srcx = this.carte.x;
      srcy = this.carte.y;
      this.carte.visible = true;
      this.carte.move(this.x, this.y);
      this.draw();
      if (mouvementCarte.length == 0) {
        console.log("Finish move ! " + "\n" + "Array length : " + mouvementCarte.length + "\n" + "case.id : " + this.id + "\n" + "carte.id : " + this.carte.id);
        console.log(this.toString());console.log(this.carte.toString());
        therequest = "command=gomove&desx="+this.x+"&desy="+this.y+"&srcx="+srcx+"&srcy="+srcy;
        goajaxrequete(therequest);
      }
    }
    else {
      console.log("Impossible to move ! " + "\n" + "Array length : " + mouvementCarte.length + "\n" + "case.id : " + this.id + "\n" + "carte.id : " + this.carte.id);
    }
  };
  canvasCase.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };
  canvasCase.draw = function() {
    carreCote = 12;
    // don't draw if no carte
    if (this.carte.visible) {
      this.ctx.beginPath();
      this.ctx.fillText(this.carte.cout, 0, carreCote-2);
      this.ctx.fillText(this.carte.titre, carreCote+2, carreCote-2);
      this.ctx.fillText(this.carte.defense, this.width-carreCote, this.height-2);
      this.ctx.fillText(this.carte.attaque, 0, this.height-2);
      this.ctx.fillText(this.carte.description, carreCote/2, this.height-(carreCote+2));
      if (this.carte.imagej.src != "") {
        this.ctx.drawImage(this.carte.imagej, carreCote+2, carreCote+2, this.width-2*(carreCote+2), this.height-3*(carreCote+2));
        this.ctx.rect(0, 0, carreCote, carreCote);//haut gauche
        this.ctx.rect(this.width-carreCote, this.height-carreCote, carreCote, carreCote);//bas droite
        this.ctx.rect(0, this.height-carreCote, carreCote, carreCote);// bas gauche
      }
      this.ctx.stroke();
    }
    else {
      this.clear();
    }
  };
  canvasCase.toString = function() {
    caseString = "Case :" + "id : " + this.id + " - " + "name : " + this.name + " - " + "x : " + this.x + " - " + "y : " + this.y + " - " + "ctx : " + this.ctx;
    caseString = caseString + " - " + "width : " + this.width + " - " + "height : " + this.height + " - " + "zIndex : " + this.style.zIndex;
    return caseString + "\n" + this.carte.toString();
  };
  return canvasCase;
}

/*
 * Carte prototype.
*/
function Carte(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.imagej = new Image();
  this.add = function(img, cout, att, def, titre, desc) {
    this.visible = true;
    this.imagej.src = img;
    this.cout = cout;
    this.attaque = att;
    this.defense = def;
    this.titre = titre;
    this.description = desc;
  };
  this.remove = function() {
    this.id = -1;
    this.x = -1;
    this.y = -1;
    this.visible = false;
    this.imagej = new Image();
    this.cout = "";
    this.attaque = "";
    this.defense = "";
    this.titre = "";
    this.description = "";
  };
  this.move = function(x, y) {
    this.x = x;
    this.y = y;
  }
  this.clone = function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
  }
  this.toString = function() {
    return "Carte : " + "id : " + this.id + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description + " - " + "image: " + this.imagej.src  + " - " + "visible: " + this.visible;
  };
}
Carte.prototype = {
  visible : false,
  cout : "",
  attaque : "",
  defense : "",
  titre : "",
  description : "",
};

function goajaxrequete(req) {
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState==4 && xmlhttp.status == 200 || xmlhttp.status == 304) {
      //response=xmlhttp.responseText;
      processajaxresponse(xmlhttp.responseText);
    }
  }
  // requete treatment
  xmlhttp.open("POST", "http://localhost:8080/?"+req, true);
  //xmlhttp.setRequestHeader("Content-type", "application/html");//not to localhost
  xmlhttp.send();
}
