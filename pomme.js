/* Plateau object
*/
function Plateau(largeur, hauteur) {
  this.largeur = largeur;
  this.hauteur = hauteur;
  this.cases = new Array();
  this.create = function() {
    id = 0;
    for (x = 0; x < this.largeur; x++) {
      for (y = 0; y < this.hauteur; y++) {
        var caseInstance = new Case(x, y, id);
        this.cases.push(caseInstance);
        document.body.appendChild(caseInstance);
        id++;
      }
    }
  };
  this.display = function() {
    for (i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].draw();
    }
  };
  this.add = function(caseid, img, cout, att, def, titre, desc) {
    this.cases[caseid].carte.add(img, cout, att, def, titre, desc);
    this.cases[caseid].draw();
  };
  this.remove = function(caseid) {
    this.cases[caseid].carte.remove();
    this.cases[caseid].draw();
  };
  this.clear = function() {
    for (i = 0; i < (this.largeur*this.hauteur); i++) {
      this.cases[i].carte.remove();
      this.cases[i].draw();
    }
  };
  this.toString = function() {
    plateauString = "Plateau : " + "largeur : " + this.largeur + " - " + "hauteur : " + this.hauteur + "\n";
    for (i = 0; i < (this.largeur*this.hauteur); i++) {
      plateauString = plateauString + this.cases[i].toString() + "\n";
    }
    return plateauString;
  };
}

/* Same as CaseTst but with a new canvas.
 * See createAllCases() function.
*/
var mouvementCarte = new Array();
function Case(x, y, id) {
  canvasCase = document.createElement('canvas');
  // new properties
  canvasCase.x = x;
  canvasCase.y = y;
  canvasCase.name = "case" + x + "-" + y;
  canvasCase.carte = new Carte(id);
  // overwrite canvas properties
  canvasCase.ctx = canvasCase.getContext("2d");
  canvasCase.id = id;
  canvasCase.width = 100;
  canvasCase.height = 150;
  canvasCase.style.zIndex = 8;
  canvasCase.style.position = "absolute";
  canvasCase.style.left = x * canvasCase.width;
  canvasCase.style.top = y * canvasCase.height;
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
    else if (mouvementCarte.length != 0) {
      this.carte = mouvementCarte.pop();
      this.carte.visible = true;
      this.draw();
      console.log("Finish move ! " + "\n" + "Array length : " + mouvementCarte.length + "\n" + "case.id : " + this.id + "\n" + "carte.id : " + this.carte.id);
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
    return caseString + "\n" + this.carte.toString();
  };
  return canvasCase;
}
/* Constructor for Emplacement.
 * Emplacement inherit from Canvas class.
 * See createAllEmplacements() function.
*/
function newEmplacement(x, y) {
  Emplacement = document.createElement('canvas');
  Emplacement.x = x;
  Emplacement.y = y;
  Emplacement.carte = new Carte(x + y);
  Emplacement.isCarte = false;
  Emplacement.ctx = Emplacement.getContext("2d");
  Emplacement.id = "case" + this.x + "-" + this.y;
  Emplacement.width = 100;
  Emplacement.height = 150;
  Emplacement.style.zIndex = 8;
  Emplacement.style.position = "absolute";
  Emplacement.style.left = this.x * Emplacement.width;
  Emplacement.style.top = this.y * Emplacement.height;
  Emplacement.style.border = "1px solid grey";
  Emplacement.isSelect = false;
  // overwrite canvas onclick method
  Emplacement.onclick = function() {
    if (this.isSelect == false) {
      this.isSelect = true;
      console.log(this.id + " selected!");
    }
    else {
      this.isSelect = false;
      console.log(this.id + " unselected!");
    }
  };
  Emplacement.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };
  Emplacement.draw = function() {
    carreCote = 12;
    // don't draw if no carte
    if (this.carteInside()) {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, carreCote, carreCote);//haut gauche
      this.ctx.fillText(this.carte.cout, 0, carreCote-2);
      this.ctx.fillText(this.carte.titre, carreCote+2, carreCote-2);
      this.ctx.rect(this.width-carreCote, this.height-carreCote, carreCote, carreCote);//bas droite
      this.ctx.fillText(this.carte.defense, this.width-carreCote, this.height-2);
      this.ctx.rect(0, this.height-carreCote, carreCote, carreCote);// bas gauche
      this.ctx.fillText(this.carte.attaque, 0, this.height-2);
      this.ctx.fillText(this.carte.description, carreCote/2, this.height-(carreCote+2));
      this.ctx.drawImage(this.carte.imagej, carreCote+2, carreCote+2, this.width-2*(carreCote+2), this.height-3*(carreCote+2));
      this.ctx.stroke();
    }
  };
  Emplacement.carteInside = function() {
    if (this.carte.initialize) {
      this.isCarte = true;
      return true;
    }
    else {
      this.isCarte = false;
      return false;
    }
  };
  Emplacement.toString = function() {
    emplacementString = "Emplacement :" + "id : " + this.id + " - " + "x : " + this.x + " - " + "y : " + this.y + " - " + "ctx : " + this.ctx + " - " + "isCarte : " + this.isCarte + " - " + "isSelect : " + this.isSelect;
    return emplacementString + "\n" + this.carte.toString();
  };
  return Emplacement;
}
/* Same object as Emplacement but can be instantiate using the new operator.
 * See createAllCasesTst() function.
*/
function CaseTst(x, y) {
  this.x = x;
  this.y = y;
  this.carte = new Carte(x + y);
  this.isCarte = false;
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext("2d");
  this.canvas.id = "case" + this.x + "-" + this.y;
  this.canvas.width = 100;
  this.canvas.height = 150;
  this.canvas.style.zIndex = 8;
  this.canvas.style.position = "absolute";
  this.canvas.style.left = this.x * this.canvas.width;
  this.canvas.style.top = this.y * this.canvas.height;
  this.canvas.style.border = "1px solid grey";
  this.canvas.isSelect = false;
  // overwrite canvas onclick method
  this.canvas.onclick = function() {
    if (this.isSelect == false) {
      this.isSelect = true;
      console.log(this.id + " selected!");
    }
    else {
      this.isSelect = false;
      console.log(this.id + " unselected!");
    }
  };
  this.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  this.draw = function() {
    carreCote = 12;
    // don't draw if no carte
    if (this.carteInside()) {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, carreCote, carreCote);//haut gauche
      this.ctx.fillText(this.carte.cout, 0, carreCote-2);
      this.ctx.fillText(this.carte.titre, carreCote+2, carreCote-2);
      this.ctx.rect(this.canvas.width-carreCote, this.canvas.height-carreCote, carreCote, carreCote);//bas droite
      this.ctx.fillText(this.carte.defense, this.canvas.width-carreCote, this.canvas.height-2);
      this.ctx.rect(0, this.canvas.height-carreCote, carreCote, carreCote);// bas gauche
      this.ctx.fillText(this.carte.attaque, 0, this.canvas.height-2);
      this.ctx.fillText(this.carte.description, carreCote/2, this.canvas.height-(carreCote+2));
      this.ctx.drawImage(this.carte.imagej, carreCote+2, carreCote+2, this.canvas.width-2*(carreCote+2), this.canvas.height-3*(carreCote+2));
      this.ctx.stroke();
    }
  };
  this.carteInside = function() {
    if (this.carte.initialize) {
      this.isCarte = true;
      return true;
    }
    else {
      this.isCarte = false;
      return false;
    }
  };
  this.toString = function() {
    caseString = "Case :" + "id : " + this.canvas.id + " - " + "x : " + this.x + " - " + "y : " + this.y + " - " + "canvas : " + this.canvas + " - " + "ctx : " + this.ctx + " - " + "isCarte : " + this.isCarte + " - " + "isSelect : " + this.canvas.isSelect;
    return caseString + "\n" + this.carte.toString();
  };
}
/*
 * Carte prototype.
*/
function Carte(id) {
  this.id = id;
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
    this.visible = false;
    this.imagej = new Image();
    this.cout = "";
    this.attaque = "";
    this.defense = "";
    this.titre = "";
    this.description = "";
  };
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
