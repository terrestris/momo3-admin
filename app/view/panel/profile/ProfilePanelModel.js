Ext.define('MoMo.admin.view.panel.ProfilePanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.momo-profilepanel',

    data: {
        profilepanelTitle: 'Edit your profile',
        profilepanelActionSuccess: 'Success',
        profilepanelActionFailure: 'Error',
        profilepanelDeleteUser: 'Delete Account',
        profilepanelChangePassword: 'Change password',
        profilepanelConfirmChangePassword: 'Do you want to reset ' +
            'your password now?',
        profilepanelOldPassword: 'Old password',
        profilepanelNewPassword: 'New password',
        profilepanelNewPasswordValidate: 'Verify new password',
        profilepanelNewPasswordNotEqual: 'New password entries are not equal.',
        profilepanelChangePasswordCancel: 'Cancel',
        profilepanelChangePasswordReset: 'Reset',
        profilepanelChangePasswordError: 'Updating the password was NOT ' +
            'successful.',
        profilepanelChangePasswordSuccess: 'Password has successfully been ' +
            'updated.',
        profilepanelDeleteUserText: 'Do you really want to delete your ' +
            'complete account?',
        profilepanelDeletionSuccessText: 'Your account has been deleted, you ' +
            'will now be redirected to the login page',

        profilepanelDeletionFailureText: 'Your account could not be deleted!' +
            'Please contact an administrator to get your account deleted',
        profilepanelSaveUser: 'Save',
        profilepanelFirstNameLabel: 'First name',
        profilepanelLastNameLabel: 'Last name',
        profilepanelEmailLabel: 'Email',
        profilepanelDepartmentLabel: 'Department',
        profilepanelTelephoneLabel: 'Telephone',
        profilepanelLanguageLabel: 'Language',
        profilepanelProfileImageLabel: 'Avatar',
        profilepanelSelectImageText: 'Select an image',
        profilepanelPictureDeletedSuccessMsgText: 'Picture deleted',
        profilepanelPictureDeletedSuccessMsgTitle: 'Success',
        profilepanelGraphicPoolWindowTitle: 'Select or upload an image',
        profilepanelEditDetailsTitle: 'Change your details',
        profilepanelEditPermissionsTitle: 'Change your permissions',
        profilepanelPermissionGridDescription: 'Check the roles you want to ' +
            'use in a ' +
            'specific group.<br>The changes you request will be on hold ' +
            'until a priviliged Sub-Admin has approved these.<br>You will ' +
            'get notified via email when your request is approved or declined.',
        profilepanelUpdateSuccessText: 'Your details have been updated. When ' +
            'you have ' +
            'also changed your permissions, you will be notified via email ' +
            'when a priviliged administrator approved or declined them.',
        profilepanelUpdateFailureText: 'Your details could not be updated'
    }
});
