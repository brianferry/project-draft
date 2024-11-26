// This element should show a button with a count of how many items are in the cart.
// When the button is clicked, it should open a modal with a list of the items in the cart.
// There should be a button at the bottom of the modal to go to the checkout.

import { observed } from "@patternfly/pfe-core/decorators/observed.js";
import { customElement, property } from "lit/decorators.js";
import { cartMachine } from "../../../xstate/machines/cart-machine/cart-machine";
import { Actor } from "xstate";
import { ActorController } from "../../../lib/controllers/actor/actor-controller";
import { css, html, LitElement, PropertyValues } from "lit";

import '../checkout-element/checkout-element.js';

@customElement('cart-element')
export class CartElement extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
        }`;

    @observed
    @property({ type: Object, attribute: 'cartmachine' })
    cartmachine?: Actor<typeof cartMachine>;

    @property({ type: Boolean })
    _showCheckout = false;

    _cartmachineChanged() {
        if (this.cartmachine) {
            new ActorController(this, this.cartmachine);
        }
    }

    checkout() {
        this._showCheckout = !this._showCheckout;
    }

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);
        if (_changedProperties.has('cartmachine')) {
            this._cartmachineChanged();
        }
    }

    render() {
        const state = this.cartmachine?.getSnapshot();
        return html`
            <button type="button" @click=${() => this.checkout()}>Cart (${state?.context.items.value.length})</button>
            <rh-dialog @close=${() => this._showCheckout = false}>
                ${this._showCheckout ? html`<checkout-element .cartmachine=${this.cartmachine} items=${JSON.stringify(state?.context.items.value)}></checkout-element>` : ''}
            </rh-dialog>
        `;
    }
}