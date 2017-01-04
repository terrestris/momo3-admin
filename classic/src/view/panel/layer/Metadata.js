Ext.define('MoMo.admin.view.panel.layer.Metadata',{
    extend: 'Ext.panel.Panel',

    xtype: 'momo-layer-metadata',

    requires: [
        'Ext.form.FieldContainer',
        'MoMo.admin.store.Epsg',
        'MoMo.admin.store.MetadataTopics',

        'MoMo.admin.view.panel.layer.MetadataController'
    ],

    controller: 'momo-layer-metadata',

    routeId: 'metadata',

    title: 'Metadata', // TODO use title formula from viewmodel

    scrollable: 'y',

    padding: 20,

    items: [{
        xtype: 'fieldset',
        title: 'Metadata',
        layout: 'hbox',
        scrollable: 'y',
        items: [{
            xtype: 'fieldcontainer',
            flex: 1,
            margin: '0 5px 0 5px',
            defaults: {
                width: '100%',
                labelWidth: 150
            },
            items: [{
                xtype: 'textfield',
                name: 'metadata-title',
                margin: '20px 0 10px 0',
                bind: {
                    fieldLabel: '{i18n.metadata.title}',
                    value: '{metadata.title}'
                }
            }, {
                xtype: 'textfield',
                name: 'metadata-abstract',
                bind: {
                    fieldLabel: '{i18n.metadata.abstract}',
                    value: '{metadata.abstract}'
                }
            }, {
                xtype: 'combobox',
                name: 'metadata-topic',
                displayField: 'value',
                valueField: 'value',
                anyMatch: true,
                queryMode: 'local',
                bind: {
                    fieldLabel: '{i18n.metadata.topic}',
                    value: '{metadata.topic}'
                },
                store: {
                    type: 'metadatatopics'
                }
            }, {
                xtype: 'datefield',
                name: 'metadata-referenceDate',
                bind: {
                    fieldLabel: '{i18n.metadata.referenceDate}',
                    value: '{metadata.referenceDate}'
                }
            }, {
                xtype: 'textfield',
                name: 'metadata-format',
                bind: {
                    fieldLabel: '{i18n.metadata.format}',
                    value: '{metadata.format}'
                }
            }, {
                xtype: 'textfield',
                name: 'metadata-limitations',
                bind: {
                    fieldLabel: '{i18n.metadata.limitations}',
                    value: '{metadata.limitations}'
                }
            }, {
                xtype: 'textfield',
                name: 'metadata-onlineResource',
                bind: {
                    fieldLabel: '{i18n.metadata.onlineResource}',
                    value: '{metadata.onlineResource}'
                }
            }, {
                xtype: 'textfield',
                name: 'metadata-dataSource',
                bind: {
                    fieldLabel: '{i18n.metadata.dataSource}',
                    value: '{metadata.dataSource}'
                }
            }, {
                xtype: 'textfield',
                name: 'metadata-publications',
                bind: {
                    fieldLabel: '{i18n.metadata.publications}',
                    value: '{metadata.publications}'
                }
            }]
        }, {
            xtype: 'fieldcontainer',
            flex: 1,
            defaults: {
                width: '100%',
                labelWidth: 150
            },
            items: [{
                xtype: 'fieldset',
                name: 'metadata-organisation',
                width: '100%',
                bind: {
                    title: '{i18n.metadata.organisation}'
                },
                defaults: {
                    width: '100%'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'metadata-organisation-address',
                    bind: {
                        fieldLabel: '{i18n.metadata.address}',
                        value: '{metadata.address}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'metadata-organisation-website',
                    bind: {
                        fieldLabel: '{i18n.metadata.website}',
                        value: '{metadata.website}'
                    }
                }]
            }, {
                xtype: 'fieldset',
                name: 'metadata-person',
                width: '100%',
                bind: {
                    title: '{i18n.metadata.person}'
                },
                defaults: {
                    width: '100%'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'metadata-person-name',
                    bind: {
                        fieldLabel: '{i18n.metadata.name}',
                        value: '{metadata.name}'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'metadata-person-email',
                    bind: {
                        fieldLabel: '{i18n.metadata.email}',
                        value: '{metadata.email}'
                    }
                }]
            }, {
                xtype: 'fieldset',
                name: 'metadata-timeExtent',
                width: '100%',
                bind: {
                    title: '{i18n.metadata.timeExtent}'
                },
                defaults: {
                    width: '100%'
                },
                items: [{
                    xtype: 'datefield',
                    name: 'metadata-timeExtent-start',
                    bind: {
                        fieldLabel: '{i18n.metadata.start}',
                        value: '{metadata.timeExtent.start}'
                    }
                }, {
                    xtype: 'datefield',
                    name: 'metadata-timeExtent-end',
                    bind: {
                        fieldLabel: '{i18n.metadata.end}',
                        value: '{metadata.timeExtent.end}'
                    }
                }]
            }, {
                xtype: 'fieldset',
                name: 'metadata-geography',
                width: '100%',
                bind: {
                    title: '{i18n.metadata.geography}'
                },
                defaults: {
                    width: '100%'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'numberfield',
                        hideTrigger: true,
                        labelWidth: 40,
                        margin: '0 5px 0 0',
                        flex: 1
                    },
                    items: [{
                        name: 'metadata-extent-minX',
                        bind: {
                            fieldLabel: '{i18n.metadata.minX}',
                            value: '{metadata.geography.extent.minX}'
                        }
                    }, {
                        name: 'metadata-extent-minY',
                        bind: {
                            fieldLabel: '{i18n.metadata.minY}',
                            value: '{metadata.geography.extent.minY}'
                        }
                    }, {
                        name: 'metadata-extent-maxX',
                        bind: {
                            fieldLabel: '{i18n.metadata.maxX}',
                            value: '{metadata.geography.extent.maxX}'
                        }
                    }, {
                        name: 'metadata-extent-maxY',
                        bind: {
                            fieldLabel: '{i18n.metadata.maxY}',
                            value: '{metadata.geography.extent.maxY}'
                        }
                    }]
                }, {
                    xtype: 'combobox',
                    name: 'metadata-geography-projection',
                    bind: {
                        fieldLabel: '{i18n.metadata.geography.projection}',
                        value: '{metadata.geography.projection}'
                    },
                    displayField: 'name',
                    valueField: 'code',
                    store: {
                        type: 'epsg',
                        autoLoad: true
                    },
                    anyMatch: true,
                    queryMode: 'local',
                    triggerAction: 'all'
                }]
            }]
        }]
    }]
});
