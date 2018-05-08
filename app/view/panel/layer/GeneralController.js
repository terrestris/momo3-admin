Ext.define('MoMo.admin.view.panel.layer.GeneralController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-layer-general',

    requires: [
        'MoMo.admin.store.Epsg',
        'MoMo.shared.MetadataUtil',
        'MoMo.admin.view.form.SubmitForm',
        'MoMo.admin.view.grid.LayerAttributes',
        'BasiGX.util.Url',
        'BasiGX.view.panel.GraphicPool'
    ],

    /**
     *
     */
    onAttributesButtonClicked: function(btn){
        var me = this;
        var win = Ext.ComponentQuery.query("window[name=layerAttributes]")[0];
        var viewModel = me.getView().lookupViewModel();

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
                bind: {
                    title: viewModel.get('i18n.general.availableAttributes')
                },
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

    /**
     *
     */
    onAttributeDblClicked: function(grid, record){
        var string = '{' + record.get('name') + '}';
        var field = this.getView().down('textfield[name=layerHoverTemplate]');
        field.setValue(field.getValue() + string);
        grid.up('window').close();
    },

    /**
     *
     */
    uploadButtonPressed: function(){
        var me = this;
        var view = this.getView();

        var submitForm = view.down('momo-form-submitform');
        var fieldsClone = [];
        var layerNameField = view.down('textfield[name="layerName"]');
        var viewModel = me.getView().lookupViewModel();
        var fields = view.query('textfield[name="layerName"]');

        if(!layerNameField.isValid()){
            Ext.toast(viewModel.get('i18n.general.layerNameInvalidMsg'));
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
                    var respObj = Ext.decode(action.response.responseText),
                        errorMsg = viewModel.
                          get('i18n.general.uploadLayerErrorMsg');

                    // We have to Set an CRS for the importJob manually and then
                    // restart it again
                    if(respObj.error === "NO_CRS"){
                        me.showProjectionWindow(respObj);
                    }

                    Ext.toast(respObj.message, errorMsg);
                }
            }
        });
    },

    /**
     *
     */
    showProjectionWindow: function(respObj){
        var me = this;
        var layerName = '';
        if (respObj.tasksWithoutProjection[0].layer) {
            layerName = respObj.tasksWithoutProjection[0].layer.name;
        }
        var viewModel = me.getView().lookupViewModel();

        Ext.create('Ext.window.Window', {
            name: 'projectionWindow',
            constrain: true,
            modal: true,
            bind: {
                title: viewModel.get('i18n.general.chooseProjectionWindowTitle')
            },
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
                bind: {
                    emptyText: viewModel.
                      get('i18n.general.chooseProjectionLayerNameEmptyText')
                },
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
                bind: {
                    text: viewModel.
                      get('i18n.general.chooseProjectionCancelBtnText')
                },
                handler: function(btn){
                    me.cancelImport(btn, respObj);
                }
            },{
                bind: {
                    text: viewModel.
                      get('i18n.general.chooseProjectionOkBtnText')
                },
                handler: function(btn){
                    me.updateCrsForImport(btn, respObj);
                }
            }]
        });
    },

    /**
     *
     */
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
                layerConfig: respObj.layerConfig,
                imageId: respObj.legendImageId
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

    /**
     *
     */
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

    /**
     *
     */
    onUploadSucess: function(respObj){
        var view = this.getView();
        var viewModel = view.lookupViewModel();
        var coeLayerPanel = view.up('momo-create-or-edit-layer');
        var coeLayerController = coeLayerPanel.getController();
        var metadataPanel = coeLayerPanel.down('momo-layer-metadata');
        var metadataController = metadataPanel.getController();
        var uploadSuccessfulText = viewModel.
          get('i18n.general.uploadSuccessfulText');

        Ext.toast(uploadSuccessfulText);

        // reload the layer stores
        var layerComponents = Ext.ComponentQuery.query('momo-layerlist');

        Ext.each(layerComponents, function(comp){
            comp.getStore().load();
        });

        var metadataHandled = false;
        if (respObj.data.layerConfig && !Ext.isEmpty(respObj.data.layerConfig)) {
            var layerConfig = Ext.decode(respObj.data.layerConfig);
            if (!Ext.isEmpty(layerConfig.config)) {
                layerConfig.config = Ext.decode(layerConfig.config);
            }
            //Create MetadataEntry
            if (layerConfig.metadata) {
                var metadataObj = MoMo.shared.MetadataUtil.parseMetadataXml(
                    layerConfig.metadata);
                var coel = Ext.ComponentQuery.query(
                    'momo-create-or-edit-layer')[0];
                if (coel) {
                    var coelViewModel = coel.getViewModel();
                    coelViewModel.set('metadata', metadataObj);
                    metadataController.createMetadataEntry(respObj, metadataObj);
                    metadataHandled = true;
                }
            }
        }

        //Create MetadataEntry
        if (!metadataHandled) {
            metadataController.createMetadataEntry(respObj);
        }

        //Load newly created Layerdata
        viewModel.set('entityId', respObj.data.layer.id);
        coeLayerController.loadLayerData();
        // reset data and guit
        viewModel.set('upload', null);
    },

    /**
     *
     */
    onFileUploadFieldChanged: function(field){
        var me = this;
        var view = me.getView();
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

        view.setLoading(true);

        if(file.size < 100000000) { // check filesize 100000000 (100 MB)
            reader.onload = function(){
                var res = this.result;
                var jszip = new JSZip();
                jszip.loadAsync(res).then(
                        me.loadZipSuccess.bind(me),
                        me.loadZipFailure.bind(me)
                );
            };
            if (reader.readAsBinaryString) {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        } else {
            view.setLoading(false);
            viewModel.set('upload.layerDataTypeNotSelectable', false);
            viewModel.set('upload.dataType', null);
            viewModel.set('layer.dataType', null);
            me.updateUploadInfo();
        }
    },

    /**
     *
     */
    loadZipSuccess: function(zip) {
        var me = this;
        var viewModel = me.getViewModel();
        var view = me.getView();
        var containsShape = false;
        var containsRaster = false;
        var lowerFileName;

        // Determine datatype of the layer
        zip.forEach(function(relativePath, zipEntry) {
            if(zipEntry.name.indexOf(".shp") > -1){
                containsShape = true;
                view.setLoading(false);
                return false;
            }
            if((zipEntry.name.toLowerCase().indexOf(".geotiff") > -1) ||
                    (zipEntry.name.indexOf(".tif") > -1)){

                zipEntry.async("arraybuffer").then(function (content) {
                    try {
                        var tiff = GeoTIFF.parse(content);
                        var image = tiff.getImage();
                        var geoKeys = image.getGeoKeys();
                        viewModel.set('upload.raster.hasGeoKeys', !!geoKeys);
                        me.updateUploadInfo();
                        view.setLoading(false);
                    } catch (error) {
                        viewModel.set('upload.raster.hasGeoKeys', false);
                        view.setLoading(false);
                    }
                });

                containsRaster = true;
                return false;
            }
        });

        if(containsShape){
            viewModel.set('upload.layerDataTypeNotSelectable', true);
            viewModel.set('upload.dataType', 'Vector');
            viewModel.set('layer.dataType', 'Vector');
        } else if (containsRaster){
            viewModel.set('upload.layerDataTypeNotSelectable', true);
            viewModel.set('upload.dataType', 'Raster');
            viewModel.set('layer.dataType', 'Raster');
        } else {
            viewModel.set('upload.layerDataTypeNotSelectable', false);
            viewModel.set('upload.dataType', 'unknown');
            viewModel.set('layer.dataType', 'unknown');
            view.setLoading(false);
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

    /**
     *
     */
    onLayerDataTypeSelect: function(combo, record) {
        var me = this;
        var vm = me.getViewModel();
        var selectedDataType = record.get('type');

        // the combo's value is bound to 'upload.dataType', but
        // we'll still have to set the value on the layer
        vm.set('layer.dataType', selectedDataType);
    },

    /**
     *
     */
    updateUploadInfo: function(){
        var me = this;
        var upload = me.getViewModel().get('upload');
        var uploadSkippedLargeFileMsg = me.getViewModel().
          get('i18n.general.uploadSkippedLargeFileMsg');
        var uploadSkippedShapeFileMissingMsg = me.getViewModel().
          get('i18n.general.uploadSkippedShapeFileMissingMsg');
        var uploadSkippedDbfFileMissingMsg = me.getViewModel().
          get('i18n.general.uploadSkippedDbfFileMissingMsg');
        var uploadSkippedShxFileMissingMsg = me.getViewModel().
          get('i18n.general.uploadSkippedShxFileMissingMsg');
        var uploadSkippedPrjMissingMsg = me.getViewModel().
          get('i18n.general.uploadSkippedPrjMissingMsg');
        var uploadSkippedGeoTiffMissingMsg = me.getViewModel().
          get('i18n.general.uploadSkippedGeoTiffMissingMsg');
        var uploadInfoGeoreferencedGeoTiffMsg = me.getViewModel().
          get('i18n.general.uploadInfoGeoreferencedGeoTiffMsg');
        var uploadGeoTiffNotGeoreferencedMsg = me.getViewModel().
          get('i18n.general.uploadGeoTiffNotGeoreferencedMsg');
        var uploadFailedNoTypeDeterminedMsg = me.getViewModel().
          get('i18n.general.uploadFailedNoTypeDeterminedMsg');

        var template = new Ext.XTemplate(
            '<tpl if="this.gotFile(values)">',
                '<p><b>Filesize</b>: {[this.prettyFileSize(values)]} MB</p>',
                '<p><b>Layertype</b>: ',
                    '<tpl if="fileSize &gt; 100000000">',
                        'unknown',
                    '<tpl else>',
                        '{dataType}',
                    '</tpl>',
                '</p>',
                '<tpl if="dataType == \'Vector\'">',
                    '<p><b>*.shp: </b>',
                    '<tpl if="vector.hasShp">',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<i style="color:red;" class="fa fa-times"></i> ',
                        uploadSkippedShapeFileMissingMsg,
                    '</tpl></p>',
                    '<p><b>*.shx: </b>',
                    '<tpl if="vector.hasShx">',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<i style="color:red;" class="fa fa-times"></i> ',
                        uploadSkippedShxFileMissingMsg,
                    '</tpl></p>',
                    '<p><b>*.dbf: </b>',
                    '<tpl if="vector.hasDbf">',
                        '<i style="color:green;" class="fa fa-check""></i>',
                    '<tpl else>',
                        '<i style="color:red;" class="fa fa-times"></i> ',
                        uploadSkippedDbfFileMissingMsg,
                    '</tpl></p>',
                    '<p><b>*.prj: </b>',
                    '<tpl if="vector.hasPrj">',
                        '<i style="color:green;" class="fa fa-check"></i>',
                    '<tpl else>',
                        '<i style="color:orange;" ',
                        'class="fa fa-exclamation-triangle"></i> ',
                        uploadSkippedPrjMissingMsg,
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
                            uploadSkippedGeoTiffMissingMsg,
                        '</p>',
                    '</tpl>',
                    '<tpl if="raster.hasGeoKeys">',
                        '<p>',
                            '<b>',uploadInfoGeoreferencedGeoTiffMsg,'</b> ',
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
                            uploadGeoTiffNotGeoreferencedMsg,
                        '</p>',
                    '</tpl>',
                '<tpl else>',
                    '<p>',
                        '<tpl if="fileSize &gt; 100000000">',
                            '<b>Info: </b>',
                            '<i style="color:orange;" ',
                                'class="fa fa-exclamation-triangle"></i> ',
                                uploadSkippedLargeFileMsg,
                        '<tpl else>',
                            '<b>Error: </b>',
                            '<i style="color:red;" class="fa fa-times"></i> ',
                                uploadFailedNoTypeDeterminedMsg,
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
                    var fileSizeInMB = values.fileSize / (1024 * 1024);
                    return Math.round(fileSizeInMB * 1000) / 1000;
                }
            });
        var html = template.apply(upload);
        me.getView().down('component[name="file-information-html-msg"]').setHtml(html);
    },

    loadZipFailure: function (e) {
        Ext.raise("Error: ", e);
        var me = this;
        var view = me.getView();
        if(view) {
            view.setLoading(false);
        }
    },

    /**
     * Enables or disables image upload button depending on check state of the
     * checkbox.
     *
     * @param {Ext.form.field.Checkbox} cb the Checkbox
     * @param {Boolean} newValue the new value of the cb
     */
    onHasFixLegendCbChange: function(cb, newValue) {
        var me = this;
        var view = me.getView();
        var buttonSel = 'button[name=graphic-pool-btn]';
        var imgSel = 'image[name=legend-img-preview]';
        var imgBtn = cb.up('fieldset').down(buttonSel);
        var legendImgCmp = cb.up('fieldset').down(imgSel);

        if (!newValue) {
            me.updateLegendSrc('', null);
            view.lookupViewModel().set('layer.fixLegendUrl', null);
        }

        if (imgBtn) {
            imgBtn.setDisabled(!newValue);
        }
        if (legendImgCmp) {
            legendImgCmp.setHidden(!newValue);
        }
    },

    /**
     * Opens window containing graphic pool for already uploaded images as well
     * as dialog to upload a new one.
     */
    onChooseImageClick: function() {
        var me = this;
        var viewModel = me.getView().lookupViewModel();

        var graphicPool =
                Ext.ComponentQuery.query('window[name=legend-image-pool]')[0];

        if(!graphicPool) {
            var graphicPoolPanel = Ext.create('BasiGX.view.panel.GraphicPool', {
                backendUrls: {
                    pictureList: {
                        url: 'rest/images/',
                        method: 'GET'
                    },
                    pictureSrc: {
                        url: 'momoimage/getThumbnail.action?id='
                    },
                    pictureUpload: {
                        url: 'momoimage/upload.action',
                        method: 'POST'
                    },
                    graphicDelete: {
                        url: 'rest/images/',
                        method: 'DELETE'
                    }
                },
                okClickCallbackFn: me.onSelectLegendImg.bind(me),
                deleteClickCallbackFn: me.onDeleteLegendImg.bind(me),
                useCsrfToken: true
            });
            var winTitle = viewModel.get('i18n.general.legend.chooseOrUploadImage');
            graphicPool = Ext.create('Ext.window.Window', {
                layout: 'fit',
                modal: true,
                title: winTitle,
                name: 'legend-image-pool',
                constrainHeader: true,
                scrollable: true,
                items: [
                    graphicPoolPanel
                ]
            });
        }
        graphicPool.show();
    },

    /**
     * Callback function for OK button click
     * @param {Ext.data.Model} img the image record
     */
    onSelectLegendImg: function(img) {
        var me = this;
        var viewModel = me.getView().lookupViewModel();
        var imgUrl = BasiGX.util.Url.getWebProjectBaseUrl() +
            'momoimage/get.action?id=' + img.get('id');
        me.updateLegendSrc(imgUrl, img);
        viewModel.get('layer').set('fixLegendUrl', imgUrl);
    },

    /**
     * Updates legend graphic source via GeoServer REST
     */
    updateLegendSrc: function (imgUrl, img) {

        var me = this;
        var view = me.getView();
        var viewModel = view.lookupViewModel();
        var layerId = viewModel.get('layer').get('id');
        var width = 0;
        var height = 0;
        var format = '';

        if (img) {
            width = img.get('width');
            height = img.get('height');
            format = img.get('fileType');
        }

        Ext.Ajax.request({
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'sld/updateLegendSrc.action',
            method: 'POST',
            params: {
                layerId: layerId,
                imgUrl: imgUrl,
                width: width,
                height: height,
                format: format
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            success: function() {
                if (!Ext.isEmpty(viewModel.get('layer.fixLegendUrl'))) {
                    Ext.toast("Successfully updated legend graphic source");
                }
            },
            failure: function(response) {
                Ext.toast(
                    Ext.decode(response.responseText).message,
                    "Couldn't update legend graphic source"
                );
            }
        });
    },

    /**
     * Callback function for Delete button click
     * @param {Ext.data.Model} img the image record
     */
    onDeleteLegendImg: function(img) {
        var me = this;
        var view = me.getView();
        var viewModel = view.lookupViewModel();
        var imgUrl = '/momo/image/get.action?id=' + img.get('id');
        var currentUrl = viewModel.get('layer.fixLegendUrl');
        if (currentUrl === imgUrl) {
            me.updateLegendSrc('', null);
            viewModel.get('layer').set('fixLegendUrl', null);
        }
    },

    /**
     * Adjust the size of the image component when a new image has been loaded.
     *
     * @param {Object} evt the (load) event
     * @param {Object} imageEl the DOM element of the image
     */
    onLegendImageLoad: function(evt, imageEl) {
        var me = this;
        var view = me.getView();
        var legendImageCmp = view.down('image[name=legend-img-preview]');

        var imageWidth = imageEl.naturalWidth;
        var imageHeight = imageEl.naturalHeight;

        legendImageCmp.setWidth(imageWidth);
        legendImageCmp.setHeight(imageHeight);
    }
});
