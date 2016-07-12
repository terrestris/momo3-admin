Ext.define('MoMo.admin.view.panel.application.General', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-general',

    requires: [
        'MoMo.admin.view.panel.application.GeneralController',
        'MoMo.admin.view.panel.application.GeneralModel'
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
                emptyText: '{nameEmptyText}'
            }
        }, {
            xtype: 'textarea',
            bind: {
                fieldLabel: '{descriptionFieldLabel}',
                emptyText: '{descriptionEmptyText}'
            }
        }, {
            xtype: 'combo',
            store: 'Language',
            allowBlank: false,
            displayField: 'name',
            valueField: 'name',
            forceSelection: true,
            editable: false,
            bind: {
                fieldLabel: '{languageFieldLabel}',
                emptyText: '{languageEmptyText}'
            }
        }, {
            xtype: 'checkbox',
            bind: {
                fieldLabel: '{publicFieldLabel}'
            },
            listeners: {
                change: 'onPublicCheckboxChange'
            }
        }, {
            xtype: 'checkbox',
            bind: {
                fieldLabel: '{activeFieldLabel}'
            },
            listeners: {
                change: 'onActiveCheckboxChange'
            }
        }]
    }]

});
