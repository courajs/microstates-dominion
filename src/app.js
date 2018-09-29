import {html, render} from "lit-html";
import {map} from "microstates";


var current;
export default function r(game) {
  window.g = game;
  current = game;
  render(App(game), document.body);
  return game;
}

/*
  <div id="board">
    <div id="supply"></div>
    <div id="resources"></div>
    <div id="in-play"></div>
    <div id="hand"></div>
    <div id="deck"></div>
    <div id="discard"></div>
  </div>
 */

function App(game) {
  return html`

  <div id="board">
    <div id="supply">${SupplyPile(game)}</div>
    <div id="resources">
      <div>Actions: ${game.player.resources.actions.state}</div>
      <div>Buys: ${game.player.resources.buys.state}</div>
      <div>Coins: ${game.player.resources.coins.state}</div>
    </div>
    <div id="in-play"><ul>${map(game.player.in_play, InertCard)}</ul></div>
    <div id="actions">
      <button @click=${()=>r(game.endTurn())}>End turn</button>
      ${
        game.player.hand.state.length > 0
        ? html`<button @click=${()=>r(game.playAll())}>Play treasures</button>`
        : null
      }
    </div>
    <div id="hand"><ul>${map(game.player.hand, PlayableCard)}</ul></div>
    <div id="deck">${game.player.deck.state.length} cards</div>
    <div id="discard">${game.player.discard[0] ? InertCard(game.player.discard[0]) : null}</div>
  </div>
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

function SupplyPile(game) {
return html`
  <ul>
    ${map(game.supply, (pile) => 
      html`
        <li>
          ${
            pile.left.state > 0  &&  game.player.resources.coins.state >= pile.def.cost.state  &&  game.player.resources.buys.state >= 1
              ? html`<button @click=${()=>r(game.buy(pile))}>Buy</button>`
              : null
           }
           ${pile.def.name.state} (${pile.left.state})
        </li>
      `)}
  </ul>`;
}

// function List(label, state, render)

