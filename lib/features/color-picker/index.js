import ContextPadModule from 'diagram-js/lib/features/context-pad';
import PopupMenuModule from 'diagram-js/lib/features/popup-menu';

import ColorPickerContextPadProvider from './ColorPickerContextPadProvider';
import ColorPickerMenuProvider from './ColorPickerMenuProvider';

export default {
  __depends__: [
    ContextPadModule,
    PopupMenuModule
  ],
  __init__: [
    'colorPickerContextPadProvider',
    'colorPickerMenuProvider'
  ],
  colorPickerContextPadProvider: [ 'type', ColorPickerContextPadProvider ],
  colorPickerMenuProvider: [ 'type', ColorPickerMenuProvider ]
};
