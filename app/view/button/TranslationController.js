/* Copyright (c) 2016 terrestris GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * TranslationController
 *
 * This controller implements the "on the fly" translation logic of the
 * momo application.
 * The most functions are based on `BasiGX.view.combo.Language` class and were
 * adapted to work with buttons instead of combo box.
 *
 * @class MoMo.client.view.button.TranslationController
 */
Ext.define('MoMo.admin.view.button.TranslationController', {
    extend: 'Ext.app.ViewController',

    requires: [
    ],

    alias: 'controller.button.translation',

    config: {
        appLocaleUrlTpl: '../locale/admin/{0}.json',
        defaultLanguage: 'de'
    },

    firstApplicationLoad: false,

    /**
    *
    */
    privates: {
        locale: null
    },

    /**
     * Fires after language button is rendered to trigger the setting of the
     * default application language
     */
    onAfterRender: function() {
        var me = this;
        if (me.getView().isDefaultLanguage) {
            me.firstApplicationLoad = true;
            me.onClick();
        }
    },

    /**
    *
    */
    onClick: function() {
        var me = this;
        var lang = me.getViewModel().get('translateTo');
        me.requestLanguageFile(lang);
    },

    /**
    * Requests a language file from backend depending on clicked locale button
    * in JSON format. This file will be generated automatically from CSV file
    * located under
    * `<projectFolder>/src/main/resources/META-INF/locale/<appName>.csv, where
    * `appName` is the application subfolde as `client`, `admin`, `login` etc.
    *
    */
    requestLanguageFile: function(locale) {
        var me = this;

        me.locale = locale;

        var appLocaleUrl = Ext.util.Format.format(
            me.getAppLocaleUrlTpl(), me.locale);

        Ext.Ajax.request({
            method: 'GET',
            url: appLocaleUrl,
            success: me.onLoadAppLocaleSuccess,
            failure: me.onLoadAppLocaleFailure,
            scope: me
        });
    },

    /**
     *
     */
    onLoadAppLocaleSuccess: function(resp) {
        var me = this;
        var respObj;

        if (resp && resp.responseText) {

            // try to parse the given string as JSON
            try {
                respObj = Ext.decode(resp.responseText);
                Ext.Logger.info('Succesfully loaded i18n file: ' + me.locale);
            } catch(err) {
                me.onLoadAppLocaleFailure();
                return false;
            } finally {
                if (respObj) {
                    me.setAppLanguage(respObj);
                    me.recreateSingletons();

                    // avoid toast on first application load
                    if (!me.firstApplicationLoad){
                        Ext.toast(Ext.util.Format.format(
                            me.getViewModel()
                                .get('setLanguageCallbackToastText'),
                            me.locale.toUpperCase())
                        );
                    }
                    me.firstApplicationLoad = false;

                    var mainVm = Ext.ComponentQuery.query(
                        'momo-mainviewport')[0].getViewModel();
                    mainVm.set('currentLanguage', me.locale);

                    // adjust locale of login/logout button
                    var loginBtn =
                        Ext.ComponentQuery.query('momo-login-logout-button')[0];
                    if (loginBtn){
                        loginBtn.getController().setCurrentUserAccountName();
                    }

                    // adjust main navigation menu translation, as its initial
                    // records cannot be bound to the viewmodel...
                    var treeList = Ext.ComponentQuery.query(
                        'treelist[reference=navigationTreeList]')[0];
                    var vm = me.getViewModel();
                    if (treeList) {
                        var store = treeList.getStore();
                        var root = {
                            expanded: true,
                            children: [{
                                text: vm.get('i18n').applicationsMenuTitle,
                                view: 'grid.ApplicationList',
                                iconCls: 'right-icon x-fa fa-desktop',
                                routeId: 'applications',
                                helpKey: 'applications-treelistitem',
                                leaf: true
                            }, {
                                text: vm.get('i18n').layersMenuTitle,
                                view: 'grid.LayerList',
                                leaf: true,
                                iconCls: 'x-fa fa-list',
                                routeId: 'layers',
                                helpKey: 'layers-treelistitem'
                            }, {
                                text: vm.get('i18n').groupsMenuTitle,
                                view: 'panel.GroupPanel',
                                leaf: true,
                                iconCls: 'x-fa fa-key',
                                routeId: 'groups',
                                helpKey: 'groups-treelistitem'
                            }, {
                                text: vm.get('i18n').usersMenuTitle,
                                view: 'grid.UserList',
                                leaf: true,
                                iconCls: 'x-fa fa-user',
                                routeId: 'users',
                                helpKey: 'users-treelistitem'
                            }, {
                                text: vm.get('i18n').profileMenuTitle,
                                view: 'panel.ProfilePanel',
                                leaf: true,
                                iconCls: 'x-fa fa-user',
                                routeId: 'profile',
                                helpKey: 'profile-treelistitem'
                            }]
                        };
                        // need to reset the root node as ext is buggy here
                        store.setRootNode(root);
                    }

                    // adjust the tooltips in the grids by refreshing the view
                    var layerList = Ext.ComponentQuery.query(
                        'momo-layerlist')[0];
                    if (layerList) {
                        layerList.getView().refresh();
                    }
                    var appList = Ext.ComponentQuery.query(
                        'momo-applicationlist')[0];
                    if (appList) {
                        appList.getView().refresh();
                    }
                    var groupList = Ext.ComponentQuery.query(
                        'momo-grouplist')[0];
                    if (groupList) {
                        groupList.getView().refresh();
                    }
                    var usersList = Ext.ComponentQuery.query(
                        'momo-userlist')[0];
                    if (usersList) {
                        usersList.getView().refresh();
                    }
                    var userGroupRoleGrid = Ext.ComponentQuery.query(
                        'momo-grouppermissiongrid')[0];
                    if (userGroupRoleGrid) {
                        userGroupRoleGrid.getView().refresh();
                    }
                    var permissionGrids = Ext.ComponentQuery.query(
                        'momo-entitypermissions');
                    Ext.each(permissionGrids, function(grid) {
                        grid.getView().refresh();
                    });
                }
            }
        }
    },

    /**
     *
     */
    onLoadAppLocaleFailure: function() {
        var me = this;
        var defaultLanguage = me.getDefaultLanguage();

        if (me.locale === defaultLanguage) {
            me.erroneousTryToLoadDefaultLanguage = true;
        }

        // load default language, but try only once to prevent killswitch
        if (!me.erroneousTryToLoadDefaultLanguage) {
            Ext.Logger.warn('Error on loading the selected i18n file! Will ' +
                    'try to load the default language ' + defaultLanguage +
                    ' instead.');
            me.requestLanguageFile(defaultLanguage);
        } else {
            Ext.Logger.error('Could neither load the selected nor ' +
                    'the fallback i18n file! Bad front-end behaviour is to ' +
                    'be expected.');
        }
    },

    /**
     *
     */
    setAppLanguage: function(localeObj) {
        var me = this;
        var cq = Ext.ComponentQuery.query;
        var cqTpl = '{self.getName() === "{0}"}{getViewModel()}';
        var instantiatedClasses;
        var baseLocaleObj;

        Ext.iterate(localeObj, function(className, locale) {
            baseLocaleObj = {
                override: className
            };

            Ext.iterate(locale, function(key, value) {
                baseLocaleObj[key] = value;
            });

            // 1. override the class itself
            Ext.define(className + '.locale.' + me.locale, baseLocaleObj);

            // 2. Now we will handle the classes viewmodel, if exisiting.
            // The override has to be based on the unmodified classname in
            // this case
            var currentClass = Ext.ClassManager.get(className);
            if (currentClass && currentClass.getConfigurator) {
                var configurator = currentClass.getConfigurator();
                if (configurator && configurator.values &&
                    configurator.values.viewModel) {
                    var viewModel = configurator.values.viewModel;
                    var type = viewModel.type;
                    // if the component has an own viewModel instance
                    if (!Ext.isEmpty(type) || Ext.isString(viewModel)) {
                        var viewName = type || viewModel;
                        var viewClassName = Ext.ClassManager.getName(
                            Ext.ClassManager
                                .getByAlias('viewmodel.' + viewName));
                        baseLocaleObj.override = viewClassName;
                        Ext.define(viewClassName, baseLocaleObj);
                    } else if (!Ext.isEmpty(viewModel)) {
                        // if the component has an inline viewModel
                        Ext.apply(viewModel.data, locale.config.data);
                    }
                }
            }

            // 3. override the classes already instantiated
            // get all instantiated classes (containing a view model)
            instantiatedClasses = cq(Ext.String.format(cqTpl, className));
            // set the locale for each class
            Ext.each(instantiatedClasses, function(clazz) {
                clazz.getViewModel().setData(locale.config.data);
            });
        });
    },

    /**
     *
     */
    recreateSingletons: function() {
        Ext.MessageBox = Ext.Msg = new Ext.window.MessageBox();
    }
});
