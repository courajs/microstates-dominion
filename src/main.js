import {create, map, reduce, filter} from "microstates";
import start from "./app.js";

function items(a) {
  return map(a, x=>x);
}

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
Game.prototype.playAll = function() {
  let coins = this.player.hand.state.reduce((sum,c)=>sum+c.def.value, 0);
  let p = this.player.state;
  return this.player.resources.coins.increment(coins)
    .player.hand.clear()
    .player.in_play.set(p.in_play.concat(p.hand));
}

Game.prototype.draw = function(n = 1) {
  let r = this;
  let p = this.player.state;
  if (p.deck.length === 0 && p.discard.length === 0) {
    // no cards left to draw; do nothing
    return this;
  }
  if (p.deck.length === 0) {
    // shuffle discard into deck on-demand
    return this.shuffle().draw(n);
  }
  // move from deck to hand
  r = r.player.deck.shift()
    .player.hand.set(p.hand.concat(p.deck[0]))

  if (n > 1) {
    return r.draw(n-1);
  } else {
    return r
  }
}
Game.prototype.shuffle = function() {
  assert(this.player.deck.state.length === 0, "Only shuffle when you need to draw")
  return this.player.discard.clear()
    .player.deck.set(this.player.discard)
}

Game.prototype.endTurn = function() {
  let p = this.player.state;
  let newDiscard = [].concat(p.discard, p.hand, p.in_play);
  return this.player.hand.clear()
    .player.in_play.clear()
    .player.discard.set(newDiscard)
    .draw(5)
    .player.resources.set({actions:1, buys: 1})
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
  return this.discard.push(makeCard(def));
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

var nextId = 1;
function makeCard(def) {
  return create(Card, {def, id: nextId++});
}
function makeCards(def, n) {
  if (n) {
    var result = [];
    for (let i = 0; i < n; i++) {
      result.push(makeCard(def));
    }
    return result;
  }
}


var copper = create(CardDef, {name: "Copper", value: 1, cost: 0});
var silver = create(CardDef, {name: "Silver", value: 2, cost: 3});
var gold = create(CardDef, {name: "Gold", value: 3, cost: 6});

var g = create(Game, {
  player: {
    hand: [...makeCards(copper, 5)],
    deck: [...makeCards(copper, 5)],
    discard: [],
    resources: {actions: 1, buys: 1},
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
