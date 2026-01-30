/**
 * @tsonic/core - Language Intrinsics
 *
 * TypeScript declarations for C# language-level intrinsics.
 * These compile to C# keywords and special syntax.
 *
 * All intrinsics are lowercase to match C# keyword style.
 *
 * @example
 * ```typescript
 * import { stackalloc, sizeof, nameof, defaultof, trycast } from "@tsonic/core/lang.js";
 * import { int, Span } from "@tsonic/core/types.js";
 *
 * const buffer: Span<int> = stackalloc<int>(100);
 * const size: int = sizeof<int>();
 * const name: string = nameof(myVariable);
 * const zero: int = defaultof<int>();
 * const person = trycast<Person>(obj);
 * ```
 */

import { int } from "./types.js";

// ============================================================================
// Memory Intrinsics
// ============================================================================

/**
 * Allocates memory on the stack.
 *
 * TypeScript: `stackalloc<int>(100)`
 * C#: `stackalloc int[100]`
 *
 * Returns a Span<T> pointing to stack-allocated memory.
 * The memory is automatically freed when the scope exits.
 *
 * @example
 * ```typescript
 * import { stackalloc } from "@tsonic/core/lang.js";
 * import { int, Span } from "@tsonic/core/types.js";
 *
 * const buffer: Span<int> = stackalloc<int>(256);
 * buffer[0] = 42;
 * ```
 *
 * In C#, this emits:
 * ```csharp
 * Span<int> buffer = stackalloc int[256];
 * buffer[0] = 42;
 * ```
 */
export declare function stackalloc<T>(size: int): Span<T>;

// ============================================================================
// Type Intrinsics
// ============================================================================

/**
 * Returns the size in bytes of a type.
 *
 * TypeScript: `sizeof<int>()`
 * C#: `sizeof(int)`
 *
 * Only valid for unmanaged types (primitives, structs with no reference fields).
 *
 * @example
 * ```typescript
 * import { sizeof } from "@tsonic/core/lang.js";
 * import { int, long } from "@tsonic/core/types.js";
 *
 * const intSize: int = sizeof<int>();     // 4
 * const longSize: int = sizeof<long>();   // 8
 * ```
 *
 * In C#, this emits:
 * ```csharp
 * int intSize = sizeof(int);   // 4
 * int longSize = sizeof(long); // 8
 * ```
 */
export declare function sizeof<T>(): int;

/**
 * Returns the default value for a type.
 *
 * TypeScript: `defaultof<int>()`
 * C#: `default(int)`
 *
 * For value types, returns the zero value.
 * For reference types, returns null.
 *
 * @example
 * ```typescript
 * import { defaultof } from "@tsonic/core/lang.js";
 * import { int, bool } from "@tsonic/core/types.js";
 *
 * const zero: int = defaultof<int>();         // 0
 * const falseBool: bool = defaultof<bool>();  // false
 * const nullRef = defaultof<Person>();        // null
 * ```
 *
 * In C#, this emits:
 * ```csharp
 * int zero = default(int);         // 0
 * bool falseBool = default(bool);  // false
 * Person? nullRef = default;       // null
 * ```
 */
export declare function defaultof<T>(): T;

// ============================================================================
// Symbol Intrinsics
// ============================================================================

/**
 * Returns the name of a symbol as a string.
 *
 * TypeScript: `nameof(myVariable)`
 * C#: `nameof(myVariable)`
 *
 * Useful for refactoring-safe string literals.
 *
 * @example
 * ```typescript
 * import { nameof } from "@tsonic/core/lang.js";
 *
 * const name = nameof(myVariable);  // "myVariable"
 * const prop = nameof(person.name); // "name"
 * ```
 *
 * In C#, this emits:
 * ```csharp
 * string name = nameof(myVariable);  // "myVariable"
 * string prop = nameof(person.name); // "name"
 * ```
 */
export declare function nameof(expression: unknown): string;

// ============================================================================
// Cast Intrinsics
// ============================================================================

/**
 * Safe cast - returns T or null if cast fails.
 *
 * TypeScript: `trycast<Person>(obj)`
 * C#: `obj as Person`
 *
 * Unlike `x as T` type assertion which throws on failure (C# `(T)x`),
 * this returns null if the cast is not valid.
 *
 * @example
 * ```typescript
 * import { trycast } from "@tsonic/core/lang.js";
 *
 * const person = trycast<Person>(unknownObj);
 * if (person !== null) {
 *   console.log(person.name);
 * }
 * ```
 *
 * In C#, this emits:
 * ```csharp
 * Person? person = unknownObj as Person;
 * if (person != null) {
 *   Console.WriteLine(person.name);
 * }
 * ```
 */
export declare function trycast<T>(value: unknown): T | null;

/**
 * Compile-time-only interface view.
 *
 * This is NOT a runtime cast. The compiler must erase this call before emitting C#.
 *
 * Primary use: treat a value as a CLR interface/nominal type for TypeScript type checking,
 * without introducing runtime casts in emitted C# (important for EF Core precompilation).
 *
 * @example
 * ```ts
 * import { asinterface } from "@tsonic/core/lang.js";
 * import type { IQueryable } from "@tsonic/dotnet/System.Linq.js";
 *
 * const q = asinterface<IQueryable<User>>(db.Users);
 * // q is typed as IQueryable<User> in TS, but emits without a cast in C#.
 * ```
 */
export declare function asinterface<T>(value: unknown): T;

/**
 * Compile-time-only type selection marker.
 *
 * This is NOT a runtime type test. The compiler must erase this call before emitting C#.
 *
 * Primary use: specialize a single TypeScript overload implementation into one CLR method
 * per signature (e.g., overriding a protected virtual overload family).
 *
 * @example
 * ```ts
 * import { istype } from "@tsonic/core/lang.js";
 * import type { int } from "@tsonic/core/types.js";
 *
 * // Overload signatures
 * Foo(x: int): int;
 * Foo(x: string): int;
 *
 * // Single implementation (compile-time specialized)
 * Foo(p0: unknown): unknown {
 *   if (istype<int>(p0)) return p0 + 1;
 *   if (istype<string>(p0)) return p0.length;
 *   throw new Error("unreachable");
 * }
 * ```
 */
export declare function istype<T>(value: unknown): value is T;

// ============================================================================
// Extension Method Intrinsics
// ============================================================================

/**
 * Marks the receiver parameter of a C# extension method.
 *
 * Use as a wrapper for the FIRST parameter type of a static function.
 * The compiler emits `this` on that parameter.
 *
 * @example
 * ```typescript
 * import type { thisarg } from "@tsonic/core/lang.js";
 * import type { IEnumerable } from "@tsonic/dotnet/System.Collections.Generic.js";
 *
 * export function where<TSource>(
 *   source: thisarg<IEnumerable<TSource>>,
 *   predicate: (x: TSource) => boolean
 * ): IEnumerable<TSource> {
 *   throw new Error("not implemented");
 * }
 * ```
 */
export type thisarg<T> = T;

// ============================================================================
// Span type (for stackalloc return type)
// ============================================================================

/**
 * A contiguous region of memory.
 * Used as the return type of stackalloc.
 */
export interface Span<T> {
  readonly Length: int;
  [index: number]: T;
}
