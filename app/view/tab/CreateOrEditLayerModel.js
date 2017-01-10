Ext.define('MoMo.admin.view.tab.CreateOrEditLayerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-create-or-edit-layer',

    data: {

        name: 'MoMo.admin',

        layer: null,

        i18n: {
            cancelBtnText: 'Cancel',
            saveBtnText: 'Save',
            metadata: {
                title: 'Titel',
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
            fileName: null,
            fileSize: null,
            dataType: null,
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
        }
    }

});
