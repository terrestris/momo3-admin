/**
 * LayerParser Util
 *
 * This util is a temporary util class until the BasiGX.util.ConfigParser2 is
 * implemented.
 *
 * It is basically a copy of the MoMo.client.view.component.MapController.
 *
 * As we just need it for the layerpreview in the admin for know i removed some
 * functions.
 *
 */
Ext.define('MoMo.admin.util.LayerParser', {

    statics: {

        /**
         *
         */
        createOlLayer: function(mapLayer) {
            var me = this;
            var mapLayerAppearance = mapLayer.appearance;

            // check for required options
            if (!mapLayer.type) {
                Ext.Logger.warn('Could not create the ol.layer. Missing ' +
                    'property type');
                return false;
            }

            var olLayer;
            if(mapLayer.type !== "Group"){
                olLayer = new ol.layer[mapLayer.type]({
                    name: mapLayer.name || 'UNNAMED LAYER',
                    opacity: mapLayerAppearance.opacity,
                    visible: mapLayerAppearance.visible,
                    minResolution: mapLayerAppearance.minResolution,
                    maxResolution: mapLayerAppearance.maxResolution,
                    source: me.createOlLayerSource(mapLayer)
                });
            } else { // Grouplayer
                var groupLayers = [];

                Ext.each(mapLayer.layers, function(childLayer){
                    // check for required options
                    if (!childLayer.type) {
                        Ext.Logger.warn('Could not create the ol.layer. ' +
                            'Missing property type');
                        return false;
                    }

                    //TODO We don't catch if a layer allready exists
                    groupLayers.push(new ol.layer[childLayer.type]({
                        name: childLayer.name || 'UNNAMED LAYER',
                        opacity: childLayer.opacity,
                        visible: childLayer.visible,
                        minResolution: childLayer.minResolution,
                        maxResolution: childLayer.maxResolution,
                        source: me.createOlLayerSource(childLayer)
                    }));
                });

                olLayer = new ol.layer.Group({
                    name: mapLayer.name || 'UNNAMED LAYER',
                    layers: groupLayers
                });

            }

            return olLayer;
        },

        /**
         * based on ol.source.TileWMS
         */
        createOlLayerSource: function(mapLayer) {
            var me = this;
            var mapLayerAppearance = mapLayer.appearance;
            var mapLayerSource = mapLayer.source;
            var olLayerSource;

            olLayerSource = new ol.source[mapLayerSource.type]({
                attributions: me.createOlLayerAttribution(
                        mapLayerAppearance.attribution),
                params: {
                    'LAYERS': mapLayerSource.layerNames,
                    'VERSION': mapLayerSource.version,
                    'TILED': true
                },
                crossOrigin: mapLayerSource.crossOrigin || null,
                gutter: mapLayerSource.gutter || 0,
                logo: {
                    href: mapLayerSource.logoHref || "",
                    src: mapLayerSource.logoSrc || ""
                },
                tileGrid: me.createOlLayerTileGrid(
                        mapLayerSource.tileGrid),
                url: mapLayerSource.url
            });

            return olLayerSource;
        },

        /**
         *
         */
        createOlLayerTileGrid: function(tileGridConfig) {
            var olLayerTileGrid;
            var tileGridOrigin;
            var tileGridExtent;

            // check for required options
            if (!tileGridConfig.type || !tileGridConfig.tileGridResolutions) {
                Ext.Logger.warn('Could not create the ol.tilegrid for the ' +
                        'current layer. Missing properties type and/or ' +
                        'tileGridResolutions');
                return false;
            }

            if (tileGridConfig.tileGridOrigin) {
                tileGridOrigin = [
                    tileGridConfig.tileGridOrigin.x,
                    tileGridConfig.tileGridOrigin.y
                ];
            }

            if (tileGridConfig.tileGridExtent) {
                tileGridExtent = [
                    tileGridConfig.tileGridExtent.lowerLeft.x,
                    tileGridConfig.tileGridExtent.lowerLeft.y,
                    tileGridConfig.tileGridExtent.upperRight.x,
                    tileGridConfig.tileGridExtent.upperRight.y
                ];
            }

            olLayerTileGrid = new ol.tilegrid[tileGridConfig.type]({
                extent: tileGridExtent,
                origin: tileGridOrigin,
                resolutions: tileGridConfig.tileGridResolutions,
                tileSize: tileGridConfig.tileSize || 256
            });

            return olLayerTileGrid;
        },

        /**
         *
         */
        createOlLayerAttribution: function(attributionConfig) {
            var olLayerAttributions = [];

            var olLayerAttribution = new ol.Attribution({
                html: attributionConfig
            });

            olLayerAttributions.push(olLayerAttribution);

            return olLayerAttributions;
        },

        /**
         *
         */
        getProjectionString: function() {
            var appCtxUtil = MoMo.client.util.ApplicationContext;
            var mapConfig = appCtxUtil.getMapConfig();
            var mapConfigProjection = mapConfig.projection;

            if (!mapConfigProjection) {
                Ext.Logger.error('No map projection found in mapConfig!');
            }

            if (mapConfigProjection.indexOf('EPSG') > -1) {
                return mapConfigProjection;
            } else {
                return Ext.String.format('EPSG:{0}', mapConfigProjection);
            }
        }
    }
});
