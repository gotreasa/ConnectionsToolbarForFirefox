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

if ("undefined" == typeof (ConnectionsPreferences)) {
    var ConnectionsPreferences = {};
};

ConnectionsPreferences.preferenceSettings = {
    usernameFieldName : "j_username",
    passwordFieldName : "j_password",
    init : function() {
        ConnectionsToolbar.logger.info("Loaded the Connections Preference Dialog js file");
        if(ConnectionsToolbar.preferences.setCredentials) {
            prefwindow = document.getElementById("connections-preferences");
            paneToLoad = prefwindow.preferencePanes[0];
            prefwindow.showPane(paneToLoad);
            ConnectionsToolbar.preferences.setCredentials = false;
        }
    },
    
    populateLoginForm : function() {
        ConnectionsToolbar.logger.info("Populating the login form");
        try {
            var loginInfo = ConnectionsToolbar.access
                    .getLoginInfo();
            if (loginInfo != null) {
                document
                        .getElementById(ConnectionsPreferences.preferenceSettings.usernameFieldName).value = loginInfo.username;
                document
                        .getElementById(ConnectionsPreferences.preferenceSettings.passwordFieldName).value = loginInfo.password;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error(e);
            ConnectionsToolbar.logger
                    .error("Unable to continue. ConnectionsPreferences.preferenceSettings "
                                    + "configuration screen needs login info.");
            window.close();
        }
    },
    submit : function() {
        ConnectionsToolbar.logger.info("Submitting the preference pane");
        ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar.configured", false);

        var hostname = ConnectionsToolbar.access.url;
        var username = document
                .getElementById(ConnectionsPreferences.preferenceSettings.usernameFieldName).value;
        var password = document
                .getElementById(ConnectionsPreferences.preferenceSettings.passwordFieldName).value;
        var httpRealm = ConnectionsToolbar.access.httpRealm;

        var nsLoginInfo = new Components.Constructor(
                "@mozilla.org/login-manager/loginInfo;1",
                Components.interfaces.nsILoginInfo, "init");
        var loginInfo = new nsLoginInfo(hostname, null, httpRealm, username,
                password,
                ConnectionsPreferences.preferenceSettings.usernameFieldName,
                this.passwordFieldName);
        try {
            ConnectionsToolbar.access.setLoginInfo(loginInfo);
            ConnectionsToolbar.scheduler
                    .disableToolbarAndRefresh();
        } catch (e) {
            ConnectionsToolbar.logger.error(e);
            ConnectionsToolbar.logger.error("Unable to save login info.");
            return false;
        }
        return true;
    },
    getTopLevelWindow : function() {
        var windowOpener = window.opener;
        while (typeof (windowOpener.opener) != "undefined"
                && windowOpener.opener != null) {
            windowOpener = windowOpener.opener;
        }

        windowOpener = windowOpener.QueryInterface(
                Components.interfaces.nsIInterfaceRequestor).getInterface(
                Components.interfaces.nsIWebNavigation).QueryInterface(
                Components.interfaces.nsIDocShellTreeItem).rootTreeItem
                .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                .getInterface(Components.interfaces.nsIDOMWindow);

        return windowOpener;
    },

    goHelp : function() {
        ConnectionsToolbar.browserOverlay.goHelp();
    },

    validateURL : function() {
        var url = document.getElementById("search-url").value;

        if (url.substr(-1) === "/") {
            url = url.slice(0, -1);
            ConnectionsToolbar.browserOverlay.prefService.setCharPref("extensions.connections-toolbar.search.url", url);
        }
        var regex = /https\:\/\/([a-zA-Z\d][\a-z\A-Z\d\-\.]*)(:\d{1,5})?([\/\?\#].*)?(search)$/;
        var results = url.match(regex);
        if (results == null) {
            document.getElementById("search-url-spacer").setAttribute("style",
                    "display:");
            document.getElementById("search-url-error").setAttribute("style",
                    "display:");
            document.getElementById("search-url").setAttribute("style",
                    "-moz-appearance: none;background-color:#FF6666");
            return false;
        } else {
            document.getElementById("search-url-spacer").setAttribute("style",
                    "display:none");
            document.getElementById("search-url-error").setAttribute("style",
                    "display:none");
            document.getElementById("search-url").setAttribute("style", "");
            return true;
        }
    },

    validateOnClose : function() {
        if (ConnectionsPreferences.preferenceSettings.validateURL() == true) {
            ConnectionsPreferences.preferenceSettings.submit();
            window.close();
        }
    },

    updateScheduler : function() {
        ConnectionsToolbar.logger.info("The value is: "+document.getElementById("scheduler-frequency").getAttribute("value"));
        if(document.getElementById("scheduler-frequency").getAttribute("value") == 86400000) {
            document.getElementById("hour-row").setAttribute("style", "");
        } else {
            document.getElementById("hour-row").setAttribute("style", "display:none");
        }
        document.getElementById("scheduler-minute").setAttribute("value", 
        		ConnectionsToolbar.browserOverlay.prefService.getIntPref("extensions.connections-toolbar.scheduler.minute"));
        document.getElementById("scheduler-second").setAttribute("value",
        		ConnectionsToolbar.browserOverlay.prefService.getIntPref("extensions.connections-toolbar.scheduler.second"));
    }
};

ConnectionsToolbar = ConnectionsPreferences.preferenceSettings.getTopLevelWindow().ConnectionsToolbar;