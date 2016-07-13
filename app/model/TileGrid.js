Ext.define('MoMo.admin.model.TileGrid', {
    extend: 'MoMo.admin.model.Base',

    requires: [
        'MoMo.admin.model.Extent'
    ],

    proxy: {
        type: 'rest',
        url: BasiGX.util.Url.getWebProjectBaseUrl() + 'rest/tilegrids',
        headers: BasiGX.util.CSRF.getHeader()
    },

    fields: [{
        name: 'type',
        type: 'string'
    }, {
        name: 'tileGridOrigin',
        type: 'auto'
    }, {
        name: 'tileSize',
        type: 'integer'
    }, {
        name: 'tileGridResolutions',
        type: 'auto'
    }, {
        name: 'tileGridExtentId',
        reference: {
            type: 'Extent',
            unique: true
        }
    }]
});
