Ext.define('MoMo.admin.view.panel.application.General', {
    extend: 'Ext.panel.Panel',

    xtype: 'momo-application-general',

    requires: [
        'MoMo.admin.view.panel.application.GeneralController',
        'Ext.form.field.ComboBox'
    ],

    controller: 'momo-application-general',

    routeId: 'general',

    bind: {
        title: '{i18n.general.title}'
    },

    padding: 20,

    scrollable: 'y',

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{i18n.general.fieldSetTitle}'
        },
        defaults: {
            width: '100%',
            msgTarget: 'side'
        },
        items: [{
            xtype: 'textfield',
            allowBlank: false,
            bind: {
                fieldLabel: '{i18n.general.nameFieldLabel}',
                emptyText: '{i18n.general.nameEmptyText}',
                value: '{application.name}'
            }
        }, {
            xtype: 'textarea',
            bind: {
                fieldLabel: '{i18n.general.descriptionFieldLabel}',
                emptyText: '{i18n.general.descriptionEmptyText}',
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
                fieldLabel: '{i18n.general.languageFieldLabel}',
                emptyText: '{i18n.general.languageEmptyText}',
                value: '{application.language}'
            }
        }, {
            xtype: 'checkbox',
            bind: {
                fieldLabel: '{i18n.general.publicFieldLabel}',
                value: '{application.open}'
            },
            listeners: {
                change: 'onPublicCheckboxChange'
            }
        }, {
            xtype: 'checkbox',
            checked: true,
            bind: {
                fieldLabel: '{i18n.general.activeFieldLabel}',
                value: '{application.active}'
            },
            listeners: {
                change: 'onActiveCheckboxChange'
            }
        }]
    }]

});
