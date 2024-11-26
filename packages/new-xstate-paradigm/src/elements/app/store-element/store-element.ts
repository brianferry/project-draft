import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { storeMachine } from '../../../xstate/machines/store-machine/store-machine';
import { observed } from '@patternfly/pfe-core/decorators/observed.js';

import * as styles from './rh-table-lightdom.js';

import '@rhds/elements/rh-table/rh-table.js';
import { cartMachine } from '../../../xstate/machines/cart-machine/cart-machine.js';
import { Actor } from 'xstate';
import { ActorController } from '../../../lib/controllers/actor/actor-controller.js';


@customElement('store-element')
export class StoreElement extends LitElement {
    static styles = [styles.styles, css`
        :host {
            display: block;
            width: 100%;
        }
        `];

    @observed
    @property({ type: Object, attribute: 'storemachine' })
    storemachine?: Actor<typeof storeMachine>;

    @observed
    @property({ type: Object, attribute: 'cartmachine' })
    cartmachine?: Actor<typeof cartMachine>;

    _storemachineChanged() {
        if (this.storemachine) {
            new ActorController(this, this.storemachine);
        }
    }

    _cartmachineChanged() {
        if (this.cartmachine) {
            new ActorController(this, this.cartmachine);
        }
    }

    render() {
        const state = this.storemachine?.getSnapshot();
        if (!state) return html`<p>No state</p>`;
        const { items, loading } = state.context;

        if (loading) {
            return html`<p>Loading...</p>`;
        }

        return html`
            <rh-table>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item: any) => html`
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.price}</td>
                                <td>${item.unit}</td>
                                <td><button @click=${() => this.cartmachine?.send({ type: 'ADD_ITEM', item })}>Add to Cart</button></td>
                            </tr>
                        `)}
                    </tbody>
                </table>
            </rh-table>`
    }
}