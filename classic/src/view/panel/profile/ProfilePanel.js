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
        title: '{title}'
    },
    height: 400,
    scrollable: 'y',

    tbar: [{
        xtype: 'button',
        bind: {
            text: '{deleteUser}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-minus fa-2x',
        handler: 'onDeleteClick'
    }],

    items: [{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            xtype: 'fieldset',
            minHeight: 350,
            bind: {
                title: '{editDetailsTitle}'
            },
            flex: 1,
            defaults: {
                width: '100%'
            },
            items: [{
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{firstNameLabel}',
                    value: '{user.firstName}'
                },
                name: 'firstName',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{lastNameLabel}',
                    value: '{user.lastName}'
                },
                name: 'lastName',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{emailLabel}',
                    value: '{user.email}'
                },
                name: 'email',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{departmentLabel}',
                    value: '{user.department}'
                },
                name: 'department',
                allowBlank: false
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{telephoneLabel}',
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
                    fieldLabel: '{languageLabel}',
                    value: '{user.language}'
                },
                name: 'language',
                allowBlank: false
            }, {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'displayfield',
                    bind: {
                        fieldLabel: '{profileImageLabel}'
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
                        text: '{selectImageText}'
                    },
                    handler: 'showGraphicPool'
                }]
            }]
        }, {
            xtype: 'fieldset',
            flex: 1,
            minHeight: 350,
            bind: {
                title: '{editPermissionsTitle}'
            },
            items: [{
                xtype: 'displayfield',
                bind: {
                    value: '{permissionGridDescription}'
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
            text: '{saveUser}'
        },
        scale: 'large',
        ui: 'momo',
        iconCls: 'fa fa-save fa-2x',
        handler: 'onSaveClick'
    }]

});
