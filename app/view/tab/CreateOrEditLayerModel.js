Ext.define('MoMo.admin.view.tab.CreateOrEditLayerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-create-or-edit-layer',

    data: {
        cancelBtnText: 'Cancel',
        saveBtnText: 'Save',

        name: 'MoMo.admin',

        layer: null,

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
            var isVector = get('layer.dataType').toLowerCase() === "vector";
            return !get('isNewLayer') && isVector;
        }
    }

});
