import { TYPE_LAB_SCHEMA_VERSION } from './type-lab-schema.js';
import { deepClone } from './type-lab-utils.js';

export const TYPE_LAB_ENGINE_VERSION = 1;
export const TYPE_LAB_STATE_VERSION = 1;

export function createTypeLabDocument(state) {
  return {
    version: TYPE_LAB_STATE_VERSION,
    schemaVersion: TYPE_LAB_SCHEMA_VERSION,
    engineVersion: TYPE_LAB_ENGINE_VERSION,
    createdAt: Date.now(),
    scene: {
      params: deepClone(state.params),
      textX: state.runtime.textX,
      textY: state.runtime.textY,
      pathPoints: deepClone(state.runtime.pathPoints),
      transformMode: state.runtime.transformMode,
      width: state.runtime.width,
      height: state.runtime.height,
      baked: Boolean(state.runtime.bakedModel),
    },
    animation: {
      keyframes: deepClone(state.runtime.keyframes),
      keyframeOptions: {
        duration: state.params.keyframeDuration,
        loop: state.params.keyframeLoop,
        pingPong: state.params.keyframePingPong,
        easing: state.params.keyframeEasing,
      },
      path: {
        enabled: state.params.pathAnimate,
        speed: state.params.pathAnimateSpeed,
        pingPong: state.params.pathAnimatePingPong,
      },
    },
  };
}

export function migrateTypeLabDocument(doc) {
  if (!doc || typeof doc !== 'object') return null;
  if (!doc.version) {
    return {
      version: TYPE_LAB_STATE_VERSION,
      schemaVersion: TYPE_LAB_SCHEMA_VERSION,
      engineVersion: TYPE_LAB_ENGINE_VERSION,
      scene: doc.scene || {},
      animation: doc.animation || { keyframes: { start: null, end: null } },
    };
  }
  return doc;
}

export function hydrateStateFromDocument(state, doc) {
  const migrated = migrateTypeLabDocument(doc);
  if (!migrated) return state;
  return {
    ...state,
    params: {
      ...state.params,
      ...(migrated.scene?.params || {}),
    },
    runtime: {
      ...state.runtime,
      textX: migrated.scene?.textX ?? state.runtime.textX,
      textY: migrated.scene?.textY ?? state.runtime.textY,
      pathPoints: Array.isArray(migrated.scene?.pathPoints) ? migrated.scene.pathPoints : state.runtime.pathPoints,
      transformMode: migrated.scene?.transformMode || state.runtime.transformMode,
      keyframes: migrated.animation?.keyframes || state.runtime.keyframes,
    },
  };
}
