import { Store } from './AbstractStore'

interface Map extends Object {
  currentObjectID: string | null
}

class MapStore extends Store<Map> {
  protected data(): Map {
    return {
      currentObjectID: null,
    }
  }

  updateObjectID(objectID: string) {
    this.state.currentObjectID = objectID
  }
}

export default new MapStore()
