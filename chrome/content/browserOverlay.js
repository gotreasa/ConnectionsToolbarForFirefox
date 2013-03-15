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

/**
 * ConnectionsToolbar namespace.
 */
if ("undefined" == typeof (ConnectionsToolbar)) {
    var ConnectionsToolbar = {};
};

ConnectionsToolbar.browserOverlay = {
    init : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Initialising the toolbar.");
        ConnectionsToolbar.access.loggedIn = false;

        Application.getExtensions(function (extensions) {
            var extension = extensions.get("ibm-connections-toolbar@ie.ibm.com");

            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Extension version is: " + extension.version);
            if(extension.firstRun) {
            	openUILinkIn("https://www.ibm.com/developerworks/mydeveloperworks/wikis/home?lang=en#/wiki/W558badb543ed_47e1_b4d9_e96364dbe98b/page/First%20Time%20User", "tab");
            	Application.prefs.get("extensions.connections-toolbar.update.version").value
                		= extension.version;
            } else if(Application.prefs.get("extensions.connections-toolbar.update.version").value
                    != extension.version) {
                openUILinkIn("https://www.ibm.com/developerworks/mydeveloperworks/blogs/4aee1970-6f11-45de-aa2a-1d53f0fc4b5f/entry/release_of_ibm_connections_toolbar_3_0_1", "tab");
                Application.prefs.get("extensions.connections-toolbar.update.version").value
                        = extension.version;
            }
        });
        if (Application.prefs.get("extensions.connections-toolbar.layout.version").value != 1) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                    "Resetting the toolbar buttons");
            ConnectionsToolbar.browserOverlay.restoreButtons();
            Application.prefs.get("extensions.connections-toolbar.layout.version").value = 1;
        }
        ConnectionsToolbar.preferences.setRandomMillisecond();
    },

    restoreButtons : function() {
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-hot-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-recommendations-component", "connections-hot-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-homepage-button", "connections-recommendations-component");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-profiles-button", "connections-homepage-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-activities-button", "connections-profiles-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-blogs-button", "connections-activities-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-communities-button", "connections-blogs-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-dogear-button", "connections-communities-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-files-button", "connections-dogear-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-forums-button", "connections-files-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-wikis-button", "connections-forums-button");
        ConnectionsToolbar.browserOverlay.installButton("ConnectionsToolbar", "connections-search-component", "connections-wikis-button");
    },

    goConnectionsHotButton : function(aEvent) {
        var connectionsHotRequest = ConnectionsToolbar.componentService
                .getComponentURL("hot");
        if (connectionsHotRequest != null && connectionsHotRequest != "") {
            ConnectionsToolbar.browserOverlay.gotoURL(connectionsHotRequest, aEvent);
        }
    },

    goComponent : function(component, event, target, isCreate) {
        if(isCreate == null) {
            var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Ci.nsIPrefBranch);
            isCreate = prefService.getBoolPref("extensions.connections-toolbar.create.button.enabled");
        }

        var request = ConnectionsToolbar.componentService
                .getComponentURL(component);

        if (request != null && !isCreate) {
            ConnectionsToolbar.browserOverlay.gotoURL(request, event, target);
        } else if (request != null &&  (component == "homepage"
                || component == "profiles")) {
            ConnectionsToolbar.browserOverlay.gotoURL(request, event, target);
        } else if (isCreate && component != "dogear") {
            ConnectionsToolbar.componentService.createEntry(component, event, target);
        } else if (isCreate && component == "dogear") {
            ConnectionsToolbar.componentService.bookmarkThis(event);
        }
    },

    goAdvancedSearch : function(aEvent) {
        // window.alert(aEvent.button);
        ConnectionsToolbar.browserOverlay.goComponent("search");
    },

    gotoURL : function(url, event, target, callback, element) {
//        ConnectionsToolbar.observer.register();
        if(target == "tab") {
            openUILinkIn(url, "tab");
        } else {
            openUILink(url, event);
        }
//        var args = new Array();
        window.focus();
//        ConnectionsToolbar.queue.add(function() {
//                ConnectionsToolbar.browserOverlay.refreshUrl(url, window.content.document.location);
//                if(callback != null) {
//                    ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
//                            "Adding the callback to the queue - "+callback);
//                    callback(element, window.content);
//                }
//            }, this, args);
        ConnectionsToolbar.browserOverlay.doNothing(event);
        return window.content;
    },
    
    refreshUrl : function(url, location) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Refreshing url: " + url);
        if(url.indexOf("#") == -1) {
            location.href = url;
        } else {
            location.reload();
        }
    },

    goHelp : function() {
        ConnectionsToolbar.browserOverlay.gotoURL(
                "https://www.ibm.com/developerworks/mydeveloperworks/wikis/home/wiki/W558badb543ed_47e1_b4d9_e96364dbe98b/page/Help",
                null,
                "tab");
    },

    search : function(aEvent) {
        var done = false;
        var cleared = false;
        var callingFunction = null;
        try {
            callingFunction = arguments.callee.caller;
            done = (callingFunction == null);
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            done = true;
        }
        while (!done) {
            if (callingFunction.name == "_clearSearch") {
                cleared = true;
                done = true;
            } else {
                try {
                    callingFunction = callingFunction.caller;
                    done = (callingFunction.name == null);
                } catch (e) {
                    ConnectionsToolbar.logger.log(
                            ConnectionsToolbar.constants.LOGGER.ERROR, e);
                    done = true;
                }
            }
        }
        if (!cleared) {
            var searchURL = ConnectionsToolbar.componentService
                    .getComponentURL("search");
            if (searchURL != "") {
                var scope = "";
                var component = Application.prefs.get("extensions.connections-toolbar.search").value;
                var searchTerm = encodeURIComponent(document
                        .getElementById("connections-search-term").value);

                var searchRequest = searchURL + "/web/search?scope=" + scope
                        + "&component=" + ((component == "all") ? "" : component)
                        + "&searchFormsearchInput_textbox=" + searchTerm
                        + "&query=" + searchTerm;
                openUILink(searchRequest, aEvent);
            }
        }
    },

    repaint : function(callback) {
        if (ConnectionsToolbar.componentService.ready == true
                || callback == ConnectionsToolbar.browserOverlay.loadContent) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                    "Refreshing UI");
            ConnectionsToolbar.access.login(callback);
        } else {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                    "The component service is not ready");
        }
    },

    getContentAndRecommendations : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Starting to get content and recommendations");
        ConnectionsToolbar.database.emptyContentTable();
        //alert("version == "+ConnectionsToolbar.config.version);
        if (ConnectionsToolbar.config.version >= "3.0") {
        	//alert("version is greater than or equal to 3.0");
            ConnectionsToolbar.recommendations.getRecommendations();
        }
        ConnectionsToolbar.content.getContent();
    },

    showAllRecommendations : function(show) {
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.browserOverlay.showRecommendations(component,
                    show);
        }
        ConnectionsToolbar.browserOverlay.showButton(
                "connections-recommendations-component", show);
    },

    showStatusUpdates : function(show) {
        var id = "search-scope-status_updates";
        ConnectionsToolbar.browserOverlay.showButton(id, show);
    },

    showRecommendations : function(componentId, show) {
        var recommendPopup = document.getElementById("recommendations-"
                + componentId + "-popup");

        if (typeof (recommendPopup) != "undefined" && recommendPopup != null) {
            var recommendMenu = recommendPopup.parentNode;
            var separator = recommendMenu.nextSibling;

            if (show) {
                recommendMenu.style.display = "";
                separator.style.display = "";
            } else {
                recommendMenu.style.display = "none";
                separator.style.display = "none";
            }
        }
    },

    showButton : function(id, show) {
        var componentButton = document.getElementById(id);
        if (typeof (componentButton) != "undefined" && componentButton != null) {
            if (show) {
                componentButton.style.display = "";
            } else {
                componentButton.style.display = "none";
            }
        }
    },

    disableButton : function(id) {
        // alert("going to disable "+id);
        var button = document.getElementById(id);
        if (typeof (button) != "undefined" && button != null) {
            button.setAttribute("disabled", "true");
            if(id != "recommendations-menu") {
                button.setAttribute("context", "");
            }
        }
    },

    enableButton : function(id) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "The enabled button id is: "+id);
        var button = document.getElementById(id);
        if (typeof (button) != "undefined" && button != null) {
            button.setAttribute("disabled", "");
            if(id != "recommendations-menu") {
                button.setAttribute("context", "buttonContext");
            }
        }
    },

    doNothing : function(aEvent) {
        if (aEvent != null) {
            aEvent.cancelBubble = true;
        }
    },

    /**
     * Enter description here ...
     */
    loadContent : function() {
        ConnectionsToolbar.menuUtils.clearAllMenus();
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Loading all items into UI");
        ConnectionsToolbar.data.initialiseContentObjects();
        ConnectionsToolbar.database.retrieveContentTable();
        if (ConnectionsToolbar.componentService.isComponentEnabled("homepage")) {
            ConnectionsToolbar.browserOverlay
                    .enableButton("connections-homepage-button");
        }
        if (ConnectionsToolbar.componentService.isComponentEnabled("profiles")) {
            ConnectionsToolbar.browserOverlay
                    .enableButton("connections-profiles-button");
        }
        if (ConnectionsToolbar.componentService.isComponentEnabled("hot")) {
            ConnectionsToolbar.browserOverlay
                    .enableButton("connections-hot-button");
        }
        if (ConnectionsToolbar.componentService.isComponentEnabled("search")) {
            var searchBox = document.getElementById("connections-search-term");
            if (typeof (searchBox) != "undefined" && searchBox != null) {
                searchBox.disabled = false;
            }
        }

        var version = ConnectionsToolbar.config.version;
        ConnectionsToolbar.browserOverlay.showAllRecommendations(version >= "3.0");
        ConnectionsToolbar.browserOverlay.showStatusUpdates(version >= "4.0");
    },

    /**
     * 
     */
    populateUi : function() {
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];

            ConnectionsToolbar.content.populateComponentUi(component);
            ConnectionsToolbar.recommendations.populateComponentUi(component);
        }
        ConnectionsToolbar.recommendations
                .populateComponentUi("allConnections");
        ConnectionsToolbar.data.deleteContentObjects();
    },
    
    /** 
     * Installs the toolbar button with the given ID into the given 
     * toolbar, if it is not already present in the document. 
     * 
     * @param {string} toolbarId The ID of the toolbar to install to. 
     * @param {string} id The ID of the button to install. 
     * @param {string} afterId The ID of the element to insert after. @optional 
     */  
    installButton : function(toolbarId, id, afterId) {  
        if (!document.getElementById(id)) {  
            var toolbar = document.getElementById(toolbarId);  
      
            // If no afterId is given, then append the item to the toolbar  
            var before = null;  
            if (afterId) {  
                var elem = document.getElementById(afterId);  
                if (elem && elem.parentNode == toolbar)  
                    before = elem.nextElementSibling;  
            }  
      
            toolbar.insertItem(id, before);  
            toolbar.setAttribute("currentset", toolbar.currentSet);  
            document.persist(toolbar.id, "currentset");  
      
            if (toolbarId == "addon-bar")  
                toolbar.collapsed = false;  
        }
    },
    
    showHideButtonItems : function(element, event) {
        if(element.getAttribute("disabled") != "true") {
            var component = element.id.replace("connections-", "");
            component = component.replace("-button", "");

            var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Ci.nsIPrefBranch);
            isCreateEnabled = prefService.getBoolPref("extensions.connections-toolbar.create.button.enabled");

            document.getElementById("openItem").setAttribute("oncommand", "ConnectionsToolbar.browserOverlay.goComponent(\""+component+"\", event, \"\", false)");
            document.getElementById("openItem").setAttribute("label", ConnectionsToolbar.NLS.get("connections." + component + ".open"));
            if(!isCreateEnabled) {
                document.getElementById("openItem").setAttribute("default", "true");
            } else {
                document.getElementById("openItem").setAttribute("default", "false");
            }

            document.getElementById("openItemTab").setAttribute("oncommand", "ConnectionsToolbar.browserOverlay.goComponent(\""+component+"\", event, \"tab\", false)");
            document.getElementById("openItemTab").setAttribute("label", ConnectionsToolbar.NLS.get("connections." + component + ".tab"));

            if(component != "hot" && component != "homepage" && component != "profiles") {
                document.getElementById("createItem").hidden = false;
                document.getElementById("createItem").setAttribute("oncommand", "ConnectionsToolbar.browserOverlay.goComponent(\""+component+"\", event, \"\", true)");
                document.getElementById("createItem").setAttribute("label", ConnectionsToolbar.NLS.get("connections." + component + ".create.open"));
                if(isCreateEnabled) {
                    document.getElementById("createItem").setAttribute("default", "true");
                } else {
                    document.getElementById("createItem").setAttribute("default", "false");
                }

                document.getElementById("buttonContextSeparator").hidden = false;

                if(component != "dogear") {
                    document.getElementById("createItemTab").hidden = false;
                    document.getElementById("createItemTab").setAttribute("oncommand", "ConnectionsToolbar.browserOverlay.goComponent(\""+component+"\", event, \"tab\", true)");
                    document.getElementById("createItemTab").setAttribute("label", ConnectionsToolbar.NLS.get("connections." + component + ".create.tab"));
                } else {
                    document.getElementById("createItemTab").hidden = true;
                }
            } else {
                document.getElementById("openItem").setAttribute("default", "true");
                document.getElementById("buttonContextSeparator").hidden = true;
                document.getElementById("createItem").hidden = true;
                document.getElementById("createItemTab").hidden = true;
            }
        }
    },
    
    showHideMenuItems : function(element, event) {
        document.getElementById("openListItem").setAttribute("oncommand", element.getAttribute("oncommand"));

        var url = element.getAttribute("url");
        var command = "ConnectionsToolbar.browserOverlay.gotoURL('"
                + url + "',event, 'tab');return false;";
        document.getElementById("openListItemTab").setAttribute("oncommand", command);
        
        document.getElementById("copyUrl").setAttribute("oncommand", "ConnectionsToolbar.browserOverlay.copyUrlToClipboard('"
                +url + "');");
        

        downloadUrl = element.getAttribute("downloadUrl");
        if(downloadUrl == "" || downloadUrl == "undefined") {
            document.getElementById("menulistContextSeparator").hidden = true;
            document.getElementById("downloadItem").hidden = true;
        } else {
            document.getElementById("menulistContextSeparator").hidden = false;
            document.getElementById("downloadItem").hidden = false;
            document.getElementById("downloadItem").setAttribute("oncommand", "ConnectionsToolbar.browserOverlay.gotoURL('"
                    + downloadUrl +"');");
        }
    },
    
    copyUrlToClipboard : function(text) {
        var str = Components.classes["@mozilla.org/supports-string;1"].
        createInstance(Components.interfaces.nsISupportsString);
        if (!str) {
            return false;
        }

        str.data = text;

        var transfer = Components.classes["@mozilla.org/widget/transferable;1"].
        createInstance(Components.interfaces.nsITransferable);
        if (!transfer) {
            return false;
        }

        transfer.addDataFlavor("text/unicode");
        transfer.setTransferData("text/unicode", str, text.length * 2);

        var clipboard = Components.interfaces.nsIClipboard;
        var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipboard);
        if (!clip) {
            return false;
        }

        clip.setData(transfer, null, clipboard.kGlobalClipboard); 
    }
};

window.addEventListener("load", function() {
    ConnectionsToolbar.fileIcons.init();
}, false);
window.addEventListener("load", function() {
    ConnectionsToolbar.logger.init();
}, false);
window.addEventListener("load", function() {
    ConnectionsToolbar.data.init();
}, false);
window.addEventListener("load", function() {
    ConnectionsToolbar.access.init();
}, false);
window.addEventListener("load", function() {
    ConnectionsToolbar.browserOverlay.init();
}, false);
window.addEventListener("load", function() {
    ConnectionsToolbar.searchFilter.init();
}, false);
window.addEventListener("load", function() {
    ConnectionsToolbar.database.init();
}, false);