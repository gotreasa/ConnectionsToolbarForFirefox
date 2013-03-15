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

ConnectionsToolbar.feed = {
    processResponseLock : 0,
        
    fetchFeed : function(component, requestURL, isRecommendationsRequest) {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Fetching "
                + (isRecommendationsRequest ? "recommendations" : "content")
                + " feed for " + component);

        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", requestURL, true);
        xhReq.setRequestHeader("User-Agent", "connections-toolbar");
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.DEBUG, "Request URL is "+requestURL);
        ConnectionsToolbar.feed.processResponseLock++;
        xhReq.onreadystatechange = function() {
            if (xhReq.readyState != 4) {
                return;
            }

            try {
                ConnectionsToolbar.feed.processResponse(component, xhReq,
                        isRecommendationsRequest);
            } catch (e) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
                ConnectionsToolbar.feed.processError(component,
                        isRecommendationsRequest, e);
            }
        };

        xhReq.onError = function() {
            ConnectionsToolbar.feed.processError(component, isRecommendationsRequest, "XHR error");
        };

        xhReq.send();
    },

    /**
     * Enter description here...
     * 
     */
    processResponse : function(requestedComponent, response,
            isRecommendationsRequest) {
        var serviceAvailable = false;
        if (response.responseXML != null) {
            serviceAvailable = true;
            // window.alert(response.responseXML);
            // window.alert(response.responseText);

            var items = new Array();
	
			var feedNodeName = "feed";
			if (ConnectionsToolbar.config.version < 4 && isRecommendationsRequest) {
                feedNodeName = "results";
			}
			            
			//if (isRecommendationsRequest){
            //	ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "requestedComponent is "+requestedComponent+"; feedNodeName is "+feedNodeName+"    "+(new XMLSerializer()).serializeToString(response.responseXML));
            //}

            var feedNode = response.responseXML
                    .getElementsByTagName(feedNodeName)[0];
            if (!isRecommendationsRequest && feedNode == null
                    && requestedComponent == "communities") {
                feedNodeName = "sp_0:feed";
                feedNode = response.responseXML
                        .getElementsByTagName(feedNodeName)[0];
            }
            var entries = feedNode.getElementsByTagName("entry");
			
            if (entries.length > 0) {
                for ( var i = 0; i < entries.length; i++) {
                    // window.alert(entries[i]);
                    var entry = entries[i];
                    var titleElement = entry.getElementsByTagName("title")[0];
                    var title = "<No Title>";
                    try {
                        title = titleElement.firstChild.nodeValue;
                    } catch (e) {
                    }
                    // window.alert(title);

                    var urlElement = entry.getElementsByTagName("link")[0];
                    var url = urlElement.getAttribute("href");
                    var download_link = null;
                    if (!isRecommendationsRequest
                            && requestedComponent != "dogear") {
                        var urlElements = entry.getElementsByTagName("link");
                        for ( var j = 0; j < urlElements.length; j++) {
                            urlElement = urlElements[j];
                            var rel = urlElement.getAttribute("rel");
                            if (rel == "alternate") {
                                url = urlElement.getAttribute("href");
                                if (requestedComponent != "files") {
                                    break;
                                }
                            } else if (rel == "edit-media"
                                    && requestedComponent == "files") {
                                download_link = urlElement.getAttribute("href");
                                //break;
                            }
                        }
                    }

                    // window.alert(URL);

                    var categoryElements = entry
                            .getElementsByTagName("category");
                    var sourceElement = null;

                    for ( var j = 0; j < categoryElements.length; j++) {
                        if (categoryElements[j].getAttribute("scheme") == "http://www.ibm.com/xmlns/prod/sn/component") {
                            sourceElement = categoryElements[j];
                            break;
                        }
                    }

                    if (sourceElement == null) {
                        for ( var k = 0; k < categoryElements.length; k++) {
                            if (categoryElements[k].getAttribute("scheme") != "http://www.ibm.com/xmlns/prod/sn/flags") {
                                sourceElement = categoryElements[k];
                                break;
                            }
                        }
                    }
                    if (sourceElement == null) {
                        for ( var l = 0; l < categoryElements.length; l++) {
                            if (categoryElements[l].getAttribute("scheme") != "http://www.ibm.com/xmlns/prod/sn/type") {
                                sourceElement = categoryElements[l];
                                break;
                            }
                        }
                    }

                    var component = requestedComponent;

                    if (requestedComponent == "allConnections") {
                        if (sourceElement != null) {
                            component = sourceElement.getAttribute("term");
                            if (component.indexOf(":") != -1) {
                                var array = component.split(":");
                                component = array[0];
                            } else if (component == "default") {
                                component = requestedComponent;
                            }
                        } else {
                            component = requestedComponent;
                        }

                        if (component.indexOf("wiki") >= 0) {
                            component = "wikis";
                        }
                        if (component.indexOf("bookmark") >= 0) {
                            component = "bookmarks";
                        } else if (component.indexOf("forum") >= 0) {
                            component = "forums";
                        } else if (component.indexOf("blog") >= 0) {
                            component = "blogs";
                        } else if (component.indexOf("activity") >= 0) {
                            component = "activities";
                        } else if (component.indexOf("community") >= 0) {
                            component = "communities";
                        }
                    }

                    var item = new Array();
                    item[ConnectionsToolbar.constants.TITLE] = title;
                    item[ConnectionsToolbar.constants.URL] = url;
                    item[ConnectionsToolbar.constants.DOWNLOAD] = download_link;
                    item[ConnectionsToolbar.constants.COMPONENT] = component;
                    item[ConnectionsToolbar.constants.TYPE] = isRecommendationsRequest ? "recommend"
                            : "my";
                    if(requestedComponent == "allConnections") {
                        item[ConnectionsToolbar.constants.TYPE] = "recommendAll";
                    }
                    items.push(item);
                }
                ConnectionsToolbar.database.updateContentTable(items);
                var type = isRecommendationsRequest ? "recommend"
                        : "my";
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Exiting the " + type
                        + " " + requestedComponent + " component was fetched");
            }
            ConnectionsToolbar.feed.processResponseLock--;
            if(ConnectionsToolbar.feed.processResponseLock == 0) {
                ConnectionsToolbar.browserOverlay.loadContent();
            }
        }

        if (!serviceAvailable) {
            ConnectionsToolbar.feed.processError(requestedComponent, isRecommendationsRequest, "The service is not available");
        }
    },

    /**
     * Enter description here...
     * 
     */
    processError : function(component, isRecommendationsRequest, exception) {
        ConnectionsToolbar.feed.processResponseLock--;
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                "Error occurred while processing "
                        + (isRecommendationsRequest ? "recommendations"
                                : "content") + " feed for " + component + ": " + exception);
    }
};