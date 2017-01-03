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

            // currently we dont get any type info from the backend
            // TODO support more than just 'Tile'
            var olLayer = new ol.layer['Tile']({
                name: mapLayer.name || 'UNNAMED LAYER',
                routingId: mapLayer.id,
                hoverable: mapLayerAppearance.hoverable || false,
                chartable: mapLayer.chartable || false,
                minResolution: mapLayerAppearance.minResolution || undefined,
                maxResolution: mapLayerAppearance.maxResolution || undefined,
                opacity: mapLayerAppearance.opacity,
                source: me.createOlLayerSource(mapLayer)
            });

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
                    'TILED': true,
                    'TRANSPARENT': mapLayerSource.transparent || true
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
        }
    }
});
