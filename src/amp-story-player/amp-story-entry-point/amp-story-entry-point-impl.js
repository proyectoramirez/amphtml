/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Source for this constant is css/amp-story-entry-point.css
import {AmpStoryPlayer} from '../amp-story-player-impl';
import {cssText} from '../../../build/amp-story-entry-point.css';

/** @const {string} */
export const STORY_URL_ATTRIBUTE = 'storyUrl';

/**
 * <amp-story-entry-point> component for embedding stories and launching them in
 * the <amp-story-player>.
 *
 * Note that this is a vanilla JavaScript class and should not depend on AMP
 * services, as v0.js is not expected to be loaded in this context.
 */
export class AmpStoryEntryPoint {
  /**
   * @param {!Window} win
   * @param {!Element} element
   * @constructor
   */
  constructor(win, element) {
    console./*OK*/ assert(
      element.hasAttribute('storyUrl'),
      'Missing story URL.'
    );

    /** @private {!Window} */
    this.win_ = win;

    /** @private {!Element} */
    this.element_ = element;

    /** @private {!Document} */
    this.doc_ = this.win_.document;

    /** @private {boolean} */
    this.isBuilt_ = false;

    /** @private {boolean} */
    this.isLaidOut_ = false;

    /** @private {?Element} */
    this.rootEl_ = null;

    /** @private {?AmpStoryPlayer} */
    this.player_ = null;

    /** @private {string} */
    this.storyUrl_ = this.element_.getAttribute('storyUrl');
  }

  /** @public */
  buildCallback() {
    if (this.isBuilt_) {
      return;
    }

    this.initializeShadowRoot_();
    this.buildPlayer();

    this.isBuilt_ = true;
  }

  /**
   *
   */
  buildPlayer() {
    const playerEl = this.doc_.createElement('amp-story-player');
    playerEl.setAttribute('autoplay', '');
    playerEl.setAttribute('circular', '');

    const story = this.doc_.createElement('a');
    story.href = this.storyUrl_;
    playerEl.appendChild(story);

    this.player_ = new AmpStoryPlayer(this.win_, playerEl);
    //this.player_.add([{href: this.storyUrl_}]);
    this.player_.buildCallback();

    this.rootEl_.appendChild(playerEl);
  }

  /** @public */
  layoutCallback() {
    if (this.isLaidOut_) {
      return;
    }

    this.player_.layoutCallback();

    this.isLaidOut_ = true;
  }

  /** @private */
  initializeShadowRoot_() {
    this.rootEl_ = this.doc_.createElement('main');

    // Create shadow root
    const shadowRoot = this.element_.attachShadow({mode: 'open'});

    // Inject default styles
    const styleEl = this.doc_.createElement('style');
    styleEl.textContent = cssText;
    shadowRoot.appendChild(styleEl);
    shadowRoot.appendChild(this.rootEl_);
  }

  /**
   * @public
   * @return {!Element}
   */
  getElement() {
    return this.element_;
  }
}
