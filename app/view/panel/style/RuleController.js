Ext.define('MoMo.admin.view.panel.style.RuleController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.style.rule',

    removeRule: function(){
        var view = this.getView();
        var viewModel = this.getViewModel();
        var rulesPanel = view.up('momo-panel-style-rules');
        var rules = rulesPanel.rules;
        var rule = view.getRule();

        if(rules.length > 1){
            rulesPanel.remove(view);
            Ext.Array.remove(rules, Ext.Array.findBy(rules, function(r){
                return r.id === rule.id;
            }));
            view.fireEvent('rulechanged', rule);
        } else {
            Ext.toast(viewModel.get('singleRoleNeededErrorMsg'));
        }
    },

    onSymbolizersChanged: function(symbolizer){
        var view = this.getView();
        if(view.rule && symbolizer){
            view.rule.symbolizer = symbolizer;
            view.fireEvent('rulechanged', view.rule);
        }
    },

    onFilterChanged: function(filter){
        var view = this.getView();
        var filterCheckbox = view.down('checkbox[name="useFilterCheckbox"]');

        if(view.rule && filter){
            if(filterCheckbox.checked){
                view.rule.filter = filter;
            } else {
                delete view.rule.filter;
            }
            view.fireEvent('rulechanged', view.rule);
        }
    }

});
