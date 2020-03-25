goog.provide('annotorious.Editor');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.soy');
goog.require('goog.string.html.htmlSanitize');
goog.require('goog.style');
goog.require('goog.ui.Textarea');

goog.require('goog.events');
goog.require('goog.events.EventType');

goog.require('annotorious.templates');

/**
 * Annotation edit form.
 * @param {Object} annotator reference to the annotator
 * @constructor
 */
annotorious.Editor = function(annotator) {
  this.element = goog.soy.renderAsElement(annotorious.templates.editform);

  /** @private **/
  this._annotator = annotator;

  /** @private **/
  this._item = annotator.getItem();

  /** @private **/
  this._original_annotation;

  /** @private **/
  this._current_annotation;

  /**@private **/
  this._dropdown = goog.dom.query('.annotorious-selection', this.element)[0];
  // this._dropdown = goog.dom.getElement('dropdown');

  /** @private **/
  this._extraFields = [];

  var self = this;

  // goog.events.listen(this._dropdown, goog.ui.Component.EventType.ACTION, function(e) {
  //       e.preventDefault();
  //        console.log('Dropdown clicked...');
  //        var dropdown = e.target.value;
  //        console.log("Selected " + dropdown);
  //      });

   goog.events.listen(this._dropdown, goog.events.EventType.CHANGE,
          function(e) {
            console.log('Dropdown selected');
            var value = e.target.value;
              if (self._dropdown.selectedIndex > 0) {
                var annotation = self.getAnnotation(value);
                annotator.addAnnotation(annotation);
                annotator.stopSelection();
                self._dropdown.selectedIndex = 0; // reset dropdown

                if (self._original_annotation)
                  annotator.fireEvent(annotorious.events.EventType.ANNOTATION_UPDATED, annotation, annotator.getItem());
                else
                  annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CREATED, annotation, annotator.getItem());
                self.close();
              } else {
                annotator.stopSelection(self._original_annotation);
                self.close();
              }
          });

  goog.style.showElement(this.element, false);
  goog.dom.appendChild(annotator.element, this.element);
}

/**
 * Opens the edit form with an annotation.
 * @param {annotorious.Annotation=} opt_annotation the annotation to edit (or undefined)
 * @param {Object=} opt_event the event, if any
 */
annotorious.Editor.prototype.open = function(opt_annotation, opt_event) {
  this._original_annotation = opt_annotation;
  this._current_annotation = opt_annotation;

  if (opt_annotation)
    this._textarea.setValue(opt_annotation.text);

  goog.style.showElement(this.element, true);
  this._textarea.getElement().focus();

  // Update extra fields (if any)
  goog.array.forEach(this._extraFields, function(field) {
    var f = field.fn(opt_annotation);
    if (goog.isString(f))  {
      field.el.innerHTML = f;
    } else if (goog.dom.isElement(f)) {
      goog.dom.removeChildren(field.el);
      goog.dom.appendChild(field.el, f);
    }
  });
  this._annotator.fireEvent(annotorious.events.EventType.EDITOR_SHOWN, opt_annotation);
}

/**
 * Closes the editor.
 */
annotorious.Editor.prototype.close = function() {
  goog.style.showElement(this.element, false);
}

/**
 * Sets the position (i.e. CSS left/top value) of the editor element.
 * @param {annotorious.shape.geom.Point} xy the viewport coordinate
 */
annotorious.Editor.prototype.setPosition = function(xy) {
  goog.style.setPosition(this.element, xy.x, xy.y);
}

/**
 * Returns the annotation that is the current state of the editor.
 * @return {annotorious.Annotation} the annotation
 */
annotorious.Editor.prototype.getAnnotation = function(value) {
  var sanitized = goog.string.html.htmlSanitize(value, function(url) {
    return url;
  });

  if (this._current_annotation) {
    this._current_annotation.text = sanitized;
  } else {
    this._current_annotation =
      new annotorious.Annotation(this._item.src, sanitized, this._annotator.getActiveSelector().getShape());
  }

  return this._current_annotation;
}

/** API exports **/
annotorious.Editor.prototype['addField'] = annotorious.Editor.prototype.addField;
annotorious.Editor.prototype['getAnnotation'] = annotorious.Editor.prototype.getAnnotation;
