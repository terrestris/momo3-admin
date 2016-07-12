Ext.define('MoMo.admin.store.Application', {
    extend: 'Ext.data.Store',

    storeId: 'Application',

    fields: [{
        name: 'Name'
    }],

    data: [{
        name: 'My Webapplication 1'
    }, {
        name: 'My Webapplication 2'
    }, {
        name: 'My Webapplication 3'
    }, {
        name: 'My Webapplication 4'
    }]

});
