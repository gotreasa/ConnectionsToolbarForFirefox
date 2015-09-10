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

ConnectionsToolbar.componentService = {
    componentRecommendationsCount : null,
    componentContentCount : null,
    componentContentContexts : null,
    ready : false,

    refreshComponentService : function() {
        ConnectionsToolbar.logger.info("Refreshing component service.");
        ConnectionsToolbar.componentService.ready = false;
        ConnectionsToolbar.componentService.componentContentCount = null;

        if (ConnectionsToolbar.componentService.componentContentContexts == null) {
            ConnectionsToolbar.componentService.componentContentContexts = new Array();
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT] = new Array();
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.COMMUNITIES] = "/service/atom/communities/my?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.ACTIVITIES] = "/service/atom2/activities?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.BLOGS] = "/home/api/blogs?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.DOGEAR] = "/atom/mybookmarks?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.FORUMS] = "/atom/topics/my?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.FILES] = "/basic/api/myuserlibrary/feed?pageSize=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.CONTENT][ConnectionsToolbar.constants.COMPONENTS.WIKIS] = "/form/api/mywikis/feed?pageSize=";

            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING] = new Array();
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING][ConnectionsToolbar.constants.COMPONENTS.COMMUNITIES] = "/follow/atom/resources?source=communities&type=community&ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING][ConnectionsToolbar.constants.COMPONENTS.ACTIVITIES] = "/follow/atom/resources?source=activities&type=activity&ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING][ConnectionsToolbar.constants.COMPONENTS.BLOGS] = "/follow/atom/resources?source=blogs&type=blog&ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING][ConnectionsToolbar.constants.COMPONENTS.FORUMS] = "/follow/atom/resources?source=forums&type=forum_topic&ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING][ConnectionsToolbar.constants.COMPONENTS.FILES] = "/follow/atom/resources?source=files&type=file&pageSize=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.FOLLOWING][ConnectionsToolbar.constants.COMPONENTS.WIKIS] = "/follow/atom/resources?source=wikis&type=wiki&pageSize=";

            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS] = new Array();
            var searchURL = ConnectionsToolbar.componentService.getComponentURL("search");

            var recommendUrl = searchURL + "/atom/social/recommend";
            var defaultParams = "diversityboost=1.0f&dateboost=1.0f&randomize=true&pageSize=";

            for (var name in ConnectionsToolbar.constants.COMPONENTS) {
                var component = ConnectionsToolbar.constants.COMPONENTS[name];

                if (component==="communities"){
                        source = new Array("Source/communities/entry");
                } else {
                        source = new Array("Source/" + component);
                }

                var constraint = {type: "category", values: source};
                ConnectionsToolbar.logger.info("The component is " + JSON.stringify(constraint));
                ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.DATA_TYPE.RECOMMENDATIONS][component] = recommendUrl
                        + "?constraint="
                        + JSON.stringify(constraint)
                        + "&"
                        + defaultParams;
            }
        }

        ConnectionsToolbar.preferences.refreshPreferences();
        ConnectionsToolbar.config.refreshConfig(ConnectionsToolbar.componentService.collateOptions);
    },

    collateOptions : function() {
        if (!ConnectionsToolbar.config.autoConfigAttempted) {
            return;
        }

        ConnectionsToolbar.logger.info("Collating available components");

        var service = ConnectionsToolbar.componentService;

        service.componentContentCount = new Array();
        for (value in ConnectionsToolbar.constants.DATA_TYPE) {
            var type = ConnectionsToolbar.constants.DATA_TYPE[value];
            service.componentContentCount[type] = new Array();
        }

        ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar.search.enable",
        		!(ConnectionsToolbar.componentService.getComponentURL("search") == null));

        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            var component = ConnectionsToolbar.constants.COMPONENTS[name];

            ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar." + component + ".enable",
            		!(ConnectionsToolbar.componentService.getComponentURL(component) == null));
            ConnectionsToolbar.logger.info("The "
                            + component
                            + " URL is "
                            + ConnectionsToolbar.browserOverlay.prefService
                                    .getCharPref("extensions.connections-toolbar."
                                            + component + ".url"));

            for (value in ConnectionsToolbar.constants.DATA_TYPE) {
                var type = ConnectionsToolbar.constants.DATA_TYPE[value];
                service.componentContentCount[type][component] = ConnectionsToolbar.preferences
                        .getComponentContentCount(component, type);
            }
        }

        ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar.profiles.enable",
        		!(ConnectionsToolbar.componentService.getComponentURL("profiles") == null));

        ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar.homepage.enable",
        		!(ConnectionsToolbar.componentService.getComponentURL("homepage") == null));

        if (ConnectionsToolbar.browserOverlay.prefService.getCharPref("extensions.connections-toolbar.hot.url") == null
                || ConnectionsToolbar.browserOverlay.prefService.getCharPref("extensions.connections-toolbar.hot.url") == "") {
        	ConnectionsToolbar.browserOverlay.prefService.clearUserPref("extensions.connections-toolbar.hot.url");
        }
        ConnectionsToolbar.browserOverlay.prefService.setBoolPref("extensions.connections-toolbar.hot.enable",
        		!(ConnectionsToolbar.componentService.getComponentURL("hot") == null));

        service.ready = true;

        ConnectionsToolbar.browserOverlay.repaint(ConnectionsToolbar.browserOverlay.getAllContent);
    },

    isComponentEnabled : function(component) {
        var enabled = false;
        try {
            enabled = ConnectionsToolbar.browserOverlay.prefService.getBoolPref("extensions.connections-toolbar." + component + ".enable");
            if (typeof (enabled) == "undefined") {
                enabled = false;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error( e);
            enabled = false;
        }
        return enabled;
    },

    getComponentContentCount : function(componentName, type) {
        var count = 0;
        try {
            count = ConnectionsToolbar.componentService.componentContentCount[type][componentName];
            if (typeof (count) == "undefined") {
                count = 0;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error(e);
            count = 0;
        }
        return count;
    },

    getComponentURL : function(componentName) {
        var componentURL = null;
        try {
            componentURL = ConnectionsToolbar.browserOverlay.prefService.getCharPref("extensions.connections-toolbar." + componentName + ".url");
            if (typeof (componentURL) == "undefined" || componentURL == "") {
                componentURL = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error( e);
            componentURL = null;
        }
        return componentURL;
    },

    getComponentContentContext : function(componentName, type) {
        var componentContentContext = null;
        try {
            componentContentContext = ConnectionsToolbar.componentService.componentContentContexts[type][componentName];
            if (typeof (componentContentContext) == "undefined"
                    || componentContentContext == "") {
                componentContentContext = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.error(e);
            componentContentContext = null;
        }
        return componentContentContext;
    },
    
    bookmarkThis : function(event) {
        ConnectionsToolbar.browserOverlay.doNothing(event);
        var bookmarkURL;
        if(ConnectionsToolbar.config.version >= "4.0") {
            bookmarkURL = ConnectionsToolbar.componentService.getComponentURL("bookmarklet");
        } else {
            bookmarkURL = ConnectionsToolbar.componentService.getComponentURL("dogear")
                    + "/bookmarklet";
        }
        
        var d = window.content.document;
//        var b = d.body;
        var dw;

        if (d.title != "" && d.title != "undefined"
            && d.location != "about:blank" && d.location != "about:newtab") {
//            if (b) {
//                var script = d.createElement('script');
//                script.charset = 'UTF-8';
//                script.ver = '4.5';
//                script.src = bookmarkURL + '/tools/blet.js';
//                b.appendChild(script);
//            }
            setTimeout(
                    function() {
                        var url = d.getElementById('dogear_postUrl');

                        if (url && url.href) {
                            url = url.href;
                        } else {
                            url = bookmarkURL + '/post?url=' + encodeURIComponent(d.location) + '&title='
                                    + encodeURIComponent(d.title);
                        }
                        dw = window
                            .openDialog("about:blank", "",
                                  "toolbars=no,scrollbars=yes,resizable=yes,width=760,height=560,centerscreen");
                        dw.location.href = url;
                        if (!(dw == null || typeof (dw) == 'undefined')) {
                            dw.focus();
                        }
                    }, 250);
        } else {
            alert(ConnectionsToolbar.NLS.get("connections.dogear.nourl"));
            ConnectionsToolbar.logger.warn("No URL for bookmark.");
        }
    },

    createEntry : function(componentID, event, target) {
        if (componentID == 'wikis') {
            if (ConnectionsToolbar.config.version < "3.0") {
                var content = ConnectionsToolbar.browserOverlay
                    .gotoURL(ConnectionsToolbar.componentService
                    .getComponentURL(componentID) + '/home/mywikis/create',
                    event, target, ConnectionsToolbar.componentService.onLoadClickButton,
                    "newButton");
                ConnectionsToolbar.componentService.onLoadClickButton("newButton", content);
            } else {
                ConnectionsToolbar.browserOverlay
                    .gotoURL(ConnectionsToolbar.componentService
                            .getComponentURL(componentID) + '/home/mywikis/create',
                            event, target);
            }
        } else if (componentID == 'blogs') {
            ConnectionsToolbar.browserOverlay.gotoURL(
                ConnectionsToolbar.componentService.getComponentURL(componentID)
                        + '/roller-ui/authoring/weblog.do?method=create', event, target);
        }
        else if (componentID == 'communities') {
            if (ConnectionsToolbar.config.version < "4.0") {
                ConnectionsToolbar.browserOverlay
                    .gotoURL(
                            ConnectionsToolbar.componentService.getComponentURL(componentID)
                                    + '/service/html/allcommunities?contextAction=createCommunity',
                            event, target);
            } else {
                ConnectionsToolbar.browserOverlay
                .gotoURL(
                        ConnectionsToolbar.componentService.getComponentURL(componentID)
                                + '/service/html/communitycreate',
                        event, target);
            }
        }
        else if (componentID == 'forums') {
            ConnectionsToolbar.browserOverlay.gotoURL(
                ConnectionsToolbar.componentService.getComponentURL(componentID)
                        + '/html/public?showForm=true', event, target);
        }
        else if (componentID == 'activities') {
            var content = ConnectionsToolbar.browserOverlay.gotoURL(ConnectionsToolbar.componentService
                    .getComponentURL(componentID), event, target,
                    ConnectionsToolbar.componentService.onLoadClickButton, "lconn_act_StartActivityButton_0");
            ConnectionsToolbar.componentService
                    .onLoadClickButton("lconn_act_StartActivityButton_0", content);
        } else if (componentID == 'files') {
            var id;
            if(ConnectionsToolbar.config.version < "4.0") {
                id = "placeAction0";
            } else {
                id = "com_ibm_social_layout_widget_ActionBar_0";
            }
            ConnectionsToolbar.logger.info("Files ID: " + id);
            var content = ConnectionsToolbar.browserOverlay.gotoURL(ConnectionsToolbar.componentService
                    .getComponentURL(componentID), event, target, 
                    ConnectionsToolbar.componentService.onLoadClickButton, id);
            ConnectionsToolbar.componentService.onLoadClickButton(id, content);
        }
        ConnectionsToolbar.browserOverlay.doNothing(event);
    },

    clickButton : function(i, buttonId, content, callee) {
        if(buttonId === "com_ibm_social_layout_widget_ActionBar_0") {
            content = window.getBrowser().webNavigation;
        }
        if (i >= 0
                && ("undefined" === typeof(content.document)
                || content.document.getElementById(buttonId) == null)) {
            setTimeout(function(i, buttonId, content, callee) {
            	ConnectionsToolbar.componentService.clickButton((--i), buttonId, content, callee);
            },
            		 1000);
        } else if ("undefined" !== typeof(content.document)) {
            content.document.body
                    .removeEventListener("load", callee, true);
            var mouseEvent = content.document
                    .createEvent("MouseEvents");
            mouseEvent.initEvent('click', true, true);
            if(content.document.getElementById(buttonId) != null) {
                content.document.getElementById(buttonId).childNodes
                            .item(0).dispatchEvent(mouseEvent);
            }
        }
    },

    onLoadClickButton : function(buttonId, content) {
        this.onLoad = function() {
            gBrowser.addEventListener(
                    "DOMContentLoaded",
                    function() {
                        content.document.body
                                .addEventListener("load", function() {
                                    ConnectionsToolbar.componentService.clickButton(10,
                                            buttonId, content, arguments.callee);
                                }, true);
                        gBrowser.removeEventListener("DOMContentLoaded",
                                arguments.callee, false);
                    }, false);
            if(buttonId === "com_ibm_social_layout_widget_ActionBar_0") {
                ConnectionsToolbar.componentService.clickButton(10, buttonId,
                        content, arguments.callee);
            }
        };
    }
};