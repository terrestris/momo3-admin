Ext.define('MoMo.admin.view.panel.application.General', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-general',

    requires: [
        'MoMo.admin.view.panel.application.GeneralController',
//        'MoMo.admin.view.panel.application.GeneralModel',
        'Ext.form.field.ComboBox'
    ],

    controller: 'momo-application-general',

//    viewModel: {
//        type: 'momo-application-general'
//    },

    routeId: 'general',

    bind: {
        title: '{general.title}'
    },

    padding: 20,

    scrollable: 'y',

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{general.title}'
        },
        defaults: {
            width: '100%',
            msgTarget: 'side'
        },
        items: [{
            xtype: 'textfield',
            allowBlank: false,
            bind: {
                fieldLabel: '{general.nameFieldLabel}',
                emptyText: '{general.nameEmptyText}',
                value: '{application.name}'
            }
        }, {
            xtype: 'textarea',
            bind: {
                fieldLabel: '{general.descriptionFieldLabel}',
                emptyText: '{general.descriptionEmptyText}',
                value: '{application.description}'
            }
        }, {
            xtype: 'combo',
            store: 'Language',
            allowBlank: false,
            displayField: 'name',
            valueField: 'locale',
            forceSelection: true,
            editable: false,
            bind: {
                fieldLabel: '{general.languageFieldLabel}',
                emptyText: '{general.languageEmptyText}',
                value: '{application.language}'
            }
        }, {
            xtype: 'checkbox',
            bind: {
                fieldLabel: '{general.publicFieldLabel}',
                value: '{application.open}'
            },
            listeners: {
                change: 'onPublicCheckboxChange'
            }
        }, {
            xtype: 'checkbox',
            checked: true,
            bind: {
                fieldLabel: '{general.activeFieldLabel}',
                value: '{application.active}'
            },
            listeners: {
                change: 'onActiveCheckboxChange'
            }
        }]
    }]

});
