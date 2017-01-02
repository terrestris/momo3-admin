Ext.define('MoMo.admin.view.panel.style.Rules', {
    extend: 'Ext.panel.Panel',
    xtype: 'momo-panel-style-rules',

    requires: [
        'MoMo.admin.util.Sld',
        'MoMo.admin.view.panel.style.Rule',
        'MoMo.admin.view.panel.style.RulesController',
        'MoMo.admin.view.panel.style.RulesModel'
    ],

    controller: 'panel.style.rules',
    viewModel: {
        type: 'panel.style.rules'
    },

    bodyStyle: {
        background: '#f6f6f6'
    },

    config: {
        sld: null
    },

    sldObj: null,

    numberOfRules: null,

    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'middle'
        },
        items: [{
            xtype: 'button',
            bind: {
                text: '{addRuleButtonText}',
                iconCls: '{addRuleButtonIconCls}'
            },
            handler: 'addRule'
        }]
    }],

    initComponent: function() {
        var me = this;
        me.callParent();
        this.sldObj = MoMo.admin.util.Sld.toSldObject(this.getSld());
        if (this.sldObj) {
            this.rules = MoMo.admin.util.Sld.rulesFromSldObject(this.sldObj);
            me.initRuleComponents();
        } else {
            me.setDisabled(true);
        }
    },

    initRuleComponents: function() {
        var me = this;
        var rules = me.rules;
        Ext.each(rules, function(rule) {
            rule.id = Ext.id();
            me.add({
                xtype: 'momo-panel-style-rule',
                margin: 10,
                rule: rule,
                listeners: {
                    rulechanged: 'onRuleChanged'
                }
            });
        });
    }
});
