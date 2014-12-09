
/*
------------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2014 Encapsule Project
  
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

A namespace descriptor is a low-level, should-be-viewed-as-frozen object
maintained by onm.Model used to cache details about a specific namespace
declaration in an onm data model.

Namespace descriptor objects are the basis of AddressToken object implementation,
and are ultimately the source of truth when it comes to opening or creating
specifc JavaScript object references within the scope of an onm.Store object.

Recall that a "namespace" in the parlance of onm is a generic moniker for a
named JavaScript object that has one of several onm-defined possible object roles
assigned via its 'namespaceType' property value declaration.

Generically, this module implements the low-level policy over the opening
(i.e. the resolution of onm.Address resource locators against a specific
onm.Store addressable, in-memory data store), and the creation (i.e. allocation
and initialization via multi-way priority merge algorithm) of data namespaces
within the scope of an onm.Store.

onm.Store -> delegates to...
onm.Namespace -> delegates to ...
omm.AddressTokenResolver -> delegates to...
onm.NamespaceDescriptorResolver -> this module gets it done

------------------------------------------------------------------------------
 */

(function() {
  var implementation;

  implementation = require('./onm-descriptor-resolve-impl');

  module.exports = {
    resolveNamespaceDescriptorOpen: function(options_) {
      var exception_, resolveResults, resourceString;
      try {
        if (!implementation.checkValidDescriptorResolveOptions(options_, true)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        resolveResults = this.resolveNamespaceDescriptorOpenImpl(options_);
        if (!((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference)) {
          resourceString = this.createResourceString(options_, resolveResults);
          throw new Error("Cannot open expected child object in data: " + resourceString);
        }
        return resolveResults;
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescriptorOpen failure: " + exception_.message);
      }
    },
    resolveNamespaceDescriptorCreate: function(options_) {
      var assignedKeyValue, assignmentKeyValue, childNamespaceDescriptor, deleteKeyNames, deleteKeys, effectiveKeyValue, effectiveValue, exception_, functions, keyName, memberName, pendingDescriptorResolveOptions, propertiesDeclaration, propertyName, resolveResults, resourceString, subObject, subcomponentPropertyAssignmentObject, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      try {
        if (!implementation.checkValidDescriptorResolveOptions(options_)) {
          throw new Error("Invalid descriptor resolve options.");
        }
        resolveResults = this.resolveNamespaceDescriptorOpenImpl(options_);
        if ((resolveResults.namespaceDataReference != null) && resolveResults.namespaceDataReference) {
          resourceString = this.createResourceString(options_, resolveResults);
          throw new Error("Child object already exists in data: " + resourceString);
        }
        resolveResults.namespaceDataReference = options_.parentDataReference[resolveResults.namespaceEffectiveKey] = {};
        switch (options_.targetNamespaceDescriptor.namespaceType) {
          case 'root' || 'component':
            effectiveKeyValue = void 0;
            assignmentKeyValue = options_.semanticBindingsReference.getUniqueKey(options_.propertyAssignmentObject);
            if ((assignmentKeyValue != null) && assignmentKeyValue) {
              if (options_.targetNamespaceKey && (options_.targetNamespaceKey !== assignmentKeyValue)) {
                resourceString = this.createResourceString(options_, resolveResults);
                throw new Error("Contradictory onm component key values '" + assignmentKeyValue + "' !== '" + options_.targetNamespaceKey + "'.");
              }
              delete options_.propertyAssignmentObject[options_.semanticBindingsReference.keyPropertyName];
            }
            effectiveKeyValue = assignmentKeyValue || options_.targetNamespaceKey || void 0;
            assignedKeyValue = options_.semanticBindingsReference.setUniqueKey(resolveResults.namespaceDataReference, effectiveKeyValue);
            break;
          default:
            break;
        }
        propertiesDeclaration = options_.targetNamespaceDescriptor.namespaceModelPropertiesDeclaration;
        if ((propertiesDeclaration.userImmutable != null) && propertiesDeclaration.userImmutable) {
          _ref = propertiesDeclaration.userImmutable;
          for (memberName in _ref) {
            functions = _ref[memberName];
            if (resolveResults.namespaceDataReference[memberName]) {
              continue;
            }
            effectiveValue = options_.propertyAssignmentObject[memberName];
            if ((effectiveValue != null) && effectiveValue) {
              delete options_.propertyAssignmentObject[memberName];
            } else {
              effectiveValue = ((functions.defaultValue != null) && functions.defaultValue) || ((functions.fnCreate != null) && functions.fnCreate && functions.fnCreate()) || (function() {
                throw new Error("Internal error: Unable to determine how to assign declared property default value.");
              })();
            }
            resolveResults.namespaceDataReference[memberName] = effectiveValue;
          }
        }
        if ((propertiesDeclaration.userMutable != null) && propertiesDeclaration.userMutable) {
          _ref1 = propertiesDeclaration.userMutable;
          for (memberName in _ref1) {
            functions = _ref1[memberName];
            if (resolveResults.namespaceDataReference[memberName]) {
              continue;
            }
            effectiveValue = options_.propertyAssignmentObject[memberName];
            if ((effectiveValue != null) && effectiveValue) {
              delete options_.propertyAssignmentObject[memberName];
            } else {
              if ((functions.fnCreate != null) && functions.fnCreate) {
                effectiveValue = functions.fnCreate();
              } else {
                effectiveValue = functions.defaultValue;
              }
            }
            resolveResults.namespaceDataReference[memberName] = effectiveValue;
          }
        }
        _ref2 = options_.targetNamespaceDescriptor.children;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          childNamespaceDescriptor = _ref2[_i];
          switch (childNamespaceDescriptor.namespaceType) {
            case 'component':
              deleteKeyNames = [];
              _ref3 = options_.propertyAssignmentObject;
              for (keyName in _ref3) {
                subcomponentPropertyAssignmentObject = _ref3[keyName];
                pendingDescriptorResolveOptions = {
                  parentDataReference: resolveResults.namespaceDataReference,
                  targetNamespaceDescriptor: childNamespaceDescriptor,
                  targetNamespaceKey: keyName,
                  semanticBindingReference: options_.semanticBindingsReference,
                  propertyAssignmentObject: subcomponentPropertyAssignmentObject
                };
                resolveResults.pendingNamespaceDescriptors.push(pendingDescriptorResolveOptions);
                deleteKeyNames.push(keyName);
              }
              while (deleteKeyNames.length) {
                delete options_.propertyAssignmentObject[deleteKeyNames.pop()];
              }
              break;
            default:
              pendingDescriptorResolveOptions = {
                parentDataReference: resolveResults.namespaceDataReference,
                targetNamespaceDescriptor: childNamespaceDescriptor,
                targetNamespaceKey: '',
                semanticBindingReference: options_.semanticBindingsReference,
                propertyAssignmentObject: options_.propertyAssignmentObject[childNamespaceDescriptor.jsonTag]
              };
              resolveResults.pendingNamespaceDescriptors.push(pendingDescriptorResolveOptions);
              delete options_.propertyAssignmentObject[childNamespaceDescriptor.jsonTag];
          }
        }
        deleteKeys = [];
        _ref4 = options_.propertyAssignmentObject;
        for (propertyName in _ref4) {
          subObject = _ref4[propertyName];
          resolveResults.namespaceDataReference[propertyName] = subObject;
          deleteKeys.push(propertyName);
        }
        while (deleteKeys.length) {
          delete options_.propertyAssignmentObject[deleteKeys.pop()];
        }
        return resolveResults;
      } catch (_error) {
        exception_ = _error;
        throw new Error("resolveNamespaceDescriptorCreate failure: " + exception_.message);
      }
    },
    resolveNamespaceDescriptorOpenImpl: function(options_) {
      var descriptor, effectiveKey, key, resolveResults;
      resolveResults = {
        namespaceEffectiveKey: null,
        namespaceDataReference: null,
        pendingNamespaceDescriptors: []
      };
      descriptor = options_.targetNamespaceDescriptor;
      key = options_.targetNamespaceKey;
      resolveResults.namespaceEffectiveKey = effectiveKey = (descriptor.namespaceType !== 'extensionPoint') && descriptor.jsonTag || key;
      resolveResults.namespaceDataReference = options_.parentDataReference[effectiveKey];
      return resolveResults;
    },
    createResourceString: implementation.createResourceString,
    checkValidDescriptorResolveOptions: implementation.checkValidDescriptorResolveOptions,
    checkValidDescriptorResolveResults: implementation.checkValidDescriptorResolveResults
  };

}).call(this);