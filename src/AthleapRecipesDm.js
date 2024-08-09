import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './athleap-recipes-dm.css.js';
import '@bbva-web-components/bbva-core-generic-dp/bbva-core-generic-dp.js';

/**
 * ![LitElement component](https://img.shields.io/badge/litElement-component-blue.svg)
 *
 * This component ...
 *
 * Example:
 *
 * ```html
 *   <athleap-recipes-dm></athleap-recipes-dm>
 * ```
 */
export class AthleapRecipesDm extends LitElement {
  static get properties() {
    return {
      host: {
        type: String,
      },
      path: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.host = '';
    this.path = '';
  }

  static get styles() {
    return [
      styles,
      getComponentSharedStyles('athleap-recipes-dm-shared-styles'),
    ];
  }

  // 4-A. Crear la función de normalización
  _normalizeResponse(response) {
    return response.recipes;
  }

  firstUpdated() {
    // 1. Obtener el DP (Data Provider)
    const athleapRecipesDP = this.shadowRoot.querySelector(
      '#athleap-recipes-dp',
    );
    // 2. Lanzar un evento, para avisar que el request ha iniciado

    /**
     * Fired when request starts:
     *
     * @event athleap-recipes-dm-request-start
     * @type {object}
     * @property {boolean} detail
     */

    this.dispatchEvent(
      new CustomEvent('athleap-recipes-dm-request-start', {
        bubbles: true,
        composed: true,
        detail: true,
      }),
    );
    // 3. Ejecutar el DM

    athleapRecipesDP
      .generateRequest()
      .then(({ response }) => {
        // 4-B. Invocar la función de normalización
        const normalizedResponse = this._normalizeResponse(response);
        // 5-A. Reaccionar a la respuesta exitosa

        /**
         * Fired when request succeeds
         *
         * @event athleap-recipes-dm-request-success
         * @type {object}
         * @property {Array<{id:Number, title:String, ingredients: Array<String>, preparation: String}>} recipes
         */

        this.dispatchEvent(
          new CustomEvent('athleap-recipes-dm-request-success', {
            bubbles: true,
            composed: true,
            detail: normalizedResponse,
          }),
        );
      })
      .catch((err) => {
        // 5-B. Reaccionar a la respuesta fallida

        /**
         * Fired when request fails
         *
         * @event athleap-recipes-dm-request-error
         * @type {Error}
         */

        this.dispatchEvent(
          new CustomEvent('athleap-recipes-dm-request-error', {
            bubbles: true,
            composed: true,
            detail: err,
          }),
        );
      });
  }

  render() {
    return html`
      <bbva-core-generic-dp
        id="athleap-recipes-dp"
        host="https://demo2973381.mockable.io"
        path="/recipes"
        method="GET"
      >
      </bbva-core-generic-dp>
    `;
  }
}
