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
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Fetching login credentials.");
        var logins = ConnectionsToolbar.access.loginManager.findLogins({},
                ConnectionsToolbar.access.url, null,
                ConnectionsToolbar.access.httpRealm);

        var loginInfo = null;
        // Find user from returned array of nsILoginInfo objects
        if (logins.length > 0) {
            loginInfo = logins[0];
        } else {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.WARNING,
                    "No login credentials found.");
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
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.browserOverlay.getContentAndRecommendations()
     */
    login : function(callback) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Attempting to log you in");
        var xhReq = new XMLHttpRequest();
        var loginURL = Application.prefs
                .get("extensions.connections-toolbar.search.url").value
                + "/j_security_check/";
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Logging into Connections - " + loginURL);
        var loginInfo = ConnectionsToolbar.access.getLoginInfo();
        var params = loginInfo.usernameField
                + "=" + encodeURIComponent(loginInfo.username) + "&"
                + loginInfo.passwordField + "="
                + encodeURIComponent(loginInfo.password)
                + "&secure=&fragment=";
        params = params.replace("%20", "+");
        xhReq.open("POST", loginURL, true);

        xhReq.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
        xhReq.setRequestHeader("User-Agent", "connections-toolbar");
        xhReq.setRequestHeader("Connection", "close");

        xhReq.onreadystatechange = function() {
            if (xhReq.readyState != 4) {
                return;
            }

            try {
                ConnectionsToolbar.access.processResponse(xhReq, callback);
            } catch (e) {
                ConnectionsToolbar.logger.log(
                        ConnectionsToolbar.constants.LOGGER.ERROR, e);
                ConnectionsToolbar.logger
                        .log(
                                ConnectionsToolbar.constants.LOGGER.ERROR,
                                "Unable to log into ConnectionsToolbar.  Please verify Connections host and network connectivity.");
                ConnectionsToolbar.access.processError(callback);
            }
        };

        xhReq.onError = function() {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                    e);
            ConnectionsToolbar.logger
                    .log(
                            ConnectionsToolbar.constants.LOGGER.ERROR,
                            "Unable to log into ConnectionsToolbar.  Please verify Connections host and network connectivity.");
            ConnectionsToolbar.access.processError();
        };

        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Attempting to connect...");
        xhReq.send(params);
        ConnectionsToolbar.scheduler.runLogin = false;
    },

    /**
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.browserOverlay.getContentAndRecommendations()
     */
    processResponse : function(xhReq, callback) {
        var responseHeaders = xhReq.getAllResponseHeaders();
        var headers = responseHeaders.split("\n");
        var found = false;
        ConnectionsToolbar.access.loggedIn = false;
        ConnectionsToolbar.access.invalidLoginCredentials = false;
        for ( var i = 0; i < headers.length && !found; i++) {
            var header = headers[i].split(": ");
            var headerName = header[0];
            var headerValue = header[1];
            if (headerName.indexOf("X-LConn-Auth") !== -1) {
                found = true;
                if (headerValue.indexOf("true") !== -1) {
                    ConnectionsToolbar.access.loggedIn = true;
                } else if (headerValue.indexOf("false") !== -1) {
                    ConnectionsToolbar.access.invalidLoginCredentials = true;
                }
            }
        }
        if (ConnectionsToolbar.access.loggedIn === true) {
            try {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                        "Successfully authenticated with Connections.");
                callback();
            } catch (e) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                        e);
                ConnectionsToolbar.logger
                        .log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                "Exception occurred during execution of post-login callback.");
            }
        } else {
            if (ConnectionsToolbar.access.invalidLoginCredentials) {
                ConnectionsToolbar.logger
                        .log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                "Unable to log into Connections Toolbar.  Please verify your login credentials.");
                ConnectionsToolbar.access.openloginAlert();
                ConnectionsToolbar.access.continueOnError = false;
            } else {
                ConnectionsToolbar.logger
                        .log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                "Unable to log into ConnectionsToolbar.  Unknown error.");
            }
            ConnectionsToolbar.access.processError(callback);
        }
    },

    openloginAlert : function() {
        window.openDialog(
                "chrome://connections-toolbar/content/loginAlert.xul",
                "", "centerscreen,toolbar", ConnectionsToolbar);
    },
    
    /**
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.browserOverlay.getContentAndRecommendations()
     */
    processError : function(callback) {
        if (ConnectionsToolbar.access.continueOnError 
                && Application.prefs
                .get("extensions.connections-toolbar.configured").value === true) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                    "Ignoring the login error, and continuing");
            callback();
        } else {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                "Unable to Configure toolbar.  Exiting processing...");
        }
        ConnectionsToolbar.access.continueOnError = false;
    },

    isLoggedIn : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Checking if logged in");
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Is logged in returns: " + ConnectionsToolbar.access.loggedIn);
        return ConnectionsToolbar.access.loggedIn;
    },

    setLoginInfo : function(loginInfo) {
        ConnectionsToolbar.access.deleteLoginInfo();
        if (loginInfo != null) {
            if (loginInfo.username.length > 0 && loginInfo.password.length > 0) {
                ConnectionsToolbar.access.loginManager.addLogin(loginInfo);
                ConnectionsToolbar.access.invalidLoginCredentials = false;
            }
        }
    }
};