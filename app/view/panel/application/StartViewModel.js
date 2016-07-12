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

        mapCenter: {
            x: null,
            y: null
        },
        mapExtent: {
            minX: null,
            minY: null,
            maxX: null,
            maxY: null
        },
        mapProjection: null,
        mapZoom: null,
        mapZoomMax: 28,
        mapZoomMin: 0
    }

});
