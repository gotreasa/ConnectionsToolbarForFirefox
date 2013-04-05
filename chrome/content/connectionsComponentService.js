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

ConnectionsToolbar.componentService = {
    componentRecommendationsCount : null,
    componentContentCount : null,
    componentContentContexts : null,
    ready : false,

    refreshComponentService : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Refreshing component service.");
        ConnectionsToolbar.componentService.ready = false;
        ConnectionsToolbar.componentService.componentRecommendationsCount = null;
        ConnectionsToolbar.componentService.componentContentCount = null;

        if (ConnectionsToolbar.componentService.componentContentContexts == null) {
            ConnectionsToolbar.componentService.componentContentContexts = new Array();
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.COMMUNITIES] = "/service/atom/communities/my?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.ACTIVITIES] = "/service/atom2/activities?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.BLOGS] = "/"
                    + Application.prefs.get("extensions.connections-toolbar.blogs.homepage").value
                    +"/api/blogs?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.DOGEAR] = "/atom/mybookmarks?ps=";
            // TODO: figure out which forums URL we should be using
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.FORUMS] = "/atom/topics/my?ps=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.FILES] = "/basic/api/myuserlibrary/feed?pageSize=";
            ConnectionsToolbar.componentService.componentContentContexts[ConnectionsToolbar.constants.COMPONENTS.WIKIS] = "/form/api/mywikis/feed?pageSize=";
        }

        ConnectionsToolbar.preferences.refreshPreferences();
        ConnectionsToolbar.config.refreshConfig(ConnectionsToolbar.componentService.collateOptions);
    },

    collateOptions : function() {
        if (!ConnectionsToolbar.config.autoConfigAttempted) {
            return;
        }

        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Collating available components");

        var service = ConnectionsToolbar.componentService;

        service.componentRecommendationsCount = new Array();
        service.componentContentCount = new Array();

        ConnectionsToolbar.config.getComponentURL("search");
        Application.prefs.get("extensions.connections-toolbar.search.enable").value = !(ConnectionsToolbar.componentService.getComponentURL("search") == null);

        service.componentRecommendationsCount["allConnections"] = ConnectionsToolbar.preferences
                .getComponentRecommendationsCount("allConnections");

        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];

            ConnectionsToolbar.config.getComponentURL(component);
            Application.prefs.get("extensions.connections-toolbar." + component + ".enable").value = !(ConnectionsToolbar.componentService.getComponentURL(component) == null);
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "The " + component + " URL is " +
                    Application.prefs.get("extensions.connections-toolbar." + component + ".url").value);
            service.componentRecommendationsCount[component] = ConnectionsToolbar.preferences
                    .getComponentRecommendationsCount(component);
            service.componentContentCount[component] = ConnectionsToolbar.preferences
                    .getComponentContentCount(component);
        }

        ConnectionsToolbar.config.getComponentURL("profiles");
        Application.prefs.get("extensions.connections-toolbar.profiles.enable").value = !(ConnectionsToolbar.componentService.getComponentURL("profiles") == null);

        ConnectionsToolbar.config.getComponentURL("homepage");
        Application.prefs.get("extensions.connections-toolbar.homepage.enable").value = !(ConnectionsToolbar.componentService.getComponentURL("homepage") == null);

        ConnectionsToolbar.config.getComponentURL("hot");
        if (Application.prefs.get("extensions.connections-toolbar.hot.url").value == null
                || Application.prefs.get("extensions.connections-toolbar.hot.url").value == "") {
            Application.prefs.get("extensions.connections-toolbar.hot.url").value = Application.prefs.get("extensions.connections-toolbar.hot.url").reset();
        }
        Application.prefs.get("extensions.connections-toolbar.hot.enable").value = !(ConnectionsToolbar.componentService.getComponentURL("hot") == null);

        service.ready = true;

        ConnectionsToolbar.browserOverlay.repaint(ConnectionsToolbar.browserOverlay.getContentAndRecommendations);
    },

    isComponentEnabled : function(componentName) {
        var enabled = false;
        try {
            enabled = Application.prefs.get("extensions.connections-toolbar." + component + ".enable").value;
            if (typeof (enabled) == "undefined") {
                enabled = false;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            enabled = false;
        }
        return enabled;
    },

    getComponentContentCount : function(componentName) {
        var count = 0;
        try {
            count = ConnectionsToolbar.componentService.componentContentCount[componentName];
            if (typeof (count) == "undefined") {
                count = 0;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            count = 0;
        }
        return count;
    },

    getComponentRecommendationsCount : function(componentName) {
        var count = 0;
        try {
            count = ConnectionsToolbar.componentService.componentRecommendationsCount[componentName];
            if (typeof (count) == "undefined") {
                count = 0;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            count = 0;
        }
        return count;
    },

    getComponentURL : function(componentName) {
        var componentURL = null;
        try {
            componentURL = Application.prefs.get("extensions.connections-toolbar." + componentName + ".url").value;
            if (typeof (componentURL) == "undefined" || componentURL == "") {
                componentURL = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            componentURL = null;
        }
        return componentURL;
    },

    getComponentContentContext : function(componentName) {
        var componentContentContext = null;
        try {
            componentContentContext = ConnectionsToolbar.componentService.componentContentContexts[componentName];
            if (typeof (componentContentContext) == "undefined"
                    || componentContentContext == "") {
                componentContentContext = null;
            }
        } catch (e) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR, e);
            componentContentContext = null;
        }
        return componentContentContext;
    },

    bookmarkThis : function(event) {
        var location = encodeURIComponent(window.content.document.location);
        var title = encodeURIComponent(window.content.document.title);
        if (title != "" && location != "about:blank") {
            var bookmarkURL;
            if(ConnectionsToolbar.config.version >= "4.0") {
                bookmarkURL = ConnectionsToolbar.componentService.getComponentURL("bookmarklet")
                        + "/post?url=" + location + "&title=" + title;
            } else {
                bookmarkURL = ConnectionsToolbar.componentService.getComponentURL("dogear")
                        + "/bookmarklet/post?url=" + location + "&title=" + title;
            }
            var bookmarkDlg = window
                    .openDialog("about:blank", "",
                            "toolbars=no,scrollbars=yes,resizable=yes,width=760,height=500,centerscreen");
            bookmarkDlg.location.href = bookmarkURL;
        } else {
            alert(ConnectionsToolbar.NLS.get("connections.dogear.nourl"));
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.WARNING,
                    "No URL for bookmark.");
        }
        ConnectionsToolbar.browserOverlay.doNothing(event);
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
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Files ID: " + id);
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
            setTimeout(function() {
            			ConnectionsToolbar.componentService.clickButton();
            		}, 1000, [--i, buttonId, content, callee]);
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
    }
};