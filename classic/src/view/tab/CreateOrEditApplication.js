Ext.define('MoMo.admin.view.tab.CreateOrEditApplication', {
    extend: 'Ext.tab.Panel',

    xtype: 'momo-create-or-edit-application',

    requires: [
        'MoMo.admin.view.tab.CreateOrEditApplicationController',
        'MoMo.admin.view.tab.CreateOrEditApplicationModel',
        'MoMo.admin.view.panel.application.General',
        'MoMo.admin.view.panel.application.Layout',
        'MoMo.admin.view.panel.application.Layer',
        'MoMo.admin.view.panel.application.StartView'
    ],

    controller: 'momo-create-or-edit-application',

    viewModel: {
        type: 'momo-create-or-edit-application'
    },

    routeId: 'createOrEdit',

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
            text: '{saveBtnText}'
        },
        handler: 'onSaveClick'
    }],

    items: [{
        xtype: 'momo-application-general'
    }, {
        xtype: 'momo-application-layout',
        disabled: true
    }, {
        xtype: 'momo-application-start-view'
    }, {
        xtype: 'momo-application-layer'
    }],

    listeners: {
        boxready: 'onAfterRender'
    }

});
