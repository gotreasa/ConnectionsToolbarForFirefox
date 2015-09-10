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

ConnectionsToolbar.fileIcons = {
    icons : null,

    getClassForFile : function(filename) {
        var iconClass = "connections-icon-File";
        try {
            var idx = filename.lastIndexOf(".");
            var fileExtension = filename.substr(idx + 1);
            var iconType = ConnectionsToolbar.fileIcons.icons[fileExtension];
            if (iconType != undefined && iconType != null) {
                iconClass = "connections-icon-" + iconType;
            }
        } catch (e) {
            iconClass = "connections-icon-File";
        }
        return iconClass;
    },

    init : function() {
        if (ConnectionsToolbar.fileIcons.icons == null) {
            ConnectionsToolbar.fileIcons.icons = new Array();
            // audio
            ConnectionsToolbar.fileIcons.icons["aac"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["au"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["snd"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["m4a"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["mid"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["rmi"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["kar"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["midi"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["mp3"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["mpga"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["wma"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["aif"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["aifc"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["aiff"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["m3u"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["ra"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["ram"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["rm"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["rpm"] = "Audio";
            ConnectionsToolbar.fileIcons.icons["wav"] = "Audio";

            // code
            ConnectionsToolbar.fileIcons.icons["asp"] = "Code";
            ConnectionsToolbar.fileIcons.icons["html.zip"] = "Code";
            ConnectionsToolbar.fileIcons.icons["jsp"] = "Code";
            ConnectionsToolbar.fileIcons.icons["axs"] = "Code";
            ConnectionsToolbar.fileIcons.icons["php"] = "Code";
            ConnectionsToolbar.fileIcons.icons["wml"] = "Code";
            ConnectionsToolbar.fileIcons.icons["js"] = "Code";
            ConnectionsToolbar.fileIcons.icons["xml"] = "Code";
            ConnectionsToolbar.fileIcons.icons["css"] = "Code";
            ConnectionsToolbar.fileIcons.icons["htm"] = "Code";
            ConnectionsToolbar.fileIcons.icons["html"] = "Code";
            ConnectionsToolbar.fileIcons.icons["stm"] = "Code";
            ConnectionsToolbar.fileIcons.icons["sct"] = "Code";
            ConnectionsToolbar.fileIcons.icons["htc"] = "Code";
            ConnectionsToolbar.fileIcons.icons["xsl"] = "Code";
            ConnectionsToolbar.fileIcons.icons["rdf"] = "Code";
            ConnectionsToolbar.fileIcons.icons["xul"] = "Code";
            ConnectionsToolbar.fileIcons.icons["dtd"] = "Code";
            ConnectionsToolbar.fileIcons.icons["sh"] = "Code";
            ConnectionsToolbar.fileIcons.icons["pl"] = "Code";

            // compressed
            ConnectionsToolbar.fileIcons.icons["cab"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["dmg"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["jar"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["rar"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["sqx"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["taz"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["z"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["tgz"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["gtar"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["gz"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["sit"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["tar"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["zip"] = "Compressed";
            ConnectionsToolbar.fileIcons.icons["xpi"] = "Compressed";

            // contact
            ConnectionsToolbar.fileIcons.icons["crd"] = "Contact";
            ConnectionsToolbar.fileIcons.icons["vcard"] = "Contact";
            ConnectionsToolbar.fileIcons.icons["vcf"] = "Contact";
            ConnectionsToolbar.fileIcons.icons["vcrd"] = "Contact";

            // data
            ConnectionsToolbar.fileIcons.icons["csv"] = "Data";
            ConnectionsToolbar.fileIcons.icons["dbs"] = "Data";
            ConnectionsToolbar.fileIcons.icons["dez"] = "Data";
            ConnectionsToolbar.fileIcons.icons["ens"] = "Data";
            ConnectionsToolbar.fileIcons.icons["fcd"] = "Data";
            ConnectionsToolbar.fileIcons.icons["fcs"] = "Data";
            ConnectionsToolbar.fileIcons.icons["mwkd"] = "Data";
            ConnectionsToolbar.fileIcons.icons["mwks"] = "Data";
            ConnectionsToolbar.fileIcons.icons["qad"] = "Data";
            ConnectionsToolbar.fileIcons.icons["smd"] = "Data";
            ConnectionsToolbar.fileIcons.icons["sms"] = "Data";
            ConnectionsToolbar.fileIcons.icons["odc-sheet.zip"] = "Data";
            ConnectionsToolbar.fileIcons.icons["123"] = "Data";
            ConnectionsToolbar.fileIcons.icons["acs"] = "Data";
            ConnectionsToolbar.fileIcons.icons["12m"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xla"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlc"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlm"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xls"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlt"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlw"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlam"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlsb"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlsm"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xltm"] = "Data";
            ConnectionsToolbar.fileIcons.icons["odf"] = "Data";
            ConnectionsToolbar.fileIcons.icons["otf"] = "Data";
            ConnectionsToolbar.fileIcons.icons["ods"] = "Data";
            ConnectionsToolbar.fileIcons.icons["ots"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xlsx"] = "Data";
            ConnectionsToolbar.fileIcons.icons["xltx"] = "Data";
            ConnectionsToolbar.fileIcons.icons["sxc"] = "Data";
            ConnectionsToolbar.fileIcons.icons["stc"] = "Data";
            ConnectionsToolbar.fileIcons.icons["sxm"] = "Data";
            ConnectionsToolbar.fileIcons.icons["wg2"] = "Data";
            ConnectionsToolbar.fileIcons.icons["wk4"] = "Data";
            ConnectionsToolbar.fileIcons.icons["wk6"] = "Data";

            // document
            ConnectionsToolbar.fileIcons.icons["en4"] = "Document";
            ConnectionsToolbar.fileIcons.icons["enw"] = "Document";
            ConnectionsToolbar.fileIcons.icons["leg"] = "Document";
            ConnectionsToolbar.fileIcons.icons["lwp7"] = "Document";
            ConnectionsToolbar.fileIcons.icons["manu"] = "Document";
            ConnectionsToolbar.fileIcons.icons["msw"] = "Document";
            ConnectionsToolbar.fileIcons.icons["doc"] = "Document";
            ConnectionsToolbar.fileIcons.icons["dot"] = "Document";
            ConnectionsToolbar.fileIcons.icons["mwp"] = "Document";
            ConnectionsToolbar.fileIcons.icons["mwp2"] = "Document";
            ConnectionsToolbar.fileIcons.icons["mwpf"] = "Document";
            ConnectionsToolbar.fileIcons.icons["pages"] = "Document";
            ConnectionsToolbar.fileIcons.icons["pcl"] = "Document";
            ConnectionsToolbar.fileIcons.icons["odc-text.zip"] = "Document";
            ConnectionsToolbar.fileIcons.icons["ort"] = "Document";
            ConnectionsToolbar.fileIcons.icons["lwp"] = "Document";
            ConnectionsToolbar.fileIcons.icons["docm"] = "Document";
            ConnectionsToolbar.fileIcons.icons["dotm"] = "Document";
            ConnectionsToolbar.fileIcons.icons["odc"] = "Document";
            ConnectionsToolbar.fileIcons.icons["odg"] = "Document";
            ConnectionsToolbar.fileIcons.icons["otg"] = "Document";
            ConnectionsToolbar.fileIcons.icons["odt"] = "Document";
            ConnectionsToolbar.fileIcons.icons["otm"] = "Document";
            ConnectionsToolbar.fileIcons.icons["ott"] = "Document";
            ConnectionsToolbar.fileIcons.icons["oth"] = "Document";
            ConnectionsToolbar.fileIcons.icons["docx"] = "Document";
            ConnectionsToolbar.fileIcons.icons["dotx"] = "Document";
            ConnectionsToolbar.fileIcons.icons["sxd"] = "Document";
            ConnectionsToolbar.fileIcons.icons["std"] = "Document";
            ConnectionsToolbar.fileIcons.icons["sxw"] = "Document";
            ConnectionsToolbar.fileIcons.icons["sxq"] = "Document";
            ConnectionsToolbar.fileIcons.icons["stw"] = "Document";
            ConnectionsToolbar.fileIcons.icons["w6"] = "Document";
            ConnectionsToolbar.fileIcons.icons["w97"] = "Document";
            ConnectionsToolbar.fileIcons.icons["wm"] = "Document";
            ConnectionsToolbar.fileIcons.icons["wp5"] = "Document";
            ConnectionsToolbar.fileIcons.icons["wp6"] = "Document";
            ConnectionsToolbar.fileIcons.icons["wpf"] = "Document";
            ConnectionsToolbar.fileIcons.icons["rtx"] = "Document";

            // graphic
            ConnectionsToolbar.fileIcons.icons["cgm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["drw"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["dxf"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["eshr"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["hgs"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["img"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["pcx"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["pgl"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["pntg"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["psd"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["psp6"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["sdw"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["tga"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["wbmp"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["wpg"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["bmp"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["cod"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["gif"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["ief"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["jfif"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["svg"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["svgz"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["ras"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["cmx"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["ico"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["pnm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["pbm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["pgm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["ppm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["rgb"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["xbm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["xpm"] = "Graphic";
            ConnectionsToolbar.fileIcons.icons["xwd"] = "Graphic";

            // image
            ConnectionsToolbar.fileIcons.icons["pict"] = "Image";
            ConnectionsToolbar.fileIcons.icons["tif6"] = "Image";
            ConnectionsToolbar.fileIcons.icons["odi"] = "Image";
            ConnectionsToolbar.fileIcons.icons["oti"] = "Image";
            ConnectionsToolbar.fileIcons.icons["jpe"] = "Image";
            ConnectionsToolbar.fileIcons.icons["jpeg"] = "Image";
            ConnectionsToolbar.fileIcons.icons["jpg"] = "Image";
            ConnectionsToolbar.fileIcons.icons["png"] = "Image";
            ConnectionsToolbar.fileIcons.icons["tif"] = "Image";
            ConnectionsToolbar.fileIcons.icons["tiff"] = "Image";
            ConnectionsToolbar.fileIcons.icons["djv"] = "Image";
            ConnectionsToolbar.fileIcons.icons["djvu"] = "Image";
            ConnectionsToolbar.fileIcons.icons["rtz"] = "Image";

            // pdf
            ConnectionsToolbar.fileIcons.icons["ich"] = "Pdf";
            ConnectionsToolbar.fileIcons.icons["ich6"] = "Pdf";
            ConnectionsToolbar.fileIcons.icons["iwp"] = "Pdf";
            ConnectionsToolbar.fileIcons.icons["pdf"] = "Pdf";
            ConnectionsToolbar.fileIcons.icons["ai"] = "Pdf";
            ConnectionsToolbar.fileIcons.icons["eps"] = "Pdf";
            ConnectionsToolbar.fileIcons.icons["ps"] = "Pdf";

            // presentation
            ConnectionsToolbar.fileIcons.icons["flw"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["pp2"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["pp97"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["shw3"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["odc-present.zip"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["ope"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["prz"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["key"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["mass"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["pot"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["pps"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["ppt"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["ppam"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["pptm"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["ppsm"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["potm"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["otc"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["odp"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["otp"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["pptx"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["ppsx"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["potx"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["sxi"] = "Presentation";
            ConnectionsToolbar.fileIcons.icons["sti"] = "Presentation";

            // text
            ConnectionsToolbar.fileIcons.icons["jw"] = "Text";
            ConnectionsToolbar.fileIcons.icons["mcw"] = "Text";
            ConnectionsToolbar.fileIcons.icons["msg"] = "Text";
            ConnectionsToolbar.fileIcons.icons["ow"] = "Text";
            ConnectionsToolbar.fileIcons.icons["pfs"] = "Text";
            ConnectionsToolbar.fileIcons.icons["qa"] = "Text";
            ConnectionsToolbar.fileIcons.icons["rtf"] = "Text";
            ConnectionsToolbar.fileIcons.icons["sow"] = "Text";
            ConnectionsToolbar.fileIcons.icons["tw"] = "Text";
            ConnectionsToolbar.fileIcons.icons["vw3"] = "Text";
            ConnectionsToolbar.fileIcons.icons["ws"] = "Text";
            ConnectionsToolbar.fileIcons.icons["xy"] = "Text";
            ConnectionsToolbar.fileIcons.icons["323"] = "Text";
            ConnectionsToolbar.fileIcons.icons["uls"] = "Text";
            ConnectionsToolbar.fileIcons.icons["asc"] = "Text";
            ConnectionsToolbar.fileIcons.icons["bas"] = "Text";
            ConnectionsToolbar.fileIcons.icons["c"] = "Text";
            ConnectionsToolbar.fileIcons.icons["h"] = "Text";
            ConnectionsToolbar.fileIcons.icons["log"] = "Text";
            ConnectionsToolbar.fileIcons.icons["text"] = "Text";
            ConnectionsToolbar.fileIcons.icons["txt"] = "Text";
            ConnectionsToolbar.fileIcons.icons["tsv"] = "Text";
            ConnectionsToolbar.fileIcons.icons["etx"] = "Text";

            // video
            ConnectionsToolbar.fileIcons.icons["swf"] = "Video";
            ConnectionsToolbar.fileIcons.icons["svi"] = "Video";
            ConnectionsToolbar.fileIcons.icons["divx"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mp4"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mp2"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mpa"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mpe"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mpeg"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mpg"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mpv2"] = "Video";
            ConnectionsToolbar.fileIcons.icons["mov"] = "Video";
            ConnectionsToolbar.fileIcons.icons["qt"] = "Video";
            ConnectionsToolbar.fileIcons.icons["wmv"] = "Video";
            ConnectionsToolbar.fileIcons.icons["flv"] = "Video";
            ConnectionsToolbar.fileIcons.icons["lsf"] = "Video";
            ConnectionsToolbar.fileIcons.icons["lsx"] = "Video";
            ConnectionsToolbar.fileIcons.icons["asf"] = "Video";
            ConnectionsToolbar.fileIcons.icons["asr"] = "Video";
            ConnectionsToolbar.fileIcons.icons["asx"] = "Video";
            ConnectionsToolbar.fileIcons.icons["avi"] = "Video";
            ConnectionsToolbar.fileIcons.icons["movie"] = "Video";
            ConnectionsToolbar.fileIcons.icons["m4v"] = "Video";
        }
    },

    getClassForFile : function(filename) {
        var iconClass = "connections-icon-File";
        try {
            var idx = filename.lastIndexOf(".");
            var fileExtension = filename.substr(idx + 1);
            var iconType = ConnectionsToolbar.fileIcons.icons[fileExtension];
            if (iconType != undefined && iconType != null) {
                iconClass = "connections-icon-" + iconType;
            }
        } catch (e) {

        }
        return iconClass;
    },

    getFavicon : function(url) {
        if(ConnectionsToolbar.config.version != "2.5") {
            return "chrome://connections-toolbar/skin/images/58-bookmark.png";
        } else {
            var regex = /(^[a-zA-Z]+)\:\/\/([a-zA-Z\d][\a-z\A-Z\d\-\.]*)(:\d{1,5})?([\/\?\#].*)?/;
            var results = url.match(regex);
    
            var host = results[2];
            var port = results[3] == undefined ? "" : results[3];
    
            return ConnectionsToolbar.componentService.getComponentURL("dogear")
                    + "/favicon?host=" + host + "&port=" + port;
        }
    }

};