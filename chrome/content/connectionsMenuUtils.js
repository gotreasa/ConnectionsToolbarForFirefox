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
 
if ("undefined" == typeof (ConnectionsToolbar)) {
    var ConnectionsToolbar = {};
};

ConnectionsToolbar.menuUtils = {
    createMenuItem : function(aLabel, aComponent, type, favicon, url, downloadUrl) {
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
                if (type === ConnectionsToolbar.constants.DATA_TYPE.CONTENT) {
                    item.setAttribute("downloadUrl", downloadUrl);
                }
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
        ConnectionsToolbar.logger.info("Clearing all the menus");
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            var component = ConnectionsToolbar.constants.COMPONENTS[name];

            for (value in ConnectionsToolbar.constants.DATA_TYPE) {
                var type = ConnectionsToolbar.constants.DATA_TYPE[value];
                
                ConnectionsToolbar.menuUtils.clearPopup(type + "-" + component + "-popup");
            }
        }
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
        ConnectionsToolbar.logger.info("Showing the placeholder for: "
                + component);
        const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        // create a new XUL menuitem
        var item = document.createElementNS(XUL_NS, "menuitem");
        item.setAttribute("type", "placeholdeer");
        ConnectionsToolbar.logger.info("type: " + type);
        if(type == ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS) {
            item.setAttribute("label", ConnectionsToolbar.NLS.get("connections.recommendations.norecommendations"));
        } else if(type == ConnectionsToolbar.constants.DATA_TYPE.CONTENT) {
            item.setAttribute("label", ConnectionsToolbar.NLS.get("connections." + component + ".nocontent"));
        } else if(type == ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING) {
            item.setAttribute("label", ConnectionsToolbar.NLS.get("connections.following.nofollowing"));
        }
        node.appendChild(item);
    }
};
