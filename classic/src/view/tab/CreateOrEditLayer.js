Ext.define('MoMo.admin.view.tab.CreateOrEditLayer', {
    extend: 'Ext.tab.Panel',

    xtype: 'momo-create-or-edit-layer',

    requires: [
        'MoMo.admin.view.tab.CreateOrEditLayerController',
        'MoMo.admin.view.tab.CreateOrEditLayerModel',
        'MoMo.admin.view.panel.layer.General',
        'MoMo.admin.view.panel.layer.Style'
    ],

    controller: 'momo-create-or-edit-layer',

    viewModel: {
        type: 'momo-create-or-edit-layer'
    },

    /**
     * It is important to set this to false to assure that the DOM of all
     * tabs will be build immediately to assure that the databinding is
     * working even if a user did not activate one of the tabs before saving.
     */
    deferredRender: false,

    bbar: [{
        xtype: 'tbfill'
    }, {
        xtype: 'button',
        bind: {
            text: '{cancelBtnText}'
        },
        handler: 'onCancelClick'
    }, {
        xtype: 'button',
        bind: {
            text: '{saveBtnText}',
            disabled: '{isNewLayer}'
        },
        handler: 'onSaveClick'
    }],

    items: [{
        xtype: 'momo-layer-general'
    }, {
        xtype: 'momo-layer-style'
    }],

    listeners: {
        boxready: 'onAfterRender'
    }

});
