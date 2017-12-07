var React = require('react');
var _ = require('lodash');

var re = function(component, properties, children) {
	if (_.isObject(component) && 1 == arguments.length && component._type) {
		properties = component;
		{
			component = properties._type;
			delete properties._type;
		}
		if (properties._dangerousHtml) {
			properties.dangerouslySetInnerHTML = {
				__html : properties._dangerousHtml
			};
			delete properties._dangerousHtml;
		}
		if (properties.children) {
			children = _.isArray(properties.children) ? _.flattenDeep(properties.children) : [properties.children];
			delete properties.children;
			children = _.map(children, function(child) {
						if (child && !React.isValidElement(child) && _.isObject(child)) {
							child = re(child);
						}
						return child;
					});
		}
	} else if (!children
			&& properties
			&& (_.isString(properties) || React.isValidElement(properties) || (!_.isPlainObject(properties)
					&& _.isArray(properties) && React.Children.count(properties) > 0))) {
		children = _.isArray(properties) ? properties : [properties];
		properties = {};
	} else {
		if (!properties) {
			properties = {};
		}
	}

	if (_.isString(component)) {
		var parts = component.split('.');
		if (parts.length > 1 && React.DOM.hasOwnProperty(parts[0])) {
			component = parts[0];
			properties.className = _.slice(parts, 1).join(' ');
		}
	} else {
		if (component == re.NullType) {
			return undefined;
		}

		// babel6+ compatibility
		// http://stackoverflow.com/questions/33704714/cant-require-default-export-value-in-babel-6-x
		if (_.isObject(component)) {
			var cd = component['default'];
			if (_.isFunction(cd)) {
				component = cd;
			}
		}
	}

	if (!children) {
		return React.createElement(component, properties);
	} else if (children.length === 1) {
		return React.createElement(component, properties, children[0]);
	} else {
		var args = new Array(children.length + 2);
		args[0] = component;
		args[1] = properties;
		for (var i = 0; i < children.length; i++) {
			args[i + 2] = children[i];
		}
		return React.createElement.apply(React, args);
	}
	// return r(component, properties, children);
}
re.NullType = {};

module.exports = re;

