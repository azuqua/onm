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

    ### open existing namespace policy implementation
    - open existing namespace
    - throw if namespace does not exist
    - write declared property values specified in caller-provided data
    - visit declared child namespaces and queue deferred resolves based on caller-provided data only
    - overlay namespace data with remaining, caller-provided properties
    ###

    policyName: 'update exisiting namespace properties'

    # ----------------------------------------------------------------------------
    processNamespaceProperty: (context_, name_, declaration_) ->
        input = context_.input
        output = context_.output
        if not (input.propertyAssignmentObject? and input.propertyAssignmentObject)
            return true
        value = input.propertyAssignmentObject[name_]
        if not propertyCommonLib.checkValidPropertyValue value
            return true
        delete context_.input.propertyAssignmentObject[name_]
        output = context_.output
        output.namespaceDataReference[name_] = value
        output.dataChangeEventJournal.push
            layer: 'namedObject'
            event: 'propertyUpdated'
            eventData:
                name: name_
                model: true
                value: JSON.stringify(value)
                source: 'data'
        true

    # ----------------------------------------------------------------------------
    processSubnamespace: (context_, descriptor_) ->
        true

    # ----------------------------------------------------------------------------
    processPropertyOptions: (context_) ->
        true

    # ----------------------------------------------------------------------------
    finalizeContext: (context_) ->
        true



