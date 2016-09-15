Ext.define('MoMo.admin.store.MapProjection', {
    extend: 'Ext.data.Store',

    storeId: 'MapProjection',

    fields: [{
        name: 'name'
    }, {
        name: 'code'
    }],

    data: [{
        name: 'Google Mercator',
        code: 'EPSG:3857'
    }, {
        name: 'WGS84',
        code: 'EPSG:4326'
    }]

});
