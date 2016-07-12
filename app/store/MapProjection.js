Ext.define('MoMo.admin.store.MapProjection', {
    extend: 'Ext.data.Store',

    storeId: 'MapProjection',

    fields: [{
        name: 'name'
    }, {
        name: 'code'
    }],

    data: [{
        name: 'UTM 32N',
        code: 'EPSG:25832'
    }, {
        name: 'UTM 33N',
        code: 'EPSG:25833'
    }, {
        name: 'Google Mercator',
        code: 'EPSG:3857'
    }, {
        name: 'WGS84',
        code: 'EPSG:4326'
    }]

});
