Ext.define('MoMo.admin.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Ext.window.Toast',

        'BasiGX.util.CSRF',

        'MoMo.admin.view.main.MainController',
        'MoMo.admin.view.main.MainModel',
        'MoMo.admin.view.container.ManageGisClients',
        'MoMo.admin.view.container.ManageLayers',
        'MoMo.admin.view.container.ManageUsers'
    ],

    controller: 'main',
    viewModel: 'main',

    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    activeTab: 2,    // FOR DEVELOPMENT

    header: {
        maxWidth: 250,
        layout: {
            align: 'stretch'
        },
        title: {
            bind: {
                text: 'Peter'
            },
            flex: 0
        },
        items: [{
            xtype: 'button',
            text: 'log out',
            iconCls: 'x-fa fa-sign-out',
            handler: 'logOut'
        }]
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    listeners: {
        beforerender: 'getUserBySession',
        tabchange: 'onTabChange'
    },

    headerPosition: 'left',

    defaults: {
        tabConfig: {
            flex: 1,
            iconAlign: 'left',
            textAlign: 'left'
        },
        layout: 'fit',
        cls: 'mm-main-tab'
    },

    items: [{
        title: 'Manage Layers',
        iconCls: 'fa-list',
        itemId: 'manage-data-layers-tab',
        // bind: {
        //     disabled: '{!allowManageLayers}'
        // },
        items: [{
            xtype: 'mm_container_managelayers',
            style: 'background: #aaa;'
        }]
    }, {
        title: 'Manage Gis Clients',
        iconCls: 'fa-cube',
        itemId: 'manage-web-maps-tab',
        // bind: {
        //     disabled: '{!allowManageGisClients}'
        // },
        items: [{
            xtype: 'mm_container_managegisclients',
            style: 'background: #666;'
        }]
    }, {
        title: 'Manage Users',
        iconCls: 'fa-users',
        itemId: 'manage-users-tab',
        // bind: {
        //     disabled: '{!allowManageUsers}'
        // },
        items: [{
            xtype: 'mm_container_manageusers',
            style: 'background: #222;'
        }]
    }
    //  {
    //     title: 'Manage Account Info',
    //     iconCls: 'fa-male',
    //     itemId: 'manage-account-info-tab',
    //     items: [{
    //         xtype: 'panel',
    //         layout: 'fit',
    //         bind: {
    //             title: '{user.MoMoUser.lastName}, '+
    //                 '{user.MoMoUser.firstName}'
    //         },
    //         items: [{
    //             xtype: 'mm_panel_manageaccountinfo',
    //             listeners: {
    //                 registrationComplete: 'getUserBySession'
    //             }
    //         }]
    //     }]
    // },{
    //     title: 'View Usage',
    //     iconCls: 'fa-bar-chart',
    //     header: false,
    //     itemId: 'view-usage-tab',
    //     bind: {
    //         disabled: '{!allowViewUsage}',
    //         html: '{loremIpsum}'
    //     }
    // }
]
});
