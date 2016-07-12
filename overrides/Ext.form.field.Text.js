Ext.define('Override.Ext.form.field.Text', {
    override: 'Ext.form.field.Text',

    /*
     * Binding needs a getter to update the property, but the property
     * emptyText has no default setter method.
     */
    setEmptyText: function(emptyText) {
        this.emptyText = emptyText;
        this.applyEmptyText();
    }

});
