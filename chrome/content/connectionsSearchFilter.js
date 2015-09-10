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

ConnectionsToolbar.searchFilter = {
    value : "",

    init : function() {
        var selectedStr = ConnectionsToolbar.browserOverlay.prefService
                .getCharPref("extensions.connections-toolbar.search");
        var componentImage = document.getElementById("search-scope-image");
        if(componentImage != null) {
            componentImage.className = "connections-" + selectedStr + "-list-item";
        }
        var searchBox = document.getElementById("connections-search-term");
        if (selectedStr != "all") {
            searchBox.emptyText = ConnectionsToolbar.NLS
                    .get("connections.searchBox.emptyText." + selectedStr);
        } else {
            searchBox.emptyText = ConnectionsToolbar.NLS
                    .get("connections.searchBox.emptyText.default");
        }
    },

    update : function(aEvent, selected) {
        // window.alert(selected);
        var selectedStr = selected == "" ? "all" : selected;
        ConnectionsToolbar.browserOverlay.prefService.setCharPref("extensions.connections-toolbar.search", selectedStr);
        // window.alert(selectedStr);
        var componentImage = document.getElementById("search-scope-image");
        componentImage.className = "connections-" + selectedStr + "-list-item";
        var searchBox = document.getElementById("connections-search-term");
        if (selected.length > 0) {
            searchBox.emptyText = ConnectionsToolbar.NLS
                    .get("connections.searchBox.emptyText." + selectedStr);
        } else {
            searchBox.emptyText = ConnectionsToolbar.NLS
                    .get("connections.searchBox.emptyText.default");
        }
    }
};