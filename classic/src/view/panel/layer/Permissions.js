Ext.define('MoMo.admin.view.panel.layer.Permissions', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-layer-permission',

    requires: [
        'MoMo.admin.view.grid.EntityPermissions'
    ],

    routeId: 'permissions',

    bind: {
        title: '{i18n.permissions.layerpermissionstitle}'
    },

    padding: 20,

    scrollable: 'y',

    items: [{
        xtype: 'displayfield',
        bind: {
            value: '{i18n.permissions.layerpermissionsdescriptionText}'
        }
    }, {
        xtype: 'fieldset',
        layout: 'hbox',
        bind: {
            title: '{i18n.permissions.layerpermissionstitle}'
        },
        items: [{
            xtype: 'momo-entitypermissions',
            flex: 1,
            entity: 'MomoLayer',
            targetEntity: 'MomoUser'
        }, {
            xtype: 'momo-entitypermissions',
            flex: 1,
            entity: 'MomoLayer',
            targetEntity: 'MomoUserGroup'
        }]
    }]

});
