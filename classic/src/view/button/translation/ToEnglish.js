/**
 * ToEnglish Button
 *
 * @class MoMo.client.view.button.translations.ToEnglish
 */
Ext.define('MoMo.admin.view.button.translation.ToEnglish', {
    extend: 'Ext.Button',
    xtype: 'momo-translation-en-button',
    requires: [
        'Ext.app.ViewModel',

        'MoMo.admin.view.button.TranslationController',
        'MoMo.admin.view.button.TranslationModel'
    ],

    controller: 'button.translation',

    viewModel: 'button.translation',

    iconCls: 'trans-en',

    scale: 'small',

    /**
     * Check if application default language set to german
     */
    isDefaultLanguage: null,

    /**
     *
     */
    bind: {
        tooltip: '{tooltipEn}'
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
        viewModel.set('translateTo', viewModel.get('languageCodeEn'));
    }

});
