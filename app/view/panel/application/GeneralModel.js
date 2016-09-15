Ext.define('MoMo.admin.view.panel.application.GeneralModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-application-general',

    data: {
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
                'deactivated and will not be visibile to anyone afterwards!',

        appData: {
            name: null,
            description: null,
            language: 'en',
            isPublic: false,
            isActive: true
        }
    }

});
