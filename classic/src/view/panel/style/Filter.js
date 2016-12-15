Ext.define('MoMo.admin.view.panel.style.Filter', {
    extend: 'Ext.panel.Panel',
    xtype: 'momo-panel-style-filter',

    requires: [
        'MoMo.admin.view.panel.style.FilterController',
        'MoMo.admin.view.panel.style.FilterModel',

        'MoMo.admin.store.LayerAttributes',
        'MoMo.admin.store.SldOperators'
    ],

    controller: 'panel.style.filter',
    viewModel: {
        type: 'panel.style.filter'
    },

    config: {
        filter: null
    },

    listeners: {
        boxready: 'onBoxReady'
    },

    bodyStyle: {
        background: '#f6f6f6'
    },

    items: [{
        xtype: 'fieldset',
        height: 140,
        bind:{
            title: '{title}'
        },
        name: 'comparison-fieldset',
        collapsed: true,
        checkboxToggle: true,
        checkboxName: 'useFilterCheckbox',
        layout: {
            type: 'hbox',
            align: 'stretchmax'
        },
        defaults: {
            margin: '0 5px 0 5px',
            labelAlign: 'top'
        },
        items: [{
            xtype: 'combobox',
            name: 'attributeCombo',
            displayField: 'name',
            valueField: 'name',
            editable: false,
            bind: {
                fieldLabel: '{attributeComboLabel}'
            },
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{name} ({type})</div>',
                '</tpl>'
            ),
            store: {
                type: 'layerattributes'
            },
            listeners: {
                boxready: 'attributeComboBoxReady'
            }
        }, {
            xtype: 'numberfield',
            name: 'literalNumberField1',
            value: 0,
            bind: {
                fieldLabel: '{literalNumberField1Label}'
            },
            hidden: true,
            flex: 5
        },{
            xtype: 'combobox',
            name: 'operatorCombo',
            width: '100px',
            displayField: 'operator',
            valueField: 'ogcType',
            editable: false,
            bind: {
                fieldLabel: '{operatorComboLabel}'
            },
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="x-boundlist-item" ',
                    '<tpl if="!this.propertyFitsOperator(dataTypes)">',
                        'style="color:red; background-color: lightgray;"',
                        'title="Not an appropriate operator for the selected ',
                        'property.";',
                    '</tpl>',
                    '>{operator}</div>',
                '</tpl>',
                {
                    propertyFitsOperator: function(dataTypes){
                        var attrCombo = this.field.up('momo-panel-style-filter')
                                .down('combobox[name="attributeCombo"]');
                        if(attrCombo){
                            var attr = attrCombo.getSelection().get('type');
                            return Ext.Array.contains(dataTypes, attr);
                        }
                        return true;
                    }
                }
            ),
            store: {
                type: 'sldoperators'
            },
            listeners: {
                change: 'operatorComboChanged'
            }
        },{
            xtype: 'numberfield',
            name: 'literalNumberField2',
            value: 0,
            bind: {
                fieldLabel: '{literalNumberField2Label}'
            },
            hidden: true,
            flex: 5
        },{
            xtype: 'textfield',
            name: 'literalTextField',
            value: "",
            bind: {
                fieldLabel: '{literalTextFieldLabel}'
            },
            hidden: true,
            flex: 5
        }]
    }]
});
