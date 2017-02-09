Ext.define('MoMo.admin.view.panel.layer.GeneralController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layer-general',

    requires: [
        'MoMo.admin.store.Epsg',

        'MoMo.admin.view.form.SubmitForm',
        'MoMo.admin.view.grid.LayerAttributes'
    ],

    onAttributesButtonClicked: function(btn){
        var win = Ext.ComponentQuery.query("window[name=layerAttributes]")[0];

        if(win){
            if(win.isVisible()){
                BasiGX.util.Animate.shake(win);
            } else {
                win.show();
            }
        } else {
            Ext.create('Ext.window.Window', {
                name: 'layerAttributes',
                constrain: true,
                title: 'Attributes',
                bodyPadding: '10px',
                scrollable: 'y',
                animateTarget: btn,
                layout: 'fit',
                height: 300,
                width: 400,
                items: [{
                    xtype: 'momo-grid-layerattributes',
                    name: 'layerAttributeGrid',
                    layer: this.getViewModel().get('layer'),
                    listeners: {
                        itemdblclick: this.onAttributeDblClicked,
                        scope: this
                    }
                }]
            }).show();
        }
    },

    onAttributeDblClicked: function(grid, record){
        var string = '{' + record.get('name') + '}';
        var field = this.getView().down('textfield[name=layerHoverTemplate]');
        field.setValue(field.getValue() + string);
        grid.up('window').close();
    },

    uploadButtonPressed: function(){
        var me = this;
        var view = this.getView();

        var submitForm = view.down('momo-form-submitform');
        var fieldsClone = [];
        var layerNameField = view.down('textfield[name="layerName"]');
        var fields = view.query(
                'textfield[name="layerName"],'+
                'textarea[name="layerDescription"],'+
                'numberfield[name="layerOpacity"],'+
                'textfield[name="layerHoverTemplate"]'
            );

        if(!layerNameField.isValid()){
            Ext.toast('Please enter a layer name.');
            return;
        }
        view.setLoading(true);

        Ext.iterate(fields, function(field) {
            var clone = field.cloneConfig({
                value: field.getValue(),
                hidden: true,
                clone: true
            });
            fieldsClone.push(clone);
        });

        submitForm.add(fieldsClone);

        submitForm.submit({
            submitEmptyText: false,
            success: function(form, action) {
                var respObj;
                if (action.response && action.response.responseText) {
                    respObj = Ext.decode(action.response.responseText);
                }
                view.setLoading(false);
                me.onUploadSucess(respObj);

                // cleanup: delete the cloned items from the form
                Ext.iterate(fieldsClone, function(field) {
                    submitForm.remove(field);
                });
            },
            failure: function(form, action) {

                view.setLoading(false);

                // cleanup: delete the cloned items from the form
                Ext.iterate(fieldsClone, function(field) {
                    submitForm.remove(field);
                });

                if (action.response && action.response.responseText) {
                    var respObj = Ext.decode(
                            action.response.responseText);

                    // We have to Set an CRS for the importJob manually and then
                    // restart it again
                    if(respObj.error === "NO_CRS"){
                        me.showProjectionWindow(respObj);
                    }

                    Ext.toast(respObj.message,
                            'Error while uploading the layer.');
                }
            }
        });
    },

    showProjectionWindow: function(respObj){
        var me = this;
        //TODO Fix for multiupload
        var layerName = respObj.tasksWithoutProjection[0].layer.name;

        Ext.create('Ext.window.Window', {
            name: 'projectionWindow',
            constrain: true,
            modal: true,
            title: 'Choose projection',
            bodyPadding: '10px',
            scrollable: 'y',
            closeable: false,
            autoShow: true,
            layout: 'fit',
            width: 400,
            items: [{
                xtype: 'combobox',
                fieldLabel: layerName,
                labelAlign: 'top',
                width: '100%',
                emptyText: 'Choose a Projection System',
                name: 'fileProjection',
                displayField: 'name',
                valueField: 'code',
                store: {
                    type: 'epsg',
                    autoLoad: true
                },
                anyMatch: true,
                queryMode: 'local',
                triggerAction: 'all',
                style: {
                    marginBottom: 0
                }
            }],
            bbar: ['->', {
                text: 'Cancel Upload',
//                ui: 'mapmavin-cancel', TODO
                handler: function(btn){
                    me.cancelImport(btn, respObj);
                }
            },{
                text: 'OK',
//                ui: 'mapmavin', TODO
                handler: function(btn){
                    me.updateCrsForImport(btn, respObj);
                }
            }]
        });
    },

    updateCrsForImport: function(btn, respObj){
        var me = this;
        var win = btn.up('window');
        var combos = win.query('combo');
        var combo = combos[0];
        var layer = me.getViewModel().get('layer');

        win.setLoading(true);

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'import/update-crs-for-import.action',
            method: "POST",
            params: {
                importJobId: respObj.importJobId,
                taskId: respObj.tasksWithoutProjection[0].id,
                fileProjection: combo.getValue(),
                layerName: layer.get('name'),
                dataType: layer.get('dataType'),
                layerDescription: layer.get('description'),
                layerHoverTemplate: layer.getAppearance().get('hoverTemplate'),
                layerOpacity: layer.getAppearance().get('opacity')
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            success: function(response) {
                var responseObj;
                if (response && response.responseText) {
                    responseObj = Ext.decode(response.responseText);
                }
                me.onUploadSucess(responseObj);
            },
            callback: function(){
                win.setLoading(false);
                win.close();
            }
        });
    },

    cancelImport: function(btn, respObj){
        var win = btn.up('window');
        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'import/deleteImportJob.action',
            method: "POST",
            params: {
                importJobId: respObj.importJobId
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            callback: function() {
                win.close();
            }
        });
    },

    onUploadSucess: function(respObj){
        var view = this.getView();
        var viewModel = view.lookupViewModel();
        var coeLayerPanel = view.up('momo-create-or-edit-layer');
        var coeLayerController = coeLayerPanel.getController();
        var metadataPanel = coeLayerPanel.down('momo-layer-metadata');
        var metadataController = metadataPanel.getController();

        Ext.toast('Successfully uploaded the layer.');

        // reload the layer stores
        var layerComponents = Ext.ComponentQuery.query(
            'momo_tree_managedatalayers, momo_view_layergroupsdataview, '
                +'momo-layerlist');

        Ext.each(layerComponents, function(comp){
            comp.getStore().load();
        });

        //Create MetadataEntry
        metadataController.createMetadataEntry(respObj);

        //Load newly created Layerdata
        viewModel.set('entityId', respObj.data.id);
        coeLayerController.loadLayerData();
        // reset data and gui
        viewModel.set('upload', null);
    },

    onFileUploadFieldChanged: function(field){
        var me = this;
        var viewModel = me.getViewModel();
        var file = field.getEl().query('input[type=file]')[0].files[0];

        // reset data and gui
        viewModel.set('upload', null);

        if(!file){
            viewModel.set('upload.fileName', null);
            return;
        }

        viewModel.set('upload.fileName', file.name);
        viewModel.set('upload.fileSize', file.size);
        var reader = new FileReader();

        if(file.size < 100000000) { // check filesize 100000000 (100 MB)
            reader.onload = function(){
                var res = this.result;
                var jszip = new JSZip();
                jszip.loadAsync(res).then(
                        me.loadZipSuccess.bind(me),
                        me.loadZipFailure.bind(me)
                );
            };
            reader.readAsBinaryString(file);
        } else {
            me.updateUploadInfo();
            Ext.toast('Prevalidation of zip skipped.', 'Large Uploadfile');
        }
    },

    loadZipSuccess: function(zip) {
        var me = this;
        var viewModel = me.getViewModel();
        var containsShape = false;
        var containsRaster = false;
        var lowerFileName;

        // Determine datatype of the layer
        zip.forEach(function(relativePath, zipEntry) {
            if(zipEntry.name.indexOf(".shp") > -1){
                containsShape = true;
                return false;
            }
            if((zipEntry.name.toLowerCase().indexOf(".geotiff") > -1) ||
                    (zipEntry.name.indexOf(".tif") > -1)){

                zipEntry.async("arraybuffer").then(function (content) {
                    var tiff = GeoTIFF.parse(content);
                    var image = tiff.getImage();
                    var geoKeys = image.getGeoKeys();

                    viewModel.set('upload.raster.hasGeoKeys', !!geoKeys);
                    me.updateUploadInfo();
                });

                containsRaster = true;
                return false;
            }
        });

        if(containsShape){
            viewModel.set('upload.dataType', 'Vector');
            viewModel.set('layer.dataType', 'Vector');
        } else if (containsRaster){
            viewModel.set('upload.dataType', 'Raster');
            viewModel.set('layer.dataType', 'Raster');
        } else {
            viewModel.set('upload.dataType', null);
            viewModel.set('layer.dataType', null);
        }
        var dataType = viewModel.get('upload.dataType');

        // Check for prj, shx, dbf
        if(dataType === "Vector"){
            viewModel.set('upload.vector.hasShp', true);
            zip.forEach(function(relativePath, zipEntry) {
                lowerFileName = zipEntry.name.toLowerCase();
                if(lowerFileName.indexOf(".shx") > -1){
                    viewModel.set('upload.vector.hasShx', true);
                }
                if(lowerFileName.indexOf(".dbf") > -1){
                    viewModel.set('upload.vector.hasDbf', true);
                }
                if(lowerFileName.indexOf(".prj") > -1){
                    viewModel.set('upload.vector.hasPrj', true);
                }
            });
        } else if (dataType === "Raster"){
            zip.forEach(function(relativePath, zipEntry) {
                lowerFileName = zipEntry.name.toLowerCase();
                if(lowerFileName.indexOf(".prj") > -1){
                    viewModel.set('upload.raster.hasPrj', true);
                }
                if(lowerFileName.indexOf(".geotiff") > -1){
                    viewModel.set('upload.raster.hasGeoTiff', true);
                }
                if(lowerFileName.indexOf(".tif") > -1){
                    viewModel.set('upload.raster.hasTif', true);
                }
                if(lowerFileName.indexOf(".tfw") > -1){
                    viewModel.set('upload.raster.hasTfw', true);
                }
            });
        }

        me.updateUploadInfo();
    },

    updateUploadInfo: function(){
        var me = this;
        var upload = me.getViewModel().get('upload');
        var template = new Ext.XTemplate(
            '<tpl if="this.gotFile(values)">',
                '<p><b>Layertype</b>: ',
                    '<tpl if="fileSize &gt; 100000000">',
                        '<i style="color:orange;" ',
                            'class="fa fa-exclamation-triangle"></i> ',
                            'Skipped preprocessing because of large file.',
                    '<tpl else>',
                        '{dataType}',
                    '</tpl>',
                '</p>',
                '<p><b>Filesize</b>: {[this.prettyFileSize(values)]} MB</p>',
                '<tpl if="dataType == \'Vector\'">',
                    '<p><b>*.shp: </b>',
                    '<tpl if="vector.hasShp">',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<i style="color:red;" class="fa fa-times"></i> ',
                        'A shape file is missing.',
                    '</tpl></p>',
                    '<p><b>*.shx: </b>',
                    '<tpl if="vector.hasShx">',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<i style="color:red;" class="fa fa-times"></i> ',
                        'A database file is missing.',
                    '</tpl></p>',
                    '<p><b>*.dbf: </b>',
                    '<tpl if="vector.hasDbf">',
                        '<i style="color:green;" class="fa fa-check""></i>',
                    '<tpl else>',
                        '<i style="color:red;" class="fa fa-times"></i> ',
                        'A database file is missing.',
                    '</tpl></p>',
                    '<p><b>*.prj: </b>',
                    '<tpl if="vector.hasPrj">',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<i style="color:orange;" ',
                        'class="fa fa-exclamation-triangle"></i> ',
                        'A projection file is recommended. You can choose a ',
                        'projectionsystem from the combo alternatively.',
                    '</tpl></p>',
                '<tpl elseif="dataType == \'Raster\'">',
                    '<tpl if="raster.hasGeoTiff">',
                        '<p><b>*.geoTiff: </b>',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl elseif="raster.hasTif">',
                        '<p><b>*.tif: </b>',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<p>',
                            '<b>*.geoTiff / *.tif: </b>',
                            '<i style="color:red;" class="fa fa-times"></i> ',
                            'A geoTiff or tif file is missing.',
                        '</p>',
                    '</tpl>',
                    '<tpl if="raster.hasGeoKeys">',
                        '<p>',
                            '<b>Data is georeferenced: </b> ',
                            '<i style="color:green;" class="fa fa-check"></i>',
                        '<p>',
                    '<tpl elseif="raster.hasTfw">',
                        '<p>',
                            '<b>*.tfw: </b>',
                            '<i style="color:green;" class="fa fa-check"></i>',
                        '<p>',
                    '<tpl else>',
                        '<p><b>Error: </b>',
                            '<i style="color:red;" class="fa fa-times"></i> ',
                            'Your raster data is not georeferenced. Please ',
                            'georeference it or add a worldfile (*.tfw) to ',
                            'the zip.',
                        '</p>',
                    '</tpl>',
                '<tpl else>',
                    '<p>',
                        '<tpl if="fileSize &gt; 100000000">',
                            '<b>Info: </b>',
                            '<i style="color:orange;" ',
                                'class="fa fa-exclamation-triangle"></i> ',
                                'Skipped preprocessing because of large file.',
                        '<tpl else>',
                            '<b>Error: </b>',
                            '<i style="color:red;" class="fa fa-times"></i> ',
                                'Type of the layer could not be determined.',
                        '</tpl>',
                    '</p>',
                '</tpl>',
            '</tpl>',
            {
                gotFile: function(values){
                    if(values.fileSize > 100000000){
                        return true;
                    }
                    return !!values.fileName;
                },
                prettyFileSize: function(values){
                    var fileSizeInMB = values.fileSize/1048576;
                    return Ext.util.Format.number(fileSizeInMB, '0.00');
                }
            });
        var html = template.apply(upload);
        me.getView().down('fieldset[name=upload-file-infos]').setHtml(html);
    },

    loadZipFailure: function (e) {
        Ext.raise("Error: ", e);
    }

});
