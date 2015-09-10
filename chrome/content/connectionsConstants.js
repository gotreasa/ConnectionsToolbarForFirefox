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

ConnectionsToolbar.constants = {
    COMPONENTS : {
        "ACTIVITIES" : "activities",
        "BLOGS" : "blogs",
        "COMMUNITIES" : "communities",
        "DOGEAR" : "dogear",
        "FILES" : "files",
        "FORUMS" : "forums",
        "WIKIS" : "wikis"
    },
    ALL_COMPONENTS : {
        "HOMEPAGE" : "homepage",
        "PROFILES" : "profiles",
        "ACTIVITIES" : "activities",
        "BLOGS" : "blogs",
        "COMMUNITIES" : "communities",
        "DOGEAR" : "dogear",
        "FILES" : "files",
        "FORUMS" : "forums",
        "WIKIS" : "wikis",
        "BOOKMARKLET" : "bookmarklet"
    },
    SEARCH : "search",
    DATA_TYPE : {
        RECOMMENDATIONS : "recommend",
        CONTENT : "my",
        FOLLOWING : "follow"
    },
    
    COMPONENT : "component",
    DOWNLOAD : "download_link",
    TITLE : "title",
    TYPE : "type",
    URL : "url",
    LOGGER : {
        DEBUG : "DEBUG",
        INFO : "INFO",
        WARNING : "WARNING",
        ERROR : "ERROR"
    }
};