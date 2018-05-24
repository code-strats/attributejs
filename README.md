# Attribute.js

Define custom attributes on standard HTML elements and use the same [Custom Elements v1 API](https://developers.google.com/web/fundamentals/web-components/customelements) you know and love to encapsulate your functionality.

## Install

Install via NPM or Yarn

```shell
npm i attributejs --save
```

Include via script tag

```html
<script src="node_modules/attributejs"></script>
```

Or import as an ES module

```js
import 'attributejs';
```

Once imported, the `attributejs` instance will be added to the window object.

## Example

```html
<button my-button>My button</button>
```

```js
class MyButton {
  constructor() {
    this.handleClick = () => {
      console.log(`
        The binded element that has the 'my-button' attribute 
        has been clicked!
      `);
    }
  }

  connectedCallback() {
    console.log(`
      The 'my-button' attribute has been added to an element and 
      is now binded to said element.
    `);
    this.element.addEventListener(`click`, this.handleClick);
    this.setBackground();
  }

  disconnectedCallback() {
    console.log(`
      The 'my-button' attribute has been removed from the binded element,
      or the binded element has been removed from the DOM.
    `);
    this.element.removeEventListener(`click`, this.handleClick);
  }

  setBackground() {
    // Custom method
    this.element.style.backgroundColor = `blue`;
  }
}

attributejs.define('my-button', MyButton);
```

## API

The Attribute.js library exposes a very similar API to the [Custom Elements v1 spec](https://developers.google.com/web/fundamentals/web-components/customelements).

Classes that are defined on the global object are given lifecycle callbacks to which you may respond appropriately with your corresponding code.

### Defining custom attributes

To define a custom attribute, invoke the `define` method on the global object `attributejs`.
The method takes two arguments:
1. An attribute name
2. A class definition

```js
attributejs.define('my-button', MyButton);
```

### Lifecycle callbacks

#### constructor

The constructor lets you set up class properties and methods, just like a regular ES class.
Note: The `element` property is not yet exposed to the class instance.

#### connectedCallback

The connectedCallback method is invoked when the element is first added to the DOM.
At this point, the element will be binded to the class instance via the property `element`.

You are then able to manipulate the element via this special property.

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

The Attribute.js library adds support for extending native elements, whilst keeping the Custom Elements v1 API intact.

### License

MIT License