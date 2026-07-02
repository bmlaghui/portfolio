/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 *
 * Patch: utilities.js was published empty in @angular-devkit/core 21.2.x
 * Source: https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/core/src/workspace/json/utilities.ts
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVirtualAstObject = createVirtualAstObject;

const json_1 = require("../../json");

function createVirtualAstObject(root, options = {}) {
  const reporter = (path, target, oldValue, newValue) => {
    if (!options.listener) {
      return;
    }
    if (oldValue === newValue || JSON.stringify(oldValue) === JSON.stringify(newValue)) {
      return;
    }
    if (Array.isArray(target)) {
      options.listener(path.slice(0, -1), target);
    } else {
      options.listener(path, newValue);
    }
  };

  return create(
    Array.isArray(root) ? [...root] : { ...root },
    [],
    reporter,
    new Set(options.exclude),
    options.include?.length ? new Set(options.include) : undefined,
  );
}

function create(obj, path, reporter, excluded = new Set(), included) {
  return new Proxy(obj, {
    getOwnPropertyDescriptor(target, p) {
      if (excluded.has(p) || (included && !included.has(p))) {
        return undefined;
      }
      return Reflect.getOwnPropertyDescriptor(target, p);
    },
    has(target, p) {
      if (typeof p === 'symbol' || excluded.has(p)) {
        return false;
      }
      return Reflect.has(target, p);
    },
    get(target, p) {
      if (excluded.has(p) || (included && !included.has(p))) {
        return undefined;
      }
      const value = Reflect.get(target, p);
      if (typeof p === 'symbol') {
        return value;
      }
      if ((json_1.isJsonObject(value) && !(value instanceof Map)) || Array.isArray(value)) {
        return create(value, [...path, p], reporter);
      } else {
        return value;
      }
    },
    set(target, p, value) {
      if (excluded.has(p) || (included && !included.has(p))) {
        return false;
      }
      if (value === undefined) {
        return this.deleteProperty?.(target, p) ?? false;
      }
      if (typeof p === 'symbol') {
        return Reflect.set(target, p, value);
      }
      const existingValue = getCurrentValue(target, p);
      if (Reflect.set(target, p, value)) {
        reporter([...path, p], target, existingValue, value);
        return true;
      }
      return false;
    },
    deleteProperty(target, p) {
      if (excluded.has(p)) {
        return false;
      }
      if (typeof p === 'symbol') {
        return Reflect.deleteProperty(target, p);
      }
      const existingValue = getCurrentValue(target, p);
      if (Reflect.deleteProperty(target, p)) {
        reporter([...path, p], target, existingValue, undefined);
        return true;
      }
      return true;
    },
    defineProperty(target, p, attributes) {
      if (typeof p === 'symbol') {
        return Reflect.defineProperty(target, p, attributes);
      }
      return false;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(
        (p) => !excluded.has(p) && (!included || included.has(p)),
      );
    },
  });
}

function getCurrentValue(target, property) {
  if (Array.isArray(target) && isFinite(+property)) {
    return target[+property];
  }
  if (target && property in target) {
    return target[property];
  }
  return undefined;
}
