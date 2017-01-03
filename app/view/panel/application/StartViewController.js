Ext.define('MoMo.admin.view.panel.application.StartViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.momo-application-start-view',

    /**
     *
     */
    renderMap: function() {
        var me = this;

        me.setOlMap();
        me.registerOnMapMoveEnd();
    },

    /**
     *
     */
    setOlMap: function() {
        var me = this,
            view = me.getView(),
            viewModel = view.lookupViewModel(),
            zoom = viewModel.getData('startview.values.zoom'),
            x = viewModel.getData('startview.values.zoom.x'),
            y = viewModel.getData('startview.values.zoom.y'),
            projCode = viewModel.getData('startview.values.projection');

        var olMap = new ol.Map({
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
                center: ol.proj.fromLonLat([x, y]),
                projection: ol.proj.get(projCode),
                zoom: zoom
            })
        });

        view.down('gx_map').setMap(olMap);
    },

    /**
     *
     */
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

    /**
     *
     */
    registerOnMapMoveEnd: function() {
        var me = this,
            view = me.getView(),
            map = view.down('gx_map').getMap();

        map.on('moveend', me.onMapMoveEnd, me);
    },

    /**
     *
     */
    onMapMoveEnd: function(evt) {
        var me = this,
            viewModel = me.getView().lookupViewModel(),
            map = evt.map,
            mapView = map.getView(),
            mapExtent = mapView.calculateExtent(map.getSize()),
            mapCenter = mapView.getCenter(),
            mapZoom = mapView.getZoom(),
            mapProjection = mapView.getProjection().getCode();

        viewModel.set('startview.mapExtent',{
            minX: mapExtent[0],
            minY: mapExtent[1],
            maxX: mapExtent[2],
            maxY: mapExtent[3]
        });
        viewModel.set('startview.values', {
            center: {
                x: mapCenter[0],
                y: mapCenter[1]
            },
            zoom: mapZoom,
            projection: mapProjection
        });

    },

    /**
     *
     */
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

    /**
     *
     */
    onMapProjectionSelect: function(combo, rec) {
        var me = this,
            projCode = rec.get('code'),
            view = me.getView(),
            map = view.down('gx_map').getMap(),
            mapView = map.getView(),
            oldCenter = mapView.getCenter(),
            oldProjection = mapView.getProjection(),
            oldZoom = mapView.getZoom(),
            newProjection = ol.proj.get(projCode),
            newCenter = ol.proj.transform(
                    oldCenter,
                    oldProjection,
                    newProjection);

        var newMapView = new ol.View({
            center: newCenter,
            projection: newProjection,
            zoom: oldZoom
        });

        map.setView(newMapView);
    }

});
