import {
  assign
} from 'min-dash';

/**
 * @typedef {import('diagram-js/lib/core/Canvas').default} Canvas
 * @typedef {import('diagram-js/lib/features/context-pad/ContextPad').default} ContextPad
 * @typedef {import('diagram-js/lib/features/popup-menu/PopupMenu').default} PopupMenu
 * @typedef {import('diagram-js/lib/i18n/translate/translate').default} Translate
 *
 * @typedef {import('../../model/Types').Element} Element
 * @typedef {import('diagram-js/lib/features/context-pad/ContextPad').ContextPadEntries} ContextPadEntries
 * @typedef {import('diagram-js/lib/features/context-pad/ContextPadProvider').default<Element>} ContextPadProvider
 */

var LOW_PRIORITY = 900;

var PALETTE_ICON = `
  <div class="entry">
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="3" fill="#E8F3FF" stroke="#2563EB" stroke-width="2"></rect>
      <circle cx="9" cy="10" r="1.3" fill="#F97316"></circle>
      <circle cx="15" cy="10" r="1.3" fill="#10B981"></circle>
      <circle cx="9" cy="15" r="1.3" fill="#E11D48"></circle>
      <circle cx="15" cy="15" r="1.3" fill="#4B5563"></circle>
    </svg>
  </div>
`;

/**
 * @implements {ContextPadProvider}
 *
 * @param {ContextPad} contextPad
 * @param {PopupMenu} popupMenu
 * @param {Translate} translate
 * @param {Canvas} canvas
 */
export default function ColorPickerContextPadProvider(contextPad, popupMenu, translate, canvas) {

  contextPad.registerProvider(LOW_PRIORITY, this);

  this._contextPad = contextPad;
  this._popupMenu = popupMenu;
  this._translate = translate;
  this._canvas = canvas;
}

ColorPickerContextPadProvider.$inject = [
  'contextPad',
  'popupMenu',
  'translate',
  'canvas'
];

/**
 * @param {Element} element
 *
 * @return {ContextPadEntries}
 */
ColorPickerContextPadProvider.prototype.getContextPadEntries = function(element) {
  var actions = {};

  if (this._isAllowed(element)) {
    assign(actions, this._getEntries(element));
  }

  return actions;
};

/**
 * @param {Element[]} elements
 *
 * @return {ContextPadEntries}
 */
ColorPickerContextPadProvider.prototype.getMultiElementContextPadEntries = function(elements) {
  var actions = {};

  if (this._isAllowed(elements)) {
    assign(actions, this._getEntries(elements));
  }

  return actions;
};

ColorPickerContextPadProvider.prototype._isAllowed = function(target) {
  return !this._popupMenu.isEmpty(target, 'bpmn-color-picker');
};

ColorPickerContextPadProvider.prototype._getEntries = function() {
  var self = this;

  return {
    'set-color': {
      group: 'edit',
      title: self._translate('Set color'),
      html: PALETTE_ICON,
      action: {
        click: function(event, target) {
          var position = self._getMenuPosition(target);

          assign(position, {
            cursor: {
              x: event.x,
              y: event.y
            }
          });

          self._popupMenu.open(target, 'bpmn-color-picker', position, {
            title: self._translate('Set color'),
            width: 260
          });
        }
      }
    }
  };
};

ColorPickerContextPadProvider.prototype._getMenuPosition = function(target) {
  var Y_OFFSET = 5;

  var pad = this._contextPad.getPad(target).html;

  var padRect = pad.getBoundingClientRect();

  return {
    x: padRect.left,
    y: padRect.bottom + Y_OFFSET
  };
};
