import { css, LitElement, html, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import { property } from "lit/decorators/property.js";
import '../quantity-element/quantity-element.js';
import { Actor } from "xstate";
import { Item } from "../../lib/types/item/item.js";
import { itemMachine, setupItemMachine } from "../../xstate/machines/item-machine/item-machine.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement('item-dialog')
export class ItemElement extends LitElement {
    static styles = css`
        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-content {
            padding: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-group label {
            font-weight: bold;
        }

        input {
            padding: 0.5rem;
        }
    `;

    // @ts-ignore
    @property({ type: Object })
    item: Item = {
        id: '1',
        name: 'Item 1',
        quantity: 0,
        price: 1.00
    };

    #itemMachine?: Actor<typeof itemMachine>;

    constructor() {
        super();
        this.item = {
            id: '1',
            name: 'Item 1',
            quantity: 0,
            price: 1.00
        };
    }

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties);
        if (_changedProperties.has('item')) {
            if (this.#itemMachine) {
                this.#itemMachine.stop();
            }
            this.#itemMachine = setupItemMachine({ item: this.item });
            this.#itemMachine.start();
            this.requestUpdate();
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#itemMachine?.stop();
    }

    #customSubmitHandler = (event: Event) => {
        console.log('customSubmitHandler');
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const quantity = Number(formData.get('quantity'));
        const price = Number(formData.get('price'));
        if (this.dispatchEvent) {
            this.dispatchEvent(new CustomEvent('update-item', {
                detail: {
                    item: {
                        ...this.item,
                        name,
                        quantity,
                        price
                    }
                }
            }));
        }

        const dialog = this.closest('rh-dialog');
        dialog?.toggle();
    }

    render() {
        const state = this.#itemMachine?.getSnapshot();
        return html`
            <div class="form-content">
                <form @submit=${(e: any) => this.#customSubmitHandler(e)}>
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" value="${ifDefined(state?.context.item.name)}">
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" value="${ifDefined(state?.context.item.quantity)}">
                </div>
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="number" id="price" name="price" value="${ifDefined(state?.context.item.price)}">
                </div>
                <div class="form-group">
                    <input type="submit" value="Submit">
                </div>
                </form>
            </div>
        `;
    }
}