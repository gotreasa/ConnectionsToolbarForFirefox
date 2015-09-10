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

ConnectionsToolbar.observer = {
    observerService : Components.classes["@mozilla.org/observer-service;1"]
        .getService(Components.interfaces.nsIObserverService),
    register : function() {
        ConnectionsToolbar.observer.observerService.addObserver(ConnectionsToolbar.observer, "http-on-examine-response", false);
    },
    
    observe : function(aSubject, aTopic, aData) {
        if(aTopic == "xpcom-shutdown") {
            ConnectionsToolbar.observer.unregister();
        } else if(aTopic == "http-on-examine-response" && (aSubject instanceof Ci.nsIHttpChannel)) {
            try {
                var code = aSubject.responseStatus;
                if(code == 302) {
                    return;
                }

                searchURL = ConnectionsToolbar.browserOverlay.prefService
                        .getCharPref("extensions.connections-toolbar.search.url").split("/search");
                if(!aSubject.URI.spec.match(searchURL[0])) {
                    ConnectionsToolbar.queue.removeNext();
                    ConnectionsToolbar.observer.unregister();
                    return;
                }
                var auth = aSubject.getResponseHeader('x-lconn-auth');
                if(auth === "false") {
                    aSubject.cancel(Components.results.NS_BINDING_ABORTED);
                    ConnectionsToolbar.access.login(function() {
                        ConnectionsToolbar.queue.runNext();
                    });
                } else {
                    ConnectionsToolbar.queue.removeNext();
                }
            } catch (e) {
                ConnectionsToolbar.logger.error(e);
                ConnectionsToolbar.queue.removeNext();
                ConnectionsToolbar.observer.unregister();
                return;
            }
            ConnectionsToolbar.observer.unregister();
            return;
        }
    },

    unregister : function() {
        ConnectionsToolbar.observer.observerService
                .removeObserver(ConnectionsToolbar.observer, "http-on-examine-response");
    }
};