Ext.define('MoMo.admin.view.panel.application.Tools', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-tools',

    requires: [
        'MoMo.admin.view.panel.application.ToolsController'
    ],

    controller: 'momo-application-tools',

    routeId: 'tools',

    bind: {
        title: '{tools.title}'
    },

    padding: 20,

    scrollable: 'y',

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{tools.title}'
        },
        items: [{
            xtype: 'displayfield',
            bind: {
                value: '{tools.helpText}'
            }
        }]
    }],

    initComponent: function(){
        this.callParent();
        var me = this;
        this.store = Ext.create('MoMo.admin.store.Tools', {
            autoLoad: true,
            listeners: {
                scope: me,
                load: me.getController().createToolButtons
            }
        });
    }

});
