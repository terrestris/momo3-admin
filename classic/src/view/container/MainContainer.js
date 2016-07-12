Ext.define('MoMo.admin.view.container.MainContainer', {
    extend: 'Ext.container.Container',
    xtype: 'momo-maincontainerwrap',

    requires : [
        'Ext.layout.container.HBox'
    ],

    cls: 'momo-main-container',

    scrollable: 'y',

    layout: {
        type: 'hbox',
        align: 'stretchmax',

        // Tell the layout to animate the x/width of the child items.
        animate: true,
        animatePolicy: {
            x: true,
            width: true
        }
    }

});
