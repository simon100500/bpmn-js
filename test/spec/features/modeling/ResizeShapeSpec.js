import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import { pick } from 'min-dash';

import {
  getDi
} from 'lib/util/ModelUtil';

import modelingModule from 'lib/features/modeling';
import coreModule from 'lib/core';


describe('features/modeling - resize shape', function() {

  var diagramXML = require('../../../fixtures/bpmn/simple-resizable.bpmn');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('shape', function() {

    it('should resize', inject(function(elementRegistry, modeling) {

      // given
      var subProcessElement = elementRegistry.get('SubProcess_1'),
          originalWidth = subProcessElement.width;

      // when
      modeling.resizeShape(subProcessElement, { x: 339, y: 142, width: 250, height: 200 });

      // then
      expect(subProcessElement.width).to.equal(250);
      expect(subProcessElement.width).to.not.equal(originalWidth);

    }));


    it('should resize Group', inject(function(elementRegistry, modeling) {

      // given
      var group = elementRegistry.get('Group_1');

      // when
      modeling.resizeShape(group, { x: 264, y: 42, width: 550, height: 420 });

      // then
      expect(group).to.have.dimensions({
        width: 550,
        height: 420
      });

    }));


    describe('businessObject', function() {

      it('should update bounds', inject(function(elementRegistry, modeling) {

        // given
        var subProcessElement = elementRegistry.get('SubProcess_1');

        // when
        modeling.resizeShape(subProcessElement, { x: 339, y: 142, width: 250, height: 200 });

        // then
        var di = getDi(subProcessElement);
        expect(di.bounds.width).to.equal(250);
      }));


      it('should update group bounds', inject(function(elementRegistry, modeling) {

        // given
        var subProcessElement = elementRegistry.get('Group_1');

        // when
        modeling.resizeShape(subProcessElement, { x: 250, y: 250, width: 550, height: 400 });

        // then
        var di = getDi(subProcessElement);
        expect(di.bounds.width).to.equal(550);
      }));

    });


    describe('connected flow', function() {

      it('should resize', inject(function(elementRegistry, modeling, bpmnFactory) {

        // given
        var subProcessElement = elementRegistry.get('SubProcess_1');

        var sequenceFlowElement = elementRegistry.get('SequenceFlow_2'),
            sequenceFlowDi = getDi(sequenceFlowElement);

        // when

        // Decreasing width by 100px
        modeling.resizeShape(subProcessElement, { x: 339, y: 142, width: 250, height: 200 });

        // then

        // expect flow layout
        var diWaypoints = bpmnFactory.createDiWaypoints([
          { x: 589, y: 242 },
          { x: 821, y: 242 }
        ]);

        expect(sequenceFlowDi.waypoint).eql(diWaypoints);
      }));


      it('should move', inject(function(elementRegistry, modeling, bpmnFactory) {

        // given
        var subProcessElement = elementRegistry.get('SubProcess_1');

        var sequenceFlowElement = elementRegistry.get('SequenceFlow_2'),
            sequenceFlowDi = getDi(sequenceFlowElement);

        // when
        modeling.moveShape(subProcessElement, { x: -50, y: 0 });

        // then

        // expect flow layout
        var diWaypoints = bpmnFactory.createDiWaypoints([
          { x: 639, y: 242 },
          { x: 821, y: 242 }
        ]);

        expect(sequenceFlowDi.waypoint).eql(diWaypoints);
      }));

    });

  });


  describe('integration', function() {

    var diagramXML = require('../../../fixtures/bpmn/boundary-events.bpmn');

    var testModules = [ coreModule, modelingModule ];

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


    it('should not move Boundary Event if unnecessary', inject(function(elementRegistry, modeling) {

      // given
      var boundaryEvent = elementRegistry.get('BoundaryEvent_3'),
          originalPosition = getPosition(boundaryEvent),
          subProcessElement = elementRegistry.get('SubProcess_1');

      // when
      modeling.resizeShape(subProcessElement, { x: 204, y: 28, width: 400, height: 339 });

      // then
      expect(getPosition(boundaryEvent)).to.jsonEqual(originalPosition);
    }));

  });


  describe('data elements', function() {

    var diagramXML = require('../../../fixtures/bpmn/collaboration-data-items.bpmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    it('should resize DataObjectReference', inject(function(elementRegistry, modeling) {

      // given
      var dataObjectReference = elementRegistry.get('DataObjectReference_1');

      // when
      modeling.resizeShape(dataObjectReference, {
        x: dataObjectReference.x,
        y: dataObjectReference.y,
        width: 120,
        height: dataObjectReference.height
      });

      // then
      expect(dataObjectReference.width).to.equal(120);
      expect(getDi(dataObjectReference).bounds.width).to.equal(120);
    }));


    it('should resize DataStoreReference', inject(function(elementRegistry, modeling) {

      // given
      var dataStoreReference = elementRegistry.get('DataStoreReference_5');

      // when
      modeling.resizeShape(dataStoreReference, {
        x: dataStoreReference.x,
        y: dataStoreReference.y,
        width: 140,
        height: dataStoreReference.height
      });

      // then
      expect(dataStoreReference.width).to.equal(140);
      expect(getDi(dataStoreReference).bounds.width).to.equal(140);
    }));

  });


  describe('external labels', function() {

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    it('should resize StartEvent label', inject(function(elementRegistry, modeling) {

      // given
      var startEventLabel = elementRegistry.get('StartEvent_1_label');

      // when
      modeling.resizeShape(startEventLabel, {
        x: startEventLabel.x,
        y: startEventLabel.y,
        width: 140,
        height: startEventLabel.height
      });

      // then
      expect(startEventLabel.width).to.equal(140);
      expect(getDi(startEventLabel.labelTarget).label.bounds.width).to.equal(140);
    }));


    it('should resize EndEvent label', inject(function(elementRegistry, modeling) {

      // given
      var endEventLabel = elementRegistry.get('EndEvent_1_label');

      // when
      modeling.resizeShape(endEventLabel, {
        x: endEventLabel.x,
        y: endEventLabel.y,
        width: 150,
        height: endEventLabel.height
      });

      // then
      expect(endEventLabel.width).to.equal(150);
      expect(getDi(endEventLabel.labelTarget).label.bounds.width).to.equal(150);
    }));

  });


  describe('group labels', function() {

    var diagramXML = require('./UpdateLabel.bpmn');

    beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));

    it('should resize Group label', inject(function(elementRegistry, modeling) {

      // given
      var groupLabel = elementRegistry.get('Group_1_label');

      // when
      modeling.resizeShape(groupLabel, {
        x: groupLabel.x,
        y: groupLabel.y,
        width: 180,
        height: groupLabel.height
      });

      // then
      expect(groupLabel.width).to.equal(180);
      expect(getDi(groupLabel.labelTarget).label.bounds.width).to.equal(180);
    }));

  });

});

// helper /////
function getPosition(shape) {
  return pick(shape, [ 'x', 'y' ]);
}
