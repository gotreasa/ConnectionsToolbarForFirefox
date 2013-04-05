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

ConnectionsToolbar.scheduler = {
    runLogin : false,
    run : function(result) {
        var d = new Date();
        var currentTime = d.getTime();
        nextTime = parseInt(Application.prefs
                .get("extensions.connections-toolbar.scheduler.next-run").value);
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Running again at: " + nextTime);

        ConnectionsToolbar.scheduler.runLogin = true;

        var count = null;
        if (nextTime <= currentTime) {
            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "It's time to run");
            ConnectionsToolbar.scheduler.fullRefresh();
        } else {
            if(typeof (result) != "undefined" && result != null) {
                var row = result.getNextRow();
                count = row.getResultByName("COUNT(*)");
            }
            
            if(typeof (count) == "undefined" || count == null || count == 0) {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "There's nothing in the database");
                ConnectionsToolbar.scheduler.fullRefresh();
            } else {
                ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Just loading the content");
                if(Application.prefs
                        .get("extensions.connections-toolbar.configured").value == true) {
                    ConnectionsToolbar.browserOverlay.repaint(ConnectionsToolbar.browserOverlay.loadContent);
                    ConnectionsToolbar.scheduler.setNextRun();
                } else {
                    ConnectionsToolbar.scheduler.fullRefresh();
                }
            }
        }
    },

    fullRefresh : function() {
        ConnectionsToolbar.componentService.refreshComponentService();
        ConnectionsToolbar.scheduler.setNextRun();
    },
    
    disableToolbarAndRefresh : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Disabling the toolbar and refreshing");
        for (name in ConnectionsToolbar.constants.COMPONENTS) {
            component = ConnectionsToolbar.constants.COMPONENTS[name];
            ConnectionsToolbar.browserOverlay.disableButton("connections-"
                    + component + "-button");
        }
        ConnectionsToolbar.browserOverlay.disableButton("recommendations-menu");
        ConnectionsToolbar.browserOverlay.disableButton("connections-hot-button");
        ConnectionsToolbar.browserOverlay.disableButton("connections-homepage-button");
        ConnectionsToolbar.browserOverlay.disableButton("connections-profiles-button");
        ConnectionsToolbar.browserOverlay.disableButton("connections-search-term");
        ConnectionsToolbar.scheduler.fullRefresh();
    },

    setNextRun : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO, "Setting the next run of the scheduler");
        var d = new Date();
        var hours = d.getHours();

        var scheduledHour = Application.prefs
            .get("extensions.connections-toolbar.scheduler.hour").value;
        var randomMillisecond = Application.prefs
            .get("extensions.connections-toolbar.scheduler.random").value;
        var frequency = Application.prefs
            .get("extensions.connections-toolbar.scheduler.frequency").value;

        if(Application.prefs
                .get("extensions.connections-toolbar.scheduler.frequency").value == 86400000) {
            if(scheduledHour > hours) {
                d.setHours(scheduledHour, 0, 0, 0);
                Application.prefs
                        .get("extensions.connections-toolbar.scheduler.next-run").value =
                            (d.getTime() + randomMillisecond).toString();
            } else {
                d.setHours(scheduledHour, 0, 0, 0);
                Application.prefs
                        .get("extensions.connections-toolbar.scheduler.next-run").value =
                            (d.getTime() + frequency + randomMillisecond).toString(); 
                // Adding on 24 hours and random minute, second, and millisecond
            }
        } else {
            Application.prefs
                .get("extensions.connections-toolbar.scheduler.next-run").value =
                (d.getTime() + frequency).toString(); 
        }

        var currentDate = new Date();
        setTimeout(function() {
        		ConnectionsToolbar.scheduler.run();
        	}, (parseInt(Application.prefs
                .get("extensions.connections-toolbar.scheduler.next-run").value)
                - currentDate.getTime()));
    }
};