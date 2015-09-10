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

ConnectionsToolbar.content = {

    /**
     * Get the particular type of content requested
     * 
     * @param String type - type of content to be fetched
     */
    getContent : function(type) {
        for (var name in ConnectionsToolbar.constants.COMPONENTS) {
            var component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.content.fetchContent(component, type);
        }
    },

    /**
     * Fetch the content from Connections server for the particular type and component
     * 
     * @param String component - name of component you retrieving the content for
     * @param String type - content type you want to retrieve
     */
    fetchContent : function(component, type) {
        if((type === ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING
                && component !== ConnectionsToolbar.constants.COMPONENTS.DOGEAR)
                || type !== ConnectionsToolbar.constants.DATA_TYPE.CONTENT
                || type !== ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS) {
            if (ConnectionsToolbar.componentService.isComponentEnabled(component)) {

                var numberOfItems = ConnectionsToolbar.componentService
                        .getComponentContentCount(component, type);
                if (numberOfItems > 0) {
                    ConnectionsToolbar.logger.info("Fetching max " + numberOfItems + " " + type + " content items for "
                                    + component);
                    var componentURL = ConnectionsToolbar.componentService
                            .getComponentURL(component);
                    var componentContext = ConnectionsToolbar.componentService
                            .getComponentContentContext(component, type);

                    var requestURL;
                    if(type !== ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS) {
                        requestURL = componentURL + componentContext
                        + numberOfItems;
                    } else {
                        requestURL = componentContext
                                + numberOfItems;
                    }
                    ConnectionsToolbar.logger.info("The request url for " + component + " " + type + " content is " + requestURL);

                    ConnectionsToolbar.data.loadFeed(component, requestURL,
                            type);
                }
            }
        }
    },

    /**
     * Enter description here ...
     */
    populateComponentUi : function(component, type) {
        ConnectionsToolbar.logger.info(type + " content is about to populate");
        if (ConnectionsToolbar.componentService.isComponentEnabled(component)) {
            ConnectionsToolbar.browserOverlay.showButton("connections-"
                    + component + "-button", true);
            ConnectionsToolbar.browserOverlay.showButton("search-scope-"
                    + component, true);
            
            ConnectionsToolbar.logger.info(type +" content is populating");
            var popupID = type + "-" + component + "-popup";
            var popup = document.getElementById(popupID);

            if (typeof (popup) != "undefined" && popup != null) {
                ConnectionsToolbar.logger.info("Removing old " + component + " " + type + " content items from UI");

                var contentData = ConnectionsToolbar.data
                        .getComponentContent(component, type);
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
                                    .createMenuItem(title, component, type, favicon,
                                            url, downloadUrl);
                            popup.appendChild(menuItem);
                        } catch (e) {
                            ConnectionsToolbar.logger.error(e);
                            ConnectionsToolbar.logger
                                    .info("An exception occurred during processing "
                                                    + component
                                                    + " " + type + " content item: " + e);
                        }
                    }
                }

                if (contentData != null && contentData.length > 0) {
                    ConnectionsToolbar.menuUtils.hidePlaceholder(popup);
                } else {
                    ConnectionsToolbar.menuUtils.showPlaceholder(popup,
                            ConnectionsToolbar.constants.DATA_TYPE.CONTENT,
                            component);
                }
            }

            ConnectionsToolbar.browserOverlay.enableButton("connections-"
                    + component + "-button");
            ConnectionsToolbar.logger.info("The " + component
                    + " " + type + " content items loaded into UI");

            ConnectionsToolbar.browserOverlay.prefService
                .setBoolPref("extensions.connections-toolbar.configured", true);
        } else {
            ConnectionsToolbar.logger.info("The " + component
                    + " are disabled.  Hiding menu options.");
            ConnectionsToolbar.browserOverlay.showButton("connections-" + component
                    + "-button", false);
            ConnectionsToolbar.browserOverlay.showButton("search-scope-" + component,
                    false);
            if(ConnectionsToolbar.browserOverlay.prefService
                    .getCharPref("extensions.connections-toolbar.search") == component) {
                ConnectionsToolbar.searchFilter.update(null, "");
            }
        }
    }
};