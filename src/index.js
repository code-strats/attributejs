// AttributeJS

const _attrs = [];  // [...Attributes]
const _ctors = {}; // { Attribute: Constructor }
const _insts = new WeakMap(); // { El: { Attribute: Instance } }

class Attribute {
  static define(defs) { // { Attribute: Constructor }
    _define(defs);
  }
}

function _define(defs) { // { Attribute: Constructor }
  Object.keys(defs).forEach(attr => {
    if (_attrs.indexOf(attr) > -1) { return; }
    _attrs.push(attr);
    _ctors[attr] = defs[attr];
  });
  [...document.all].map(el => _queryList(el, _mount));
}

function _handleMutations(ms) { // Mutations
  ms.forEach(m => {
    switch(m.type) {
      case 'childList': {
        m.addedNodes.forEach(n => _queryList(n, _mount));
        m.removedNodes.forEach(n => _queryList(n, _unmount));
        break;
      }
      case 'attributes': {
        if (!_attrs.includes(m.attributeName)) { return; }
        m.target.getAttributeNames().includes(m.attributeName)
          ? _mount(m.target, m.attributeName)
          : _unmount(m.target, m.attributeName);
        break;
      }
      default: { break; }
    }
  });
}

function _queryList(n, cb) { // Node, Callback
  if (n.nodeType !== 1) { return; }
  _attrs.forEach(a => {
    if (n.getAttributeNames().includes(a)) { cb(n, a); }
    n.querySelectorAll(`[${a}]`).forEach(el => {
      cb(el, a);
    });
  });
}

function _mount(n, a) { // Node, Attribute
  if (!_insts.has(n)) { _insts.set(n, {}); }
  const el = _insts.get(n);
  if (el[a]) { return; }
  el[a] = new _ctors[a]();
  el[a].element = n;
  el[a].connectedCallback();
}

function _unmount(n, a) { // Node, Attribute
  const el = _insts.get(n);
  if (!el) { return; }
  if (!el[a]) { return; }
  el[a].disconnectedCallback();
  delete el[a];
  if (!Object.entries(el).length) { _insts.delete(n); }
}

new MutationObserver(_handleMutations).observe(
  document,
  { 
    childList: true,
    subtree: true,
    attributes: true 
  },
);

export {Attribute};