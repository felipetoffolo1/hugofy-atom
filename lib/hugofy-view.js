'use babel';

export default class HugofyView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('hugofy');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The Hugofy package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    const input = document.createElement('input');
    input.setAttribute('type','text')
    this.element.appendChild(message);
    this.element.appendChild(input);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
