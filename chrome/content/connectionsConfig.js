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

ConnectionsToolbar.config = {
    autoConfigAttempted : false,
    serviceAvailable : false,
    version : Application.prefs
            .get("extensions.connections-toolbar.config.version").value,

    /**
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.componentService.collateOptions()
     */
    refreshConfig : function(callback) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Resetting URLs");
        for (name in ConnectionsToolbar.constants.ALL_COMPONENTS) {
            component = ConnectionsToolbar.constants.ALL_COMPONENTS[name];
            Application.prefs.setValue("extensions.connections-toolbar." + component + ".url", "");
            Application.prefs.setValue("extensions.connections-toolbar." + component + ".enable", false);
        }
        ConnectionsToolbar.config.autoConfigAttempted = false;
        ConnectionsToolbar.config.version = null;
        var configURL = ConnectionsToolbar.preferences.searchURL + "/serviceconfigs";
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Performing Connections autoconfiguration: " + configURL);
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", configURL, true);
        xhReq.setRequestHeader("Cache-Control", "max-age=1");
        xhReq.setRequestHeader("User-Agent", "connections-toolbar");
        xhReq.onreadystatechange = function() {
            if (xhReq.readyState != 4) {
                return;
            }
            ConnectionsToolbar.config.processResponse30(xhReq, callback);
            if (!ConnectionsToolbar.config.serviceAvailable) {
                ConnectionsToolbar.logger
                        .log(ConnectionsToolbar.constants.LOGGER.WARNING,
                                "Connections config service not available, switching to Legacy mode.");
                ConnectionsToolbar.config.tryConnections25(callback);
            }
        };
        xhReq.onError = function() {
            ConnectionsToolbar.logger
                    .log(ConnectionsToolbar.constants.LOGGER.WARNING,
                            "Connections config service not available, switching to Legacy mode.");
            // 2.5?
            ConnectionsToolbar.config.tryConnections25(callback);
        };
        xhReq.send();
    },

    /**
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.componentService.collateOptions()
     */
    tryConnections25 : function(callback) {
        if (!ConnectionsToolbar.access.isLoggedIn()) {
            ConnectionsToolbar.access.login(function() {
                ConnectionsToolbar.config.tryConnections25(callback);
            });
        } else {

            var configURL25 = ConnectionsToolbar.preferences.searchURL
                    + "/web/jsp/advancedSearch.jsp";
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                    "Performing Connections legacy autoconfiguration: "
                            + configURL25);
            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", configURL25, true);
            xhReq.setRequestHeader("User-Agent", "connections-toolbar");
            xhReq.onreadystatechange = function() {
                if (xhReq.readyState != 4) {
                    return;
                }
                ConnectionsToolbar.config.processResponse25(xhReq, callback);
            };
            xhReq.onError = function() {
                ConnectionsToolbar.logger
                        .log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                "Unable to perform Connections legacy autoconfiguration");
                ConnectionsToolbar.config.autoConfigAttempted = true;
            };
            xhReq.send();

        }
    },

    /**
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.componentService.collateOptions()
     */
    processResponse25 : function(response, callback) {
        ConnectionsToolbar.config.serviceAvailable = false;
        if (response.responseText != null) {
            try {
                // window.alert(response.responseText);
                // window.alert(ConnectionsToolbar.config.version);

                var responseXML = document.implementation.createDocument(
                        "http://www.w3.org/1999/xhtml", "html", null);
                var body = document.createElementNS(
                        "http://www.w3.org/1999/xhtml", "body");
                responseXML.documentElement.appendChild(body);
                body
                        .appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
                                .getService(
                                        Components.interfaces.nsIScriptableUnescapeHTML)
                                .parseFragment(response.responseText, false,
                                        null, body));

                try {
                    Application.prefs
                            .get("extensions.connections-toolbar.search.url").value = ConnectionsToolbar.preferences.searchURL;
                } catch (e) {
                }

                var siteURL = ConnectionsToolbar.preferences.searchURL.split("/search");
                
                try {
                    var wikiElement = responseXML.getElementById("lotusBannerWikis");
                    if(typeof (wikiElement) != "undefined" && wikiElement != null) {
                        var URL = wikiElement.firstChild
                                .getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.wikis.url").value = URL;
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.wikis.url").value = siteURL[0] + "/wikis";
                    }
                } catch (e) {
                }

                try {
                    var communityElement = responseXML.getElementById("lotusBannerCommunities");
                    if(typeof (communityElement) != "undefined" && communityElement != null) {
                        var URL = communityElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.communities.url").value = URL;
                    } else if(Application.prefs
                            .get("extensions.connections-toolbar.search.url")
                            .value.indexOf("www.ibm.com/developerworks/mydeveloperworks") != -1) {
                        Application.prefs
                                .get("extensions.connections-toolbar.communities.url").value = siteURL[0] + "/groups";
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.communities.url").value = siteURL[0] + "/communities";
                    }
                } catch (e) {
                }

                try {
                    var profileElement = responseXML.getElementById("lotusBannerProfiles");
                    if(typeof (profileElement) != "undefined" && profileElement != null) {
                        var URL = profileElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.profiles.url").value = URL;
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.profiles.url").value = siteURL[0] + "/profiles";
                    }
                } catch (e) {
                }

                try {
                    var activityElement = responseXML.getElementById("lotusBannerActivities");
                    if(typeof (activityElement) != "undefined" && activityElement != null) {
                        var URL = activityElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.activities.url").value = URL;
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.activities.url").value = siteURL[0] + "/activities";
                    }
                } catch (e) {
                }

                try {
                    var homepageElement = responseXML.getElementById("lotusBannerHomepage");
                    if(typeof (homepageElement) != "undefined" && homepageElement != null) {
                        var URL = homepageElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.homepage.url").value = URL;
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.homepage.url").value = siteURL[0] + "/homepage";
                    }
                } catch (e) {
                }

                try {
                    var blogElement = responseXML.getElementById("lotusBannerBlogs");
                    if(typeof (blogElement) != "undefined" && blogElement != null) {
                        var URL = blogElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.blogs.url").value = URL;
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.blogs.url").value = siteURL[0] + "/blogs";
                    }
                } catch (e) {
                }

                try {
                    var fileElement = responseXML.getElementById("lotusBannerFiles");
                    if(typeof (fileElement) != "undefined" && fileElement != null) {
                        var URL = fileElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.files.url").value = URL;
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.files.url").value = siteURL[0] + "/files";
                    }
                } catch (e) {
                }

                try {
                    var dogearElement = responseXML.getElementById("lotusBannerDoger");
                    if(typeof (dogearElement) != "undefined" && dogearElement != null) {
                        var URL = dogearElement.firstChild.getAttribute("href");
                        Application.prefs
                                .get("extensions.connections-toolbar.dogear.url").value = URL;
                    } else if(Application.prefs
                            .get("extensions.connections-toolbar.search.url")
                            .value.indexOf("www.ibm.com/developerworks/mydeveloperworks") != -1) {
                        Application.prefs
                                .get("extensions.connections-toolbar.dogear.url").value = siteURL[0] + "/bookmarks";
                    } else {
                        Application.prefs
                                .get("extensions.connections-toolbar.dogear.url").value = siteURL[0] + "/dogear";
                    }
                } catch (e) {
                }

                ConnectionsToolbar.config.serviceAvailable = true;
                ConnectionsToolbar.config.version = "2.5";
                Application.prefs
                    .get("extensions.connections-toolbar.config.version").value = ConnectionsToolbar.config.version;

                ConnectionsToolbar.config.autoConfigAttempted = true;
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                        "Connections legacy autoconfiguration complete");
                callback();
            } catch (e) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                        e);
                ConnectionsToolbar.config.autoConfigAttempted = true;
                ConnectionsToolbar.logger
                        .log(
                                ConnectionsToolbar.constants.LOGGER.ERROR,
                                "An error occurred while processing response data from Connections legacy autoconfiguration");
            }
        } else {
            ConnectionsToolbar.logger
                    .log(ConnectionsToolbar.constants.LOGGER.ERROR,
                            "No response data from Connections legacy autoconfiguration");
        }
    },

    /**
     * Enter description here...
     * 
     * @param function
     *            callback -
     *            ConnectionsToolbar.componentService.collateOptions()
     */
    processResponse30 : function(response, callback) {
        ConnectionsToolbar.config.serviceAvailable = false;
       if (response.responseXML != null) {

            // window.alert(response.responseXML);
            // window.alert(response.responseText);
            try {
                var feedNode = response.responseXML
                        .getElementsByTagName("feed")[0];
                        
                var generatorNodes = feedNode.getElementsByTagName("generator");
                for (var i = 0; i < generatorNodes.length; i++) {
                    var version = generatorNodes[i].getAttribute("version");
                    ConnectionsToolbar.config.version = version.substring(0,3);
                    Application.prefs
                            .get("extensions.connections-toolbar.config.version").value
                                    = ConnectionsToolbar.config.version;
                }
                        
                var entries = feedNode.getElementsByTagName("entry");
                for (var i = 0; i < entries.length; i++) {
                    // window.alert(entries[i]);
                    var entry = entries[i];
                    var titleElement = entry.getElementsByTagName("title")[0];
                    var title = titleElement.firstChild.nodeValue;
                    if(ConnectionsToolbar.config.contains(title)) {
                        // window.alert(title);
                        var URLElement = entry.getElementsByTagName("link")[0];
                        var URL = URLElement.getAttribute("href");
                        // window.alert(URL);
                        var pref = Application.prefs.get("extensions.connections-toolbar." + title + ".url");
                        if (pref){
                            pref.value = URL;
                        }
                    }
                }

                ConnectionsToolbar.config.autoConfigAttempted = true;
                ConnectionsToolbar.config.serviceAvailable = true;
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                        "Connections autoconfiguration complete. Version is "+ConnectionsToolbar.config.version+".");
                callback();
            } catch (e) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                        e);
                ConnectionsToolbar.logger
                        .log(
                                ConnectionsToolbar.constants.LOGGER.ERROR,
                                "An error occurred while processing response data from Connections autoconfiguration");
            }
        } else {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.WARNING,
                    "No response data from Connections autoconfiguration");
        }
    },

    contains : function(string) {
        for (name in ConnectionsToolbar.constants.ALL_COMPONENTS) {
            component = ConnectionsToolbar.constants.ALL_COMPONENTS[name];
            if(component == string) {
                return true;
            }
        }
        return false;
    },

    getComponentURL : function(componentName) {
        var componentURL = null;
        try {
            componentURL = Application.prefs
                    .get("extensions.connections-toolbar." + componentName
                            + ".url").value;
            if (typeof (componentURL) == "undefined" || componentURL == "") {
                componentURL = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                    "Unable to get component url for: " + component);
            componentURL = null;
        }
        return componentURL;
    }
};
