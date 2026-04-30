import {
  every,
  forEach,
  isArray
} from 'min-dash';

import {
  is
} from '../../util/ModelUtil';

import {
  isLabel
} from '../../util/LabelUtil';

import { isConnection } from 'diagram-js/lib/util/ModelUtil';

/**
 * @typedef {import('../modeling/Modeling').default} Modeling
 * @typedef {import('diagram-js/lib/features/popup-menu/PopupMenu').default} PopupMenu
 * @typedef {import('diagram-js/lib/i18n/translate/translate').default} Translate
 *
 * @typedef {import('../../model/Types').Element} Element
 *
 * @typedef {import('diagram-js/lib/features/popup-menu/PopupMenuProvider').PopupMenuEntries} PopupMenuEntries
 * @typedef {import('diagram-js/lib/features/popup-menu/PopupMenu').PopupMenuTarget} PopupMenuTarget
 */

var PALETTE = [
  {
    id: 'blue',
    label: 'Ocean blue',
    fill: '#E8F3FF',
    stroke: '#2563EB'
  },
  {
    id: 'green',
    label: 'Mint green',
    fill: '#E8FFF3',
    stroke: '#059669'
  },
  {
    id: 'amber',
    label: 'Warm amber',
    fill: '#FFF4D6',
    stroke: '#D97706'
  },
  {
    id: 'red',
    label: 'Rose red',
    fill: '#FFE4E6',
    stroke: '#E11D48'
  },
  {
    id: 'teal',
    label: 'Deep teal',
    fill: '#E6FFFB',
    stroke: '#0F766E'
  },
  {
    id: 'gray',
    label: 'Slate gray',
    fill: '#F3F4F6',
    stroke: '#4B5563'
  }
];

/**
 * @param {string} fill
 * @param {string} stroke
 *
 * @return {string}
 */
function createSwatch(fill, stroke) {
  return `
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2" y="2" width="16" height="16" rx="4" fill="${ fill }" stroke="${ stroke }" stroke-width="2"></rect>
    </svg>
  `;
}

/**
 * @implements {import('diagram-js/lib/features/popup-menu/PopupMenuProvider').default}
 *
 * @param {PopupMenu} popupMenu
 * @param {Modeling} modeling
 * @param {Translate} translate
 */
export default function ColorPickerMenuProvider(popupMenu, modeling, translate) {
  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._translate = translate;

  popupMenu.registerProvider('bpmn-color-picker', this);
}

ColorPickerMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'translate'
];

/**
 * @param {PopupMenuTarget} target
 *
 * @return {PopupMenuEntries}
 */
ColorPickerMenuProvider.prototype.getPopupMenuEntries = function(target) {
  var entries = {};

  if (!this._isAllowed(target)) {
    return entries;
  }

  var modeling = this._modeling,
      popupMenu = this._popupMenu,
      translate = this._translate;

  forEach(PALETTE, function(color) {
    entries[ 'set-color-' + color.id ] = {
      group: 'color',
      title: translate(color.label),
      className: 'bjs-color-picker-entry',
      imageHtml: createSwatch(color.fill, color.stroke),
      action: function() {
        modeling.setColor(target, {
          fill: color.fill,
          stroke: color.stroke
        });

        popupMenu.close();
      }
    };
  });

  entries['set-color-reset'] = {
    group: 'color',
    title: translate('Reset colors'),
    className: 'bjs-color-picker-entry',
    imageHtml: `
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <rect x="2" y="2" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#6B7280" stroke-width="2"></rect>
        <path d="M5 15 L15 5" stroke="#DC2626" stroke-width="2" stroke-linecap="round"></path>
      </svg>
    `,
    action: function() {
      modeling.setColor(target);
      popupMenu.close();
    }
  };

  return entries;
};

ColorPickerMenuProvider.prototype._isAllowed = function(target) {
  if (isArray(target)) {
    return target.length > 0 && every(target, isColorable);
  }

  return isColorable(target);
};

function isColorable(element) {
  return !!element &&
    !isLabel(element) &&
    !isConnection(element) &&
    !is(element, 'bpmn:Process') &&
    !is(element, 'bpmn:Collaboration') &&
    !is(element, 'bpmn:ParticipantMultiplicity');
}
