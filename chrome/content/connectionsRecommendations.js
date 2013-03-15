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

ConnectionsToolbar.recommendations = {

    getRecommendations : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Getting all the recommendations");
        ConnectionsToolbar.recommendations
                .fetchRecommendations("activities,blogs,communities,wikis,files,dogear,forums");
        for(name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.recommendations.fetchRecommendations(component);
        }
    },

    fetchRecommendations : function(component) {
        var popupId = component;
        if (component.split(",").length > 1) {
            popupId = "allConnections";
        }
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Fetching recommendations for " + popupId);
        if (popupId == "allConnections"
                || ConnectionsToolbar.componentService.isComponentEnabled(component)) {

//            ConnectionsToolbar.browserOverlay.disableButton("recommendations-menu");

            // alert("popupId="+popupId);
            var numberOfRecommendations = ConnectionsToolbar.componentService
                    .getComponentRecommendationsCount(popupId);

            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Fetching max "
                    + numberOfRecommendations + " recommendations for "
                    + popupId);

 			var requestURL = ConnectionsToolbar.recommendations.getRequestURL(component, numberOfRecommendations);

            try {
                ConnectionsToolbar.data.loadFeed(popupId, requestURL, true);
            } catch (e) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                        "Error loading " + component
                                + " recommendations data feed");
            }
        }
    },
    
    getRequestURL : function(component, numberOfRecommendations){
    	    var searchURL = ConnectionsToolbar.componentService.getComponentURL("search");
                    
            var requestURL;
            //alert("version is "+ConnectionsToolbar.config.version);
            if (ConnectionsToolbar.config.version >= 4){
                //alert("executing 4.0 recommendations request");
                var recommendUrl = searchURL + "/atom/social/recommend";
                var defaultParams = "pageSize="+numberOfRecommendations+"&diversityboost=1.0f&dateboost=1.0f&randomize=true";

                component = component.replace(new RegExp(', ','g'),',');
                var sources = component.split(",");

                sources.forEach(function(item, i){
                        if (item==="communities"){
                                sources[i] = "Source/communities/entry";
                        } else {
                                sources[i] = "Source/" + item;
                        }
                });

                var constraint = {type: "category", values: sources};
                requestURL = recommendUrl+"?constraint="+JSON.stringify(constraint)+"&"+defaultParams;
            } else {
                requestURL = searchURL + "/api/sand/recommend?ps=" + numberOfRecommendations
                        + "&source=" + component;
            }
            return requestURL;
    },

    populateComponentUi : function(component) {
        if (ConnectionsToolbar.componentService.isComponentEnabled(component)
                || component == "allConnections") {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Loading "
                    + component + " recommendations into UI");
            var popupID = "recommendations-" + component + "-popup";
            var popup = document.getElementById(popupID);

            if (typeof (popupID) != "undefined" && popupID != null) {
                var collectivePopupID = "recommendations-" + component
                        + "-collective-popup";
                var collectivePopup = document
                        .getElementById(collectivePopupID);

                if (typeof (popup) == "undefined" || popup == null) {
                    if (typeof (collectivePopup) != "undefined"
                            && collectivePopup != null) {
                        popup = collectivePopup;
                        collectivePopup = null;
                    }
                }

                if (typeof (popup) != "undefined" && popup != null) {
                    ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                            "Removing old " + component
                                    + " recommendations from UI");

                    var recommendationsData = ConnectionsToolbar.data
                            .getComponentRecommendations(component);
                    if (recommendationsData != null) {
                        for ( var i = 0; i < recommendationsData.length; i++) {
                            try {
                                var title = recommendationsData[i][ConnectionsToolbar.constants.TITLE];
                                var url = recommendationsData[i][ConnectionsToolbar.constants.URL];
                                var type = recommendationsData[i][ConnectionsToolbar.constants.COMPONENT];

                                var favicon = null;
                                if (type == "dogear") {
                                    favicon = ConnectionsToolbar.fileIcons
                                            .getFavicon(recommendationsData[i][ConnectionsToolbar.constants.URL]);
                                }

                                var menuItem = ConnectionsToolbar.menuUtils
                                        .createMenuItem(title, type,
                                                favicon, url);
                                popup.appendChild(menuItem);
                            } catch (e) {
                                ConnectionsToolbar.logger.log(
                                        ConnectionsToolbar.constants.LOGGER.ERROR, e);
                                ConnectionsToolbar.logger.log(
                                        ConnectionsToolbar.constants.LOGGER.INFO,
                                        "An exception occurred during processing "
                                                + component
                                                + " recommendation: " + e);
                            }
                        }
                    }

                    if (recommendationsData != null
                            && recommendationsData.length > 0) {
                        ConnectionsToolbar.menuUtils.hidePlaceholder(popup);
                    } else {
                        ConnectionsToolbar.menuUtils.showPlaceholder(popup, "recommendations");
                    }

                    if (typeof (collectivePopup) != "undefined"
                            && collectivePopup != null) {
                        ConnectionsToolbar.menuUtils.synchronizeMenus(popup,
                                collectivePopup);
                    }
                }
                ConnectionsToolbar.browserOverlay
                        .enableButton("recommendations-menu");
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "The " + component
                        + " recommendations loaded into UI");
            }
        }
    }
};