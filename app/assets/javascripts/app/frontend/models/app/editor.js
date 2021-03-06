class Editor extends Item {

  constructor(json_obj) {
    super(json_obj);
    if(!this.notes) {
      this.notes = [];
    }
    if(!this.data) {
      this.data = {};
    }
  }

  mapContentToLocalProperties(contentObject) {
    super.mapContentToLocalProperties(contentObject)
    this.url = contentObject.url;
    this.name = contentObject.name;
    this.data = contentObject.data || {};
    this.default = contentObject.default;
    this.systemEditor = contentObject.systemEditor;
  }

  structureParams() {
    var params = {
      url: this.url,
      name: this.name,
      data: this.data,
      default: this.default,
      systemEditor: this.systemEditor
    };

    _.merge(params, super.structureParams());
    return params;
  }

  referenceParams() {
    var references = _.map(this.notes, function(note){
      return {uuid: note.uuid, content_type: note.content_type};
    })

    return references;
  }

  addItemAsRelationship(item) {
    if(item.content_type == "Note") {
      if(!_.find(this.notes, item)) {
        this.notes.push(item);
      }
    }
    super.addItemAsRelationship(item);
  }

  removeItemAsRelationship(item) {
    if(item.content_type == "Note") {
      _.pull(this.notes, item);
    }
    super.removeItemAsRelationship(item);
  }

  removeAllRelationships() {
    super.removeAllRelationships();
    this.notes = [];
  }

  locallyClearAllReferences() {
    super.locallyClearAllReferences();
    this.notes = [];
  }

  potentialItemOfInterestHasChangedItsUUID(newItem, oldUUID, newUUID) {
    if(newItem.content_type === "Note" && _.find(this.notes, {uuid: oldUUID})) {
      _.pull(this.notes, {uuid: oldUUID});
      this.notes.push(newItem);
    }
  }

  allReferencedObjects() {
    return this.notes;
  }

  toJSON() {
    return {uuid: this.uuid}
  }

  get content_type() {
    return "SN|Editor";
  }

  setData(key, value) {
    var dataHasChanged = JSON.stringify(this.data[key]) !== JSON.stringify(value);
    if(dataHasChanged) {
      this.data[key] = value;
      return true;
    }
    return false;
  }

  dataForKey(key) {
    return this.data[key] || {};
  }
}
