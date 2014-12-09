###
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
------------------------------------------------------------------------------

###
#
#
#

module.exports =

    # ****************************************************************************
    # ****************************************************************************
    # ****************************************************************************
    # Module-internal implementation functions exports for white box testing.
    #
    #

    # ==============================================================================
    createResourceString: (options_, results_) ->
        "[object name='#{results_.namespaceEffectiveKey}' " +
        "for descriptor path='#{options_.targetNamespaceDescriptor.path}' " +
        "of declared namespace type='#{options_.targetNamespaceDescriptor.namespaceType}']"



    # ==============================================================================
    checkValidDescriptorResolveOptions: (options_, isOpenResolve_) ->
        if not (options_? and options_)
            return false

        openResult = 
            options_.parentDataReference? and options_.parentDataReference and
            options_.targetNamespaceDescriptor? and options_.targetNamespaceDescriptor and
            options_.targetNamespaceDescriptor.archetypePathId? and options_.targetNamespaceDescriptor.archetypePathId and
            true or false

        if not (isOpenResolve_? and isOpenResolve_)
            return openResult and
                options_.targetNamespaceKey? and
                options_.semanticBindingsReference? and options_.semanticBindingsReference and
                options_.propertyAssignmentObject? and options_.propertyAssignmentObject and
                true or false

        openResult



    # ==============================================================================
    checkValidDescriptorResolveResults: (results_) ->
        results_? and results_ and
            results_.namespaceEffectiveKey? and results_.namespaceEffectiveKey and
            results_.namespaceDataReference? and results_.namespaceDataReference and
            results_.pendingNamespaceDescriptors? and results_.pendingNamespaceDescriptors and
            Array.isArray(results_.pendingNamespaceDescriptors) and
            true or false






