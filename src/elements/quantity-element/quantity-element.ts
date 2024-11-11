import { css, LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { quantityMachine } from "../../xstate/machines/quantity-machine/quantity-machine.js";
import { observed } from "@patternfly/pfe-core/decorators.js";
import { ActorController } from "../../lib/controllers/actor/actor-controller.js";
import { Actor } from "xstate";


@customElement('quantity-element')
export class QuantityElement extends LitElement {
    static styles = css``;

    @observed
    @property({ type: Object })
    actor?: Actor<typeof quantityMachine>;

    _actorChanged() {
        if (this.actor) {
            new ActorController(this, this.actor);
        }
    }

    render() {
        const state = this.actor?.getSnapshot();
        const { quantity, id } = state?.context?.item.value || { quantity: '0', id: 'N/A from quantity-element'};
        return html`
            <button type="button" @click=${() => this.actor?.send({ type: 'INCREMENT_QUANTITY', id })}>INCREMENT</button>
            <button type="button" @click=${() => this.actor?.send({ type: 'DECREMENT_QUANTITY', id })}>DECREMENT</button>
            <div>id: ${id} |</div>
            <div>quantity: ${quantity} |</div>
        `;
    }


}