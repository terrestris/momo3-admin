Ext.define('MoMo.admin.view.panel.layer.General',{
    extend: 'Ext.panel.Panel',

    xtype: 'momo-layer-general',

    requires: [
        'Ext.form.FieldContainer',

        'MoMo.admin.view.panel.layer.GeneralController',

        'MoMo.admin.view.form.SubmitForm',
        'MoMo.admin.store.Epsg',
        'MoMo.admin.util.TextfieldValidator',
        'MoMo.admin.store.LayerDataType'
    ],

    controller: 'momo-layer-general',

    routeId: 'general',

    bind: {
        title: '{i18n.general.generalTitle}'
    },

    scrollable: 'y',

    padding: 20,

    items: [{
        xtype: 'fieldset',
        bind: {
            title: '{i18n.general.generalTitle}'
        },
        layout: 'column',
        scrollable: 'y',
        items: [{
            xtype: 'fieldcontainer',
            columnWidth: 0.5,
            items: [{
                xtype: 'displayfield',
                bind: {
                    value: '{i18n.general.uploadDescription}'
                }
            }, {
                xtype: 'textfield',
                bind: {
                    fieldLabel: '{i18n.general.layerName}',
                    value: '{layer.name}',
                    emptyText: '{i18n.general.layerNameEmptyText}',
                    hidden: '{isNewLayer}',
                    disabled: '{isNewLayer}'
                },
                msgTarget: 'under',
                validator: MoMo.admin.util.TextfieldValidator.
                    checkForWhiteSpaces,
                allowBlank: false,
                name: 'layerName',
                width: '100%'
            }, {
                xtype: 'momo-form-submitform',
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                        'import/create-layer.action',
                // set to hidden:true initially to avoid ugly blinking onRender
                hidden: true,
                // show for createLayer only
                bind: {
                    hidden: '{!isNewLayer}'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    width: '100%',
                    items: [{
                        xtype: 'fileuploadfield',
                        flex: 1,
                        bind: {
                            fieldLabel: '{i18n.general.fileUploadFieldLabel}',
                            emptyText: '{i18n.general.fileUploadEmptyText}',
                            buttonText: '{i18n.general.fileSelectBtnText}'
                        },
                        setButtonText: function(value) {
                            // needed since it isn't bindable
                            this.button.setText(value);
                        },
                        name: 'file',
                        allowBlank: false,
                        required: true,
                        listeners: {
                            change: 'onFileUploadFieldChanged'
                        }
                    }, {
                        xtype: 'button',
                        bind: {
                            text: '{i18n.general.fileUploadButtonText}',
                            disabled: '{!isUploadBtnEnabled}'
                        },
                        margin: '0 0 0 5px',
                        handler: 'uploadButtonPressed'
                    }]
                }, {
                    xtype: 'fieldset',
                    name: 'upload-file-infos',
                    bind: {
                        hidden: '{!upload.fileName}',
                        title: '{upload.fileName}'
                    },
                    items: [{
                        xtype: 'component',
                        name: 'file-information-html-msg'
                    }, {
                        xtype: 'combobox',
                        labelAlign: 'left',
                        labelWidth: 300,
                        width: '100%',
                        bind: {
                            fieldLabel: '{i18n.general.chooseLayerDataTypeEmptyText}',
                            emptyText: '{i18n.general.chooseLayerDataTypeEmptyText}',
                            hidden: '{(isRasterLayer || isVectorLayer) && upload.layerDataTypeNotSelectable}',
                            value: '{upload.dataType}'
                        },
                        listeners: {
                            select: 'onLayerDataTypeSelect'
                        },
                        name: 'layerdatatype',
                        submitValue: false,
                        displayField: 'display',
                        valueField: 'type',
                        store: {
                            type: 'layerdatatype',
                            autoLoad: true
                        },
                        anyMatch: true,
                        queryMode: 'local',
                        editable: false,
                        triggerAction: 'all',
                        style: {
                            marginBottom: 10
                        }
                    }, {
                         xtype: 'combobox',
                         labelAlign: 'left',
                         labelWidth: 300,
                         width: '100%',
                         bind: {
                             fieldLabel: '{i18n.general.chooseProjectionLayerNameEmptyText}',
                             emptyText: '{i18n.general.chooseProjectionLayerNameEmptyText}',
                             hidden: '{upload.raster.hasGeoKeys || upload.raster.hasPrj || upload.vector.hasPrj}',
                             value: '{upload.fileProjection}'
                         },
                         name: 'projection',
                         submitValue: false,
                         displayField: 'name',
                         valueField: 'code',
                         store: {
                             type: 'epsg',
                             autoLoad: true
                         },
                         anyMatch: true,
                         queryMode: 'local',
                         forceSelection: true,
                         triggerAction: 'all',
                         style: {
                             marginBottom: 0
                         }
                     }]
                }, {
                    xtype: 'hiddenfield',
                    name: 'dataType',
                    bind: {
                        value: '{upload.dataType}'
                    }
                }, {
                    xtype: 'hiddenfield',
                    name: 'fileProjection',
                    bind: {
                        value: '{upload.fileProjection}'
                    }
                }]
            }, {
                xtype: 'textarea',
                width: '100%',
                name: 'layerDescription',
                bind: {
                    fieldLabel: '{i18n.general.layerDescription}',
                    value: '{layer.description}',
                    hidden: true //'{isNewLayer}'
                }
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [{
                    xtype: 'slider',
                    width: 400,
                    minValue: 0,
                    maxValue: 1,
                    increment: 0.01,
                    decimalPrecision: 2,
                    submitValue: false,
                    bind:{
                        fieldLabel: '{i18n.general.layerOpacity}',
                        value: '{layer.appearance.opacity}',
                        hidden: '{isNewLayer}'
                    },
                    margin: '0 10px 0 0'
                }, {
                    xtype: 'numberfield',
                    hideTrigger: true,
                    width: 60,
                    minValue: 0,
                    maxValue: 1,
                    name: 'layerOpacity',
                    bind:{
                        value: '{layer.appearance.opacity}',
                        hidden: '{isNewLayer}'
                    }
                }]
            }, {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretchmax'
                },
                bind: {
                    hidden: '{!isHoverable}'
                },
                items: [{
                    xtype: 'textfield',
                    width: 400,
                    name: 'layerHoverTemplate',
                    margin: '0 5px 0 0',
                    flex: 1,
                    bind: {
                        fieldLabel: '{i18n.general.hoverTemplate}',
                        value: '{layer.appearance.hoverTemplate}'
                    }
                }, {
                    xtype: 'button',
                    bind: {
                        text: '{i18n.general.availableAttributes}'
                    },
                    handler: 'onAttributesButtonClicked'
                }]
            }]
        },{
            xtype: 'container',
            columnWidth: 0.5
        }]
    }]
});
