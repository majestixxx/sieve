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

  const { SieveLogger } = require("./SieveLogger.js");
  const { SieveAbstractIpcClient } = require("./SieveAbstractIpcClient.js");

  /**
   * Implements a IPC based on the postMessage interface.
   */
  class SieveIpcClient extends SieveAbstractIpcClient {

    /**
     * @inheritdoc
     */
    static getLogger() {
      return SieveLogger.getInstance();
    }

    /**
     * @inheritdoc
     */
    static parseMessageFromEvent(e) {
      return JSON.parse(e.data);
    }

    /**
     * @inheritdoc
     */
    static dispatch(message, target, origin) {
      if (origin === undefined)
        origin = "*";

      if (target === undefined)
        target = parent;

      if (typeof (message) !== 'string') {
        message = JSON.stringify(message);
      }

      this.getLogger().logIpcMessage(`Sending message ${message}`);

      if (target !== window) {
        target.postMessage(message, origin);
        return;
      }

      for (let idx = 0; idx < frames.length; idx++)
        frames[idx].postMessage(message, origin);
    }

    /**
     * @inheritdoc
     */
    static onMessage(e) {
      if (e.source === window)
        return;

      super.onMessage(e);
    }
  }

  window.addEventListener("message", (ev) => { SieveIpcClient.onMessage(ev); }, false);

  // Require modules need to use export.module
  if (typeof (module) !== "undefined" && module && module.exports)
    module.exports.SieveIpcClient = SieveIpcClient;
  else
    exports.SieveIpcClient = SieveIpcClient;

})(this);

