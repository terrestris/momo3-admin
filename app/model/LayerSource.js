Ext.define('MoMo.admin.model.LayerSource', {
    extend: 'MoMo.admin.model.Base',

    requires: [
        'MoMo.admin.model.TileGrid',
        'MoMo.admin.model.Extent'
    ],

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/sources',
        headers: BasiGX.util.CSRF.getHeader()
    },

    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'url',
        type: 'string'
    },
    // WMS
    {
        name: 'width',
        type: 'integer'
    }, {
        name: 'height',
        type: 'integer'
    }, {
        name: 'version',
        type: 'string'
    }, {
        name: 'layerNames',
        type: 'auto'
    }, {
        name: 'layerStyles',
        type: 'auto'
    },
    // TileWMS
    {
        name: 'tileGridId',
        reference: {
            type: 'TileGrid',
            unique: true
        }
    },
    // Vector-Source
    {
        name: 'format',
        type: 'string'
    },
    // XYZ-Source
    {
        name: 'tileSize',
        type: 'integer'
    }, {
        name: 'center',
        type: 'integer'
    }, {
        name: 'extentId',
        reference: {
            type: 'Extent',
            unique: true
        }
    }, {
        name: 'resolutions',
        type: 'auto'
    }]
});
