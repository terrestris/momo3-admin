/**
 * TextfieldValidator Util
 *
 * This Util checks textfields and textareas to use white spaces in two cases
 * Case 1: one white space on the beginn of the textfield
 * Case 2: two or more white spaces in a string
 *
 */
Ext.define('MoMo.admin.util.TextfieldValidator', {

    statics: {
        checkForWhiteSpaces : function(val) {
            var startsWith = Ext.String.startsWith(val, ' '),
                startsWithErrMsg =
                'No whitespaces allowed at the beginning!',
                containsTwoWhitespaces = val.indexOf('  ') > -1,
                containsTwoWhitespacesErrMsg =
                    'Not more than one whitespaces allowed!';

            if(! startsWith && ! containsTwoWhitespaces) {
                return true;
            } else if(startsWith && ! containsTwoWhitespaces) {
                return startsWithErrMsg;
            } else if(!startsWith && containsTwoWhitespaces) {
                return containsTwoWhitespacesErrMsg;
            } else {
                return startsWithErrMsg
                +' '+ containsTwoWhitespacesErrMsg;
            }
        }
    }
});
