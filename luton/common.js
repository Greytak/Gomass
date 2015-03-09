//-----------------------------------------------------------
function create_card() {
  cards=[];
  cards.push(new card_model('soldier', 'Ready...', 1, 1, 1, 0));
  cards.push(new card_model('sergeant', 'Yes...', 2, 1, 2, 1));
  cards.push(new card_model('lieutenant', 'Ok...', 3, 2, 2, 2));
  cards.push(new card_model('captain', 'Go...', 4, 2, 3, 3));
  cards.push(new card_model('colonel', 'Prepare...', 5, 3, 3, 4));
  cards.push(new card_model('marshal', 'Think...', 6, 3, 4, 5));
  cards.push(new card_model('general', 'Serve...', 7, 4, 3, 6));
  cards.push(new card_model('player', '', 0, 1, 20, 7));
  cards.push(new card_model('player', '', 0, 1, 20, 8));
}
function card_model(title_card, text_card, cost, atk, def, image_num) {
  this.title_card= title_card; this.text_card= text_card; this.cost= cost;
  this.atk= atk; this.def= def; this.image_num= image_num;
}
//-----------------------------------------------------------
