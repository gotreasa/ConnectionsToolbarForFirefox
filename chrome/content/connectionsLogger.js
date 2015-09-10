/*
 * © Copyright IBM Corp. 2011, 2015
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */

/*
 * Some tracking software, eg webtrends, clears the console to conceal itself
 * while loading webpages. Before gathering logs, ALL cookies should be deleted
 * to prevent this. when extensions.connections.logging-toolbar.enabled is set to true,
 * the console will automatically open when Firefox starts.
 */

if ("undefined" == typeof (ConnectionsToolbar)) {
    var ConnectionsToolbar = {};
};

ConnectionsToolbar.logger = {
    consoleService : null,
    loggingEnabled : false,
    init : function() {
        ConnectionsToolbar.preferences.loggingEnabled = ConnectionsToolbar.browserOverlay.prefService
                .getBoolPref("extensions.connections-toolbar.logging.enable");
        ConnectionsToolbar.preferences.updateLoggingMenuOption();
        ConnectionsToolbar.logger.loggingEnabled = ConnectionsToolbar.browserOverlay.prefService
        .getBoolPref("extensions.connections-toolbar.logging.enable");
        if (ConnectionsToolbar.logger.loggingEnabled) {
            Components.utils.import("resource://gre/modules/devtools/Console.jsm");
            var devtools = Components.utils.import("resource://gre/modules/devtools/Loader.jsm", {}).devtools;
            var HUDService = devtools.require("devtools/webconsole/hudservice");
            if(HUDService.getBrowserConsole()) {
                HUDService.getBrowserConsole().chromeWindow.focus();
            } else {
                HUDService.toggleBrowserConsole();
            }
        }
        ConnectionsToolbar.logger.info("Logging initialized");
    },
    error : function(logString) {
        if (ConnectionsToolbar.logger.loggingEnabled) {
            console.error("ConnectionsToolbar", logString);
        }
    },
    warn : function(logString) {
        if (ConnectionsToolbar.logger.loggingEnabled) {
            console.warn("ConnectionsToolbar", logString);
        }
    },
    info : function(logString) {
        if (ConnectionsToolbar.logger.loggingEnabled) {
            console.info("ConnectionsToolbar", logString);
        }
    }
};