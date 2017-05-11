Ext.define('MoMo.admin.view.tab.CreateOrEditApplicationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-create-or-edit-application',

    requires: [
        'MoMo.admin.model.Application'
    ],

    data: {

        i18n: {
            permissions: {
                applicationpermissionstitle: 'Permissions',
                applicationpermissionsdescriptiontext: 'Here you can manage ' +
                    'what users and groups may' +
                    'see, edit and delete this application.<br>' +
                    'If you are creating a new application, you will need to ' +
                    'save it first before you can set the permissions'
            },
            general: {
                title: 'General',
                fieldSetTitle: 'General',
                nameFieldLabel: 'Name',
                nameEmptyText: 'Enter the name of the application*',
                descriptionFieldLabel: 'Description',
                descriptionEmptyText: 'Enter an optional description of the ' +
                        'application',
                languageFieldLabel: 'Language',
                languageEmptyText: 'Select the language of the application*',
                publicFieldLabel: 'Public',
                publicBoxToastText: '<b>Note:</b> This application will be ' +
                    'set to public and will be visible even for non logged-in '+
                        'users afterwards!',
                activeFieldLabel: 'Active',
                activeBoxToastText: '<b>Note:</b> This application will ' +
                    'be deactivated and will not be visible to anyone ' +
                    'afterwards!'
            },
            tools: {
                title: 'Tools',
                helpText: 'Green buttons / tools will be available in the' +
                    ' application, blue ones not'
            },
            startview: {
                projectionTitle: 'Projection',
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
                mapZoomLabel: 'Level'
            },
            layer: {
                title: 'Layer',
                availableLayersGridTitle: 'Available layers'
            },
            cancelBtnText: 'Cancel',
            saveBtnText: 'Save'
        },
        entityId: null,
        application: Ext.create('MoMo.admin.model.Application'),
        startview: {
            mapExtent: {
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0
            },
            values: {
                center: {
                    x: 11843458,
                    y: 6251937
                },
                projection: 'EPSG:3857',
                zoom: 5
            }
        }
    }
});
