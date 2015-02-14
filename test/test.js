/*globals describe,it */
/* jshint -W097 */

"use strict";

var assert = require("assert");
var spout = require("../src/spout");


describe('store tests', function(){
    it('it should initialize constructor', function(){
        
        var store = spout.store(function() {
            this.__param = "PARAM";
        });
        
        assert.equal("PARAM",store.__param);
    });
    it('it should initialize attribs ', function(){

        var store = spout.store(function() {
            this.__param = "PARAM";
        },{
            add : function(input) {
                return input+1;
            },
            param : function() {
                return this.__param;
            }
            
        });

        assert.equal("PARAM",store.__param);
        assert.equal(2,store.add(1));
        assert.equal("PARAM",store.param());
    });
    it('it should emit', function(){

        var store = spout.store({
            setValue : function(data) {
                this.data = data;
                this.emit("change");
            },
            getData : function() {
                return this.data;
            }
            
        });
        var attrib = 0;
        store.on("change",function() {
            attrib = 10;
        });
        
        store.setValue("hey");
        assert.equal("hey",store.getData());
        assert.equal(10,attrib);
        
    });
});

/**
 * Dispatcher test
 *  
 */
describe('dispatcher tests', function() {

    it('it should register dispatchers', function(){
        
        var dispatcher = spout.dispatcher();
        var store = spout.store({
            onAction : function(act) {
                this.action = act;
            }
        });
        dispatcher.register(store);
        dispatcher.dispatch({ action: {type: "NEW_ACTION"} });
        
        assert.equal( "NEW_ACTION", store.action.action.type );
    });


    it('it should dispatch el', function(){
        
    });
});

