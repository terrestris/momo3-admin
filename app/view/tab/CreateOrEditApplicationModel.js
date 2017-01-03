Ext.define('MoMo.admin.view.tab.CreateOrEditApplicationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-create-or-edit-application',

    requires: [
        'MoMo.admin.model.Application'
    ],

    data: {
        cancelBtnText: 'Cancel',
        saveBtnText: 'Save',
        application: Ext.create('MoMo.admin.model.Application'),
        general: {
            title: 'General',
            nameFieldLabel: 'Name',
            nameEmptyText: 'Enter the name of the application*',
            descriptionFieldLabel: 'Description',
            descriptionEmptyText: 'Enter an optional description of the ' +
                    'application',
            languageFieldLabel: 'Language',
            languageEmptyText: 'Select the language of the application*',
            publicFieldLabel: 'Public',
            publicBoxToastText: '<b>Note:</b> This application will be set to ' +
                    'public and will be visible even for non logged-in users ' +
                    'afterwards!',
            activeFieldLabel: 'Active',
            activeBoxToastText: '<b>Note:</b> This application will be ' +
                    'deactivated and will not be visible to anyone afterwards!',
        },
        layer: {
            title: 'Layer',
            availableLayersGridTitle: 'Available layers'
        },
        layout: {
            title: 'Layout',
            layoutFieldLabel: 'Layout',
            layoutEmptyText: 'Select the basic layout of the application*',
            availableModulesDescription: 'Select a model to see its description'
        },
        startview: {
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
            values: {
                center: {
                    x: 11579292,
                    y: 6095394
                },
                projection: 'EPSG:3857',
                zoom: 5
            }
        }
    }

});
