Ext.define('MoMo.admin.view.panel.application.LayoutController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-layout',

    onLayoutSelect: function(combo, record) {
        var me = this,
            view = me.getView(),
            refs = view.getReferences(),
            dataView = refs.customizeLayout,
            lytManager = refs.layoutManager;

        dataView.show();

        lytManager.removeAll();

        // get the layout template
        var layoutTemplate = me.layouts[record.get('layoutName')];

        layoutTemplate.defaults.listeners = {
            render: 'initializeDropTarget'
        };

        layoutTemplate.defaults.header = {
            items: me.getHeaderConfigTemplate()
        };

        lytManager.add(layoutTemplate);
    },

    onSetLayoutTemplatePanelTitleKeyDown: function() {
    },

    getHeaderConfigTemplate: function() {
        return [{
            xtype: 'button',
            text: 'Options',
            menu: [{
                text: 'Show this title bar',
                checked: true,
                config: 'expanderOnly',
                listeners: {
                    change: function() {
                        //console.log('das')
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: 'Title text',
                emptyText: 'Title text',
                listeners: {
                    keydown: 'onSetLayoutTemplatePanelTitleKeyDown'
                }
            }, {
                text: 'Expanded on startup',
                checked: false,
                handler: 'onToggleConfig',
                config: 'singleExpand'
            }, {
                text: 'Collapsible',
                checked: false,
                handler: 'onToggleConfig',
                config: 'singleExpand'
            }, {
                text: 'Resizable',
                checked: false,
                handler: 'onToggleConfig',
                config: 'singleExpand'
            }]
        }];
    },

    onAvailableModulesSelectionChange: function(tree, record) {
        var me = this,
            viewModel = me.getViewModel(),
            descriptionText = 'No description available';

        if (record[0].get('description')) {
            descriptionText = record[0].get('description');
        }

        viewModel.set('availableModulesDescription', descriptionText);
    },

    /**
     *
     */
    initializeDropTarget: function(cmp) {
        var cmpDom;

        if (cmp.body && cmp.body.dom) {
            cmpDom = cmp.body.dom;
        } else {
            return false;
        }

        var dropTargetEl = cmpDom;

        Ext.create('Ext.dd.DropTarget', dropTargetEl, {
            ddGroup: 'availableModules',
            notifyOver: function(ddSource) {
                var draggedRecord = ddSource.dragData.records[0];

                cmp.addBodyCls('hover-box-shadow');

                if (Ext.Array.contains(cmp.allowedTypes,
                        draggedRecord.get('type'))) {
                    return Ext.baseCSSPrefix + 'dd-drop-ok';
                } else {
                    return Ext.baseCSSPrefix + 'dd-drop-nodrop';
                }

            },
            notifyOut: function() {
                cmp.removeBodyCls('hover-box-shadow');
            },
            notifyDrop: function(ddSource) {
                cmp.removeBodyCls('hover-box-shadow');
                var draggedRecord = ddSource.dragData.records[0];

                if (Ext.Array.contains(cmp.allowedTypes,
                        draggedRecord.get('type'))) {
                    cmp.update(draggedRecord.get('description'));
                    return true;
                } else {
                    return false;
                }

            }
        });
    },

    onToggleDescriptionPanel: function(btn, state) {
        var me = this,
            view = me.getView(),
            refs = view.getReferences(),
            panel = refs.availableModulesDescriptionPanel;

        if (state) {
            panel.expand(false);
        } else {
            panel.collapse(null, false);
        }
    },

    onOpenHelpToastClick: function() {
        var reusableToast = Ext.ComponentQuery.query('toast')[0];

        if (!reusableToast) {
            reusableToast = Ext.create('Ext.window.Toast', {
                title: 'Help',
                closeAction: 'hide',
                maxWidth: 250,
                align: 'bl',
                autoClose: false,
                closable: true
            });
        }

        reusableToast.update('This panels allows you to Customize ' +
                'your application\'s layout.');

    },

    layouts: {
        classicBorderLayout: {
            layout: 'border',
            defaults: {
                collapsible: true,
                split: true,
                bodyPadding: 10
            },
            items: [{
                title: 'Footer',
                region: 'south',
                height: 100,
                minHeight: 75,
                maxHeight: 150,
                allowedTypes: [
                    'panel'
                ],
                html: '<p>Footer content</p>'
            }, {
                title: 'Navigation',
                region: 'west',
                floatable: false,
                margin: '5 0 0 0',
                width: 125,
                minWidth: 100,
                maxWidth: 250,
                allowedTypes: [
                    'panel'
                ],
                html: '<p>Secondary content like navigation links ' +
                        'could go here</p>'
            }, {
                title: 'Main Content',
                collapsible: false,
                region: 'center',
                margin: '5 0 0 0',
                allowedTypes: [
                    'panel'
                ],
                html: '<h2>Main Page</h2><p>This is where the main ' +
                        'content would go</p>'
            }]
        },
        advancedBorderLayout: {
            layout: 'border',
            height: 400,
            defaults: {
                collapsible: true,
                split: true,
                bodyPadding: 10
            },
            items: [{
                title: 'Header',
                region: 'north',
                height: 100,
                minHeight: 75,
                maxHeight: 150,
                html: '<p>Footer content</p>'
            }, {
                title: 'Footer',
                region: 'south',
                height: 100,
                minHeight: 75,
                maxHeight: 150,
                html: '<p>Footer content</p>'
            }, {
                title: 'Navigation',
                region:'west',
                floatable: false,
                margin: '5 0 0 0',
                width: 125,
                minWidth: 100,
                maxWidth: 250,
                html: '<p>Secondary content like navigation links ' +
                        'could go here</p>'
            }, {
                title: 'Content',
                region: 'east',
                floatable: false,
                margin: '5 0 0 0',
                width: 125,
                minWidth: 100,
                maxWidth: 250,
                html: '<p>Secondary content like navigation links ' +
                        'could go here</p>'
            }, {
                title: 'Main Content',
                collapsible: false,
                region: 'center',
                margin: '5 0 0 0',
                html: '<h2>Main Page</h2><p>This is where the main ' +
                        'content would go</p>'
            }]
        },
        simpleBorderLayout: {
            layout: 'border',
            height: 400,
            defaults: {
                collapsible: true,
                split: true,
                bodyPadding: 10
            },
            items: [{
                collapsible: false,
                region: 'center',
                margin: '5 0 0 0',
                html: '<h2>Main Page</h2><p>This is where the main ' +
                        'content would go</p>'
            }]
        }
    }

});
