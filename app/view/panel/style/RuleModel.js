Ext.define('MoMo.admin.view.panel.style.RuleModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.panel.style.rule',

    data: {
        titlePrefix: '',
        rule: null,
        removeRuleButtonText: '',
        removeRuleButtonIconCls: 'fa fa-minus'
    },

    formulas: {
        fieldsetTitle: function(get){
            var name = get('rule.name');
            var title = get('rule.title');
            var dsp = "";
            if (name) {
                dsp += name;
            }
            if (title) {
                dsp += " (" + title + ")";
            }
            return dsp;
        }
    }

});
