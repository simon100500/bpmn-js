import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';


describe('draw - TextRenderer', function() {

  var diagramXML = require('./TextRenderer.bpmn');


  describe('API', function() {

    beforeEach(bootstrapViewer(diagramXML));

    it('should expose #createText', inject(function(textRenderer) {

      // when
      var text = textRenderer.createText('FOO');

      // then
      expect(text).to.exist;
    }));


    it('should expose #getExternalLabelBounds', inject(function(textRenderer) {

      // given
      var bounds = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };

      // when
      var layoutedBounds = textRenderer.getExternalLabelBounds(
        bounds,
        'FOO\nBar\nFOOBAR'
      );

      // then
      expect(layoutedBounds).to.exist;

      expect(layoutedBounds.x).to.exist;
      expect(layoutedBounds.y).to.exist;
      expect(layoutedBounds.width).to.exist;
      expect(layoutedBounds.height).to.exist;
    }));


    it('should preserve external label width for reflow', inject(function(textRenderer) {

      // given
      var bounds = {
        x: 0,
        y: 0,
        width: 180,
        height: 30
      };

      // when
      var layoutedBounds = textRenderer.getExternalLabelBounds(
        bounds,
        'FOO BAR BAZ QUUX QUUZ'
      );

      // then
      expect(layoutedBounds.width).to.equal(180);
    }));


    it('should expose #getTextAnnotationBounds', inject(function(textRenderer) {

      // given
      var bounds = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };

      // when
      var layoutedBounds = textRenderer.getTextAnnotationBounds(
        bounds,
        'FOO\nBar\nFOOBAR'
      );

      // then
      expect(layoutedBounds).to.exist;

      expect(layoutedBounds.x).to.exist;
      expect(layoutedBounds.y).to.exist;
      expect(layoutedBounds.width).to.exist;
      expect(layoutedBounds.height).to.exist;
    }));

  });


  describe('style override', function() {

    beforeEach(bootstrapViewer(diagramXML, {
      textRenderer: {
        defaultStyle: {
          fontFamily: 'monospace',
          fontSize: '15px',
          lineHeight: '24px'
        },
        externalStyle: {
          fontWeight: 'bold'
        }
      }
    }));


    it('should render', inject(function(textRenderer) {

      // when
      var defaultStyle = textRenderer.getDefaultStyle();
      var externalStyle = textRenderer.getExternalStyle();

      // then
      expect(defaultStyle.fontFamily).to.eql('monospace');
      expect(defaultStyle.fontSize).to.eql('15px');
      expect(defaultStyle.lineHeight).to.eql('24px');

      expect(externalStyle.fontFamily).to.eql('monospace');
      expect(externalStyle.fontSize).to.eql(14);
      expect(externalStyle.fontWeight).to.eql('bold');
    }));

  });


  describe('font size API', function() {

    beforeEach(bootstrapViewer(diagramXML));

    it('should update default and external font size', inject(function(textRenderer) {

      // when
      textRenderer.setFontSize(18);

      var defaultStyle = textRenderer.getDefaultStyle();
      var externalStyle = textRenderer.getExternalStyle();

      // then
      expect(defaultStyle.fontSize).to.eql(18);
      expect(externalStyle.fontSize).to.eql(17);
    }));

  });

});
