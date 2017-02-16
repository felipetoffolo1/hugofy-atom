'use babel';

export default class HugofyView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('hugofy');

    // Create message element
    const form = document.createElement('form');
    // form.action = doIt;
    const message = document.createElement('label');
    message.textContent = 'Inform Folder';
    message.classList.add('message');
    const message2 = document.createElement('label');
    message2.textContent = 'Inform FileName';
    message2.classList.add('message');
    const input = document.createElement('input');
    input.setAttribute('type','text')
    input.setAttribute('id','folder')
    input.classList.add('u-full-width');
    const input2 = document.createElement('input');
    input2.setAttribute('type','text')
    input2.setAttribute('id','fileName')
    input2.classList.add('u-full-width');
    form.appendChild(message);
    form.appendChild(input);
    form.appendChild(message2);
    form.appendChild(input2);
    this.element.appendChild(form);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    valuex: 'y'
  }




  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
