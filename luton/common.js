//-----------------------------------------------------------
function create_card() {
  card_models=[];
  card_models.push(new Card_model('soldier', 'Ready...', 1, 1, 1, 0));
  card_models.push(new Card_model('sergeant', 'Yes...', 2, 1, 2, 1));
  card_models.push(new Card_model('lieutenant', 'Ok...', 3, 2, 2, 2));
  card_models.push(new Card_model('captain', 'Go...', 4, 2, 3, 3));
  card_models.push(new Card_model('colonel', 'Prepare...', 5, 3, 3, 4));
  card_models.push(new Card_model('marshal', 'Think...', 6, 3, 4, 5));
  card_models.push(new Card_model('general', 'Serve...', 7, 4, 3, 6));
  card_models.push(new Card_model('player', '', 0, 1, 20, 7));
  card_models.push(new Card_model('player', '', 0, 1, 20, 8));
}
function Card_model(title_card, text_card, cost, atk, def, image_num) {
  this.title_card= title_card; this.text_card= text_card; this.cost= cost;
  this.atk= atk; this.def= def; this.image_num= image_num;
}
function Card(model_num) {
  this.model_num= model_num;
  this.ready= false;
  this.title_card= card_models[model_num].title_card;
  this.text_card= card_models[model_num].text_card;
  this.atk= card_models[model_num].atk;  this.def= card_models[model_num].def;
  this.cost= card_models[model_num].cost;
  this.image_num= card_models[model_num].image_num;
}
// http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
//-----------------------------------------------------------
