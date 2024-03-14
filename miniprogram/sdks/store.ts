class Store<T extends Record<string, any>> {
  private state: T;
  private listeners: Record<string, Function[]>;

  constructor(initialState: T) {
    this.state = initialState || {} as T;
    this.listeners = {};
  }

  getState() {
    return this.state;
  }

  setState(value: Partial<T>) {
    this.state = { ...this.state, ...value };
  }

  dispatch(key: string, value: any) {
    // @ts-ignore
    this.state[key] = value;
    // 如果存在监听此字段的函数，则触发它们
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => {
        listener(value);
      });
    }
  }

  subscribeKey(key: string, listener: Function) {
    const listeners = this.listeners[key];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return () => {
      this.listeners[key] = listeners.filter((l) => l !== listener);
    };
  }
}

export default Store;