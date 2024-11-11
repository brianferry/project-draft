import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import '../src/elements/cart-element/cart-element.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    `

  render() {
    return html`
      <cart-element></cart-element>
    `
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
