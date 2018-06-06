# AttributeJS

Define custom attributes on standard HTML elements and use the same [Custom Elements v1 API](https://developers.google.com/web/fundamentals/web-components/customelements) you know and love to encapsulate your functionality.

## Install

Install via NPM or Yarn

```shell
npm i attributejs --save
```

Import as an ES module

```js
import { Attribute } from 'attributejs';
```

Once imported, the `Attribute` class exposes the static method `define` which can be used to define custom attributes.

## Example

```html
<button my-button>My button</button>
```

```js
import { Attribute } from 'attributejs';

class MyButton {
  constructor() {
  }

  connectedCallback() {
    console.log(`
      The 'my-button' attribute has been added to an element and 
      is now binded to said element.
    `);
    this.setBackground();
  }

  disconnectedCallback() {
    console.log(`
      The 'my-button' attribute has been removed from the binded element,
      or the binded element has been removed from the DOM.
    `);
  }

  setBackground() {
    // Custom method
    this.element.style.backgroundColor = `blue`;
  }
}

Attribute.define({
  ['my-button']: MyButton
});
```

## API

The AttributeJS library exposes a very similar API to the [Custom Elements v1 spec](https://developers.google.com/web/fundamentals/web-components/customelements).

Classes that are defined are given lifecycle callbacks to which you may respond appropriately with your corresponding code.

### Defining custom attributes

To define a custom attribute, import the `Attribute` class and use the `define` method, passing an object as an argument.
The object key should be the attribute name. The object value should be the custom class declaration.
Many classes can be passed within the object to the `define` method.

```js
Attribute.define({ 
  ['my-button']: MyButton, 
  ['my-second-button']: MySecondButton ,
});
```

### Lifecycle callbacks

#### constructor

The constructor lets you set up class properties and methods, just like a regular ES class.
Note: The `element` property is not yet exposed to the class instance.

#### connectedCallback

The connectedCallback method is invoked when the element is first binded to the attribute.

You are then able to manipulate the host element via the `element` property.

```js
connectedCallback() {
  this.element.innerHTML = `My innerHTML has changed!`;
}
```

#### disconnectedCallback

The disconnectedCallback method is invoked either when the element is removed from the DOM,
or the custom attribute is removed from the element.

The element is still available via the `element` property within this method and any necessary clean up can be done.

```js
disconnectedCallback() {
  this.element.removeEventListener(`click`, this.myClickHandler);
}
```

### Properties

#### element

`this.element` refers to the element containing the custom attribute.

### Motivation

Safari have declined allowing developers to extend native elements with the proposed `is="my-element"`
attribute, which has created complications for the Custom Elements v1 project.

The AttributeJS library adds support for extending native elements, whilst keeping the Custom Elements v1 API intact.

### License

MIT License