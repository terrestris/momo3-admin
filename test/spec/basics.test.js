describe('Basic requirements of momo', function() {
    describe('Libraries are loaded & available in testsuite', function() {
        describe('ExtJS', function() {
            it('is defined', function() {
                expect(Ext).not.to.be(undefined);
            });
        });
        describe('BasiGX', function() {
            it('is defined', function() {
                expect(BasiGX).not.to.be(undefined);
            });
        });
    });
    // describe('The Ext.loader is correctly configured', function() {
    //     it('is enabled', function () {
    //         var isEnabled = Ext.Loader.getConfig('enabled');
    //         expect(isEnabled).to.be(true);
    //     });
    //     it('has a path configured for BasiGX', function () {
    //         var paths = Ext.Loader.getConfig('paths');
    //         expect('BasiGX' in paths).to.be(true);
    //         expect(paths['BasiGX']).not.to.be(undefined);
    //     });
    // });
});
