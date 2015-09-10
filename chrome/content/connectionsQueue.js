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

ConnectionsToolbar.queue = {
        methods : new Array(),
        add : function(fn, context, params) {
            ConnectionsToolbar.queue.methods.push(function() {
                fn.apply(context, params);
            });
        },
        run : function() {
            while(ConnectionsToolbar.queue.methods.length > 0) {
                ConnectionsToolbar.queue.methods.shift()();
            }
        }, 
        runNext : function() {
            ConnectionsToolbar.queue.methods.shift()();
        },
        removeNext : function() {
            ConnectionsToolbar.queue.methods.pop();
        }
};