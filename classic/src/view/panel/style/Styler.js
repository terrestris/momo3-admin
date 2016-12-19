Ext.define('MoMo.admin.view.panel.style.Styler', {
    extend: 'Ext.panel.Panel',
    xtype: 'momo-panel-style-styler',

    requires: [
        'MoMo.admin.view.panel.style.StylerController',
        'MoMo.admin.view.panel.style.StylerModel'
    ],

    controller: 'panel.style.styler',
    viewModel: {
        type: 'panel.style.styler'
    },

    bodyStyle: {
        background: '#f6f6f6'
    },

    config: {

        /**
         * @type {String} layerName The fully qualified layername that this SLD
         *     styler will style, e.g. 'namespace:featuretype'.
         */
        layerName: null,

        /**
         * @type {String} layerUrl The url to query for the current style of the
         *     layer.
         */
        layerUrl: '/geoserver.action',

        /**
         * @type {String} wmsVersion The version of the WMS to use.
         */
        wmsVersion: '1.1.1',

        /**
         * @type {String} dspLayerName An arbitrary string to be displayed to
         *     the user as the layer name. If not set, this will have the same
         *     value as #layerName.
         */
        dspLayerName: null
    },

    /**
     * @type {String} geometryType The geometry type of the remote layer.
     */
    geometryType: null,

    listeners: {
        layerNameChange: 'checkRebuildUserInterface'
    },

    /**
     * Fired when the layername changes.
     *
     * @param {String} layerName The new layername or null if it was not valid.
     * @event layerNameChange
     */

    /**
     * Initializes the SLD styler. Will check if the required configuration
     * option `layerName` is passed and valid.
     */
    initComponent: function() {
        var me = this;
        me.callParent();
        me.on('layerNameChange', me.checkDspLayerName, me);
        if (!me.validLayerName(me.getLayerName())) {
            me.getController().markErrored('missingOrInvalidLayerName');
        }
        me.checkDspLayerName(me.getLayerName());
    },

    /**
     * Checks if the passed name is valid, e.g. not falsy and contains a colon.
     *
     * @param {String} name The name to test for validity.
     * @return {Boolean} Whether the name is valid.
     */
    validLayerName: function(name) {
        var isValid = false;
        if (name && (/:/).test(name)) {
            isValid = true;
        }
        return isValid;
    },

    /**
     * The applier for the layerName configuration. Will fire the
     * event #layerNameChange and will also validate the new value.
     *
     * @param {String} newVal The new value for the configuration `layerName`.
     * @return {String} The new value for the configuration that will be stored,
     *     If the passed newVal was valid, it will be returned, if isn't, we'll
     *     return `null`.
     */
    applyLayerName: function(newVal) {
        var me = this;
        if (!me.validLayerName(newVal)) {
            Ext.log.warn(me.getViewModel().get('missingOrInvalidLayerName'));
            me.fireEvent('layerNameChange', null);
            return null;
        }
        me.fireEvent('layerNameChange', newVal);
        return newVal;
    },

    /**
     * The applier for the dspLayerName configuration. Will keep the viewModel
     * in sync.
     *
     * @param {String} newVal The new value for the configuration
     *     `dspLayerName`.
     */
    applyDspLayerName: function(newVal) {
        var useVal = newVal ? newVal : this.getLayerName();
        this.getViewModel().set('dspLayerName', useVal);
        return newVal;
    },

    /**
     * Called when the #layerNameChange event occurs, this method will check
     * if we have a #dspLayerName, and if not, we'll set the #dspLayerName to
     * the value of #layerName.
     *
     * @param {String} layerName The fully qualified name of the layer, e.g.
     *     'namespace:featuretype'.
     */
    checkDspLayerName: function(layerName) {
        var valToDsp = this.getDspLayerName();
        if (!valToDsp) {
            valToDsp = layerName;
        }
        this.setDspLayerName(valToDsp);
    }

});
