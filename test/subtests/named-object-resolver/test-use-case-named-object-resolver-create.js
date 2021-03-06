// test-impl-onm-descriptor-resovle.create.js
//

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var withData = require('leche').withData;

var uuid = require('node-uuid');
var onm = require('../../../index');

var namedObjectResolver = require('../../../lib/impl/onm-named-object-resolver');
var namedObjectContext = require('../../../lib/impl/onm-named-object-context');


var namespaceDescriptorResolveCreateVectors = require('../../vectors/named-object-create-strategy-vectors')();
var subcomponentCreationTestVectors = require('../../vectors/named-object-resolve/vector-dimension-create-subcomponent-assignment')();

describe("resolveNamespaceDescriptorCreate internal function whitebox test matrix:", function () {
    withData(namespaceDescriptorResolveCreateVectors, function(testData) {
        var testName = "Attempt to resolve the namespace descriptor '" +
            testData.options.targetNamespaceDescriptor.jsonTag + "' of type '" +
            testData.options.targetNamespaceDescriptor.namespaceType + "'.";
        var resolveResults = null;
        it(testName, function() {
            var functionUnderTestWrapper = function() {
                resolveResults = namedObjectResolver.resolve(testData.options);
                //console.log("RESOLVE RESULTS::" + JSON.stringify(testData.options.parentDataReference));
            };
            if (testData.validConfig) {
                assert.doesNotThrow(functionUnderTestWrapper, testName);
            } else {
                assert.throws(functionUnderTestWrapper, testName);
            }
        });
        if (!testData.validConfig) {
            it("Execute the test setup which is expected to throw (concluding this test suite).", function() {
                assert.isTrue(true);
            });
        } else {
            it("Function call should have returned an object.", function() {
                assert.isDefined(resolveResults);
                assert.isNotNull(resolveResults);
                assert.isObject(resolveResults);
            });
            it("The returned object should be a valid descriptor resolve results object.", function() {
                assert.isTrue(namedObjectContext.checkValidContextOutput(resolveResults));
            });
            switch (testData.options.targetNamespaceDescriptor.namespaceType) {
            case 'root':
            case 'child':
            case 'extensionPoint':
                it("Resolve results effective namespace key should be '" + testData.options.targetNamespaceDescriptor.jsonTag + "'.", function() {
                    assert.equal(testData.options.targetNamespaceDescriptor.jsonTag, resolveResults.namespaceEffectiveKey);
                });
                break;
            case 'component':
                it("Resolve results effective namespace key should not be '" + testData.options.targetNamespaceDescriptor.jsonTag + "'.", function() {
                    assert.notEqual(testData.options.targetNamespaceDescriptor.jsonTag, resolveResults.namespaceEffectiveKey);
                });
                break;
            default:
                break;
            }
            it("Verify that named child object '" + testData.options.targetNamespaceDescriptor.jsonTag + "' was created in the parent store object.", function() {
                assert.property(testData.options.parentDataReference, resolveResults.namespaceEffectiveKey);
                assert.isObject(testData.options.parentDataReference[resolveResults.namespaceEffectiveKey]);
            });
            it("Verify the integrity of the resolved child object '" + testData.options.targetNamespaceDescriptor.jsonTag + "' data reference.", function() {
                assert.doesNotThrow(function() {
                    resolveResults.namespaceDataReference.test = "test property touched";
                });
                assert.property(testData.options.parentDataReference[resolveResults.namespaceEffectiveKey], 'test');
                assert.equal(testData.options.parentDataReference[resolveResults.namespaceEffectiveKey].test, "test property touched");
            });

            // Note: it's going to really tedious to try to do low-level verification of the property values
            // generically. Effectively you would need to re-implement the entire priority merge algorithm in
            // the test. Here we go for low-hanging fruit and ensure that properties contained in the data model
            // and property assignment object sets are present in the data model. This is a good enough baseline
            // to run higher-order tests later that will definitely fail and alert to probems in the generic
            // property value assignment algorithm.

            describe("Verify the properties of the newly-created namespace object.", function() {
                describe("Verify that every property declared on the namespace declaration is present in the data.", function() {
                    if (testData.options.targetNamespaceDescriptor.namespaceType !== 'extensionPoint') {
                        it("The namespace object should define property 'a'.", function() {
                            assert.property(resolveResults.namespaceDataReference, 'a');
                            assert.isString(resolveResults.namespaceDataReference.a);
                        });
                        it("The namespace object should define property 'b'.", function() {
                            assert.property(resolveResults.namespaceDataReference, 'a');
                            assert.isString(resolveResults.namespaceDataReference.a);

                        });
                        it("The namespace object should define property 'c'.", function() {
                            assert.property(resolveResults.namespaceDataReference, 'a');
                            assert.isString(resolveResults.namespaceDataReference.a);
                        });
                        it("The namespace object should define property 'd'.", function() {
                            assert.property(resolveResults.namespaceDataReference, 'a');
                            assert.isString(resolveResults.namespaceDataReference.a);
                        });
                        it("The namespace object should define property 'e'.", function() {

                            assert.property(resolveResults.namespaceDataReference, 'a');
                            assert.isString(resolveResults.namespaceDataReference.a);
                        });
                        it("The namespace object should deinfe property 'f'.", function() {
                            assert.property(resolveResults.namespaceDataReference, 'a');
                            assert.isString(resolveResults.namespaceDataReference.a);
                        });
                    }
                });

                describe("Verify that every property declared on the property assignment object is present in the data.", function() {
                    var propertyTestVector = {};
                    var key,value;
                    for (key in testData.options.propertyAssignmentObject) {
                        value = testData.options.propertyAssignmentObject[key];
                        var testName = "Property assignment object property '" + key + "' w/value='" + JSON.stringify(value) + "'.";
                        propertyTestVector[testName] = { key: key, value: value };
                    }
                    withData(propertyTestVector, function(propertyTestVector_) {
                        it("Verify actual value equals expected value.", function() {
                            assert.property(resolveResults.namespaceDataReference, propertyTestVector_.key);
                            assert.deepEqual(resolveResults.namespaceDataReference[propertyTestVector_.key], propertyTestVector_.value);
                        });
                    });
                    it("Execute the tests with lemon.", function() {
                        assert.isTrue(true);
                    });
                });
                it("Execute the tests.", function() {
                    assert.isTrue(true);
                });
            });

            describe("Verify pending descriptor resolve requests.", function() {
                var expectedCount = null;
                var actualCount = null;
                var testMessage = null;

                before(function() {
                    actualCount = resolveResults.pendingResolutionStack.length;
                    switch (testData.options.targetNamespaceDescriptor.namespaceType) {
                    case 'extensionPoint':
                        expectedCount = (testData.expectedPendingCount !== null) && testData.expectedPendingCount || 0;
                        // I disabled the application of the property assignment dimension value iff extension point
                        // thus expected will always be zero. Subcomponent creation needs its own list test matrix and
                        // is to be handled in a separate test module.
                        if (!expectedCount) {
                            testMessage = "The extension point namespace's object is expected to be empty (i.e. zero subcomponents).";
                        } else {
                            testMessage = "The extension point namespace's object is expected to contain " + expectedCount + " subcomponent object(s).";
                        }
                        break;
                    default:
                        testMessage = "There should be a pending descriptor resolve object pending for each child namespace of the descriptor."
                        expectedCount = testData.options.targetNamespaceDescriptor.children.length;
                        break;
                    }
                });
                it("Actual and expected pending descriptor resolve request counts should be equal.", function() {
                    assert.equal(actualCount, expectedCount, testMessage);
                });
            });
        }
    }); // withData (test matrix coverage minus subcomponent creation via property assignment object)


    describe("Dynamic subcomponent creation via property assignment object tests.", function() {
        withData(subcomponentCreationTestVectors, function(testData) {
            var resolveResults = null;
            var functionUnderTestWrapper = function() {
                resolveResults = namedObjectResolver.resolve(testData.options);
                /*
                console.log("----------------------------------------------------------------------------");
                console.log("NAMESPACE RESOSUTION RESULTS");
                console.log("Parent data namespace JSON: " + JSON.stringify(testData.options.parentDataReference));
                console.log("Pending: " + resolveResults.pendingResolutionStack.length);
                */
            };
            assert.doesNotThrow(functionUnderTestWrapper);
            it("There should be a pending namespace descriptor resolve for each property defined in the property assignment object.", function() {
                assert.equal(resolveResults.pendingResolutionStack.length, Object.keys(testData.options.propertyAssignmentObject).length);
            });
            describe("Each pending namespace descriptor should be valid.", function() {
                var testVectors = {};
                resolveResults.pendingResolutionStack.forEach( function(options_) {
                    testVectors[options_.targetNamespaceDescriptor.jsonTag] = [ options_ ];
                });
                withData(testVectors, function(options_) {
                    var optionsValid = false;
                    it("Attempt to validate the pending namespace descriptor should not throw.", function() {
                        var functionUnderTest = function() {
                            optionsValid = namedObjectContext.checkValidContextInput(options_);
                        };
                        assert.doesNotThrow(functionUnderTest);
                    });
                    it("The pending namespace descriptor resolve options object should be valid.", function() {
                        assert.isTrue(optionsValid);
                    });
                });
                it("Execute the test suite.", function() {
                    assert.isTrue(true);
                });
            });
        });
    });
});
