import {create, map} from "microstates";
import {render} from "./ui.js";



function Game() {
  this.player = Player;
  this.supply = [SupplyPile];
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

render(g);

window.Stuff = {
  map,
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
}
