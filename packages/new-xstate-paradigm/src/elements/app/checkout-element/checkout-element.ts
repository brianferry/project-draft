import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement, PropertyValues } from "lit";
import { checkoutMachine, createCheckoutMachine, ItemWithValidity } from "../../../xstate/machines/checkout-machine/checkout-machine";
import { Item } from "../../../lib/types/item/item";

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
    items: Array<Item> = [];

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
                this.checkoutMachine.send({ type: 'UPDATE_ITEMS', items: this.items });
            }
        };
    }

    checkIsValid(item: Item): boolean | undefined {
        const items = this.checkoutMachine?.getSnapshot()?.context.items;
        const foundItem = items?.find((i: ItemWithValidity) => i.uuid === item.uuid);
        return foundItem?.valid;
    }

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.checkoutMachine) {
            this.checkoutMachine = createCheckoutMachine({ items: this.items });
            this.checkoutMachine.subscribe((state) => {
                console.log('state', state);
                this.requestUpdate();
            });
            this.checkoutMachine.start();
        }
    }

    render() {
        const state = this.checkoutMachine?.getSnapshot();
        if (state && state.context && state.context.items.length > 0) {
            return html`
            <div>
                <button type="button" @click=${() => this.checkoutMachine?.send({ type: 'LOG_CONTEXT' })} >LOG_CONTEXT</button>
                <ol>
                ${state.context.items.map((item: Item) => html`
                    <li>
                        <span>${item.name}</span>
                        <button type="button" @click=${() => this.cartmachine?.send({ type: 'REMOVE_ITEM', uuid: item.uuid })} >Remove ${item.name}</button>
                        ${typeof this.checkIsValid(item) === 'undefined' ?
                            html`<p>Checking validity...</p>` :
                        this.checkIsValid(item) ? html`<p>Validated</p>` : html`<p>Invalid</p>`}
                    </li>
                `)}
                </ol>
                </div>`
        }
        return html`<p>No items in cart</p>`;
    }
}