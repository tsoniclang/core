/**
 * @tsonic/core - Type Definitions
 *
 * TypeScript type aliases for CLR/.NET runtime primitives.
 *
 * IMPORTANT: These are simple type aliases with NO runtime enforcement.
 * TypeScript treats all numeric types as `number`, bool as `boolean`, etc.
 * Tsonic enforces semantic correctness at compile time via its proof system.
 *
 * TypeScript will NOT catch type errors between int/byte/long etc.
 * Only Tsonic compilation validates numeric correctness.
 *
 * @example
 * ```typescript
 * import { int, float, bool } from "@tsonic/core/types.js";
 *
 * const age: int = 42 as int;        // Tsonic validates 42 fits in Int32
 * const temp: float = 98.6 as float; // Tsonic validates for Single
 * const isActive: bool = true;       // bool is just boolean
 * ```
 */

// Signed integer types
export type sbyte = number; // System.SByte (-128 to 127)
export type short = number; // System.Int16 (-32,768 to 32,767)
export type int = number; // System.Int32 (-2,147,483,648 to 2,147,483,647)
export type long = number; // System.Int64 (approx -9.2e18 to 9.2e18)
export type nint = number; // System.IntPtr (native int)
export type int128 = number; // System.Int128 (128-bit signed)

// Unsigned integer types
export type byte = number; // System.Byte (0 to 255)
export type ushort = number; // System.UInt16 (0 to 65,535)
export type uint = number; // System.UInt32 (0 to 4,294,967,295)
export type ulong = number; // System.UInt64 (approx 0 to 1.8e19)
export type nuint = number; // System.UIntPtr (native uint)
export type uint128 = number; // System.UInt128 (128-bit unsigned)

// Floating-point types
export type half = number; // System.Half (16-bit float)
export type float = number; // System.Single (32-bit float)
export type double = number; // System.Double (64-bit float)
export type decimal = number; // System.Decimal (128-bit decimal)

// Other primitive types
export type bool = boolean; // System.Boolean
export type char = string; // System.Char (single UTF-16 code unit)
// Tsonic enforces char must be length-1 literal or proven conversion

// Pointer type
// Represents C# unsafe pointer types (T*, void*, int*, etc.)
// Erases to unknown for type safety - requires explicit handling
export type ptr<T> = unknown;

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
 * Marker interface for C# struct types.
 *
 * Types that extend `struct` will be emitted as C# structs instead of classes.
 * This enables value semantics and stack allocation in the generated code.
 *
 * @example
 * ```typescript
 * import { struct } from "@tsonic/core/types.js";
 *
 * // This becomes a C# struct
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
 * In C#, this emits:
 * ```csharp
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
  readonly __brand: unique symbol;
}
