Ext.define('MoMo.admin.view.panel.ProfilePanel',{
    extend: 'Ext.form.Panel',

    xtype: 'momo-profilepanel',

    bodyPadding: 5,

    requires: [
        'MoMo.admin.view.panel.ProfilePanelController',
        'MoMo.admin.view.panel.ProfilePanelModel',
        'MoMo.admin.view.grid.UserPermissionGrid',
        'BasiGX.view.panel.GraphicPool'
    ],

    controller: 'momo-profilepanel',

    viewModel: {
        type: 'momo-profilepanel'
    },

    bind: {
        title: '{i18n.profilepanelTitle}'
    },
    height: 400,
    scrollable: 'y',

    tbar: [{
        xtype: 'button',
        bind: {
            text: '{i18n.profilepanelDeleteUser}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
    }, {
        xtype: 'button',
        bind: {
            text: '{i18n.profilepanelChangePassword}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-lock fa-2x',
        handler: 'onChangePasswordClick'
    }],

    items: [{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'fieldset',
            minHeight: 350,
            bind: {
                title: '{i18n.profilepanelEditDetailsTitle}'
            },
            flex: 1,
            defaults: {
                width: '100%'
            },
            items: [{
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{i18n.profilepanelFirstNameLabel}',
                    value: '{user.firstName}'
                },
                name: 'firstName',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{i18n.profilepanelLastNameLabel}',
                    value: '{user.lastName}'
                },
                name: 'lastName',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{i18n.profilepanelEmailLabel}',
                    value: '{user.email}'
                },
                vtype: 'email',
                name: 'email',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{i18n.profilepanelDepartmentLabel}',
                    value: '{user.department}'
                },
                name: 'department',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{i18n.profilepanelTelephoneLabel}',
                    value: '{user.telephone}'
                },
                name: 'telephone',
                allowBlank: false
            }, {
                xtype: 'combo',
                store: Ext.data.Store({
                    fields: ['name','value'],
                    data: [{
                        name: 'Deutsch',
                        value: 'de'
                    }, {
                        name: 'English',
                        value: 'en'
                    }, {
                        name: 'Mongolian',
                        value: 'mn'
                    }]
                }),
                displayField: 'name',
                valueField: 'value',
                bind: {
                    fieldLabel: '{i18n.profilepanelLanguageLabel}',
                    value: '{user.language}'
                },
                name: 'language',
                allowBlank: false,
                editable: false,
                forceSelection: true
            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'displayfield',
                    bind: {
                        fieldLabel: '{i18n.profilepanelProfileImageLabel}'
                    },
                    name: 'profileImage'
                },
                {
                    xtype: 'image',
                    name: 'avatar',
                    height: 70,
                    width: 70,
                    bind: {
                        src: '{profileImage}'
                    }
                }, {
                    xtype: 'button',
                    margin: 20,
                    bind: {
                        text: '{i18n.profilepanelSelectImageText}'
                    },
                    handler: 'showGraphicPool'
                }]
            }]
        }, {
            xtype: 'fieldset',
            flex: 1,
            minHeight: 350,
            bind: {
                title: '{i18n.profilepanelEditPermissionsTitle}'
            },
            items: [{
                xtype: 'displayfield',
                bind: {
                    value: '{i18n.profilepanelPermissionGridDescription}'
                }
            }, {
                xtype: 'momo-userpermissiongrid'
            }]
        }]
    }],


    bbar: [{
        xtype: 'button',
        formBind: true,
        bind: {
            text: '{i18n.profilepanelSaveUser}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-save fa-2x',
        handler: 'onSaveClick'
    }]

});
