import {
  bootstrapModeler,
  getBpmnJS,
  inject
} from 'test/TestHelper';

import {
  query as domQuery
} from 'min-dom';

import colorPickerModule from 'lib/features/color-picker';
import modelingModule from 'lib/features/modeling';
import coreModule from 'lib/core';

describe('features/color-picker', function() {

  describe('context pad', function() {

    var testModules = [ colorPickerModule, modelingModule, coreModule ];

    var basicXML = require('../modeling/SetColor.bpmn');

    beforeEach(bootstrapModeler(basicXML, { modules: testModules }));

    it('should provide button to open menu', inject(function(elementRegistry, contextPad) {

      // given
      var task = elementRegistry.get('Task_1');

      // when
      contextPad.open(task);

      // then
      expect(getContextPadEntry(task, 'set-color')).to.exist;
    }));

    it('should open popup menu when item is clicked', inject(function(elementRegistry, contextPad, popupMenu) {

      // given
      var task = elementRegistry.get('Task_1');
      contextPad.open(task);

      // when
      getContextPadEntry(task, 'set-color').click();

      // then
      expect(popupMenu.isOpen()).to.be.true;
    }));

  });

  describe('popup menu', function() {

    var testModules = [ colorPickerModule, modelingModule, coreModule ];

    var basicXML = require('../modeling/SetColor.bpmn');

    beforeEach(bootstrapModeler(basicXML, { modules: testModules }));

    it('should set fill and stroke colors', inject(function(elementRegistry, popupMenu) {

      // given
      var task = elementRegistry.get('Task_1'),
          taskDi = task.di;

      popupMenu.open(task, 'bpmn-color-picker', {
        x: 0,
        y: 0
      });

      // when
      getPopupMenuEntry('set-color-blue').click();

      // then
      expect(taskDi.get('background-color')).to.equal('#E8F3FF');
      expect(taskDi.get('border-color')).to.equal('#2563EB');
    }));

    it('should provide button for multi selection', inject(function(elementRegistry, contextPad) {

      // given
      var elements = [
        elementRegistry.get('Task_1'),
        elementRegistry.get('StartEvent_1')
      ];

      // when
      contextPad.open(elements);

      // then
      expect(getContextPadEntry(elements, 'set-color')).to.exist;
    }));

  });

});

function getContextPadEntry(target, actionName) {
  return padQuery(getBpmnJS().invoke(function(contextPad) {
    return contextPad.getPad(target).html;
  }), 'data-action', actionName);
}

function getPopupMenuEntry(actionName) {
  return padQuery(getBpmnJS().invoke(function(popupMenu) {
    return popupMenu._current.container;
  }), 'data-id', actionName);
}

function padQuery(element, attribute, name) {
  return domQuery('[' + attribute + '="' + name + '"]', element);
}
