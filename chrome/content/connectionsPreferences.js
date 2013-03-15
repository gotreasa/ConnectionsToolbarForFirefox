/*
 * © Copyright IBM Corp. 2011, 2013
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

if ("undefined" == typeof (ConnectionsToolbar)) {
    var ConnectionsToolbar = {};
};

ConnectionsToolbar.preferences = {
    contentCountComponents : null,
    recommendationsCountComponents : null,
    searchURL : "",
    connectionsHotURL : "",
    loggingEnabled : false,
    setCredentials : false,

    configure : function(event, opener, setCredentials) {
        if(setCredentials == true) {
            ConnectionsToolbar.preferences.setCredentials = setCredentials;
        } else {
            ConnectionsToolbar.preferences.setCredentials = false;
        }
        var dlg = window.openDialog(
                "chrome://connections-toolbar/content/preferencesWindow.xul",
                ConnectionsToolbar.NLS.get("connections.dialog.title"),
                "centerscreen,toolbar", ConnectionsToolbar);
        dlg.focus();
    },

    toggleLogging : function(event) {
        // alert("toggling logging functionality");
        ConnectionsToolbar.preferences.loggingEnabled = !this.loggingEnabled;
        Application.prefs.get("extensions.connections-toolbar.logging.enabled").value = ConnectionsToolbar.preferences.loggingEnabled;
        ConnectionsToolbar.preferences.updateLoggingMenuOption();
    },

    updateLoggingMenuOption : function() {
        try {
            document.getElementById("toggle-logging").setAttribute("checked",
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
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Refreshing preferences.");

        ConnectionsToolbar.preferences.loggingEnabled = Application.prefs
                .get("extensions.connections-toolbar.logging.enabled").value;
        ConnectionsToolbar.preferences.updateLoggingMenuOption();

        ConnectionsToolbar.preferences.searchURL = Application.prefs
                .get("extensions.connections-toolbar.search.url").value;

        ConnectionsToolbar.preferences.connectionsHotURL = Application.prefs
                .get("extensions.connections-toolbar.hot.url").value;

        ConnectionsToolbar.preferences.contentCountComponents = new Array();
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.preferences.contentCountComponents[component] = Application.prefs
                    .get("extensions.connections-toolbar.content." + component
                            + ".count").value;
        }

        ConnectionsToolbar.preferences.recommendationsCountComponents = new Array();
        ConnectionsToolbar.preferences.recommendationsCountComponents["allConnections"] = Application.prefs
                .get("extensions.connections-toolbar.recommendations.allConnections.count").value;
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.preferences.recommendationsCountComponents[component] = Application.prefs
                    .get("extensions.connections-toolbar.recommendations." + component
                            + ".count").value;
        }
    },

    getComponentContentCount : function(componentName) {
        var count = 0;
        try {
            count = ConnectionsToolbar.preferences.contentCountComponents[componentName];
            if (typeof (count) == "undefined") {
                count = 0;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, 
                    "Unable to get the content count for " + componentName);
            count = 0;
        }
        return count;
    },

    getComponentRecommendationsCount : function(componentName) {
        var count = 0;
        try {
            count = ConnectionsToolbar.preferences.recommendationsCountComponents[componentName];
            if (typeof (count) == "undefined") {
                count = 0;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, 
                    "Unable to get the recommendations count for " + componentName);
            count = 0;
        }
        return count;
    },
    
    setRandomMillisecond : function() {
        if(Application.prefs
             .get("extensions.connections-toolbar.scheduler.random").value == -1) {
            Application.prefs
                .get("extensions.connections-toolbar.scheduler.random").value = Math.random() * 3540000;
            var milliseconds = Application.prefs.get("extensions.connections-toolbar.scheduler.random").value;
            Application.prefs
                .get("extensions.connections-toolbar.scheduler.minute").value = milliseconds / 60000;
            Application.prefs
                .get("extensions.connections-toolbar.scheduler.second").value  = (milliseconds / 1000) % 60;
        }
    }
};