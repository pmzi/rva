import React from 'react';
import ReactDOM from 'react-dom';
import debounce from './utils/debounce';

export default function rvaReact({
  component, componentName, renderer = ReactDOM, props,
}) {
  const render = debounce(
    (args, element) => { renderer.render(React.createElement(component, args), element); },
    1000,
  );

  customElements.define(componentName, class extends HTMLElement {
    static get observedAttributes() { return props || component.props; }

    constructor() {
      super();
      this.args = {};
    }

    connectedCallback() {
      render(this.args, this);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      this.args[name] = newVal;
      render(this.args, this);
    }
  });
}
