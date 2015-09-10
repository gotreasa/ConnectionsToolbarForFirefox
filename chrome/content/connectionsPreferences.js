/*
 * © Copyright IBM Corp. 2011, 2015
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

if ("undefined" == typeof (ConnectionsToolbar)) {
    var ConnectionsToolbar = {};
};

ConnectionsToolbar.preferences = {
    contentCountComponents : null,
    searchURL : "",
    connectionsHotURL : "",
    loggingEnabled : false,
    setCredentials : false,
    preferenceDialog : null,

    configure : function(event, opener, setCredentials) {
        if (setCredentials == true) {
            ConnectionsToolbar.preferences.setCredentials = setCredentials;
        } else {
            ConnectionsToolbar.preferences.setCredentials = false;
        }
        ConnectionsToolbar.preferences.preferenceDialog = window.openDialog(
                "chrome://connections-toolbar/content/preferencesWindow.xul",
                ConnectionsToolbar.NLS.get("connections.dialog.title"),
                "centerscreen,toolbar", ConnectionsToolbar);
        ConnectionsToolbar.preferences.preferenceDialog.focus();
    },

    toggleLogging : function(event) {
        // alert("toggling logging functionality");
        ConnectionsToolbar.preferences.loggingEnabled = !this.loggingEnabled;
        ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar.logging.enable",
        		ConnectionsToolbar.preferences.loggingEnabled);
        ConnectionsToolbar.preferences.updateLoggingMenuOption();
    },

    updateLoggingMenuOption : function() {
        try {
            document.getElementById("toggle-logging").setAttribute("checked",
                    ConnectionsToolbar.preferences.loggingEnabled);
        } catch (e) {
        }
        try {
            document.getElementById("toggle-logging-setting-menu").setAttribute("checked",
                    ConnectionsToolbar.preferences.loggingEnabled);
        } catch (e) {
        }
        try {
            document.getElementById("toggle-logging-appmenu").setAttribute(
                    "checked", ConnectionsToolbar.preferences.loggingEnabled);
        } catch (e) {
        }
    },

    refreshPreferences : function() {
        ConnectionsToolbar.logger.info("Refreshing preferences.");

        ConnectionsToolbar.preferences.loggingEnabled = ConnectionsToolbar.browserOverlay.prefService
                .getBoolPref("extensions.connections-toolbar.logging.enable");
        ConnectionsToolbar.preferences.updateLoggingMenuOption();

        ConnectionsToolbar.preferences.searchURL = ConnectionsToolbar.browserOverlay.prefService
                .getCharPref("extensions.connections-toolbar.search.url");

        ConnectionsToolbar.preferences.connectionsHotURL = ConnectionsToolbar.browserOverlay.prefService
                .getCharPref("extensions.connections-toolbar.hot.url");

        ConnectionsToolbar.preferences.contentCountComponents = new Array();
        for (value in ConnectionsToolbar.constants.DATA_TYPE) {
            var type = ConnectionsToolbar.constants.DATA_TYPE[value];

            ConnectionsToolbar.preferences.contentCountComponents[type] = new Array();
            for (name in ConnectionsToolbar.constants.COMPONENTS) {
                var component = ConnectionsToolbar.constants.COMPONENTS[name];

                var typeName = "";
                if(type == ConnectionsToolbar.constants.DATA_TYPE.CONTENT) {
                    typeName = "content";
                } else if(type == ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS) {
                    typeName = "recommendations";
                } else if(type == ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING) {
                    typeName = "following";
                }
                ConnectionsToolbar.preferences.contentCountComponents[type][component] = ConnectionsToolbar.browserOverlay.prefService
                        .getIntPref("extensions.connections-toolbar."
                                + typeName + "."
                                + component + ".count");
            }
        }
    },

    // TODO: remove duplicate function in connectionsComponentService
    getComponentContentCount : function(componentName, type) {
        var count = 0;
        try {
            count = ConnectionsToolbar.preferences.contentCountComponents[type][componentName];
            if (typeof (count) == "undefined") {
                count = 0;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error(e);
            ConnectionsToolbar.logger.error("Unable to get the content count for " + componentName);
            count = 0;
        }
        return count;
    },

    setRandomMillisecond : function() {
        if (ConnectionsToolbar.browserOverlay.prefService
                .getIntPref("extensions.connections-toolbar.scheduler.random") == -1) {
        	ConnectionsToolbar.browserOverlay.prefService
                    .setIntPref("extensions.connections-toolbar.scheduler.random", Math
                    .random() * 3540000);
            var milliseconds = ConnectionsToolbar.browserOverlay.prefService
                    .getIntPref("extensions.connections-toolbar.scheduler.random");
            ConnectionsToolbar.browserOverlay.prefService
                    .setIntPref("extensions.connections-toolbar.scheduler.minute", milliseconds / 60000);
            ConnectionsToolbar.browserOverlay.prefService
                    .setIntPref("extensions.connections-toolbar.scheduler.second", (milliseconds / 1000) % 60);
        }
    }
};