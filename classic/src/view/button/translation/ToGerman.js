/**
 * ToGerman Button
 *
 * @class MoMo.client.view.button.translation.ToGerman
 */
Ext.define('MoMo.admin.view.button.translation.ToGerman', {
    extend: 'Ext.Button',
    xtype: 'momo-translation-de-button',
    requires: [
        'Ext.app.ViewModel',

        'MoMo.admin.view.button.TranslationController',
        'MoMo.admin.view.button.TranslationModel'
    ],

    controller: 'button.translation',

    viewModel: 'button.translation',

    iconCls: 'trans-de',

    scale: 'small',

    /**
     * Check if application default language set to german
     */
    isDefaultLanguage: null,

    /**
     *
     */
    bind: {
        tooltip: '{tooltipDe}'
    },

    /**
     *
     */
    listeners: {
        click: 'onClick',
        afterrender: 'onAfterRender'
    },

    /**
     *
     */
    constructor: function(cfg) {
        var me = this;
        me.callParent([cfg]);

        var viewModel = me.getViewModel();
        viewModel.set('translateTo', viewModel.get('languageCodeDe'));
    }

});
