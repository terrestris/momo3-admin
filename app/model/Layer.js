Ext.define('MoMo.admin.model.Layer', {
    extend: 'MoMo.admin.model.Base',

    requires: [
        'MoMo.admin.model.LayerSource',
        'MoMo.admin.model.LayerAppearance'
    ],

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/layers',
        headers: BasiGX.util.CSRF.getHeader()
    },

    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'hoverFieldTemplate',
        type: 'string'
    }, {
        name: 'hoverable',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    }, {
        name: 'dataType',
        type: 'string'
    }, {
        name: 'sourceId',
        reference: {
            type: 'LayerSource',
            unique: true
        }
    }, {
        name: 'metadataIdentifier',
        type: 'string'
    }, {
        name: 'appearanceId',
        reference: {
            type: 'LayerAppearance',
            unique: true
        }
    }]

    // manyToMany: {
    //     LayerLayer: {
    //         type: 'Layer',
    //         role: 'layers',
    //         field: 'layerId',
    //         right: {
    //             field: 'layerId',
    //             role: 'layers'
    //         }
    //     }
    // }
});
