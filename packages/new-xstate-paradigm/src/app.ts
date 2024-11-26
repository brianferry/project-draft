// This component is a placeholder for the store UI. 

import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import '../src/elements/app/store-element/store-element.js';
import '../src/elements/app/cart-element/cart-element.js';
import { InterpretController } from "./lib/controllers/xstate/xstate-controller.js";
import { storeMachine } from "./xstate/machines/store-machine/store-machine.js";
import { cartMachine } from "./xstate/machines/cart-machine/cart-machine.js";
import { observed } from "@patternfly/pfe-core/decorators/observed.js";

@customElement('app-element')
export class AppElement extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
        }`;



public xstateStoreMachine?: InterpretController<typeof storeMachine>;

public xstateCartMachine?: InterpretController<typeof cartMachine>;

@observed
@property({ type: Object, attribute: false })
storeMachine?: typeof storeMachine;

@observed
@property({ type: Object, attribute: false })
cartMachine?: typeof cartMachine;


_storeMachineChanged() {
    if (this.storeMachine) {
        this._interpretStoreMachine(this.storeMachine);
    }
}

_cartMachineChanged() {
    if (this.cartMachine) {
        this._interpretCartMachine(this.cartMachine);
    }
}

_interpretStoreMachine(machine: typeof storeMachine): void {
    this.xstateStoreMachine = new InterpretController(this, machine, {
        devTools: true
    });
}

_interpretCartMachine(machine: typeof cartMachine): void {
    this.xstateCartMachine = new InterpretController(this, machine, {
        devTools: true
    });
}

connectedCallback(): void {
    super.connectedCallback();
    if (!this.storeMachine) {
        this._interpretStoreMachine(storeMachine);
    }
    if (!this.cartMachine) {
        this._interpretCartMachine(cartMachine);
    }
}

    render() {
        const storeActor = this.xstateStoreMachine?.value;
        const cartActor = this.xstateCartMachine?.value;
        return html`
            <store-element .storemachine=${storeActor} .cartmachine=${cartActor}></store-element>
            <cart-element .cartmachine=${cartActor}></cart-element>
        `;
    }
}