import { css, LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { observed } from "@patternfly/pfe-core/decorators.js";
import { ActorController } from "../../lib/controllers/actor/actor-controller.js";
import { itemMachine } from "../../xstate/machines/item-machine/item-machine.js";
import '../quantity-element/quantity-element.js';
import { Actor } from "xstate";

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
            return html`
                <quantity-element .actor=${this.actor}></quantity-element>
            `;
        }
    }
}