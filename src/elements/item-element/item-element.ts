import { css, LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { asyncReplace } from "lit/directives/async-replace.js";
import { observed } from "@patternfly/pfe-core/decorators.js";
import { ActorController } from "../../lib/controllers/actor/actor-controller.js";
import { itemMachine } from "../../xstate/machines/item-machine/item-machine";
import '../quantity-element/quantity-element.js';
import { Actor } from "xstate";
import { Item, ItemSignal } from "../../lib/types/item/item.js";

@customElement('item-element')
export class ItemElement extends LitElement {
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
        if (state && state.children ) {
            const quantityMachineActor = state.children.quantityMachine;
            return html`
            <button type="button" @click=${() => this.actor?.send({type: 'LOG_CURRENT_CONTEXT'})}>LOG ITEM CONTEXT</button>

                quantity in item-element: ${asyncReplace(state?.context?.item, (value: any) => {
                    return html`${value.quantity}`;
                })};
                <quantity-element .actor=${quantityMachineActor}></quantity-element>
            `;
        }
    }
}