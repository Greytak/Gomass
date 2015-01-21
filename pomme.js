/* Same as Case but with a new canvas.
 * See createAllCases2() function.
*/
function CanvasCarte(x, y) {
  canvas = document.createElement('canvas');
  canvas.id = "case" + x + "-" + y;
  canvas.width = 100;
  canvas.height = 150;
  canvas.style.zIndex = 8;
  canvas.style.position = "absolute";
  canvas.style.left = x * canvas.width;
  canvas.style.top = y * canvas.height;
  canvas.style.border = "1px solid grey";
  canvas.isSelect = false;
  // overwrite canvas onclick method
  canvas.onclick = function() {
    if (this.isSelect == false) {
      this.isSelect = true;
      console.log(this.id + " selected!");
    }
    else {
      this.isSelect = false;
      console.log(this.id + " unselected!");
    }
  };
  return canvas;
}
function Case2(x, y) {
  this.x = x;
  this.y = y;
  this.carte = new Carte(x + y);
  this.isCarte = false;
  this.canvas = new CanvasCarte(x, y);
  this.ctx = this.canvas.getContext("2d");
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
 * See createAllCases() function.
*/
function Case(x, y) {
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
  this.initialize = false;
  this.imagej = new Image();
  this.init = function(img, cout, att, def, titre, desc) {
    this.initialize = true;
    this.imagej.src = img;
    this.cout = cout;
    this.attaque = att;
    this.defense = def;
    this.titre = titre;
    this.description = desc;
  };
  this.toString = function() {
    return "Carte : " + "id : " + this.id + " - " + "cout : " + this.cout + " - " + "attaque: " + this.attaque
            + " - " + "defense: " + this.defense + " - " + "titre: " + this.titre + " - " + "description: " + this.description + " - " + "image: " + this.imagej.src;
  };
}
Carte.prototype = {
  cout : "N",
  attaque : "N",
  defense : "N",
  titre : "N",
  description : "N",
};
