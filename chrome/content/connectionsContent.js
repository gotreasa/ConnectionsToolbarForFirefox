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

ConnectionsToolbar.content = {

    getContent : function() {
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.content.fetchContent(component);
        }
    },

    fetchContent : function(component) {
        if (ConnectionsToolbar.componentService.isComponentEnabled(component)) {

            var numberOfItems = ConnectionsToolbar.componentService
                    .getComponentContentCount(component);
            if (numberOfItems > 0) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                        "Fetching max " + numberOfItems + " content items for "
                                + component);
                var componentURL = ConnectionsToolbar.componentService
                        .getComponentURL(component);
                var componentContext = ConnectionsToolbar.componentService
                        .getComponentContentContext(component);
                var requestURL = componentURL + componentContext
                        + numberOfItems;
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                        "The request url for " + component + " content is " + requestURL);

                ConnectionsToolbar.data.loadFeed(component, requestURL, false);
            }
        }
    },

    /**
     * Enter description here ...
     */
    populateComponentUi : function(component) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Content is about to populate");
        if (ConnectionsToolbar.componentService.isComponentEnabled(component)) {
            ConnectionsToolbar.browserOverlay.showButton("connections-"
                    + component + "-button", true);
            ConnectionsToolbar.browserOverlay.showButton("search-scope-"
                    + component, true);
            
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                    "Content is populating");
            var popupID = "my-" + component + "-popup";
            var popup = document.getElementById(popupID);

            if (typeof (popup) != "undefined" && popup != null) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                        "Removing old " + component + " content items from UI");

                var contentData = ConnectionsToolbar.data
                        .getComponentContent(component);
                if (contentData != null) {
                    for ( var i = 0; i < contentData.length; i++) {
                        try {
                            var title = contentData[i][ConnectionsToolbar.constants.TITLE];
                            var url = contentData[i][ConnectionsToolbar.constants.URL];

                            var favicon = null;
                            if (component == "dogear") {
                                favicon = ConnectionsToolbar.fileIcons
                                        .getFavicon(contentData[i][ConnectionsToolbar.constants.URL]);
                            }
                            
                            var downloadUrl = null;
                            if (component == "files") {
                                downloadUrl = contentData[i][ConnectionsToolbar.constants.DOWNLOAD];
                            }

                            var menuItem = ConnectionsToolbar.menuUtils
                                    .createMenuItem(title, component, favicon,
                                            url, downloadUrl);
                            popup.appendChild(menuItem);
                        } catch (e) {
                            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                    e);
                            ConnectionsToolbar.logger
                                    .log(ConnectionsToolbar.constants.LOGGER.INFO,
                                            "An exception occurred during processing "
                                                    + component
                                                    + " content item: " + e);
                        }
                    }
                }

                if (contentData != null && contentData.length > 0) {
                    ConnectionsToolbar.menuUtils.hidePlaceholder(popup);
                } else {
                    ConnectionsToolbar.menuUtils.showPlaceholder(popup, "content", component);
                }
            }

            ConnectionsToolbar.browserOverlay.enableButton("connections-"
                    + component + "-button");
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "The " + component
                    + " content items loaded into UI");

            Application.prefs
                .get("extensions.connections-toolbar.configured").value = true;
        } else {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "The " + component
                    + " are disabled.  Hiding menu options.");
            ConnectionsToolbar.browserOverlay.showButton("connections-" + component
                    + "-button", false);
            ConnectionsToolbar.browserOverlay.showButton("search-scope-" + component,
                    false);
            if(Application.prefs
                    .get("extensions.connections-toolbar.search").value == component) {
                ConnectionsToolbar.searchFilter.update(null, "");
            }
        }
    }
};