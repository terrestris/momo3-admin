Ext.define('MoMo.admin.view.panel.application.Layout', {
    extend: 'Ext.form.Panel',

    xtype: 'momo-application-layout',

    requires: [
        'MoMo.admin.view.panel.application.LayoutController',
//        'MoMo.admin.view.panel.application.LayoutModel',
        'Ext.form.field.ComboBox',
        'Ext.tree.Panel'
    ],

    controller: 'momo-application-layout',

//    viewModel: {
//        type: 'momo-application-layout'
//    },

    bind: {
        title: '{layout.title}'
    },

    padding: 20,

    items: [{
        xtype: 'fieldset',
        autoScroll: true,
        bind: {
            title: '{layout.title}'
        },
        defaults: {
            width: '100%'
        },
        items: [{
            xtype: 'container',
            layout: 'hbox',
            items: [{
                xtype: 'combo',
                bind: {
                    fieldLabel: '{layout.layoutFieldLabel}',
                    emptyText: '{layout.layoutEmptyText}'
                },
                allowBlank: false,
                msgTarget: 'side',
                flex: 2,
                store: 'Layout',
                editable: false,
                displayField: 'name',
                valueField: 'layoutName',
                forceSelection: true,
                listeners: {
                    select: 'onLayoutSelect'
                }
            }]
        }, {
            xtype: 'fieldset',
            reference: 'customizeLayout',
            title: 'Customize Layout',
            layout: 'hbox',
            border: false,
            hidden: true,
            items: [{
                xtype: 'panel',
                reference: 'layoutManager',
                layout: 'fit',
                padding: '0 10 0 0',
                height: 450,
                title: 'Your layout',
                flex: 4,
                header: {
                    items: [{
                        xtype: 'button',
                        iconCls: 'x-fa fa-question',
                        tooltip: 'Show instructions for this mambo jambo',
                        handler: 'onOpenHelpToastClick'
                    }]
                }
            }, {
                xtype: 'panel',
                title: 'Available components',
                iconCls: 'fa fa-gears',
                layout: 'hbox',
                header: {
                    items: [{
                        xtype: 'button',
                        enableToggle: true,
                        iconCls: 'x-fa fa-question',
                        tooltip: 'Show module description',
                        checked: true,
                        toggleHandler: 'onToggleDescriptionPanel'
                    }]
                },
                flex: 2,
                height: 450,
                autoScroll: true,
                items: [{
                    xtype: 'treepanel',
                    reference: 'availableModules',
                    flex: 1,
                    border: false,
                    rootVisible: false,
                    store: 'AvailableModules',
                    viewConfig: {
                        plugins: {
                            ddGroup: 'availableModules',
                            ptype: 'treeviewdragdrop',
                            enableDrag: true,
                            enableDrop: false
                        }
                    },
                    listeners: {
                        selectionchange: 'onAvailableModulesSelectionChange'
                    }
                }, {
                    bodyPadding: 10,
                    reference: 'availableModulesDescriptionPanel',
                    header: false,
                    collapsible: true,
                    collapsed: true,
                    collapseDirection: 'right',
                    flex: 1,
                    bind: {
                        html: '{layout.availableModulesDescription}'
                    }
                }]
            }]
        }]
    }]

});
