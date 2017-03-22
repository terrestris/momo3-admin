Ext.define("MoMo.admin.view.container.style.StyleEditor", {
    extend: "BasiGX.view.container.RedlineStyler",
    xtype: "momo-container-styleditor",

    /**
     * @overwrite
     */
    updateStyle: function(pointStyle, lineStyle, polygonStyle) {
        var redLineStyler = this;
        var oldStyle;
        var style;
        var renderer;

        if (pointStyle) {
            oldStyle = redLineStyler.getRedlinePointStyle();
            renderer = redLineStyler.down(
                    'gx_renderer[name=pointRenderPreview]');
            style = redLineStyler.generatePointStyle(oldStyle, pointStyle);
            redLineStyler.setRedlinePointStyle(style);
        } else if (lineStyle) {
            oldStyle = redLineStyler.getRedlineLineStringStyle();
            renderer = redLineStyler.down(
                    'gx_renderer[name=lineRenderPreview]');
            style = redLineStyler.generateLineStringStyle(oldStyle, lineStyle);
            redLineStyler.setRedlineLineStringStyle(style);
        } else {
            oldStyle = redLineStyler.getRedlinePolygonStyle();
            renderer = redLineStyler.down(
                    'gx_renderer[name=polygonRenderPreview]');
            style = redLineStyler.generatePolygonStyle(oldStyle, polygonStyle);
            redLineStyler.setRedlinePolygonStyle(style);
        }

        // refresh the gx_renderer
        if (renderer) {
            renderer.setSymbolizers(style);
        }
    },

    /**
     * @overwrite
     * Removed the boxready listener as it destroys styles with external
     * graphics everytime the component gets shown
     */
    getPointFieldset: function() {
        var me = this;
        var style = me.getRedlinePointStyle();
        if (Ext.isEmpty(style)) {
            return null;
        }
        var imageStyle = style.getImage();
        var imageAnchor;
        var imageScale;
        var radius = 10;
        var strokeWidth = 0;
        var fillColor = '#008000';
        var strokeColor = '#ffcc33';

        if (imageStyle instanceof ol.style.Icon) {
            imageAnchor = imageStyle.getAnchor();
            imageScale = imageStyle.getScale() * 100;
        } else if (imageStyle instanceof ol.style.Circle) {
            radius = imageStyle.getRadius();
            if (imageStyle.getStroke()) {
                strokeWidth = imageStyle.getStroke().getWidth();
                strokeColor = imageStyle.getStroke().getColor();
                strokeColor = strokeColor.indexOf('rgba') > -1 ?
                        BasiGX.util.Color.rgbaToHex8(strokeColor) : strokeColor;
            }
            if (imageStyle.getFill()) {
                fillColor = imageStyle.getFill().getColor();
                fillColor = fillColor.indexOf('rgba') > -1 ? BasiGX.util.Color.
                        rgbaToHex8(fillColor) : fillColor;
            }
        }

        var fs = {
            xtype: 'fieldset',
            bind: {
                title: '{pointStyleFieldSetTitle}'
            },
            name: 'pointstyle',
            layout: 'hbox',
            items: [{
                xtype: 'tabpanel',
                items: [{
                    xtype: 'panel',
                    bind: {
                        title: '{pointStyleSymbolPanelTitle}'
                    },
                    defaults: {
                        margin: 3,
                        width: 220
                    },
                    items: [{
                        xtype: 'numberfield',
                        bind: {
                            fieldLabel: '{pointStyleRadiusNumberFieldLabel}'
                        },
                        name: 'pointradius',
                        value: radius,
                        minValue: 1,
                        maxValue: 50,
                        listeners: {
                            change: function(field, val) {
                                me.updateStyle({radius: val});
                            }
                        }
                    }, {
                        xtype: 'numberfield',
                        bind: {
                            fieldLabel: '{pointStyleStrokeNumberFieldLabel}'
                        },
                        name: 'pointstrokewidth',
                        value: strokeWidth,
                        minValue: 0,
                        maxValue: 50,
                        listeners: {
                            change: function(field, val) {
                                me.updateStyle({strokewidth: val});
                            }
                        }
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            width: 100
                        },
                        items: [{
                            xtype: 'displayfield',
                            width: 100,
                            bind: {
                                value: '{pointStyleStrokeColorFieldLabel}'
                            }
                        }, {
                            xtype: 'colorbutton',
                            name: 'pointstrokecolor',
                            format: 'hex8',
                            value: strokeColor,
                            margin: '5 0 0 10',
                            listeners: {
                                change: function(field, val, oldVal) {
                                    if (oldVal) {
                                        var color = BasiGX.util.Color
                                                .hex8ToRgba(val);
                                        me.updateStyle({
                                            strokecolor: color
                                        });
                                    }
                                }
                            }
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            width: 100
                        },
                        items: [{
                            xtype: 'displayfield',
                            width: 100,
                            bind: {
                                value: '{pointStyleFillColorFieldLabel}'
                            }
                        }, {
                            xtype: 'colorbutton',
                            name: 'pointfillcolor',
                            format: 'hex8',
                            margin: '0 0 0 10',
                            value: fillColor,
                            listeners: {
                                change: function(field, val, oldVal) {
                                    if (oldVal) {
                                        var color = BasiGX.util.Color
                                                .hex8ToRgba(val);
                                        me.updateStyle({
                                            fillcolor: color
                                        });
                                    }
                                }
                            }
                        }]
                    }]
                }, {
                    xtype: 'panel',
                    bind: {
                        title: '{pointStyleGraphicPanelTitle}'
                    },
                    name: 'pointgraphic',
                    defaults: {
                        margin: 3,
                        width: 220
                    },
                    items: [{
                        xtype: 'button',
                        bind: {
                            text: '{pointStyleChooseImgBtnText}'
                        },
                        handler: me.onChooseGraphicClick,
                        scope: me
                    }, {
                        xtype: 'slider',
                        bind: {
                            fieldLabel: '{pointStyleImgOffsetXSliderLabel}'
                        },
                        name: 'xoffset',
                        value: imageAnchor ? imageAnchor[0] : 50,
                        minValue: 0,
                        maxValue: 100,
                        listeners: {
                            change: function() {
                                var values = me.getImageAttributes();
                                me.changeIconStyle(values);
                            },
                            scope: me
                        }
                    }, {
                        xtype: 'slider',
                        bind: {
                            fieldLabel: '{pointStyleImgOffsetYSliderLabel}'
                        },
                        name: 'yoffset',
                        value: imageAnchor ? imageAnchor[1] : 50,
                        minValue: 0,
                        maxValue: 100,
                        listeners: {
                            change: function() {
                                var values = me.getImageAttributes();
                                me.changeIconStyle(values);
                            },
                            scope: me
                        }
                    }, {
                        xtype: 'slider',
                        bind: {
                            fieldLabel: '{pointStyleImgScaleSliderLabel}'
                        },
                        name: 'iconscale',
                        value: imageScale ? imageScale : 100,
                        increment: 1,
                        minValue: 10,
                        maxValue: 500,
                        listeners: {
                            change: function() {
                                var values = me.getImageAttributes();
                                me.changeIconStyle(values);
                            },
                            scope: me
                        }
                    }]
                }]
            }, {
                xtype: 'panel',
                border: false,
                layout: 'fit',
                items: [{
                    xtype: 'gx_renderer',
                    margin: 20,
                    width: 200,
                    height: 160,
                    name: 'pointRenderPreview',
                    symbolizers: style,
                    symbolType: 'Point'
                }]
            }]
        };
        return fs;
    },

    /**
     * @overwrite
     * Removed the boxready listener as it destroys styles with external
     * graphics everytime the component gets shown
     */
    getLineStringFieldset: function() {
        var me = this;
        var style = me.getRedlineLineStringStyle();
        if (Ext.isEmpty(style)) {
            return null;
        }
        var styleStrokeColor = style.getStroke().getColor();
        var strokeColor = styleStrokeColor.indexOf('rgba') > -1 ?
                BasiGX.util.Color.rgbaToHex8(styleStrokeColor) :
                styleStrokeColor;

        var fs = {
            xtype: 'fieldset',
            bind: {
                title: '{lineStyleFieldSetTitle}'
            },
            name: 'linestringstyle',
            layout: 'hbox',
            items: [{
                xtype: 'fieldset',
                layout: 'vbox',
                width: 220,
                defaults: {
                    margin: 3,
                    width: 180
                },
                items: [{
                    xtype: 'numberfield',
                    bind: {
                        fieldLabel: '{lineStyleStrokeNumberFieldLabel}'
                    },
                    value: style.getStroke().getWidth(),
                    minValue: 0,
                    maxValue: 50,
                    listeners: {
                        change: function(field, val) {
                            me.updateStyle(null, {strokewidth: val});
                        }
                    }
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        width: 70
                    },
                    items: [{
                        xtype: 'displayfield',
                        width: 100,
                        bind: {
                            value: '{lineStyleStrokeColorFieldLabel}'
                        }
                    }, {
                        xtype: 'colorbutton',
                        format: 'hex8',
                        value: strokeColor,
                        margin: '5 0 0 10',
                        listeners: {
                            change: function(field, val) {
                                var color = BasiGX.util.Color
                                    .hex8ToRgba(val);
                                me.updateStyle(null,
                                    {strokecolor: color}
                                );
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'panel',
                border: false,
                layout: 'fit',
                items: [{
                    xtype: 'gx_renderer',
                    margin: 20,
                    width: 200,
                    height: 60,
                    name: 'lineRenderPreview',
                    symbolizers: style,
                    symbolType: 'Line'
                }]
            }]
        };
        return fs;
    },

    /**
     * @overwrite
     * Removed the boxready listener as it destroys styles with external
     * graphics everytime the component gets shown
     */
    getPolygonFieldset: function() {
        var me = this;
        var style = me.getRedlinePolygonStyle();
        if (Ext.isEmpty(style)) {
            return null;
        }
        var styleFillColor = style.getFill().getColor();
        var fillColor = styleFillColor.indexOf('rgba') > -1 ?
                BasiGX.util.Color.rgbaToHex8(styleFillColor) : styleFillColor;
        var styleStrokeColor = style.getStroke().getColor();
        var strokeColor = styleStrokeColor.indexOf('rgba') > -1 ?
                BasiGX.util.Color.rgbaToHex8(styleStrokeColor) :
                styleStrokeColor;

        var fs = {
            xtype: 'fieldset',
            bind: {
                title: '{polygonStyleFieldSetTitle}'
            },
            name: 'polygonstyle',
            layout: 'hbox',
            items: [{
                xtype: 'fieldset',
                layout: 'vbox',
                width: 220,
                defaults: {
                    width: 180
                },
                items: [{
                    xtype: 'numberfield',
                    bind: {
                        fieldLabel: '{polygonStyleStrokeNumberFieldLabel}'
                    },
                    value: style.getStroke().getWidth(),
                    minValue: 0,
                    maxValue: 50,
                    listeners: {
                        change: function(field, val) {
                            me.updateStyle(null, null,
                                {strokewidth: val}
                            );
                        }
                    }
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        width: 70
                    },
                    items: [{
                        xtype: 'displayfield',
                        width: 100,
                        bind: {
                            value: '{polygonStyleStrokeColorFieldLabel}'
                        }
                    }, {
                        xtype: 'colorbutton',
                        format: 'hex8',
                        value: strokeColor,
                        margin: '5 0 0 10',
                        listeners: {
                            change: function(field, val) {
                                var color = BasiGX.util.Color
                                    .hex8ToRgba(val);
                                me.updateStyle(null, null,
                                    {strokecolor: color}
                                );
                            }
                        }
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        width: 100
                    },
                    items: [{
                        xtype: 'displayfield',
                        width: 100,
                        bind: {
                            value: '{polygonStyleFillColorFieldLabel}'
                        }
                    }, {
                        xtype: 'colorbutton',
                        format: 'hex8',
                        margin: '0 0 0 10',
                        value: fillColor,
                        listeners: {
                            change: function(field, val) {
                                var color = BasiGX.util.Color
                                    .hex8ToRgba(val);
                                me.updateStyle(null, null,
                                    {fillcolor: color}
                                );
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'panel',
                border: false,
                layout: 'fit',
                items: [{
                    xtype: 'gx_renderer',
                    margin: 20,
                    width: 200,
                    height: 100,
                    name: 'polygonRenderPreview',
                    symbolizers: style,
                    symbolType: 'Polygon'
                }]
            }]
        };
        return fs;
    },

    /**
     * @overwrite
     */
    changeIconStyle: function(imageProps) {
        var redLineStyler = this;
        var offsetX = imageProps[0];
        var offsetY = imageProps[1];
        var scale = imageProps[2];

        var renderer = redLineStyler.down(
                'gx_renderer[name=pointRenderPreview]');
        var oldStyle = redLineStyler.getRedlinePointStyle().getImage();
        // just set a new style if an icon style has already been set
        if (!(oldStyle instanceof ol.style.Icon)) {
            return;
        }
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                scale: scale,
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                anchor: [
                    offsetX,
                    offsetY
                ],
                src: oldStyle.getSrc()
            })
        });
        renderer.setSymbolizers(iconStyle);
        redLineStyler.setRedlinePointStyle(iconStyle);
    },

    /**
    * @overwrite
    */
    onChooseGraphicClick: function() {
        var me = this;

        var okClickCallbackFn = function(pictureRec) {
            var renderer = me.down('gx_renderer[name=pointRenderPreview]');
            var pictureUrl = BasiGX.util.Url.getWebProjectBaseUrl() +
                me.getBackendUrls().pictureSrc.url +
                pictureRec.get('id');
            var imageValues = me.getImageAttributes();
            var imageStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [
                        imageValues[0],
                        imageValues[1]
                    ],
                    scale: imageValues[2],
                    src: pictureUrl
                })
            });
            me.setRedlinePointStyle(imageStyle);
            renderer.setSymbolizers(imageStyle);
        };

        var deleteClickCallbackFn = function() {
            Ext.toast(
                me.getViewModel().get('pointGrapicDeletedSuccessMsgText'),
                me.getViewModel().get('pointGrapicDeletedSuccessMsgTitle'),
                't'
            );
        };

        var graphicPool = Ext.create('BasiGX.view.panel.GraphicPool', {
            backendUrls: me.getBackendUrls(),
            okClickCallbackFn: okClickCallbackFn,
            deleteClickCallbackFn: deleteClickCallbackFn,
            useCsrfToken: true
        });

        var graphicPoolWin = Ext.create('Ext.window.Window', {
            title: me.getViewModel().get('graphicPoolWindowTitle'),
            constrained: true,
            items: [graphicPool]
        });
        graphicPoolWin.show();
    }

});
