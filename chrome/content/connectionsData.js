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

ConnectionsToolbar.data = {
    recommendationsByComponent : null,
    contentByComponent : null,
    init : function() {
        ConnectionsToolbar.data.initialiseContentObjects();
    },
    /**
     * Enter description here...
     * 
     */
    loadFeed : function(component, requestURL, isRecommendationsRequest) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Loading "
                        + (isRecommendationsRequest ? "recommendations"
                                : "content") + " feed for " + component);
        ConnectionsToolbar.feed.fetchFeed(component, requestURL,
                isRecommendationsRequest);
    },

    getComponentContent : function(component) {
        var data = null;
        // return ConnectionsToolbar.data.contentByComponent[component];
        try {
            data = ConnectionsToolbar.data.contentByComponent[component];
            if (typeof (data) == "undefined") {
                data = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                    "Unable to get content for: " + component);
            data = null;
        }
        return data;
    },

    getComponentRecommendations : function(component) {
        var data = null;
        // return ConnectionsToolbar.data.recommendationsByComponent[component];
        try {
            data = ConnectionsToolbar.data.recommendationsByComponent[component];
            if (typeof (data) == "undefined") {
                data = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                    "Unable to get recommendations for: " + component);
            data = null;
        }
        return data;
    },

    initialiseContentObjects : function() {
        ConnectionsToolbar.data.recommendationsByComponent = new Array();
        ConnectionsToolbar.data.contentByComponent = new Array();
        ConnectionsToolbar.data.followByComponent = new Array();
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];

            ConnectionsToolbar.data.recommendationsByComponent[component] = new Array();
            ConnectionsToolbar.data.contentByComponent[component] = new Array();
            ConnectionsToolbar.data.followByComponent[component] = new Array();
        }
        ConnectionsToolbar.data.recommendationsByComponent["allConnections"] = new Array();
    },
    /**
     * 
     */
    setContentObjects : function(content) {
        for ( var row = content.getNextRow(); row; row = content.getNextRow()) {

            var item = new Array();
            item[ConnectionsToolbar.constants.TYPE] = row
                    .getResultByName(ConnectionsToolbar.constants.TYPE);
            item[ConnectionsToolbar.constants.COMPONENT] = row
                    .getResultByName(ConnectionsToolbar.constants.COMPONENT);
            item[ConnectionsToolbar.constants.TITLE] = row
                    .getResultByName(ConnectionsToolbar.constants.TITLE);
            item[ConnectionsToolbar.constants.URL] = row
                    .getResultByName(ConnectionsToolbar.constants.URL);
            item[ConnectionsToolbar.constants.DOWNLOAD] = row
                    .getResultByName(ConnectionsToolbar.constants.DOWNLOAD);

            if (item[ConnectionsToolbar.constants.TYPE] == "recommend"
                    || item[ConnectionsToolbar.constants.TYPE] == "recommendAll") {
                if (item[ConnectionsToolbar.constants.TYPE] == "recommendAll") {
                    ConnectionsToolbar.data.recommendationsByComponent["allConnections"]
                            .push(item);
                } else {
                    ConnectionsToolbar.data.recommendationsByComponent[item[ConnectionsToolbar.constants.COMPONENT]]
                            .push(item);
                }
            } else if (item[ConnectionsToolbar.constants.TYPE] == "my") {
                ConnectionsToolbar.data.contentByComponent[item[ConnectionsToolbar.constants.COMPONENT]]
                        .push(item);
            } else if (item[ConnectionsToolbar.constants.TYPE] == "follow") {
                ConnectionsToolbar.data.followByComponent[item[ConnectionsToolbar.constants.COMPONENT]]
                        .push(item);
            }
        }
    },

    deleteContentObjects : function() {
        delete ConnectionsToolbar.data.recommendationsByComponent;
        delete ConnectionsToolbar.data.contentByComponent;
        delete ConnectionsToolbar.data.followByComponent;
    }
};