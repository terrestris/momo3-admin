Ext.define('MoMo.admin.store.ApplicationLayout', {
    extend: 'Ext.data.Store',

    storeId: 'ApplicationLayout',

    fields: [{
        name: 'Name'
    }],

    data: [{
        src:'http://www.sencha.com/img/20110215-feat-drawing.png',
        name: 'My Layout 1'
    }, {
        src:'http://www.sencha.com/img/20110215-feat-data.png',
        name: 'My Layout 2'
    }, {
        src:'http://www.sencha.com/img/20110215-feat-html5.png',
        name: 'My Layout 3'
    }, {
        src:'http://www.sencha.com/img/20110215-feat-perf.png',
        name: 'My Layout 4'
    }]

});
