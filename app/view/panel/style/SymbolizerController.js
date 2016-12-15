Ext.define('MoMo.admin.view.panel.style.SymbolizerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.style.symbolizer',
    requires: [
        'GeoExt.component.FeatureRenderer',

        'MoMo.admin.util.Sld',
        "MoMo.admin.view.container.style.StyleEditor",

        'MoMo.admin.util.Sld',
        'BasiGX.util.Color'
    ],

    setupInitialUI: function(){
        var me = this;
        var view = me.getView();
        var viewModel = me.getViewModel();
        var sldUtil = MoMo.admin.util.Sld;
        if(!view.getSymbolizer()){
            var geometryType = view.up('momo-panel-style-styler').geometryType;
            view.setSymbolizer(
                sldUtil.getDefaultSymbolizerForGeometryType(geometryType)
            );
        }
        var jsonixSymb = view.getSymbolizer();
        var olStyle = sldUtil.styleFromSymbolizers(jsonixSymb);
        var symbolType = sldUtil.symbolTypeFromSymbolizer(jsonixSymb);

        viewModel.set({
            olStyle: olStyle,
            symbolType: symbolType
        });

        var added = view.add({
            xtype: 'fieldset',
            bind:{
                title: '{title}',
                html: '{symbolizerFieldSetHtml}'
            },
            height: 140,
            name: 'symbolizer-fieldset',
            layout: 'center',
            items: [{
                xtype: 'gx_renderer',
                symbolizers: olStyle,
                minWidth: 80,
                minHeight: 80,
                symbolType: symbolType,
                cls: 'sld-gx-renderer',
                listeners: {
                    click: {
                        element: 'el',
                        fn: me.symbolizerClicked,
                        scope: me
                    }
                }
            }]
        });
        // if we were given a style with an image, we need to check the size…
        Ext.each(olStyle, function(style){
            me.checkAddResizeListener(style, added.down('gx_renderer'));
        });
    },

    /**
     * For every style that we gathered by evaluating the SLD, we need to check
     * if the style contained an icon (`ol.style.Icon`). If that is the case, we
     * have to ensure that the SLD handling of `<size>` is reflected in the
     * ol.style.Icon. In SLD, for rectangular images, the `<size>` means height,
     * the width will be set accordingly in the correct ratio. For OpenLayers,
     * we can have the same effect f we set a new symbolizer, which has an
     * approprooiate ratio.
     *
     * Here is how we achebve this:
     * Render an image to the dom with the desired height (jsut as in SLD). Once
     * the image has loaded, gather the rendered width. From these two
     * dimensions, we calculate the ratio and set a nearly identical style, only
     * this time with a ratio.
     *
     * TODO This needs t be checked with mutliple images stacked on top of each
     *      other.
     * TODO We also should check why there seems to be a max width for the
     *      gx_renderer?
     */
    checkAddResizeListener: function(style, rendererCmp){
        var img = style && style.getImage && style.getImage();
        if (img && img instanceof ol.style.Icon) {
            var size = img.getSize();
            var height = size && size[1];
            var src = img.getSrc();
            if (!height || !src) {
                return;
            }
            var imgElem = document.createElement('img');
            imgElem.height = height + "";
            imgElem.onload = function() {
                var imgW = this.width;
                var imgH = this.height;
                rendererCmp.setSize(imgW, imgH);
                var adjustedStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: src,
                        scale: (imgH/imgW)
                    })
                });
                rendererCmp.update({symbolizers:adjustedStyle});
                // rendererCmp.setRendererDimensions();
                imgElem = null;
            };
            imgElem.src = src;
        }
    },

    /**
     *
     */
    symbolizerClicked: function(){
        var me = this;
        var view = this.getView();
        var userGroupId = view.getViewModel().get('selectedUserGroup');
        var viewModel = this.getViewModel();
        var symbolType = viewModel.get('symbolType');
        var olStyle = viewModel.get('olStyle');

        var win = Ext.ComponentQuery.query('[name=symbolizer-edit-window]')[0];

        var styleEditor = {
            xtype: 'mm_container_styleditor',
            backendUrls: {
                pictureList: {
                    url: 'images/getImagesForImagePool.action?' +
                    'userGroupId=' + userGroupId +
                    '&category=redliningimages'
                },
                pictureSrc: {
                    url: 'images/getThumbnail.action?id='
                },
                pictureUpload: {
                    url: 'images/uploadMoMoImage.action?' +
                        'category=redliningimages'
                },
                graphicDelete: {
                    url: 'rest/images/',
                    method: 'DELETE'
                }
            }
        };

        switch(symbolType) {
        case "Point":
            styleEditor.redlinePointStyle = Ext.isArray(olStyle) ?
                    olStyle[0] : olStyle;
            break;
        case "Line":
            styleEditor.redlineLineStringStyle = Ext.isArray(olStyle) ?
                    olStyle[0] : olStyle;
            break;
        case "Polygon":
            styleEditor.redlinePolygonStyle = Ext.isArray(olStyle) ?
                    olStyle[0] : olStyle;
            break;
        default:
            break;
        }

        if(!win){
            Ext.create('Ext.window.Window', {
                name: 'symbolizer-edit-window',
                title: me.getViewModel().get('windowTitle'),
                layout: 'fit',
                items: [styleEditor],
                bbar: [{
                    text: 'Cancel',
                    ui: 'MoMo-cancel',
                    handler: function(btn){
                        btn.up('[name=symbolizer-edit-window]').close();
                    }
                },{
                    text: 'Apply',
                    ui: 'MoMo',
                    handler: me.applyStyle,
                    scope: me
                }]
            }).show();
        } else {
            BasiGX.util.Animate.shake(win);
        }
    },

    applyStyle:function(btn){
        var view = this.getView();
        var viewModel = this.getViewModel();

        var symbolizerRenderer = view.down('gx_renderer');
        var win = btn.up('[name=symbolizer-edit-window]');
        var editorRenderer = win.down('gx_renderer');

        view.symbolizer = [MoMo.admin.util.Sld
                .olSymbolizerToSldSymbolizer(editorRenderer.getSymbolizers())];

        if(symbolizerRenderer && editorRenderer){
            if(Ext.isArray(editorRenderer.getSymbolizers())){
                symbolizerRenderer.setSymbolizers(
                        editorRenderer.getSymbolizers());
                viewModel.set('olStyle', editorRenderer.getSymbolizers());
            } else {
                symbolizerRenderer.setSymbolizers(
                        [editorRenderer.getSymbolizers()]);
                viewModel.set('olStyle', editorRenderer.getSymbolizers());
            }
        }

        view.fireEvent('symbolizerschanged', view.symbolizer);
        win.close();
    }
});
