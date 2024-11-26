import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement, PropertyValues } from "lit";
import { checkoutMachine, checkoutMachineContextSchema, createCheckoutMachine, ItemWithValidity } from "../../../xstate/machines/checkout-machine/checkout-machine";
import { Item, ItemSignal } from "../../../lib/types/item/item";

import { Actor } from "xstate";
import { cartMachine } from "../../../xstate/machines/cart-machine/cart-machine";
import { observed } from "@patternfly/pfe-core/decorators.js";

@customElement('checkout-element')
export class CheckoutElement extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
        }`;

    @property({ type: Object, attribute: 'cartmachine' })
    cartmachine?: Actor<typeof cartMachine>;

    @property({ attribute: 'items', reflect: true, type: Array })
    items: Array<ItemSignal> = [];

    @observed
    @property({ type: Object, attribute: false, reflect: true })
    checkoutMachine?: Actor<typeof checkoutMachine>;

    _checkoutMachineChanged() {
        if (this.checkoutMachine) {
            this.requestUpdate();
        }
    }

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);
        if (_changedProperties.has('items')) {
            if (this.checkoutMachine) {
                this.checkoutMachine.send({ type: 'UPDATE_ITEMS', items: this.items.map((item: ItemSignal) => item._value.uuid) });
            }
        };
    }

    checkIsValid(item: Item): boolean | undefined {
        const items = this.checkoutMachine?.getSnapshot()?.context.items;
        return items?.find((i: checkoutMachineContextSchema) => i.uuid === item.uuid)?.valid;
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.checkoutMachine) {
            console.log(this.items);
            const itemIds = this.items.map((item: ItemSignal) => item._value.uuid);
            this.checkoutMachine = createCheckoutMachine({ items: itemIds });
            this.checkoutMachine.subscribe(() => {
                this.requestUpdate();
            });
            this.checkoutMachine.start();
        }
    }

    render() {
        const cartMachineState = this.cartmachine?.getSnapshot();
        if (cartMachineState && cartMachineState.context && cartMachineState.context.items.value.length > 0) {
            return html`
            <div>
                <button type="button" @click=${() => this.checkoutMachine?.send({ type: 'LOG_CONTEXT' })} >LOG_CONTEXT</button>
                <ol>
                ${cartMachineState.context.items.value.map((item: ItemSignal) => html`
                    <li>
                        <span>${item.value.name}</span>
                        <button type="button" @click=${() => this.cartmachine?.send({ type: 'REMOVE_ITEM', uuid: item.value.uuid })} >Remove ${item.value.name}</button>
                        ${typeof this.checkIsValid(item.value) === 'undefined' ?
                            html`<p>Checking validity...</p>` :
                        this.checkIsValid(item.value) ? html`<p>Validated</p>` : html`<p>Invalid</p>`}
                    </li>
                `)}
                </ol>
                </div>`
        }
        return html`<p>No items in cart</p>`;
    }
}