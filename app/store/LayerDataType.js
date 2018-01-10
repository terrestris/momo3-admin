/*eslint max-len: 0*/
Ext.define('MoMo.admin.store.LayerDataType', {
    extend: 'Ext.data.Store',

    /**
     *
     */
    alias: 'store.layerdatatype',

    /**
     *
     */
    fields: [
        {name: 'type', type: 'string'},
        {name: 'display', type: 'string'}
    ],

    /**
     *
     */
    data: [
        {type: 'Vector', display: 'Vector'},
        {type: 'Raster', display: 'Raster'}
    ]
});