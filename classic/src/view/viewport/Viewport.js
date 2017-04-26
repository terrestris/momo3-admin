Ext.define('MoMo.admin.view.viewport.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'momo-mainviewport',

    requires: [
        'Ext.list.Tree',

        'MoMo.admin.view.viewport.ViewportController',
        'MoMo.admin.view.viewport.ViewportModel',
        'MoMo.admin.view.container.MainContainer',
        'MoMo.admin.view.grid.ApplicationList',
        'MoMo.admin.view.grid.LayerList',
        'MoMo.admin.view.grid.UserList',
        'MoMo.admin.view.panel.ProfilePanel',
        'MoMo.admin.view.panel.GroupPanel',
        'MoMo.admin.view.button.translation.ToMongolian',
        'MoMo.admin.view.button.translation.ToGerman',
        'MoMo.admin.view.button.translation.ToEnglish'
    ],

    controller: 'momo-mainviewport',

    viewModel: {
        type: 'momo-mainviewport'
    },

    cls: 'sencha-dash-viewport',

    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        beforerender: 'getUserBySession',
        render: 'onMainViewRender'
    },

    items: [{
        xtype: 'toolbar',
        cls: 'viewport-header-headerbar toolbar-btn-shadow',
        height: 64,
        itemId: 'headerBar',
        items: [{
            xtype: 'image',
            reference: 'headerLogo',
            cls: 'viewport-header-logo',
            src: 'resources/images/iwrm_momo_logo.png',
            height: 43
        }, {
            xtype: 'tbspacer',
            flex: 1
        }, {
            xtype: 'momo-translation-de-button'
        }, {
            xtype: 'momo-translation-en-button'
        }, {
            xtype: 'momo-translation-mn-button'
        }, {
            xtype: 'button',
            cls: 'delete-focus-bg',
            iconCls: 'x-fa fa-power-off',
            bind: {
                tooltip: '{i18n.logoutTitle}'
            },
            handler: 'logOut'
        }, {
            xtype: 'tbtext',
            cls: 'header-toolbar-text',
            bind: {
                text: '{user.firstName}'
            }
        }, {
            xtype: 'image',
            cls: 'header-right-profile-image',
            style: {
                'border-radius': '20px'
            },
            height: 35,
            width: 35,
            alt: 'current user image',
            bind: {
                src: '{profileImage}'
            }
        }]
    }, {
        xtype: 'momo-maincontainerwrap',
        reference: 'mainContainerWrap',
        flex: 1,
        items: [{
            xtype: 'container',
            reference: 'navigationContainer',
            layout: 'vbox',
            defaults: {
                width: 250
            },
            items: [{
                xtype: 'treelist',
                ui: 'navigation',
                reference: 'navigationTreeList',
                store: 'NavigationTree',
                expanderFirst: false,
                expanderOnly: false,
                listeners: {
                    selectionchange: 'onNavigationTreeSelectionChange'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-angle-left',
                enableToggle: true,
                toggleHandler: 'onToggleNavigationSize'
            }]
        }, {
            xtype: 'container',
            flex: 1,
            reference: 'mainCardPanel',
            cls: 'main-card-panel',
            itemId: 'contentPanel',
            layout: {
                type: 'card'
            }
        }]
    }]
});
