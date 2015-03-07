



module.exports = {
    deriveType : function(payload) {

       if ( payload && payload.action && payload.action.type ) {
           return payload.action.type;
       }
       return null;
    },

    /**
     * Takes A_IN_P and transforms to aInP
     *
     * @param payload
     * @returns {*}
     */
    toCamelCaseFunctionName : function(text) {
        var type =text;
        var idx;


        if ( type ) {
            type = type.toLowerCase();

            while ( type.indexOf("_") > -1 ) {
                idx = type.indexOf("_");
                type = type.substring(0,idx) +  type.substring(idx+1,idx+2).toUpperCase() +  type.substring(idx+2,type.length);

            }
        }
        return type;
    }
};