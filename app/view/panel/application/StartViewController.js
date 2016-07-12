Ext.define('MoMo.admin.view.panel.application.StartViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-start-view',

    renderMap: function() {
        var me = this;

        me.setOlMap();
        //me.addMapCrossHair();
        me.registerOnMapMoveEnd();

    },

    setOlMap: function() {
        var me = this,
            view = me.getView(),
            olMap;

        olMap = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.Stamen({
                        layer: 'watercolor'
                    })
                }),
                new ol.layer.Tile({
                    source: new ol.source.Stamen({
                        layer: 'terrain-labels'
                    })
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([7.1067575, 50.7374741]),
                zoom: 12
            })
        });

        view.down('gx_map').setMap(olMap);
    },

    addMapCrossHair: function() {
        var me = this,
            view = me.getView(),
            mapContainer = view.down('gx_map'),
            mapCrossHairElemSpec;

        mapCrossHairElemSpec = {
            id: 'map-cross-hair',
            tag: 'div',
            style: {
                position: 'absolute',
                zIndex: 10,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
            },
            children: [{
                tag: 'span',
                class: 'fa fa-street-view fa-3x',
                style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%'
                }
            }]
        };

        Ext.DomHelper.append(mapContainer.getEl(), mapCrossHairElemSpec);

    },

    registerOnMapMoveEnd: function() {
        var me = this,
            view = me.getView(),
            map = view.down('gx_map').getMap();

        map.on('moveend', me.onMapMoveEnd, me);
    },

    onMapMoveEnd: function(evt) {
        var me = this,
            viewModel = me.getViewModel(),
            map = evt.map,
            mapView = map.getView(),
            mapExtent = mapView.calculateExtent(map.getSize()),
            mapCenter = mapView.getCenter(),
            mapZoom = mapView.getZoom(),
            mapProjection = mapView.getProjection().getCode();

        viewModel.setData({
            mapExtent: {
                minX: Math.round(mapExtent[0]),
                minY: Math.round(mapExtent[1]),
                maxX: Math.round(mapExtent[2]),
                maxY: Math.round(mapExtent[3])
            },
            mapCenter: {
                x: Math.round(mapCenter[0]),
                y: Math.round(mapCenter[1])
            },
            mapZoom: mapZoom,
            mapProjection: mapProjection
        });

    },

    onFormFieldChange: function(field, newVal) {
        var me = this,
            view = me.getView(),
            map = view.down('gx_map').getMap(),
            mapView = map.getView();

        switch(field.getName()) {
        case 'mapZoom':
            mapView.setZoom(newVal);
            break;
        case 'mapCenterX':
            mapView.setCenter([newVal, mapView.getCenter()[1]]);
            break;
        case 'mapCenterY':
            mapView.setCenter([mapView.getCenter()[0], newVal]);
            break;
        default:
            break;
        }

    },

    onMapProjectionSelect: function(combo, rec) {
        var me = this,
            projCode = rec.get('code'),
            view = me.getView(),
            map = view.down('gx_map').getMap();

        var projection = ol.proj.get(projCode);

        //TODO work with wgs84 coordinates to simply transform
        // example ol.proj.transform([8.23, 46.86], 'EPSG:4326', 'EPSG:900913'),
        var newMapView = new ol.View({
            center: [0, 0],
            projection: projection,
            zoom: 1
        });

        map.setView(newMapView);
    },

    setDefaultProjection: function(combo) {
        var me = this,
            view = me.getView(),
            map = view.down('gx_map').getMap(),
            mapView = map.getView();

        combo.setValue(mapView.getProjection().getCode());
    }

});
