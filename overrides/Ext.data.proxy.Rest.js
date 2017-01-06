Ext.define('MoMo.overrides.Ext.data.proxy.Rest', {
    override: 'Ext.data.proxy.Rest',
    requires: [
        'Ext.data.proxy.Rest'
    ],

    buildUrl: function(request) {
        var me = this,
            operation = request.getOperation(),
            records = operation.getRecords(),
            record = records ? records[0] : null,
            format = me.getFormat(),
            url = me.getUrl(request),
            id,
            params;

        if (record && !record.phantom) {
            id = record.get('id');
        } else {
            id = operation.getId();
        }

        // Remove root from the URL
        if (id === 'root') {
            id = '';
        }

        if (me.getAppendId() && me.isValidId(id)) {
            if (!url.match(me.slashRe)) {
                url += '/';
            }

            url += encodeURIComponent(id);
            params = request.getParams();
            if (params) {
                delete params[me.getIdParam()];
            }
        }

        if (format) {
            if (!url.match(me.periodRe)) {
                url += '.';
            }

            url += format;
        }

        request.setUrl(url);

        // … but remember to call the superclass buildUrl so that additional
        // parameters like the cache buster string are appended.
        return Ext.data.proxy.Rest.superclass.buildUrl.apply(this, arguments);
    }
});
