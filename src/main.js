import {create, map, filter} from "microstates";
import start from "./app.js";

function assert(v, msg) {
  if (!v) {
    throw new Error(msg);
  }
}
function removeFrom(arrayState, item) {
  return arrayState.filter(i => i.state !== item.state);
}


function Game() {
  this.player = Player;
  this.supply = [SupplyPile];
}
Game.prototype.buy = function(pile) {
  assert(this.player.resources.buys.state >= 1, "No buys available");
  assert(this.player.resources.coins.state >= pile.def.cost.state, "Buy without enough coins");
  return this.gain(pile)
    .player.resources.buys.decrement()
    .player.resources.coins.decrement(pile.def.cost.state);
}
Game.prototype.gain = function(pile) {
  assert(pile.left.state > 0, "Gaining from empty supply pile");
  return pile.decrement()
    .player.gain(pile.def);
}
Game.prototype.play = function(card) {
  return removeFrom(this.player.hand, card)
    .player.in_play.push(card)
    .player.resources.coins.increment(card.def.value.state);
}
Game.prototype.draw = function(n = 1) {
  let card = this.player.deck[0];
  let r = removeFrom(this.player.deck, card)
  return r.player.hand.push(card)
}

function SupplyPile() {
  this.def = CardDef;
  this.left = Number;
}
SupplyPile.prototype.decrement = function() {
  return this.left.decrement();
}

function Player() {
  this.resources = Resources;
  this.hand = [Card];
  this.discard = [Card];
  this.deck = [Card];
  this.in_play = [Card];
}
Player.prototype.gain = function(def) {
  return this.discard.push(create(Card, {def}));
}

function Resources() {
  this.actions = Number;
  this.buys = Number;
  this.coins = Number;
}

function CardDef() {
  this.name = String;
  this.value = Number;
  this.cost = Number;
}

function Card() {
  this.def = CardDef;
  this.id = Number;
}
Card.make = function(def, n) {
  if (n) {
    var result = [];
    for (var i = 0; i < n; i++) {
      result.push(create(Card, {def}));
    }
    return result;
  } else {
    return create(Card, {def});
  }
}
var nextId = 1;
Card.prototype.initialize = function(){
  return this.id.set(nextId++);
}


var copper = create(CardDef, {name: "Copper", value: 1, cost: 0});
var silver = create(CardDef, {name: "Silver", value: 2, cost: 3});
var gold = create(CardDef, {name: "Gold", value: 3, cost: 6});

var g = create(Game, {
  player: {
    hand: [...Card.make(copper, 4), ...Card.make(silver, 1)],
    deck: [...Card.make(copper, 3), ...Card.make(silver, 2)],
    resources: {buys: 4},
  },
  supply: [
    {def: copper, left: 60},
    {def: silver, left: 40},
    {def: gold, left: 30},
  ]
});

start(g);

Object.assign(window, {
  map,
  filter,
  create,
  Game,
  SupplyPile,
  Player,
  CardDef,
  Card,
  copper, 
  silver,
  gold,
  g,
  r(game) {
    window.g = game
    start(game)
  }
});
