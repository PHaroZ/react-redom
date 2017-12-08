# react-redom

React.createElement wrapper. The purpose of this wrapper is to work without JSX and create elements with a single hash param.

## Usage

```js
var r = require('react-redom');

var MyCmp = React.createClass({
      render : function render() {
        // create a div with a contentText
        return r('span', this.props.myProp);
      }
    });

module.exports = React.createClass({
      render : function render() {
        return r({
              _type : 'div.class1.class2',               // create a <div class="class1 class2">
              children : {                               // add one child
                _type : 'div',                           // a new html <div>
                className : 'subclass',                  // with class="subclass"
                children : [1, 2, 3].map(function(i) {   // with multiple children
                      return {
                        _type : i != 2           // a fake functionnal test
                            ? MyCmp              // create an instance of MyCmp
                            : r.NullType,        // or a special type which is finally ignored
                        myProp : 'myValue' + i   // a prop for MyCmp
                      };
                    })
              }
            });
      }
    });

// finally this should create the following html snippet :
// <div class="class1 class2"><div class="subclass"><span>myValue1</span><span>myValue3</span></div></div>
```

## Documentation

#### `r(component, [properties], [children])`

Returns a React element

- **component** `Function|String|Object` - A React.js Component class or an HTML tag. If it's an `Object` the properties `component._type` whould be extracted and considered as **component**, the properties `component.children` whould be extracted and considered as **children**, the rest is kept and considered as **properties**
- **properties** `Object` *optional* - props of the component
- **children** `Array|Object|String` *optional* - An array of `Object|String` or an `Object|String` which will be passed as single argument of this method
