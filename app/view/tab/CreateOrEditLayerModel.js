Ext.define('MoMo.admin.view.tab.CreateOrEditLayerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-create-or-edit-layer',

    data: {

        name: 'MoMo.admin',

        entityId: null,

        layer: null,

        i18n: {
            cancelBtnText: 'Cancel',
            saveBtnText: 'Save',
            general: {
                generalTitle: 'General',
                layerName: 'Name',
                layerNameEmptyText: 'Enter a layer name',
                fileUploadFieldLabel: 'File',
                fileUploadEmptyText: '*.zip',
                fileUploadButtonText: 'Upload',
                fileSelectBtnText: 'Browse...',
                layerDescription: 'Layer Description',
                layerOpacity: 'Layer Opacity',
                hoverTemplate: 'Hover Template',
                availableAttributes: 'Available Attributes',
                legend: {
                    title: 'Legend settings',
                    useFixLegendUrlCbBoxLabel: 'Fix legend image (instead of GetLegendGraphic)?',
                    chooseOrUploadImage: 'Upload/choose image'
                }
            },
            metadata: {
                title: 'Titel',
                tabPanelTitle: 'Metadata',
                abstract: 'Abstract',
                organisation: 'Organisation',
                address: 'Anschrift',
                deliveryPoint: 'Straße und Hausnr.',
                city: 'Stadt',
                postalCode: 'Postleitzahl',
                country: 'Land',
                website: 'Website',
                person: 'Verantwortlicher',
                name: 'Name',
                email: 'E-Mail',
                referenceDate: 'Erstellungsdatum',
                topic: 'Thema',
                geography: 'Geographisch',
                extent: 'Extent',
                projection: 'Projektion',
                geoExtent: 'Extent',
                minX: 'Min X',
                minY: 'Min Y',
                maxX: 'Max X',
                maxY: 'Max Y',
                timeExtent: 'Zeitraum',
                start: 'Von',
                end: 'Bis',
                format: 'Format',
                limitations: 'Beschränkungen',
                onlineResource: 'Online Resource',
                dataSource: 'Quelle',
                publications: 'Publikationen'
            },
            style: {
                title: 'Style',
                fieldsetTitle: 'Generate Style for Layer'
            },
            permissions: {
                layerpermissionstitle: 'Permissions',
                layerpermissionsdescriptiontext: 'Here you can manage what ' +
                    'users and groups may' +
                    ' see, edit and delete this layer.<br>' +
                    'If you are creating a new layer, you will need to ' +
                    'save it first before you can set the permissions'
            }
        },

        metadata: {
            title: null,
            abstract: null,
            organisation: {
                name: null,
                address: {
                    deliveryPoint: null,
                    city: null,
                    postalCode: null,
                    country: null
                },
                website: null
            },
            person: {
                name: null,
                email: null
            },
            referenceDate: null,
            topic: null,
            geography: {
                extent: {
                    minX: null,
                    minY: null,
                    maxX: null,
                    maxY: null
                },
                projection: null
            },
            timeExtent: {
                start: null,
                end: null
            },
            format: null,
            limitations: null,
            onlineResource: null,
            dataSource: null,
            publications: null
        },

        groups: null,

        style: null,

        upload: {
            layerDataTypeNotSelectable: null,
            fileName: null,
            fileSize: null,
            dataType: null,
            fileProjection: null,
            vector: {
                hasShp: false,
                hasShx: false,
                hasDbf: false,
                hasPrj: false
            },
            raster: {
                isGeoTiff: false,
                isTif: false,
                hasGeoKeys: false,
                hasTfw: false,
                hasPrj: false
            }
        }
    },

    formulas: {
        isNewLayer: function(get){
            return !get('layer.id');
        },
        title: function(get){
            return get('layer.name') || 'New Layer';
        },
        isHoverable: function(get){
            var isVector = get('layer.dataType').toLowerCase() !== "raster";
            return !get('isNewLayer') && isVector;
        },
        isRasterLayer: function(get) {
            return get('layer.dataType').toLowerCase() === "raster";
        },
        isVectorLayer: function(get) {
            return get('layer.dataType').toLowerCase() === "vector";
        },
        isUploadBtnEnabled: function(get) {
            if (get('upload.fileProjection') && get('layer.dataType')) {
                var dataType = get('layer.dataType').toLowerCase();
                if(dataType === "vector" || dataType === "raster") {
                    return true;
                }
            }
            if (get('layer.dataType').toLowerCase() === "raster") {
                return get('upload.raster.hasPrj') || get('upload.raster.hasGeoKeys');
            } else if (get('layer.dataType').toLowerCase() === "vector") {
                return get('upload.vector.hasPrj');
            } else {
                return false;
            }
        },
        hasFixLegendUrl: {
            get: function(get) {
                return !Ext.isEmpty(get('layer.fixLegendUrl'));
            }
        }
    }
});
