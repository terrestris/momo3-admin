Ext.define('MoMo.admin.view.grid.ApplicationList',{
    extend: 'Ext.grid.Panel',

    xtype: 'momo-applicationlist',

    requires: [
        'MoMo.admin.view.grid.ApplicationListController',
        'MoMo.admin.view.grid.ApplicationListModel'
    ],

    controller: 'momo-applicationlist',

    viewModel: {
        type: 'momo-applicationlist'
    },

    store: 'Application',

    columns: [{
        text: 'Name',
        dataIndex: 'name',
        flex: 1
    }],

    bind: {
        title: '{title}'
    },

    layout: 'auto',

    selModel: {
        selType: 'rowmodel',
        mode: 'MULTI'
    },

    tbar: [{
        xtype: 'textfield',
        fieldLabel: 'Filter by name',
        labelWidth: undefined,
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                handler: function(){
                    // Will trigger the change listener
                    this.reset();
                }
            }
        },
        listeners: {
            change: 'onFilterChange',
            buffer: 250
        }
    }],

    bbar: [{
        xtype: 'button',
        text: 'Create',
        listeners: {
            click: 'onCreateClick'
        }
    }, {
        xtype: 'button',
        text: 'Edit',
        listeners: {
            click: 'onEditClick'
        }
    }, {
        xtype: 'button',
        text: 'Copy',
        listeners: {
            click: 'onCopyClick'
        }
    }, {
        xtype: 'button',
        text: 'Delete',
        listeners: {
            click: 'onDeleteClick'
        }
    }]

});
