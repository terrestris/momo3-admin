Ext.define('MoMo.admin.view.panel.GroupPanel',{
    extend: 'Ext.form.Panel',

    xtype: 'momo-grouppanel',

    bodyPadding: 5,

    requires: [
        'MoMo.admin.view.panel.GroupPanelController',
        'MoMo.admin.view.panel.GroupPanelModel',
        'MoMo.admin.view.grid.GroupList',
        'MoMo.admin.view.grid.GroupPermissionGrid'
    ],

    controller: 'momo-grouppanel',

    viewModel: {
        type: 'momo-grouppanel'
    },

    listeners: {
        groupsreloaded: 'reloadData'
    },

    bind: {
        title: '{i18n.grouppanelTitle}'
    },
    height: 400,
    scrollable: 'y',

    items: [{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'fieldset',
            minWidth: 620,
            minHeight: 350,
            flex: 1,
            defaults: {
                width: '100%'
            },
            items: [{
                xtype: 'momo-grouplist'
            }]
        }, {
            xtype: 'fieldset',
            flex: 2,
            minHeight: 350,
            items: [{
                xtype: 'panel',
                bind: {
                    title: '{i18n.grouppanelEditPermissionsTitle}'
                },
                items: [{
                    xtype: 'displayfield',
                    bind: {
                        value: '{i18n.grouppanelPermissionGridDescription}'
                    }
                }, {
                    xtype: 'momo-grouppermissiongrid'
                }]
            }]
        }]
    }],


    bbar: [{
        xtype: 'button',
        formBind: true,
        bind: {
            text: '{i18n.grouppanelSaveButtonText}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-save fa-2x',
        handler: 'onSaveClick'
    }]

});
