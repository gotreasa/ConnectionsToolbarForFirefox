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

ConnectionsToolbar.data = {
    contentByComponent : null,
    init : function() {
        ConnectionsToolbar.data.initialiseContentObjects();
    },
    /**
     * Enter description here...
     * 
     */
    loadFeed : function(component, requestURL, isRecommendationsRequest) {
        ConnectionsToolbar.logger.info("Loading "
                        + isRecommendationsRequest + " feed for " + component);
        ConnectionsToolbar.feed.fetchFeed(component, requestURL,
                isRecommendationsRequest);
    },

    getComponentContent : function(component, type) {
        var data = null;

        try {
            data = ConnectionsToolbar.data.contentByComponent[type][component];
            if (typeof (data) == "undefined") {
                data = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error(e);
            ConnectionsToolbar.logger.error("Unable to get " + type
                    + " content for: " + component);
            data = null;
        }
        return data;
    },

    initialiseContentObjects : function() {
        ConnectionsToolbar.logger.info("Initialising the objects");
        ConnectionsToolbar.data.contentByComponent = new Array();
        for (value in ConnectionsToolbar.constants.DATA_TYPE) {
            var type =  ConnectionsToolbar.constants.DATA_TYPE[value];
            ConnectionsToolbar.data.contentByComponent[type] = new Array();

            for (name in ConnectionsToolbar.constants.COMPONENTS) {
                var component = ConnectionsToolbar.constants.COMPONENTS[name];
                ConnectionsToolbar.data.contentByComponent[type][component] = new Array();
            }
        }
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

            ConnectionsToolbar.data.contentByComponent[item[ConnectionsToolbar.constants.TYPE]][item[ConnectionsToolbar.constants.COMPONENT]]
                    .push(item);
        }
    },

    deleteContentObjects : function() {
        delete ConnectionsToolbar.data.contentByComponent;
    }
};