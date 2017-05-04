Ext.define('MoMo.admin.view.panel.application.Permissions', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-permission',

    requires: [
        'MoMo.admin.view.grid.EntityPermissions'
    ],

    routeId: 'permissions',

    bind: {
        title: '{i18n.permissions.applicationpermissionstitle}'
    },

    padding: 20,

    scrollable: 'y',

    items: [{
        xtype: 'displayfield',
        bind: {
            value: '{i18n.permissions.applicationpermissionsdescriptiontext}'
        }
    }, {
        xtype: 'fieldset',
        layout: 'hbox',
        bind: {
            title: '{i18n.permissions.applicationpermissionstitle}'
        },
        items: [{
            xtype: 'momo-entitypermissions',
            flex: 1,
            entity: 'MomoApplication',
            targetEntity: 'MomoUser'
        }, {
            xtype: 'momo-entitypermissions',
            flex: 1,
            entity: 'MomoApplication',
            targetEntity: 'MomoUserGroup'
        }]
    }]

});
