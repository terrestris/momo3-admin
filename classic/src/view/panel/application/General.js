Ext.define('MoMo.admin.view.panel.application.General', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-general',

    requires: [
        'MoMo.admin.view.panel.application.GeneralController',
        'MoMo.admin.view.panel.application.GeneralModel',
        'Ext.form.field.ComboBox'
    ],

    controller: 'momo-application-general',

    viewModel: {
        type: 'momo-application-general'
    },

    routeId: 'general',

    bind: {
        title: '{title}'
    },

    padding: 20,

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{title}'
        },
        defaults: {
            width: '100%',
            msgTarget: 'side'
        },
        items: [{
            xtype: 'textfield',
            allowBlank: false,
            bind: {
                fieldLabel: '{nameFieldLabel}',
                emptyText: '{nameEmptyText}',
                value: '{appData.name}'
            }
        }, {
            xtype: 'textarea',
            bind: {
                fieldLabel: '{descriptionFieldLabel}',
                emptyText: '{descriptionEmptyText}',
                value: '{appData.description}'
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
                fieldLabel: '{languageFieldLabel}',
                emptyText: '{languageEmptyText}',
                value: '{appData.language}'
            }
        }, {
            xtype: 'checkbox',
            bind: {
                fieldLabel: '{publicFieldLabel}',
                value: '{appData.isPublic}'
            },
            listeners: {
                change: 'onPublicCheckboxChange'
            }
        }, {
            xtype: 'checkbox',
            checked: true,
            bind: {
                fieldLabel: '{activeFieldLabel}',
                value: '{appData.isActive}'
            },
            listeners: {
                change: 'onActiveCheckboxChange'
            }
        }]
    }]

});
