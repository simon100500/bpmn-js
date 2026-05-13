import { assign } from 'min-dash';

import TextUtil from 'diagram-js/lib/util/Text';

var DEFAULT_FONT_SIZE = 12;
var LINE_HEIGHT_RATIO = 1.2;

var MIN_TEXT_ANNOTATION_HEIGHT = 30;

/**
 * @typedef { {
 *   fontFamily: string;
 *   fontSize: number|string;
 *   fontWeight: string;
 *   lineHeight: number;
 * } } TextRendererStyle
 *
 * @typedef { {
 *   defaultStyle?: Partial<TextRendererStyle>;
 *   externalStyle?: Partial<TextRendererStyle>;
 * } } TextRendererConfig
 *
 * @typedef { import('diagram-js/lib/util/Text').TextLayoutConfig } TextLayoutConfig
 *
 * @typedef { import('diagram-js/lib/util/Types').Rect } Rect
 */


/**
 * Renders text and computes text bounding boxes.
 *
 * @param {TextRendererConfig} [config]
 */
export default function TextRenderer(config) {

  var defaultStyle,
      externalStyle,
      textUtil;

  var defaultStyleConfig = assign({}, config && config.defaultStyle || {}),
      externalStyleConfig = assign({}, config && config.externalStyle || {});

  updateStyles();

  /**
   * Get the new bounds of an externally rendered,
   * layouted label.
   *
   * @param {Rect} bounds
   * @param {string} text
   *
   * @return {Rect}
   */
  this.getExternalLabelBounds = function(bounds, text) {

    var layoutedDimensions = textUtil.getDimensions(text, {
      box: {
        width: 90,
        height: 30
      },
      style: externalStyle
    });

    // resize label shape to fit label text
    return {
      x: Math.round(bounds.x + bounds.width / 2 - layoutedDimensions.width / 2),
      y: Math.round(bounds.y),
      width: Math.ceil(layoutedDimensions.width),
      height: Math.ceil(layoutedDimensions.height)
    };

  };

  /**
   * Get the new bounds of text annotation.
   *
   * @param {Rect} bounds
   * @param {string} text
   *
   * @return {Rect}
   */
  this.getTextAnnotationBounds = function(bounds, text) {

    var layoutedDimensions = textUtil.getDimensions(text, {
      box: bounds,
      style: defaultStyle,
      align: 'left-top',
      padding: 5
    });

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: Math.max(MIN_TEXT_ANNOTATION_HEIGHT, Math.round(layoutedDimensions.height))
    };
  };

  /**
   * Create a layouted text element.
   *
   * @param {string} text
   * @param {TextLayoutConfig} [options]
   *
   * @return {SVGElement} rendered text
   */
  this.createText = function(text, options) {
    return textUtil.createText(text, options || {});
  };

  /**
   * Update renderer styles.
   *
   * @param {TextRendererConfig} [newConfig]
   *
   * @return { {
   *   defaultStyle: TextRendererStyle;
   *   externalStyle: TextRendererStyle;
   * } }
   */
  this.setStyle = function(newConfig) {
    newConfig = newConfig || {};

    assign(defaultStyleConfig, newConfig.defaultStyle || {});
    assign(externalStyleConfig, newConfig.externalStyle || {});

    updateStyles();

    return {
      defaultStyle: this.getDefaultStyle(),
      externalStyle: this.getExternalStyle()
    };
  };

  /**
   * Update font size for all rendered labels.
   *
   * @param {number|string} fontSize
   *
   * @return { {
   *   defaultStyle: TextRendererStyle;
   *   externalStyle: TextRendererStyle;
   * } }
   */
  this.setFontSize = function(fontSize) {
    var normalizedFontSize = normalizeFontSize(fontSize, DEFAULT_FONT_SIZE);

    return this.setStyle({
      defaultStyle: {
        fontSize: normalizedFontSize
      },
      externalStyle: {
        fontSize: normalizedFontSize - 1
      }
    });
  };

  /**
   * Get default text style.
   */
  this.getDefaultStyle = function() {
    return assign({}, defaultStyle);
  };

  /**
   * Get the external text style.
   */
  this.getExternalStyle = function() {
    return assign({}, externalStyle);
  };

  function updateStyles() {
    defaultStyle = assign({
      fontFamily: 'Arial, sans-serif',
      fontSize: DEFAULT_FONT_SIZE,
      fontWeight: 'normal',
      lineHeight: LINE_HEIGHT_RATIO
    }, defaultStyleConfig);

    defaultStyle.fontSize = normalizeFontSize(defaultStyle.fontSize, DEFAULT_FONT_SIZE);

    externalStyle = assign({}, defaultStyle, {
      fontSize: defaultStyle.fontSize - 1
    }, externalStyleConfig);

    externalStyle.fontSize = normalizeFontSize(externalStyle.fontSize, defaultStyle.fontSize - 1);

    textUtil = new TextUtil({
      style: defaultStyle
    });
  }

}

TextRenderer.$inject = [
  'config.textRenderer'
];


function normalizeFontSize(fontSize, fallback) {
  var normalizedFontSize = parseInt(fontSize, 10);

  return Number.isNaN(normalizedFontSize) ? fallback : normalizedFontSize;
}
