import {html, render} from "lit-html";
import {map} from "microstates";


var current;
export default function r(game) {
  current = game;
  render(App(game), document.body);
}

function App(game) {
  return html`
<h1>Dominion</h1>
<h2>Supply</h2>
<ul>
  ${map(game.supply, SupplyPile)}
</ul>
<h2>Resources</h2>
<div>Actions: ${game.player.resources.actions.state}</div>
<div>Buys: ${game.player.resources.buys.state}</div>
<div>Coins: ${game.player.resources.coins.state}</div>
<h2>Hand</h2>
<ul>
  ${map(game.player.hand, PlayableCard)}
</ul>
<h2>In play</h2>
<ul>
  ${map(game.player.in_play, InertCard)}
</ul>
<h2>Discard</h2>
<ul>
  ${map(game.player.discard, InertCard)}
</ul>
`;
}

function PlayableCard(c) {
  return html`
    <li>
      <button @click=${()=>r(current.play(c))}>Play</button>
      ${c.def.name.state}
    </li>`;
}
function InertCard(c) {
  return html`
    <li>
      ${c.def.name.state}
    </li>`;
}

function SupplyPile(s) {
  return html`
    <li>
      ${
        s.left.state > 0 ? html`<button @click=${()=>r(current.buy(s))}>Buy</button>` : null
      }
      ${s.def.name.state} (${s.left.state})
    </li>`;
}

// function List(label, state, render)

