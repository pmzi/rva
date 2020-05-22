import Vue from 'vue';
import debounce from './utils/debounce';

export default function rvaVue({
  component, componentName, props, options,
}) {
  const render = debounce(
    (() => {
      let vm;
      return (args, element) => {
        // eslint-disable-next-line no-new
        if (vm) return;
        vm = new Vue({
          el: element,
          render: (h) => h(component, {
            props: {
              ...args,
            },
          }),
          ...options,
        });
      };
    })(),
    1000,
  );

  customElements.define(componentName, class extends HTMLElement {
    static get observedAttributes() { return props || component.props; }

    constructor() {
      super();
      this.args = {};
      props.forEach((item) => {
        this.args[item] = null;
      });
      this.args = Vue.observable(this.args);

      this.element = document.createElement('div');
      this.appendChild(this.element);
    }

    connectedCallback() {
      render(this.args, this.element);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      this.args[name] = newVal;
      render(this.args, this.element);
    }
  });
}
