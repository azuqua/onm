###
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

###
#
#
#

propertyCommonLib = require './onm-named-object-property-policy-common'

module.exports =

    ### create new namespace policy implementation
    - create new namespace
    - throw if namespace already exists
    - initialize all declared namespace properties to value (first):
      1. caller-provided value
      2. declared default value
    - visit declared subnamespaces and queue deferred resolves based on data model and caller-supplied data
    - overlay namespace data with remaining, caller-provided properties
    ###

    # ----------------------------------------------------------------------------
    policyName: 'initialize namespace properties'

    # ----------------------------------------------------------------------------
    processNamespaceProperty: (context_, name_, declaration_) ->
        valueFromCallerData = false
        value = context_.input.propertyAssignmentObject[name_]
        if propertyCommonLib.checkValidPropertyValue value
            delete context_.input.propertyAssignmentObject[name_]
            valueFromCallerData = true
        else
            value = declaration_.defaultValue
            if not propertyCommonLib.checkValidPropertyValue value
                value = declaration_.fnCreate? and declaration_.fnCreate and declaration_.fnCreate() or undefined
                if not propertyCommonLib.checkValidPropertyValue value
                    throw new Error "Internal data model consistency check error: Cannot deduce value to assign to property name '#{name_}'."
        output = context_.output
        output.namespaceDataReference[name_] = value
        output.dataChangeEventJournal.push
            layer: 'namedObject'
            event: 'propertyInitialized'
            eventData:
                name: name_
                model: true
                value: JSON.stringify(value)
                source: valueFromCallerData and 'data' or 'model'
        true

    # ----------------------------------------------------------------------------
    processSubnamespace: (context_, descriptor_) ->
        propertyAssignmentObject = context_.input.propertyAssignmentObject
        # TODO: This could stand a little reduction via refactor to eliminate common code
        switch descriptor_.namespaceType
            when 'component'
                deleteKeyNames = []
                for keyName, subcomponentPropertyAssignmentObject of propertyAssignmentObject
                    if not propertyCommonLib.checkValidNamedObject subcomponentPropertyAssignmentObject
                        throw new Error "Caller data framing error: Expected '#{keyName}' to be a named object but instead found type '#{Object.prototype.toString.call(subcomponentPropertyAssignmentObject)}'."
                    deleteKeyNames.push keyName
                    context_.output.pendingResolutionStack.push
                        parentDataReference: context_.output.namespaceDataReference
                        targetNamespaceDescriptor: descriptor_
                        targetNamespaceKey: keyName
                        semanticBindingsReference: context_.input.semanticBindingsReference
                        propertyAssignmentObject: subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject or {}
                        strategy: 'create'

                while deleteKeyNames.length
                    delete context_.input.propertyAssignmentObject[deleteKeyNames.pop()]
                break
            else
                subcomponentPropertyAssignmentObject = propertyAssignmentObject[descriptor_.jsonTag]
                if subcomponentPropertyAssignmentObject? and subcomponentPropertyAssignmentObject
                    if not propertyCommonLib.checkValidNamedObject subcomponentPropertyAssignmentObject
                        throw new Error "Caller data framing error: Expected '#{keyName}' to be a named object but instead found type '#{Object.prototype.toString.call(subcomponentPropertyAssignmentObject)}'."
                    delete context_.input.propertyAssignmentObject[descriptor_.jsonTag]
                else
                    subcomponentPropertyAssignmentObject = {}
                context_.output.pendingResolutionStack.push {
                    parentDataReference: context_.output.namespaceDataReference
                    targetNamespaceDescriptor: descriptor_
                    targetNamespaceKey: ''
                    semanticBindingsReference: context_.input.semanticBindingsReference
                    propertyAssignmentObject: subcomponentPropertyAssignmentObject
                    strategy: 'create'
                }
                break
        true

    # ----------------------------------------------------------------------------
    processPropertyOptions: (context_) ->
        deleteKeyNames = []
        input = context_.input
        output = context_.output
        for propertyName, subObject of input.propertyAssignmentObject
            if not propertyCommonLib.checkValidPropertyValue subObject
                throw new Error "Invalid value for assignment to property name '#{propertyName}'."
            output.namespaceDataReference[propertyName] = subObject
            deleteKeyNames.push propertyName
            output.dataChangeEventJournal.push
                layer: 'namedObject'
                event: 'propertyInitialized'
                eventData:
                    name: propertyName
                    model: false
                    value: JSON.stringify(subObject)
                    source: 'data'
        while deleteKeyNames.length
            delete input.propertyAssignmentObject[deleteKeyNames.pop()]
        true

    # ----------------------------------------------------------------------------
    finalizeContext: (context_) ->
        true

