Ext.define('MoMo.admin.view.panel.ProfilePanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-profilepanel',

    data: {
        title: 'Edit your profile',
        deleteUser: 'Delete Account',
        saveUser: 'Save',
        firstNameLabel: 'First name',
        lastNameLabel: 'Last name',
        emailLabel: 'Email',
        departmentLabel: 'Department',
        telephoneLabel: 'Telephone',
        languageLabel: 'Language',
        profileImageLabel: 'Avatar',
        selectImageText: 'Select an image',
        pictureDeletedSuccessMsgText: 'Picture deleted',
        pictureDeletedSuccessMsgTitle: 'Success',
        graphicPoolWindowTitle: 'Select or upload an image',
        editDetailsTitle: 'Change your details',
        editPermissionsTitle: 'Change your permissions',
        permissionGridDescription: 'Check the roles you want to use in a ' +
            'specific group.<br>The changes you request will be on hold ' +
            'until a priviliged Sub-Admin has approved these.<br>You will ' +
            'get notified via email when your request is approved or declined.',
        updateSuccessText: 'Your details have been updated. When you have ' +
            'also changed your permissions, you will be notified via email ' +
            'when a priviliged administrator approved or declined them.',
        updateFailureText: 'Your details could not be updated'
    }
});
