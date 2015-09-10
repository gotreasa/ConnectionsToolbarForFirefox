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

ConnectionsToolbar.feed = {
    processResponseLock : 0,
        
    fetchFeed : function(component, requestURL, type) {
        if((type == ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING
                && component !== ConnectionsToolbar.constants.COMPONENTS.DOGEAR)
                || type === ConnectionsToolbar.constants.DATA_TYPE.CONTENT
                || type === ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS) {
            ConnectionsToolbar.logger.info("Fetching " + type + " feed for "
                    + component);

            var xhReq = new XMLHttpRequest();
            xhReq.open("GET", requestURL, true);
            xhReq.setRequestHeader("User-Agent", "connections-toolbar");
            ConnectionsToolbar.logger.info("Request URL is "+requestURL);
            ConnectionsToolbar.feed.processResponseLock++;
            xhReq.onreadystatechange = function() {
                if (xhReq.readyState != 4) {
                    return;
                }
    
                try {
                    ConnectionsToolbar.feed.processResponse(component, xhReq,
                            type);
                } catch (e) {
                    ConnectionsToolbar.logger.error(e);
                    ConnectionsToolbar.feed.processError(component,
                            type, e);
                }
            };
    
            xhReq.onError = function() {
                ConnectionsToolbar.feed.processError(component, type, "XHR error");
            };
    
            xhReq.send();
    
        }
    },

    /**
     * Enter description here...
     * 
     */
    processResponse : function(requestedComponent, response,
            type) {
        var serviceAvailable = false;
        if (response.responseXML != null) {
            serviceAvailable = true;
            // window.alert(response.responseXML);
            // window.alert(response.responseText);

            var items = new Array();

            var feedNodeName = "feed";
            if (ConnectionsToolbar.config.version < 4
                    && type == ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS) {
                feedNodeName = "results";
            }

            var feedNode = response.responseXML
                    .getElementsByTagName(feedNodeName)[0];
            if (type != ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS && feedNode == null
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
                    if (type != ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS
//                            && type != ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING
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

                    var item = new Array();
                    item[ConnectionsToolbar.constants.TITLE] = title;
                    item[ConnectionsToolbar.constants.URL] = url;
                    item[ConnectionsToolbar.constants.DOWNLOAD] = download_link;
                    item[ConnectionsToolbar.constants.COMPONENT] = component;
                    item[ConnectionsToolbar.constants.TYPE] = type;
                    items.push(item);
                }
                ConnectionsToolbar.database.updateContentTable(items);
                ConnectionsToolbar.logger.info("Exiting the " + type + " "
                        + requestedComponent + " component was fetched");
            }
            ConnectionsToolbar.feed.processResponseLock--;
            if(ConnectionsToolbar.feed.processResponseLock == 0) {
                ConnectionsToolbar.browserOverlay.loadContent();
            }
        }

        if (!serviceAvailable) {
            ConnectionsToolbar.feed.processError(requestedComponent, type, "The service is not available");
        }
    },

    /**
     * Enter description here...
     * 
     */
    processError : function(component, type, exception) {
        ConnectionsToolbar.feed.processResponseLock--;
        ConnectionsToolbar.logger.error("Error occurred while processing "
                + type + " feed for " + component + ": " + exception);
    }
};