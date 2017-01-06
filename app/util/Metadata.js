/**
 * Metadata Util
 *
 * Write and read XML
 */
Ext.define('MoMo.admin.util.Metadata', {

    statics: {
        /**
         * 
         */
        parseXml: function(xmlString){
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");
            return xmlDoc;
        },

        /**
         * 
         */
        sendCswRequest: function(xmlString, successCallBack){
            Ext.Ajax.request({
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'metadata/csw.action',
                method: "POST",
                params: {
                    xml: xmlString
                },
                defaultHeaders: BasiGX.util.CSRF.getHeader(),
                scope: this,
                success: successCallBack
            });
        },

        /**
         * 
         */
        getInsertBlankXml: function(){
            var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
                '<csw:Transaction xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" version="2.0.2" service="CSW">' +
                '  <csw:Insert>' +
                '    <gmd:MD_Metadata' +
                '        xsi:schemaLocation="http://www.isotc211.org/2005/gmd http://schemas.open gis.net/iso/19139/20060504/gmd/gmd.xsd"' +
                '        xmlns:gmd="http://www.isotc211.org/2005/gmd"' +
                '        xmlns:gco="http://www.isotc211.org/2005/gco"' +
                '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                '        xmlns:gml="http://www.opengis.net/gml">' +
                '    </gmd:MD_Metadata>' +
                '  </csw:Insert>' +
                '</csw:Transaction>';
            return xml;
        },

        /**
         * 
         */
        getRecordXml: function(key, value){
            return '<csw:RecordProperty>' +
                '<csw:Name>' + key + '</csw:Name>' +
                '<csw:Value>' + value + '</csw:Value>' +
            '</csw:RecordProperty>';
        },

        /**
         * 
         */
        getUpdateXml: function(uuid, metadata){
            var recordsString = '';
            var me = this;

            Ext.Object.each(metadata, function(k, v){
                if(metadata[k] && !Ext.isObject(metadata[k])){
                    recordsString += me.getRecordXml(k,v);
                }
            });

            debugger

            var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
                '<csw:Transaction xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" version="2.0.2" service="CSW">' +
                '  <csw:Update>' +
                recordsString +
                '    <csw:Constraint version="1.1.0">' +
                '         <ogc:Filter>' +
                '            <ogc:PropertyIsEqualTo>' +
                '                 <ogc:PropertyName>uuid</ogc:PropertyName>' +
                '                 <ogc:Literal>' + uuid + '</ogc:Literal>' +
                '             </ogc:PropertyIsEqualTo>' +
                '         </ogc:Filter>' +
                '     </csw:Constraint>' +
                '  </csw:Update>' +
                '</csw:Transaction>';
            return xml;
        },

        /**
         * 
         */
        uuidFromXmlString: function(xmlString){
            var xml = this.parseXml(xmlString);
            var identifierNode = xml.getElementsByTagName('identifier')[0];
            return identifierNode.innerHTML;
        }
    }

});
