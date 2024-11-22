import { css, LitElement, html, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { observed } from "@patternfly/pfe-core/decorators.js";
import '../item-dialog/item-dialog.js';
import { cartMachine } from "../../xstate/machines/cart-machine/cart-machine.js";
import { Item } from "../../lib/types/item/item.js";
import { InterpretController } from "../../lib/controllers/xstate/xstate-controller.js";

import '@rhds/elements/rh-dialog/rh-dialog.js';
import '@rhds/elements/rh-table/rh-table.js';

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

    @query('item-dialog')
    itemDialog?: HTMLElement;

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

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        if (this.itemDialog) {
            console.log('itemDialog', this.itemDialog);
            this.itemDialog.addEventListener('update-item', (e: any) => {
                this.xstate?.value.send({ type: 'UPDATE_ITEM', item: e.detail.item });
            });
        }
    }

    openDialog(item: Item) {
        const itemDialog = this.shadowRoot?.querySelector('item-dialog');
        itemDialog?.setAttribute('item', JSON.stringify(item));
        const dialog = this.shadowRoot?.querySelector('rh-dialog');
        dialog?.toggle();
    }

    render() {
        const state = this.xstate?.value.getSnapshot();
        if (state) {
            return html`<rh-table>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state?.context?.items?.map((item: Item) => html`
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button @click=${() => this.openDialog(item)}>Edit</button>
                                    </td>
                                </tr>`
                            )}
                        </tbody>
                    </table>
            </rh-table>
            
            <rh-dialog>
                    <item-dialog></item-dialog>
            </rh-dialog>`
        }
    }
}