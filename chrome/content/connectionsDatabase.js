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
        var file = FileUtils.getFile("ProfD",
                ["connections_toolbar_firefox.sqlite"]);
        var mDBConn = Services.storage.openDatabase(file);
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
     * Updates the row in the table
     */
    updateRow : function(tableName, columnValues, dbConn) {
        var statement =  dbConn
                .createStatement("INSERT INTO toolbar_content VALUES ( :title, :url, :type, :component, :download );");
        statement.params.title = ConnectionsToolbar.database
                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.TITLE]);
        statement.params.url = ConnectionsToolbar.database
                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.URL]);
        statement.params.type = ConnectionsToolbar.database
                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.TYPE]);
        statement.params.component = ConnectionsToolbar.database
                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.COMPONENT]);
        statement.params.download = ConnectionsToolbar.database
                .escapeApostrophe(columnValues[ConnectionsToolbar.constants.DOWNLOAD]);
        return statement;
    },
    /**
     * Updates the content table with the content
     */
    updateContentTable : function(rowsArray) {
        var mDBConn = ConnectionsToolbar.database.openDatabase();
        var statements = [];
        for (row in rowsArray) {
            statements.push(ConnectionsToolbar.database.updateRow("toolbar_content", rowsArray[row],
                    mDBConn));
        }
        mDBConn.executeAsync(statements, statements.length);
        mDBConn.asyncClose();
    },
    /**
     * Retrieve all of the content from the content table
     */
    retrieveContentTable : function() {
        var mDBConn = ConnectionsToolbar.database.openDatabase();
        var statement = mDBConn
                .createStatement("SELECT * FROM toolbar_content ORDER BY "
                        + "title COLLATE NOCASE ASC");
        statement
                .executeAsync({
                    handleResult : function(aResultSet) {
                        ConnectionsToolbar.data.setContentObjects(aResultSet);
                    },

                    handleError : function(aError) {
                        ConnectionsToolbar.logger.error(aError.message);
                    },

                    handleCompletion : function(aReason) {
                        if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                            ConnectionsToolbar.logger.info("Query canceled or aborted!");
                        }
                        ConnectionsToolbar.logger
                                .info("Content retrieved and going to populate the UI - "
                                        + Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED);
                        ConnectionsToolbar.browserOverlay.populateUi();
                    }
                });
        mDBConn.asyncClose();
    },
    /**
     * Create the statement to check the table exists
     */
    checkTableExistsStatement : function(mDBConn) {
    	return mDBConn
                .createStatement("CREATE TABLE IF NOT EXISTS toolbar_content" +
                        " ( title varchar(256) NOT NULL, " +
                        "url varchar(256) NOT NULL, " +
                        "type varchar(8) NOT NULL, " +
                        "component varchar(25) NOT NULL, " +
                        "download_link varchar(256), " +
                        "PRIMARY KEY ( title, url , type, component))");
    },

    /**
     * Check that the table exists
     */
    checkTablesExist : function() {
        var statements = [];
        var mDBConn = ConnectionsToolbar.database.openDatabase();
        statements.push(ConnectionsToolbar.database.checkTableExistsStatement(mDBConn));
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
                        ConnectionsToolbar.logger.error(aError.message);
                    },

                    handleCompletion : function(aReason) {
                        if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                            ConnectionsToolbar.logger.info("Query canceled or aborted!");
                        }
                    }
                });
        mDBConn.asyncClose();
    },

    /**
     * 
     */
    emptyContentTable : function() {
        ConnectionsToolbar.logger.info("Emptying the content table");
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