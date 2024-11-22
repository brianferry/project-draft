import { css, LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { observed } from "@patternfly/pfe-core/decorators.js";
import { ActorController } from "../../lib/controllers/actor/actor-controller.js";
import { Actor } from "xstate";
import { itemMachine } from "../../xstate/machines/item-machine/item-machine.js";


@customElement('quantity-element')
export class QuantityElement extends LitElement {
    static styles = css``;

    @observed
    @property({ type: Object })
    actor?: Actor<typeof itemMachine>;

    _actorChanged() {
        if (this.actor) {
            new ActorController(this, this.actor);
        }
    }

    render() {
        const state = this.actor?.getSnapshot();
        const { quantity, id } = state?.context?.item.value || { quantity: '0', id: 'N/A from quantity-element'};
        return html`
            <button type="button" @click=${() => this.actor?.send({ type: 'INCREMENT', id })}>INCREMENT</button>
            <button type="button" @click=${() => this.actor?.send({ type: 'DECREMENT', id })}>DECREMENT</button>
            <div>id: ${id} |</div>
            <div>quantity: ${quantity} |</div>
        `;
    }
}