/* tslint:disable */
/* eslint-disable */
/**
*/
export function set_panic_hook(): void;
/**
*/
export class Tuner {
  free(): void;
/**
* @param {number} sample_rate
* @param {number} freq
* @param {number} motion_blur_size
* @param {boolean} filter_on
* @param {number} filter_octave
* @param {number} filter_q
* @returns {Tuner}
*/
  static new(sample_rate: number, freq: number, motion_blur_size: number, filter_on: boolean, filter_octave: number, filter_q: number): Tuner;
/**
* @param {Float32Array} input
* @returns {any}
*/
  process_input(input: Float32Array): any;
/**
* @returns {number}
*/
  get_wheel_freq(): number;
/**
* @param {boolean} filter_on
*/
  toggle_filter(filter_on: boolean): void;
/**
* @returns {any}
*/
  get_positions(): any;
/**
* @returns {number}
*/
  get_last_pitch(): number;
/**
* @param {number} wheel_frequency
* @param {boolean} filter_on
* @param {number} filter_octave
* @param {number} filter_q
*/
  update_params(wheel_frequency: number, filter_on: boolean, filter_octave: number, filter_q: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly set_panic_hook: () => void;
  readonly __wbg_tuner_free: (a: number) => void;
  readonly tuner_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly tuner_process_input: (a: number, b: number, c: number) => number;
  readonly tuner_get_wheel_freq: (a: number) => number;
  readonly tuner_toggle_filter: (a: number, b: number) => void;
  readonly tuner_get_positions: (a: number) => number;
  readonly tuner_get_last_pitch: (a: number) => number;
  readonly tuner_update_params: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
