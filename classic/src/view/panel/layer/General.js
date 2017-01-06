Ext.define('MoMo.admin.view.panel.layer.General',{
    extend: 'Ext.panel.Panel',

    xtype: 'momo-layer-general',

    requires: [
        'Ext.form.FieldContainer',

        'MoMo.admin.view.panel.layer.GeneralController',

        'MoMo.admin.view.form.SubmitForm',
        'MoMo.admin.store.Epsg'
    ],

    controller: 'momo-layer-general',

    routeId: 'general',

    title: 'General', // TODO use title formula from viewmodel

    scrollable: 'y',

    padding: 20,

    items: [{
        xtype: 'fieldset',
        title: 'General',
        layout: 'column',
        scrollable: 'y',
        items: [{
            xtype: 'fieldcontainer',
            columnWidth: 0.5,
            items: [{
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: 'Name',
                emptyText: 'Enter a layer name',
                name: 'layerName',
                width: '100%',
                bind: {
                    value: '{layer.name}'
                }
            }, {
                xtype: 'momo-form-submitform',
                url: BasiGX.util.Url.getWebProjectBaseUrl() +
                        'import/create-layer.action',
                // set to hidden:true initially to avoid ugly blinking onRender
//                hidden: true,
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
                        fieldLabel: 'File',
                        emptyText: '*.zip',
                        name: 'file',
                        allowBlank: false,
                        required: true,
                        listeners: {
                            change: 'onFileUploafFieldChanged'
                        }
                    }, {
                        xtype: 'button',
                        text: 'Upload',
                        formBind: true,
                        margin: '0 0 0 5px',
                        handler: 'uploadButtonPressed'
                    }]
                }, {
                    xtype: 'fieldset',
                    name: 'upload-file-infos',
                    bind: {
                        hidden: '{!upload.fileName}',
                        title: '{upload.fileName}'
                    }
                }, {
                    xtype: 'hiddenfield',
                    name: 'dataType',
                    bind: {
                        value: '{upload.dataType}'
                    }
                }, {
                    xtype: 'hiddenfield',
                    name: 'fileProjection',
                    value: ''
                }]
            }, {
                xtype: 'textarea',
                width: '100%',
                fieldLabel: 'Layer Description',
                name: 'layerDescription',
                bind: {
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
                        value: '{layer.appearance.opacity}',
                        hidden: '{isNewLayer}'
                    },
                    margin: '0 10px 0 0',
                    fieldLabel: 'Opacity'
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
                    fieldLabel: 'Hover Template',
                    name: 'layerHoverTemplate',
                    margin: '0 5px 0 0',
                    flex: 1,
                    bind: {
                        value: '{layer.appearance.hoverTemplate}'
                    }
                }, {
                    xtype: 'button',
                    text: 'Available Attributes',
                    handler: 'onAttributesButtonClicked'
                }]
            }]
        },{
            xtype: 'container',
            columnWidth: 0.5
        }]
    }]
});
