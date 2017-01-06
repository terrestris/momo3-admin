Ext.define('MoMo.admin.view.panel.application.StartViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-application-start-view',

    data: {
        title: 'Startview',
        mapCenterTitle: 'Center',
        mapExtentTitle: 'Extent',
        mapZoomTitle: 'Zoom',
        mapCenterXLabel: 'X',
        mapCenterYLabel: 'Y',
        mapExtentMinXLabel: 'Min X',
        mapExtentMinYLabel: 'Min Y',
        mapExtentMaxXLabel: 'Max X',
        mapExtentMaxYLabel: 'Max Y',
        mapZoomLabel: 'Level',
        mapZoomMaxLabel: 'Max',
        mapZoomMinLabel: 'Min',

        mapExtent: {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        },
        mapZoomMax: 28,
        mapZoomMin: 0,

        appData: {
            mapCenter: {
                x: 11579292,
                y: 6095394
            },
            mapProjection: 'EPSG:3857',
            mapZoom: 5
        }
    }

});
