define( [ 'dojo/_base/declare',
          'dojo/_base/lang',
          'dojo/request',
          'dojo/promise/all',
          'dojo/Deferred',
          'JBrowse/Store/SeqFeature',
          'JBrowse/Util',
          'JBrowse/Digest/Crc32',
          'JBrowse/Model/XHRBlob',
          'JBrowse/Store/DeferredFeaturesMixin',
          './IndexedFasta/File'
        ],
        function(
            declare,
            lang,
            request,
            all,
            Deferred,
            SeqFeatureStore,
            Util,
            Crc32,
            XHRBlob,
            DeferredFeaturesMixin,
            FASTAFile
        ) {

return declare( [ SeqFeatureStore, DeferredFeaturesMixin ],
{

    /**
     * Storage backend for sequences in indexed fasta files
     * served as static text files.
     * @constructs
     */
    constructor: function(args) {
        var fastaBlob = args.fasta ||
            new XHRBlob( this.resolveUrl(
                             args.urlTemplate || 'data.fasta'
                         )
                       );

        var faiBlob = args.fai ||
            new XHRBlob( this.resolveUrl(
                             args.faiUrlTemplate || ( args.urlTemplate ? args.urlTemplate+'.fai' : 'data.fasta.fai' )
                         )
                       );
        this.index = {}

        this.fasta = new FASTAFile({
            store: this,
            data: fastaBlob,
            fai: faiBlob
        });

        this.fasta.init({
            success: lang.hitch( this,
                                 function() {
                                     this._deferred.features.resolve({success:true});
                                 }),
            failure: lang.hitch( this, '_failAllDeferred' )
        });

    },

    _getFeatures: function( query, featCallback, endCallback, errorCallback ) {
        this.fasta.fetch( this.refSeq.name, query.start, query.end, featCallback, endCallback, errorCallback );
    }

});
});
