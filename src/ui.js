import {html, render} from "lit-html";
import {map} from "microstates";

var body = document.body;

function _render(state) {
  render(App(state), document.body);
}

export {_render as render};

function App(game) {
  return html`
<h1>Dominion</h1>
<h2>Supply</h2>
<ul>
  ${map(game.supply, SupplyPile)}
</ul>
<h2>Hand</h2>
<ul>
  ${map(game.player.hand, Card)}
</ul>
<h2>Discard</h2>
<ul>
  ${map(game.player.discard, Card)}
</ul>
  <button @click=${()=>console.log('click')}>Hi</button>
`;
}

function Card(c) {
  return html`<li>${c.def.name.state}</li>`;
}

function SupplyPile(s) {
  return html`<li>${s.def.name.state} (${s.left.state})`;
}

// function List(label, state, render)

