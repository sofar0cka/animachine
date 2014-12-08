'use strict';

var EventEmitter = require('eventman');
var inherits = require('inherits');
var WebStorageman = require('./storages/WebStorageman');
var PageScript = require('./storages/PageScript');
var Download = require('./storages/Download');
var decorDialog = require('./decorDialog');

function Warehouseeman(opt) {

    EventEmitter.call(this);

    decorDialog(this);

    opt = opt || {};

    this._storages = [];
    this.addStorage(new PageScript());
    this.addStorage(new WebStorageman());
    this.addStorage(new Download());
    // this.addStorage(new Copy());
    this.addStorage({icon: 'hdd', tooltip: 'local file system'});
    this.addStorage({icon: 'git', tooltip: 'Git'});
    this.addStorage({icon: 'google', tooltip: 'Google Drive'});
    this.addStorage({icon: 'dropbox', tooltip: 'Dropbox'});
    this.addStorage({icon: 'history', tooltip: 'auto save'});

    this.selectStorage(this._storages[2]);
}

inherits(Warehouseeman, EventEmitter);
var p = Warehouseeman.prototype;

Object.defineProperties(p, {

    selectedStorageType: {
        get: function () {
            return this._currStorage && this._currStorage.type;
        }
    }
})

p.addStorage = function (storage) {

    storage.features = storage.features || {
        placeholder: true,
    };

    this._storages.push(storage);
    this.emit('changeStorages');
};

p.selectStorage = function (storage) {

    if (this._currStorage === storage) {
        return;
    }

    this._currStorage = storage;

    if (storage.features.placeholder) {

        am.dialogs.WIP.show();
    }

    this.emit('changeSelectedStorage');
};

p.save = function (name, data, path) {

    return this._currStorage.save(name, data, path);
};

p.load = function (name, path   ) {

    return this._currStorage.load(name, path);
};

p.mkdir = function (path) {

    return this._currStorage.mkdir(path);
};

p.dir = function (path) {

    return this._currStorage.dir(path);
};

module.exports = Warehouseeman;

