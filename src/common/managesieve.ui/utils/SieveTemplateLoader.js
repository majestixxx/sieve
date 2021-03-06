/*
 * The content of this file is licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

(function (exports) {

  "use strict";

  /* global $ */
  const { SieveLogger } = require("./SieveLogger.js");
  const { SieveI18n } = require("./SieveI18n.js");

  /**
   * Loads an html fragment from a file or url.
   */
  class SieveTemplateLoader {

    /**
     * Gets an instance of the default i18n
     *
     * @returns {SieveI18n}
     *   a reference to an i18n instance.
     */
    getI18n() {
      return SieveI18n.getInstance();
    }

    /**
     * Gets an instance of the default logger.
     *
     * @returns {SieveLogger}
     *   a reference to a logger instance.
     */
    getLogger() {
      return SieveLogger.getInstance();
    }

    /**
     * Translates a loaded template.
     * It queries all data-i18n and translates all elements found.
     *
     * @param {DocumentFragment} fragment
     *   the template which should be translated.
     * @returns {DocumentFragment}
     *   the translated template.
     */
    translate(fragment) {

      // Check if a translator is attached to this loader...
      // if ((typeof(this.i18n) === "undefined") || (this.i18n === null))
      //  return fragment;

      // Get all elements with a data-i18n tag from the fragment.
      for (const elm of fragment.querySelectorAll('[data-i18n]')) {

        const entity = elm.dataset.i18n;

        // We translate the placeholder on HTML Elements
        if ((elm instanceof HTMLInputElement) && (elm.type === "text")) {
          try {
            elm.placeholder = this.getI18n().getString(entity);
          } catch (ex) {
            this.getLogger().logI18n(ex);
          }
          continue;
        }

        // Warn if text content is not empty.
        if (elm.textContent.trim() !== "") {
          this.getLogger().logI18n(`Text node for ${entity} not empty, replacing existing text`);
        }

        // Get the translation and update the text...
        try {
          elm.textContent = this.getI18n().getString(entity);
        } catch (ex) {
          this.getLogger().logI18n(ex);
          elm.classList.add("alert-danger");
          elm.textContent = entity;
        }
      }

      return fragment;
    }


    /**
     * Loads an html fragment from file or url
     *
     * @param {string} tpl
     *   the path tho the template file
     * @returns {Promise<HTMLElement>}
     *   the template which should be loaded.
     */
    async load(tpl) {

      // ensure we bypass any caching...
      tpl += "?_=" + (new Date().getTime());

      this.getLogger().logWidget(`Load template ${tpl}`);

      return await new Promise((resolve, reject) => {

        const onError = (status, text) => {
          this.getLogger().logWidget(`Loading template ${tpl} failed\n ${status} ${text}`);

          reject(new Error(`Failed to load resource. ${tpl}`));
        };

        const onSuccess = (content) => {
          this.getLogger().logWidget(`Template ${tpl} loaded`);

          resolve($(this.translate(content).children));
        };

        $("<template />").load(tpl,
          function (response, status, xhr) {
            if (status === "error") {
              onError(xhr.status, xhr.statusText);
              return;
            }

            onSuccess(this.content);
          });
      });
    }
  }

  if (typeof (module) !== "undefined" && module && module.exports)
    module.exports.SieveTemplateLoader = SieveTemplateLoader;
  else
    exports.SieveTemplateLoader = SieveTemplateLoader;

})(this);
