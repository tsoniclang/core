/**
 * @tsonic/core - Type Definitions
 *
 * TypeScript type aliases for Tsonic source primitive intent.
 *
 * IMPORTANT: These are simple type aliases with NO runtime enforcement.
 * TypeScript treats all numeric types as `number`, bool as `boolean`, etc.
 * Tsonic enforces semantic correctness at compile time through TSTS extension
 * facts and target capability validation.
 *
 * TypeScript will NOT catch type errors between int/byte/long etc.
 * Only Tsonic compilation validates numeric correctness.
 *
 * @example
 * ```typescript
 * import { int, float, bool } from "@tsonic/core/types.js";
 *
 * const age: int = 42 as int;        // Tsonic validates int32 range
 * const temp: float = 98.6 as float; // Tsonic validates float32 intent
 * const isActive: bool = true;       // bool is just boolean
 * ```
 */

// JavaScript value surface
export type JsPrimitive = string | number | boolean | bigint | symbol;
export type JsValue = object | JsPrimitive | null;

// Signed integer types
export type sbyte = number; // signed 8-bit integer intent
export type short = number; // signed 16-bit integer intent
export type int = number; // signed 32-bit integer intent
export type long = number; // signed 64-bit integer intent
export type nint = number; // native-width signed integer intent
export type int128 = number; // signed 128-bit integer intent

// Unsigned integer types
export type byte = number; // unsigned 8-bit integer intent
export type ushort = number; // unsigned 16-bit integer intent
export type uint = number; // unsigned 32-bit integer intent
export type ulong = number; // unsigned 64-bit integer intent
export type nuint = number; // native-width unsigned integer intent
export type uint128 = number; // unsigned 128-bit integer intent

// Floating-point types
export type half = number; // 16-bit floating-point intent
export type float = number; // 32-bit floating-point intent
export type double = number; // 64-bit floating-point intent
export type decimal = number; // decimal floating-point intent

// Other primitive types
export type bool = boolean; // boolean primitive intent
export type char = string; // single UTF-16 code-unit character intent
// Tsonic enforces char must be length-1 literal or proven conversion

// Pointer type
// Represents target pointer types when a selected target supports them.
// Explicit branded support type - requires explicit handling
declare const __tsonicPtrBrand: unique symbol;
export type ptr<T> = {
  readonly [__tsonicPtrBrand]: T;
};

// Function pointer type for targets that expose signature-only callbacks.
// Explicit branded support type - not callable as a normal JS function.
declare const __tsonicFnPtrBrand: unique symbol;
export type fnptr<
  Args extends readonly unknown[],
  Result,
  CallingConventions extends readonly string[] = readonly []
> = {
  readonly [__tsonicFnPtrBrand]: {
    readonly args: Args;
    readonly result: Result;
    readonly callingConventions: CallingConventions;
  };
};

// ============================================================================
// Parameter Passing Modifiers
// ============================================================================

/**
 * Marks a parameter as `out` - callee sets the value.
 * Use with `as out<T>` at call sites.
 *
 * @example
 * ```typescript
 * import { int, out } from "@tsonic/core/types.js";
 *
 * let value: int = 0;
 * dict.tryGetValue("key", value as out<int>);
 * // value now contains the result
 * ```
 */
export type out<T> = T;

/**
 * Marks a parameter as `ref` - callee can read and modify.
 * Use with `as ref<T>` at call sites.
 *
 * @example
 * ```typescript
 * import { int, ref } from "@tsonic/core/types.js";
 *
 * let count: int = 10;
 * increment(count as ref<int>);
 * // count is now modified
 * ```
 */
export type ref<T> = T;

/**
 * Marks a parameter as `in` - read-only reference (optimization for large structs).
 * Use with `as inref<T>` at call sites.
 * Named `inref` because `in` is a TypeScript reserved keyword.
 *
 * @example
 * ```typescript
 * import { inref } from "@tsonic/core/types.js";
 *
 * const data: LargeStruct = { ... };
 * process(data as inref<LargeStruct>);
 * ```
 */
export type inref<T> = T;

// ============================================================================
// Value Type Markers
// ============================================================================

/**
 * Marker interface for source value types.
 *
 * Types that extend `struct` request value-type lowering on targets that support it.
 * This enables value semantics and stack allocation in the generated code.
 *
 * @example
 * ```typescript
 * import { struct } from "@tsonic/core/types.js";
 *
 * // This requests target value-type lowering
 * export interface Point extends struct {
 *   x: number;
 *   y: number;
 * }
 *
 * // Use as generic constraint for nullable value types
 * function wrap<T extends struct>(value: T | null): T | null {
 *   return value;
 * }
 * ```
 *
 * Target lowering example:
 * ```text
 * public struct Point {
 *   public double x { get; set; }
 *   public double y { get; set; }
 * }
 *
 * // With constraint: where T : struct
 * T? Wrap<T>(T? value) where T : struct => value;
 * ```
 */
export interface struct {
  readonly __brand?: unique symbol;
}
