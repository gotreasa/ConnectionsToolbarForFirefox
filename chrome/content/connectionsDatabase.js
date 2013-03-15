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

if ("undefined" === typeof (ConnectionsToolbar)) {
    var ConnectionsToolbar = {};
};
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

ConnectionsToolbar.database = {
    /**
     * Enter description here...
     */
    init : function() {
        ConnectionsToolbar.database.checkTablesExist();
        ConnectionsToolbar.database.checkTableHasContent();
    },
    /**
     * Enter description here...
     */
    openDatabase : function() {
        let
        file = FileUtils.getFile("ProfD",
                ["connections_toolbar_firefox.sqlite"]);
        mDBConn = Services.storage.openDatabase(file);
        return mDBConn;
        // Will also create the file if it does not exist
    },
    /**
     * Enter description here...
     */
    closeDatabase : function(dbConn) {
        dbConn.asyncClose();
    },
    /**
     * Enter description here...
     */
    createTable : function(tableName) {
        let
        statement = mDBConn
                .createStatement("CREATE "
                        + tableName
                        + " (Title char(256) NOT NULL, Url char(256) NOT NULL PRIMARY)");
    },
    /**
     * Enter description here...
     */
    updateRow : function(tableName, columnValues, dbConn) {
        return statement = dbConn
                .createStatement("INSERT INTO "
                        + tableName
                        + " VALUES ( '"
                        + ConnectionsToolbar.database
                                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.TITLE])
                        + "', '"
                        + ConnectionsToolbar.database
                                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.URL])
                        + "', '"
                        + ConnectionsToolbar.database
                                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.TYPE])
                        + "', '"
                        + ConnectionsToolbar.database
                                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.COMPONENT])
                        + "', '"
                        + ConnectionsToolbar.database
                                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.DOWNLOAD])
                        + "' );");
    },
    /**
     * Enter description here...
     */
    updateContentTable : function(rowsArray) {
        let
        mDBConn = ConnectionsToolbar.database.openDatabase();
        statements = [];
        for (row in rowsArray) {
            statements.push(ConnectionsToolbar.database.updateRow("toolbar_content", rowsArray[row],
                    mDBConn));
        }
        mDBConn.executeAsync(statements, statements.length);
        mDBConn.asyncClose();
    },
    /**
     * Enter description here...
     */
    retrieveContentTable : function() {
        mDBConn = ConnectionsToolbar.database.openDatabase();
        let
        statement = mDBConn
                .createStatement("SELECT * FROM toolbar_content ORDER BY "
                        + ConnectionsToolbar.constants.TITLE + " COLLATE NOCASE ASC");
        statement
                .executeAsync({
                    handleResult : function(aResultSet) {
                        ConnectionsToolbar.data.setContentObjects(aResultSet);
                    },

                    handleError : function(aError) {
                        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                aError.message);
                    },

                    handleCompletion : function(aReason) {
                        if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                                    "Query canceled or aborted!");
                        }
                        ConnectionsToolbar.logger
                                .log(
                                        ConnectionsToolbar.constants.LOGGER.INFO,
                                        "Content retrieved and going to populate the UI - "
                                                + Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED);
                        ConnectionsToolbar.browserOverlay.populateUi();
                    }
                });
        mDBConn.asyncClose();
    },
    /**
     * Enter description here...
     */
    checkTableExistsStatement : function(tableName, mDBConn) {
        return statement = mDBConn
                .createStatement("CREATE TABLE IF NOT EXISTS " + tableName
                        + " (" + ConnectionsToolbar.constants.TITLE
                        + " varchar(256) NOT NULL, " + ConnectionsToolbar.constants.URL
                        + " varchar(256) NOT NULL, " + ConnectionsToolbar.constants.TYPE
                        + " varchar(8) NOT NULL, "
                        + ConnectionsToolbar.constants.COMPONENT
                        + " varchar(25) NOT NULL, "
                        + ConnectionsToolbar.constants.DOWNLOAD + " varchar(256), "
                        + "PRIMARY KEY (" + ConnectionsToolbar.constants.TITLE + ", "
                        + ConnectionsToolbar.constants.URL + ", " + ConnectionsToolbar.constants.TYPE
                        + ", " + ConnectionsToolbar.constants.COMPONENT + "))");
    },

    /**
     * Enter description here...
     */
    checkTablesExist : function() {
        var statements = [];
        var mDBConn = ConnectionsToolbar.database.openDatabase();
        statements.push(ConnectionsToolbar.database.checkTableExistsStatement("toolbar_content",
                mDBConn));
        mDBConn.executeAsync(statements, statements.length);
        mDBConn.asyncClose();
    },

    checkTableHasContent : function() {
        var mDBConn = ConnectionsToolbar.database.openDatabase();
        var statement = mDBConn
                .createStatement("SELECT COUNT(*) FROM toolbar_content");
        statement
                .executeAsync({
                    handleResult : function(aResultSet) {
                        ConnectionsToolbar.access.continueOnError = true;
                        ConnectionsToolbar.scheduler.run(aResultSet);
                    },

                    handleError : function(aError) {
                        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.ERROR,
                                aError.message);
                    },

                    handleCompletion : function(aReason) {
                        if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                            ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                                    "Query canceled or aborted!");
                        }
                    }
                });
        mDBConn.asyncClose();
    },

    /**
     * 
     */
    emptyContentTable : function() {
        ConnectionsToolbar.logger.log(ConnectionsToolbar.constants.LOGGER.INFO,
                "Emptying the content table");
        var mDBConn = ConnectionsToolbar.database.openDatabase();
        var statement = mDBConn.createStatement("DELETE FROM toolbar_content");
        statement.executeAsync();
        mDBConn.asyncClose();
    },
    /**
     * Enter description here...
     */
    escapeApostrophe : function(str) {
        return (str + '').replace(/[']/g, '\'$&').replace(/\u0000/g, '\\0');
    }
};