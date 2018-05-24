// Private members prefixed by _
const _attributes = new WeakMap();
const _instances = new WeakMap();
const _mutation = new WeakMap();
const _observer = new WeakMap();
const _bind = new WeakMap();
const _unbind = new WeakMap();

// Global object
class CustomAttributes {
  constructor() {
    _attributes.set(this, {});

    _mutation.set(this, (mutations) => {
      // Attribute mutations
      mutations.filter(mutation => mutation.type === `attributes`)
        .filter(mutation => _attributes.get(this)[mutation.attributeName])
        .map(mutation => {
          // Custom attribute added
          if (!_instances.get(mutation.target))
            _bind.get(this)(mutation.target, _attributes.get(this)[mutation.attributeName]);
          // Custom attribute removed
          else if (mutation.target.getAttributeNames().indexOf(mutation.attributeName) < 0)
            _unbind.get(this)(_instances.get(mutation.target));
        });
      // Child list mutations
      mutations.filter(mutation => mutation.type === `childList`)
        .map(mutation => {
          // Element added
          mutation.addedNodes.forEach(element => {
            Object.keys(_attributes.get(this))
              .filter(attribute => 
                element.nodeType === 1 &&
                element.getAttributeNames().indexOf(attribute) > -1 && 
                !_instances.get(element)
              )
              .map(attribute => {
                _bind.get(this)(element, _attributes.get(this)[attribute]);
              });
          });
          // Element removed
          mutation.removedNodes.forEach(element => {
            if (_instances.get(element)) 
              _unbind.get(this)(_instances.get(element));      
          });
        });
    });

    _observer.set(this, new MutationObserver(_mutation.get(this)));

    _observer.get(this).observe(document, {
      childList: true,
      subtree: true,
      attributes: true
    });

    _bind.set(this, (element, Constructor) => {
      let instance = new Constructor();
      instance.element = element;
      _instances.set(element, instance);
      if (instance.connectedCallback)
        instance.connectedCallback();
    });

    _unbind.set(this, (instance) => {
      if (instance.disconnectedCallback)
        instance.disconnectedCallback();
      _instances.delete(instance.element);
    });
  }

  // Public define method
  define(attribute, Constructor) {
    Object.assign(_attributes.get(this), {
      [attribute]: Constructor
    });
  }
}

window.customAttributes = new CustomAttributes();