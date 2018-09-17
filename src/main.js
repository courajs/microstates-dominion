import {create, map, filter} from "microstates";
import start from "./app.js";

function assert(v, msg) {
  if (!v) {
    throw new Error(msg);
  }
}


function Game() {
  this.player = Player;
  this.supply = [SupplyPile];
}
Game.prototype.buy = function(pile) {
  assert(pile.left.state > 0, "Buying from empty supply pile");
  return pile.left.decrement()
    .player.discard.push(create(Card, {def: pile.def}));
}

function SupplyPile() {
  this.def = CardDef;
  this.left = Number;
}

function Player() {
  this.hand = [Card];
  this.discard = [Card];
  this.deck = [Card];
  this.in_play = [Card];
}

function CardDef() {
  this.name = String;
  this.value = Number;
  this.cost = Number;
}

CardDef.prototype.make = function() {
  return create(Card, {def: this});
}

function Card() {
  this.def = CardDef;
  this.id = Number;
}

var nextId = 1;
Card.prototype.initialize = function(){
  return this.id.set(nextId++);
}

var copper = create(CardDef, {name: "Copper", value: 1, cost: 0});
var silver = create(CardDef, {name: "Silver", value: 2, cost: 3});
var gold = create(CardDef, {name: "Gold", value: 3, cost: 6});

var g = create(Game, {
  player: {hand: [copper.make() ,copper.make(), silver.make()]},
  supply: [{def: copper, left: 4}]
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
  g
});
