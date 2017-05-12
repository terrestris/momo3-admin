Ext.define('MoMo.admin.store.LayerAttributes', {

    extend: 'Ext.data.Store',

    alias: 'store.layerattributes',

    requires: [
        'Ext.data.reader.Json'
    ],

    proxy: {
        type: 'ajax',
        extraParams: {
            outputFormat: 'application/json'
        },
        reader: {
            type: 'json',
            rootProperty: 'featureTypes[0].properties'
        }
    },

    fields: [{
        name: "name",
        mapping: "@name",
        type: 'string'
    },{
        name: "maxOccurs",
        mapping: "@maxOccurs",
        type: 'int'
    },{
        name: "minOccurs",
        mapping: "@minOccurs",
        type: 'int'
    },{
        name: "nillable",
        mapping: "@nillable",
        type: 'boolean'
    },{
        name: "type",
        mapping: "@type",
        type: 'string'
    }],

    filters: [function(item){
        var ignoreTypes = [
            'gml:GeometryPropertyType',
            'gml:PointPropertyType',
            'gml:LineStringPropertyType',
            'gml:SurfacePropertyType',
            'gml:PolygonPropertyType',
            'gml:MultiPointPropertyType',
            'gml:MultiLineStringPropertyType',
            'gml:MultiSurfacePropertyType',
            'gml:MultiPolygonPropertyType',
            'gml:Point',
            'gml:Polygon',
            'gml:LineString',
            'gml:Surface',
            'gml:MultiPoint',
            'gml:MultiPolygon',
            'gml:MultiLineString',
            'gml:MultiSurface'
        ];

        return !Ext.Array.contains(ignoreTypes, item.get('type'));
    }]

});
