/* tslint:disable */
/* eslint-disable */
/**
*/
export function set_panic_hook(): void;
/**
*/
export class Wheel {
  free(): void;
/**
* @param {number} freq
* @param {number} motion_blur_size
* @returns {Wheel}
*/
  static new(freq: number, motion_blur_size: number): Wheel;
/**
* @param {number} timestamp_ms
*/
  update_position(timestamp_ms: number): void;
/**
* @param {number} freq
*/
  set_freq(freq: number): void;
/**
* @returns {number}
*/
  get_freq(): number;
/**
* @returns {Float32Array}
*/
  get_position_buffer(): Float32Array;
/**
* @returns {number}
*/
  get_position(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wheel_free: (a: number) => void;
  readonly wheel_new: (a: number, b: number) => number;
  readonly wheel_update_position: (a: number, b: number) => void;
  readonly wheel_set_freq: (a: number, b: number) => void;
  readonly wheel_get_freq: (a: number) => number;
  readonly wheel_get_position_buffer: (a: number, b: number) => void;
  readonly wheel_get_position: (a: number) => number;
  readonly set_panic_hook: () => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
