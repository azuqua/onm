
/*
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2015 Encapsule Project
  
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

**** Encapsule Project :: Build better software with circuit models ****

OPEN SOURCES: http://github.com/Encapsule HOMEPAGE: http://Encapsule.org
BLOG: http://blog.encapsule.org TWITTER: https://twitter.com/Encapsule

------------------------------------------------------------------------------
------------------------------------------------------------------------------
 */

(function() {
  var namedObjectContextHelpers, namedObjectPropertyVisitor, namedObjectPropertyVisitorInterfaces, namedObjectResolver, resolveNamedObjectReference;

  namedObjectContextHelpers = require('./onm-named-object-context');

  namedObjectPropertyVisitor = require('./onm-named-object-property-visitor');

  namedObjectPropertyVisitorInterfaces = {
    open: require('./onm-named-object-property-policy-update'),
    create: require('./onm-named-object-property-policy-initialize')
  };

  module.exports = namedObjectResolver = {};

  namedObjectResolver.resolve = function(options_) {
    var context, continueEval, exception_, message, propertyResolutionPolicyInterface;
    try {
      if (!namedObjectContextHelpers.checkValidContextInput(options_)) {
        throw new Error("Internal test case failure: invalid options object in-parameter.");
      }
      context = namedObjectContextHelpers.initializeContextObject(options_);
      continueEval = resolveNamedObjectReference(context);
      propertyResolutionPolicyInterface = namedObjectPropertyVisitorInterfaces[context.output.strategyFollowed];
      continueEval = continueEval && namedObjectPropertyVisitor.visitNamespaceProperties(propertyResolutionPolicyInterface, context);
      continueEval = continueEval && namedObjectPropertyVisitor.visitNamespaceChildren(propertyResolutionPolicyInterface, context);
      continueEval = continueEval && namedObjectPropertyVisitor.processPropertyOptions(propertyResolutionPolicyInterface, context);
      continueEval = continueEval && namedObjectPropertyVisitor.finalizeContext(propertyResolutionPolicyInterface, context);
      if (!namedObjectContextHelpers.checkValidContextOutput(context.output)) {
        throw new Error("Internal test case failure: context.output object validation failed.");
      }
      return context.output;
    } catch (_error) {
      exception_ = _error;
      message = "namedObjectResolver.resolve failed :: " + exception_.message;
      throw new Error(message);
    }
  };

  namedObjectResolver.getResolvedNamedObjectReference = function(resolvedNamedObjectContext_) {
    var exception_, namespaceDataReference;
    try {
      if (!((resolvedNamedObjectContext_ != null) && resolvedNamedObjectContext_)) {
        throw new Error("Missing resolved named object context object in-parameter.");
      }
      namespaceDataReference = resolvedNamedObjectContext_.output.namespaceDataReference;
      if (!((namespaceDataReference != null) && namespaceDataReference && (typeof namespaceDataReference === 'object'))) {
        throw new Error("Resolved named object reference is undefined, null, or not an object as expected!");
      }
      return namespaceDataReference;
    } catch (_error) {
      exception_ = _error;
      throw new Error("namedObjectResolver failure: " + exception_.message);
    }
  };

  resolveNamedObjectReference = function(context_) {
    var descriptor, effectiveKey, exception_, input, output;
    try {
      input = context_.input;
      output = context_.output;
      descriptor = input.targetNamespaceDescriptor;
      output.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'component') && descriptor.jsonTag || input.targetNamespaceKey;
      output.namespaceDataReference = input.parentDataReference[effectiveKey];
      switch (input.strategy) {
        case 'open':
          if (!((output.namespaceDataReference != null) && output.namespaceDataReference)) {
            throw new Error("Named object at key '" + effectiveKey + "' does not exist.");
          }
          output.strategyFollowed = 'open';
          break;
        case 'create':
          if ((output.namespaceDataReference != null) && output.namespaceDataReference) {
            throw new Error("Named object at key '" + effectiveKey + "' already exists.");
          }
          output.strategyFollowed = 'create';
          break;
        case 'negotiate':
          output.strategyFollowed = (output.namespaceDataReference != null) && output.namespaceDataReference && 'open' || 'create';
          break;
        default:
          throw new Error("Unrecognized named object dereference strategy '" + input.strategy + "'.");
      }
      switch (output.strategyFollowed) {
        case 'open':
          break;
        case 'create':
          if (!((effectiveKey != null) && effectiveKey && (effectiveKey.length != null) && effectiveKey.length)) {
            output.namespaceEffectiveKey = effectiveKey = input.semanticBindingsReference.getUniqueKey();
          }
          output.namespaceDataReference = input.parentDataReference[effectiveKey] = {};
          output.dataChangeEventJournal.push({
            layer: 'namedObject',
            event: 'namedObjectCreated',
            eventData: {
              namespaceType: descriptor.namespaceType,
              namespaceModelPath: descriptor.path,
              namespaceModelId: descriptor.id,
              key: effectiveKey
            }
          });
          break;
      }
      output.resolvedId = input.targetNamespaceDescriptor.id;
      return true;
    } catch (_error) {
      exception_ = _error;
      throw new Error(exception_.message + (" ('" + descriptor.namespaceType + "' namespace '" + descriptor.jsonTag + "')."));
    }
  };

}).call(this);
