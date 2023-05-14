class LocalStorage {
  private static _instance: LocalStorage
  private _storage: Storage

  private constructor() {
    this._storage = window.localStorage
  }

  static getInstance(): LocalStorage {
    if (!LocalStorage._instance) {
      LocalStorage._instance = new LocalStorage()
    }
    return LocalStorage._instance
  }

  public getItem<T>(key: string): T | null {
    const value = this._storage.getItem(key)
    if (value) {
      return JSON.parse(value) as T
    }
    return null
  }

  public setItem(key: string, value: any): void {
    this._storage.setItem(key, JSON.stringify(value))
  }

  public removeItem(key: string): void {
    this._storage.removeItem(key)
  }

  public clear(): void {
    this._storage.clear()
  }
}

export default LocalStorage
