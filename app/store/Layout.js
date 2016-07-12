Ext.define('MoMo.admin.store.Layout', {
    extend: 'Ext.data.Store',

    storeId: 'Layout',

    fields: [{
        name: 'Name'
    }],

    data: [{
        id: 1,
        name: 'Classic Layout',
        layoutName: 'classicBorderLayout',
        previewSrc: 'http://www.sencha.com/img/20110215-feat-drawing.png'
    }, {
        id: 2,
        name: 'Advanced Layout',
        layoutName: 'advancedBorderLayout',
        previewSrc: 'http://www.sencha.com/img/20110215-feat-data.png'
    }, {
        id: 3,
        name: 'Simple Layout',
        layoutName: 'simpleBorderLayout',
        previewSrc: 'http://www.sencha.com/img/20110215-feat-html5.png'
    }]

});
