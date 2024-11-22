import { css, LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { observed } from "@patternfly/pfe-core/decorators.js";
import '../item-element/item-element.js';
import { cartMachine } from "../../xstate/machines/cart-machine/cart-machine.js";
import { ItemSignal } from "../../lib/types/item/item.js";
import { InterpretController } from "../../lib/controllers/xstate/xstate-controller.js";

import '@rhds/elements/rh-accordion/rh-accordion.js';
import '@rhds/elements/rh-accordion/rh-accordion-header.js';
import '@rhds/elements/rh-accordion/rh-accordion-panel.js';
import { RhAccordion } from "@rhds/elements/rh-accordion/rh-accordion.js";

@customElement('cart-element')
export class CartElement extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
        }`;

    public xstate?: InterpretController<typeof cartMachine>;

    @observed
    @property({ type: Object, attribute: false })
    cartMachine?: typeof cartMachine;

    _cartMachineChanged() {
        if (this.cartMachine) {
            this._interpretCartMachine(this.cartMachine);
        }
    }

    _interpretCartMachine(machine: typeof cartMachine): void {
        this.xstate = new InterpretController(this, machine, {
            devTools: true
        });
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.cartMachine) {
            this._interpretCartMachine(cartMachine);
        }
    }

    #collapseAll = () => {
        const accordion = this.shadowRoot?.querySelector('rh-accordion') as RhAccordion;
        accordion.collapseAll();
    }

    #startOrEndItemMachine = (itemMachine: any, id: string) => {
        this.#collapseAll();
        if (itemMachine) {
            this.xstate?.value.send({ type: 'END_ITEM_MACHINE' });
            this.xstate?.value.send({ type: 'START_ITEM_MACHINE', id });
        } else {
            this.xstate?.value.send({ type: 'START_ITEM_MACHINE', id });
        }
    }

    render() {
        const state = this.xstate?.value.getSnapshot();
        const itemMachine = state?.children.itemMachine;
        if (state) {
            return html`
            <button type="button" @click=${() => this.xstate?.value.send({type: 'LOG_CONTEXT'})}>LOG GLOBAL CONTEXT</button>
                <rh-accordion>
                    ${state?.context?.items?.value?.map((item: ItemSignal) => html`
                    <rh-accordion-header 
                        @change=${(evt: any) => this.#startOrEndItemMachine(itemMachine, item.value.id)}>
                        ${item.value.name}
                    </rh-accordion-header>
                    <rh-accordion-panel>
                        <item-element .actor=${itemMachine}></item-element>
                    </rh-accordion-panel>`
            )}
            </rh-accordion>`
        }
    }
}