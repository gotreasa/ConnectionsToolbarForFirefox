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

ConnectionsToolbar.menuUtils = {
    createMenuItem : function(aLabel, aComponent, favicon, url, downloadUrl) {
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        // create a new XUL menuitem
        var item = document.createElementNS(XUL_NS, "menuitem");

        item.setAttribute("label", aLabel);
        item.addEventListener("command", function(event){ 
        	ConnectionsToolbar.browserOverlay.gotoURL(url,event);
        	return false;
        });
        item.addEventListener("click", function(event){
        	if (event.button == 1){
        		ConnectionsToolbar.browserOverlay.gotoURL(url,event,"tab");
        	}
        	return false;
        });
        item.setAttribute("context", "menulistContext");
        item.setAttribute("tooltiptext", aLabel+"\n"+url);
        item.setAttribute("url", url);
        if (aComponent != null) {
            item.setAttribute("class", "menuitem-iconic");
            if (aComponent != "files") {
                if (favicon != null) {
                    item.setAttribute("image", favicon);
                } else {
                    item.className += " connections-" + aComponent
                            + "-list-item";
                }
            } else {
                var iconClass = " "
                        + ConnectionsToolbar.fileIcons.getClassForFile(aLabel);
                item.className += iconClass;
                item.setAttribute("downloadUrl", downloadUrl);
            }
        }
        return item;
    },

    clearMenu : function(node) {
        var menuOptions = node.childNodes;
        for ( var i = menuOptions.length - 1; i >= 0; i--) {
            var currentChild = menuOptions[i];
            if (currentChild.getAttribute("type") != "placeholder") {
                node.removeChild(currentChild);
            } else {
                currentChild.setAttribute("style", "display: none");
            }
        }
    },

    clearAllMenus : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Clearing all the menus");
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];

            ConnectionsToolbar.menuUtils.clearPopup("my-" + component + "-popup");
            ConnectionsToolbar.menuUtils.clearPopup("recommendations-" + component + "-popup");
            ConnectionsToolbar.menuUtils.clearPopup("recommendations-" + component + "-collective-popup");
        }
        ConnectionsToolbar.menuUtils.clearPopup("recommendations-allConnections-popup");
    },
    
    clearPopup : function(popupID) {
        popup = document.getElementById(popupID);
        if (typeof (popup) != "undefined" && popup != null) {
            ConnectionsToolbar.menuUtils.clearMenu(popup);
        }
    },

    hidePlaceholder : function(node) {
        var menuOptions = node.childNodes;
        for ( var i = 0; i < menuOptions.length; i++) {
            var currentChild = menuOptions[i];
            if (currentChild.getAttribute("type") == "placeholder") {
                currentChild.setAttribute("style", "display: none");
            }
        }
    },

    showPlaceholder : function(node, type, component) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Showing the placeholder for: " + component);
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        // create a new XUL menuitem
        var item = document.createElementNS(XUL_NS, "menuitem");
        item.setAttribute("type", "placeholdeer");
        if(type == "recommendations") {
            item.setAttribute("label", ConnectionsToolbar.NLS.get("connections.recommendations.norecommendations"));
        } else if(type == "content")
        item.setAttribute("label", ConnectionsToolbar.NLS.get("connections." + component + ".nocontent"));
        node.appendChild(item);
    },

    synchronizeMenus : function(sourceMenu, destinationMenu) {
        if (destinationMenu != null && sourceMenu != null) {
            // ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Synchronising
            // the Recommendations");
            ConnectionsToolbar.menuUtils.clearMenu(destinationMenu);
            var count = 0;
            if (sourceMenu.hasChildNodes()) {
                var menuOptions = sourceMenu.childNodes;
                for ( var i = 0; i < menuOptions.length; i++) {
                    if (menuOptions[i].getAttribute("type") != "placeholder") {
                        count++;
                        destinationMenu.appendChild(menuOptions[i]
                                .cloneNode(true));
                    }
                }
            }
            if (count > 0) {
                ConnectionsToolbar.menuUtils.hidePlaceholder(destinationMenu);
            }
        }
    }
};
