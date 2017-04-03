Ext.define('MoMo.admin.view.panel.style.RulesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.style.rules',

    requires: [
        'MoMo.admin.view.panel.style.Rule'
    ],

    addRule: function(){
        var view = this.getView();
        var rule = Ext.clone(view.rules[0]);
        // generate a random name, as rules should not have the same name
        var rnd = Math.random().toString().substring(2,12);
        rule.name = rule.name + '-' + rnd;
        view.rules.push(rule);
        view.insert(1, {
            xtype: 'momo-panel-style-rule',
            margin: 10,
            rule: rule
        });
    },

    onRuleChanged: function(){
        this.updateRules();
    },

    updateRules: function(){
        var view = this.getView();
        var rulePanels = view.query('momo-panel-style-rule');
        view.rules = Ext.Array.pluck(rulePanels, 'rule');
    }

});
