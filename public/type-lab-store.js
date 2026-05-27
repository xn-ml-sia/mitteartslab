import { deepClone } from './type-lab-utils.js';

export function createTypeLabStore(initialState) {
  let state = deepClone(initialState);
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(updater) {
    const next = typeof updater === 'function' ? updater(state) : updater;
    state = next;
    listeners.forEach((listener) => listener(state));
  }

  function patch(patchObject) {
    if (typeof patchObject === 'function') {
      setState((prev) => ({ ...prev, ...patchObject(prev) }));
      return;
    }
    setState((prev) => ({ ...prev, ...patchObject }));
  }

  function patchParams(paramsPatch) {
    if (typeof paramsPatch === 'function') {
      setState((prev) => ({ ...prev, params: { ...prev.params, ...paramsPatch(prev.params, prev) } }));
      return;
    }
    setState((prev) => ({ ...prev, params: { ...prev.params, ...paramsPatch } }));
  }

  function patchRuntime(runtimePatch) {
    if (typeof runtimePatch === 'function') {
      setState((prev) => ({ ...prev, runtime: { ...prev.runtime, ...runtimePatch(prev.runtime, prev) } }));
      return;
    }
    setState((prev) => ({ ...prev, runtime: { ...prev.runtime, ...runtimePatch } }));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    getState,
    setState,
    patch,
    patchParams,
    patchRuntime,
    subscribe,
  };
}
