import {map} from "microstates";

var body = document.body;

export function render(state) {
  body.innerHTML = App(state);
}

function App(game) {
  return `
<h1>Dominion</h1>
<h2>Supply</h2>
<ul>
  ${mash(game.supply, SupplyPile)}
</ul>
<h2>Hand</h2>
<ul>
  ${mash(game.player.hand, Card)}
</ul>
<h2>Discard</h2>
<ul>
  ${mash(game.player.discard, Card)}
</ul>
`;
}

function Card(c) {
  return `<li>${c.def.name.state}</li>`;
}

function SupplyPile(s) {
  return `<li>${s.def.name.state} (${s.left.state})`;
}

function List(label, state, render)







function mash(state, fn) {
  return map(state, fn).join('');
}

