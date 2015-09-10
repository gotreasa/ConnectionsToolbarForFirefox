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

ConnectionsToolbar.access = {
    loggedIn : false,
    invalidLoginCredentials : false,
    loginManager : null,
    continueOnError : false,
    httpRealm : "Firefox Extension",
    url : "IBM Connections",
    init : function() {
        ConnectionsToolbar.access.loginManager = Components.classes["@mozilla.org/login-manager;1"]
                .getService(Components.interfaces.nsILoginManager);
    },

    getLoginInfo : function() {
        ConnectionsToolbar.logger.info("Fetching login credentials.");
        if (ConnectionsToolbar.access.loginManager === null 
                || typeof(ConnectionsToolbar.access.loginManager) == "undefined") {
            ConnectionsToolbar.access.init();
            ConnectionsToolbar.logger.error("The Login Manger was null.");

            if (ConnectionsToolbar.access.loginManager === null 
                    || typeof(ConnectionsToolbar.access.loginManager) == "undefined") {
                ConnectionsToolbar.logger.error("The Login Manger couldn't be retrieved.");
            } else {
                ConnectionsToolbar.logger.info("The Login Manger was retrieved.");
            }
        } else {
            ConnectionsToolbar.logger.info("The Login Manger is setup.");
        }
        var logins = ConnectionsToolbar.access.loginManager.findLogins({},
                ConnectionsToolbar.access.url, null,
                ConnectionsToolbar.access.httpRealm);

        var loginInfo = null;
        // Find user from returned array of nsILoginInfo objects
        if (typeof(logins) !== "undefined" && logins !== null && logins.length > 0) {
            loginInfo = logins[0];
        } else {
            ConnectionsToolbar.logger.warn("No login credentials found.");
        }
        return loginInfo;
    },

    deleteLoginInfo : function() {
        var logins = ConnectionsToolbar.access.loginManager.findLogins({},
                ConnectionsToolbar.access.url, null,
                ConnectionsToolbar.access.httpRealm);
        // Find user from returned array of nsILoginInfo objects
        for ( var i = 0; i < logins.length; i++) {
            ConnectionsToolbar.access.loginManager.removeLogin(logins[0]);
        }
    },

    /**
     * Login in to Connections
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.browserOverlay.getAllContent()
     */
    login : function(callback) {
        ConnectionsToolbar.logger.info("Attempting to log you in");
        var xhReq = new XMLHttpRequest();
        var loginURL = ConnectionsToolbar.browserOverlay.prefService
                .getCharPref("extensions.connections-toolbar.files.url")
                + "/basic/api/introspection";
        ConnectionsToolbar.logger.info("Logging into Connections - " + loginURL);
        var loginInfo = ConnectionsToolbar.access.getLoginInfo();

        var isEmptyCredentials = false;
        if (loginInfo) {
            if (!(typeof(loginInfo.username) !== "undefined"
                    && loginInfo.username !== null)) {
                ConnectionsToolbar.logger.warn("The username is not loaded correctly");
                isEmptyCredentials = true;
            }
            if (!(typeof(loginInfo.password) !== "undefined"
                    && loginInfo.password !== null)) {
                ConnectionsToolbar.logger.warn("The password is not loaded correctly");
                isEmptyCredentials = true;
            }
        } else {
            isEmptyCredentials = true;
        }
        if(isEmptyCredentials) {
            ConnectionsToolbar.logger.warn("Could not load the toolbar due to missing credentials");
            return;
        }
        
        var credentials = loginInfo.username + ":"
                + loginInfo.password;
        var base64Credentials = window.btoa(credentials);
        
        xhReq.open("GET", loginURL, true);
        
        xhReq.setRequestHeader("User-Agent", "connections-toolbar");
        xhReq.setRequestHeader("Authorization", "Basic " + base64Credentials);
        xhReq.setRequestHeader("Connection", "close");

        xhReq.onreadystatechange = function() {
            if (xhReq.readyState != 4) {
                return;
            }

            try {
                ConnectionsToolbar.access.processResponse(xhReq, callback);
            } catch (e) {
                ConnectionsToolbar.logger.error(e);
                ConnectionsToolbar.logger
                        .error("Unable to log into ConnectionsToolbar.  Please verify Connections host and network connectivity.");
                ConnectionsToolbar.access.processError(callback);
            }
        };

        xhReq.onError = function() {
            ConnectionsToolbar.logger.error(e);
            ConnectionsToolbar.logger
                    .error("Unable to log into ConnectionsToolbar.  Please verify Connections host and network connectivity.");
            ConnectionsToolbar.access.processError();
        };

        ConnectionsToolbar.logger.info("Attempting to connect...");
        xhReq.send();
        ConnectionsToolbar.scheduler.runLogin = false;
    },

    /**
     * Processes the response from the Connections login request
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.browserOverlay.getAllContent()
     */
    processResponse : function(xhReq, callback) {
        if (xhReq.status == 200) {
            try {
                ConnectionsToolbar.logger.info("Successfully authenticated with Connections.");
                callback();
            } catch (e) {
                ConnectionsToolbar.logger.error(e);
                ConnectionsToolbar.logger
                        .error("Exception occurred during execution of post-login callback.");
            }
        } else {
            if (xhReq.status == 401) {
                ConnectionsToolbar.logger
                        .error("Unable to log into Connections Toolbar.  Please verify your login credentials.");
                ConnectionsToolbar.access.openLoginAlert();
                ConnectionsToolbar.access.continueOnError = false;
            } else {
                ConnectionsToolbar.logger
                        .error("Unable to log into ConnectionsToolbar.  Unknown error.");
            }
            ConnectionsToolbar.access.processError(callback);
        }
    },

    openLoginAlert : function() {
        window.openDialog(
                "chrome://connections-toolbar/content/loginAlert.xul", "",
                "centerscreen,toolbar", ConnectionsToolbar);
    },

    /**
     * Processes the error from the Connections login
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.browserOverlay.getAllContent()
     */
    processError : function(callback) {
        if (ConnectionsToolbar.access.continueOnError
                && ConnectionsToolbar.browserOverlay.prefService
                        .getBoolPref("extensions.connections-toolbar.configured") === true) {
            ConnectionsToolbar.logger.info("Ignoring the login error, and continuing");
            callback();
        } else {
            ConnectionsToolbar.logger.error("Unable to Configure toolbar.  Exiting processing...");
        }
        ConnectionsToolbar.access.continueOnError = false;
    },

    isLoggedIn : function() {
        ConnectionsToolbar.logger.info("Checking if logged in");
        ConnectionsToolbar.logger.info("Is logged in returns: " + ConnectionsToolbar.access.loggedIn);
        return ConnectionsToolbar.access.loggedIn;
    },

    setLoginInfo : function(loginInfo) {
        ConnectionsToolbar.access.deleteLoginInfo();
        ConnectionsToolbar.logger.info("Clearing your credentials before saving them");
        if (loginInfo != null) {
            if (loginInfo.username.length > 0 && loginInfo.password.length > 0) {
                ConnectionsToolbar.access.loginManager.addLogin(loginInfo);
                ConnectionsToolbar.access.invalidLoginCredentials = false;
            } else {
                ConnectionsToolbar.logger.error("Problem saving your credentials");
            }
        }
    }
};