Ext.define('MoMo.admin.view.panel.style.Rule', {
    extend: 'Ext.panel.Panel',
    xtype: 'momo-panel-style-rule',

    requires: [
        'MoMo.admin.util.Sld',
        'MoMo.admin.view.panel.style.RuleController',
        'MoMo.admin.view.panel.style.RuleModel',

        'MoMo.admin.view.panel.style.Filter',
        'MoMo.admin.view.panel.style.Symbolizer'
    ],

    controller: 'panel.style.rule',
    viewModel: {
        type: 'panel.style.rule'
    },

    config: {
        rule: null
    },

    bodyStyle: {
        background: '#f6f6f6'
    },

    filter: null,

    symbolizer: null,

    layout: 'fit',

    initComponent: function() {
        var me = this;
        me.callParent();
        if(this.rule){
            this.filter = this.rule.filter;
            this.symbolizer = this.rule.symbolizer;
            this.getViewModel().set({
                rule: this.rule
            });
        }
        me.initBaseFieldset();
        me.initFilterSymbolizerComponents();
    },

    initBaseFieldset: function(){
        this.add({
            xtype: 'fieldset',
            title: this.getViewModel().get('titlePrefix'),
            bind: {
                title: '{titlePrefix} {fieldsetTitle}'
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaultType: 'textfield',
                items: [{
                    fieldLabel: 'Name',
                    bind: {
                        value: '{rule.name}'
                    },
                    margin: '0 10px 0 0',
                    flex: 1,
                    listeners: {
                        change: function(){
                            var view = this.up('momo-panel-style-rule');
                            view.fireEvent('rulechanged', view.rule);
                        }
                    }
                }, {
                    fieldLabel: 'Title',
                    bind: {
                        value: '{rule.title}'
                    },
                    margin: '0 10px 0 0',
                    flex: 1,
                    listeners: {
                        change: function(){
                            var view = this.up('momo-panel-style-rule');
                            view.fireEvent('rulechanged', view.rule);
                        }
                    }
                }, {
                    xtype: 'button',
                    bind: {
                        text: '{removeRuleButtonText}',
                        iconCls: '{removeRuleButtonIconCls}'
                    },
                    handler: 'removeRule'
                }]
            }]
        });
    },

    initFilterSymbolizerComponents: function() {
        this.down('fieldset').add({
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            margin: '10px 0 0 0',
            items: [{
                xtype: 'momo-panel-style-symbolizer',
                symbolizer: this.symbolizer,
                flex: 1,
                listeners: {
                    symbolizerschanged: 'onSymbolizersChanged'
                }
            },{
                xtype: 'momo-panel-style-filter',
                filter: this.filter,
                flex: 1,
                margin: '0 10px 0 0',
                listeners: {
                    filterchanged: 'onFilterChanged'
                }
            }]
        });
    }

});
