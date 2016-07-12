Ext.define('MoMo.admin.store.Language', {
    extend: 'Ext.data.Store',

    storeId: 'Language',

    fields: [{
        name: 'Name'
    }],

    data: [{
        name: 'de'
    }, {
        name: 'en'
    }]

});
