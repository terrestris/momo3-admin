Ext.define('MoMo.admin.view.panel.style.SymbolizerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.style.symbolizer',
    requires: [
        'GeoExt.component.FeatureRenderer',

        'MoMo.admin.util.Sld',

        'MoMo.admin.util.Sld',
        'BasiGX.util.Color',
        'BasiGX.util.SLD',
        'BasiGX.view.container.SLDStyler'
    ],

    setupInitialUI: function(){
        var me = this;
        var view = me.getView();
        var viewModel = me.getViewModel();
        var sldUtil = MoMo.admin.util.Sld;
        var jsonixSymb = view.getSymbolizer();
        var symbolType = sldUtil.symbolTypeFromSymbolizer(jsonixSymb);
        var sld = view.up('momo-panel-style-rules').sld;
        var styler = view.up('momo-panel-style-styler');
        var rule = view.up('momo-panel-style-rule').rule;
        var layerName = styler.layerName;
        var availableRules;

        viewModel.set({
            symbolType: symbolType
        });


        // check if rule exists in sld. may not be the case when user adds
        // a new rule
        var sldObj = BasiGX.util.SLD.toSldObject(sld);
        var ruleObj = BasiGX.util.SLD.getRuleByName(rule.name, sldObj);
        if (!ruleObj) {
            availableRules = BasiGX.util.SLD.rulesFromSldObject(sldObj);
        }

        Ext.Ajax.request({
            binary: true,
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'geoserver.action',
            method: 'POST',
            params: {
                service: 'WMS',
                request: 'GetLegendGraphic',
                layer: layerName,
                version: '1.1.1',
                format: 'image/png',
                width: 80,
                height: 80,
                rule: ruleObj ? rule.name : availableRules[0].name,
                sld_body: sld
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            success: function(response) {
                var blob = new Blob(
                    [response.responseBytes],
                    {type: 'image/png'}
                );
                var url = window.URL.createObjectURL(blob);
                view.add({
                    xtype: 'fieldset',
                    bind:{
                        title: '{title}',
                        html: '{symbolizerFieldSetHtml}'
                    },
                    height: 140,
                    name: 'symbolizer-fieldset',
                    layout: 'center',
                    items: [{
                        xtype: 'image',
                        alt: 'test',
                        src: url,
                        width: 80,
                        minHeight: 80,
                        listeners: {
                            click: {
                                element: 'el',
                                fn: me.symbolizerClicked,
                                scope: me
                            }
                        }
                    }]
                });
            },
            failure: function() {
                Ext.toast('Error retrieving the Graphic preview');
            }
        });
    },

    /**
     *
     */
    symbolizerClicked: function(){
        var me = this;
        var view = this.getView();
        var viewModel = this.getViewModel();
        var symbolType = viewModel.get('symbolType');
        var sld = view.up('momo-panel-style-rules').sld;
        var styler = view.up('momo-panel-style-styler');
        var rule = view.up('momo-panel-style-rule').rule;
        var layerName = styler.layerName;

        var win = Ext.ComponentQuery.query('[name=symbolizer-edit-window]')[0];

        var styleEditor = {
            xtype: 'basigx-container-sldstyler',
            backendUrls: {
                pictureList: {
                    url: 'rest/images',
                    method: 'GET'
                },
                pictureSrc: {
                    url: 'momoimage/getThumbnail.action?id='
                },
                pictureUpload: {
                    url: 'momoimage/upload.action?'
                },
                graphicDelete: {
                    url: 'rest/images/',
                    method: 'DELETE'
                },
                geoServerUrl: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'geoserver.action',
                geoserverFontListUrl: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'font/getGeoServerFontList.action',
                geoserverFontUrl: BasiGX.util.Url.getWebProjectBaseUrl() +
                    'font/getGeoServerFont.action'
            },
            layer: layerName,
            sld: sld,
            ruleName: rule.name,
            mode: symbolType.toLowerCase()
        };

        if(!win){
            Ext.create('Ext.window.Window', {
                name: 'symbolizer-edit-window',
                title: viewModel.get('windowTitle'),
                layout: 'fit',
                items: [styleEditor],
                bbar: [{
                    text: viewModel.get('cancelSymbolizationText'),
                    handler: function(btn){
                        btn.up('[name=symbolizer-edit-window]').close();
                    }
                },{
                    text: viewModel.get('applySymbolizationText'),
                    handler: me.applyStyle,
                    scope: me
                }]
            }).show();
        } else {
            BasiGX.util.Animate.shake(win);
        }
    },

    applyStyle: function(btn){
        var view = this.getView();
        var win = btn.up('[name=symbolizer-edit-window]');
        var sldStyler = win.down('basigx-container-sldstyler');
        var sld = sldStyler.getSld();
        var rule = sldStyler.getRule();
        var rules = BasiGX.util.SLD.rulesFromSldObject(sldStyler.getSldObj());

        // update parent components (who screwed this up btw?)
        view.up('momo-panel-style-rules').setSld(sld);
        view.up('momo-panel-style-rules').sldObj = sldStyler.getSldObj();
        view.up('momo-panel-style-rules').rules = rules;

        // preserve the filter
        var oldRule = view.up('momo-panel-style-rule').getRule();
        rule.filter = oldRule.filter;
        view.up('momo-panel-style-rule').setRule(rule);

        var styler = view.up('momo-panel-style-styler');
        var layerName = styler.layerName;

        Ext.Ajax.request({
            binary: true,
            url: BasiGX.util.Url.getWebProjectBaseUrl() +
                'geoserver.action',
            method: 'POST',
            params: {
                service: 'WMS',
                request: 'GetLegendGraphic',
                layer: layerName,
                version: '1.1.1',
                format: 'image/png',
                width: 80,
                height: 80,
                rule: rule.name,
                sld_body: sld
            },
            defaultHeaders: BasiGX.util.CSRF.getHeader(),
            scope: this,
            success: function(response) {
                var blob = new Blob(
                    [response.responseBytes],
                    {type: 'image/png'}
                );
                var url = window.URL.createObjectURL(blob);
                view.down('image').setSrc(url);
            },
            failure: function() {
                Ext.toast('Error retrieving the Graphic preview');
            }
        });
        win.close();
    }
});
