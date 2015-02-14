/*globals require,module */
/* jshint -W097 */
"use strict";

var EventEmitter = require('events').EventEmitter;

var Store = function(pconstr,pattributes) {

    var constr;
    var attributes;

    if ( pconstr && typeof pconstr === 'function' ) {
        constr = pconstr;
    } else if ( pconstr && typeof pconstr === 'object' ) {
        attributes = pconstr;
    }

    if ( !attributes ) {
        attributes = pattributes || {};
    }

    Object.keys(attributes).forEach(function(key) {
        if ( attributes[key] !== null || attributes[key] !== undefined ) {
            this[key] = Object(attributes[key]);
        }
    }.bind(this));

    if ( constr ) {
        constr.call(this);
    }
    EventEmitter.apply(this);
    return this;
};

Store.prototype = Object.create(EventEmitter.prototype);



var StoreFactory = function(pconstr,pattributes) {
    return  new Store(pconstr,pattributes);
};


var Dispatcher = function() {

    var dispatchers = [];

    var consumers = [];

    /**
     *
     * Register the given path or type
     *
     * path can be :
     *
     * "src/Source",
     * "src/Source/Sub"
     *
     * "type/MESSAGE_TYPE"
     * "type
     *
     *  payload
     *
     *
     *
     * @param path
     * @param consumer
     */
    this.register = function(path,consumerInput) {
        var consumer = !consumerInput ? path : consumerInput;
        consumers.push(consumer);
    };



    /**
     * Dispatch the given payload
     *
     *
     *
     * @param payload
     */
    this.dispatch = function(payload) {
        consumers.forEach(function(consumer) {
            if ( consumer.onAction ) {
                consumer.onAction(payload);
            } else {
                consumer(payload);
            }
        });
    };


    /**
     * Create a click dispatcher for this el
     *
     * @param el
     */
    this.clickDispatcher = function(el) {

        dispatchers.push(new ClickDispatcher(el,this));
        return this;
    };
};

/**
 * Listens to all clicks and dispatches as needed
 *
 * @param el
 * @constructor
 */
var ClickDispatcher = function(el,mainDispatcher) {

    this.mainDispatcher = mainDispatcher;
    this.el = el;

    this.el.addEventListener("click",function(e) {
        
        var target = e.target;
        var action = target.getAttribute("dispatch-action") || target.getAttribute("data-dispatch-action");
        var source = target.getAttribute("dispatch-source")|| target.getAttribute("data-dispatch-source");
        var payload;
        var data = {};
        var attribs = target.attributes;
        var i,attrNodeName;
        
        if ( !action ) {
            return;
        }
        for ( i=0; i < attribs.length;i++ ) {
            attrNodeName = attribs[i].nodeName;
            if ( attrNodeName.indexOf("data-") === 0 ) {
                data[attrNodeName] = attribs[i].nodeValue;
            }

        }
        
        payload = {
            source : source,
            action : {
                type : action,
                data: data
            }
        };
        
        this.mainDispatcher.dispatch(payload);
    }.bind(this));


};

module.exports = {
    store : function(construct,attribs) {
        return new StoreFactory(construct,attribs);
    },
    dispatcher : function() {
        return new Dispatcher();
    },
    
    emitter : function() {
        return new EventEmitter();
    }
};
