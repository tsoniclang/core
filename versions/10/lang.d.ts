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

import { int, type JsValue } from "./types.js";

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
export declare function nameof(expression: JsValue): string;

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
export declare function trycast<T>(value: JsValue): T | null;

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
export declare function asinterface<T>(value: JsValue): T;

/**
 * Makes a CLR interface type implementable in TypeScript without requiring
 * internal `__tsonic_iface_*` nominal brand fields.
 *
 * Use ONLY in `implements` clauses.
 *
 * @example
 * ```ts
 * import type { Interface } from "@tsonic/core/lang.js";
 * import type { IDesignTimeDbContextFactory } from "@tsonic/efcore/Microsoft.EntityFrameworkCore.Design.js";
 *
 * export class MyFactory implements Interface<IDesignTimeDbContextFactory<MyDbContext>> {
 *   CreateDbContext(_args: string[]): MyDbContext {
 *     return new MyDbContext();
 *   }
 * }
 * ```
 */
export type Interface<T> = {
  [K in keyof T as K extends `__tsonic_iface_${string}` ? never : K]: T[K];
};

/**
 * Compile-time-only field marker.
 *
 * By default, Tsonic emits TypeScript class properties as C# auto-properties.
 * Use `field<T>` to force emission as a C# field instead.
 *
 * This is a type-level marker only and is erased for typing (`field<T> = T`).
 *
 * @example
 * ```ts
 * import type { field } from "@tsonic/core/lang.js";
 *
 * export class User {
 *   private email: field<string> = "";
 * }
 * ```
 *
 * Emits:
 * ```csharp
 * class User
 * {
 *     private string email = "";
 * }
 * ```
 */
export type field<T> = T;

/**
 * Parameter passing modifiers (call-site markers).
 *
 * These are compile-time-only intrinsics. The compiler must erase them and emit
 * the corresponding C# argument modifiers: `out`, `ref`, `in`.
 *
 * These are *not* runtime functions.
 *
 * @example
 * ```ts
 * import { defaultof, out } from "@tsonic/core/lang.js";
 *
 * let value = defaultof<int>();
 * if (dict.TryGetValue("key", out(value))) {
 *   // value is assigned by the call
 * }
 * ```
 */
export declare function out<T>(value: T): T;

/**
 * Compile-time-only `ref` argument marker (emits `ref x`).
 */
export declare function ref<T>(value: T): T;

/**
 * Compile-time-only `in` argument marker (emits `in x`).
 *
 * Named `inref` because `in` is a TypeScript reserved keyword.
 */
export declare function inref<T>(value: T): T;

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
 * import type { int, JsValue } from "@tsonic/core/types.js";
 *
 * // Overload signatures
 * Foo(x: int): int;
 * Foo(x: string): int;
 *
 * // Single implementation (compile-time specialized)
 * Foo(p0: JsValue): int {
 *   if (istype<int>(p0)) return p0 + 1;
 *   if (istype<string>(p0)) return p0.length;
 *   throw new Error("unreachable");
 * }
 * ```
 */
export declare function istype<T extends JsValue>(value: JsValue): value is T;

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
// Sticky Extension Scopes (used by generated bindings)
// ============================================================================

type __TsonicUnionToIntersection<T> =
  (T extends T ? (k: T) => void : never) extends (k: infer I) => void ? I : never;

type __TsonicExtMapOf<T> = T extends { __tsonic_ext?: infer M } ? M : {};

type __TsonicExtApplierUnion<T> = __TsonicExtMapOf<T>[keyof __TsonicExtMapOf<T>];

type __TsonicApplyApplier<TApplier, TShape> =
  TApplier extends { __tsonic_type: infer TResult }
    ? TResult
    : never;

type __TsonicApplyAllAppliers<TReceiver, TShape> =
  [__TsonicExtApplierUnion<TReceiver>] extends [never]
    ? {}
    : __TsonicUnionToIntersection<
      __TsonicExtApplierUnion<TReceiver> extends infer A
        ? A extends A
          ? __TsonicApplyApplier<A, TShape>
          : never
        : never
    >;

type __TsonicExtCarrier<TReceiver> =
  TReceiver extends { __tsonic_ext?: infer M } ? { __tsonic_ext?: M } : {};

/**
 * Rewrap a return shape with the extension scopes that were in scope on the receiver.
 *
 * This is used by generated `ExtensionMethods_*` typings so fluent chains keep the same
 * extension namespaces "sticky" (similar to C# `using` semantics).
 *
 * This is compile-time-only. There is no runtime behavior.
 */
export type Rewrap<TReceiver, TNewShape> =
  TNewShape extends null | undefined ? TNewShape
  : TNewShape extends void ? void
  : TNewShape & __TsonicExtCarrier<TReceiver> & __TsonicApplyAllAppliers<TReceiver, TNewShape>;



// ============================================================================
// Attribute Intrinsics
// ============================================================================

/**
 * Compiler-only attribute API for Tsonic.
 *
 * Design goals:
 * - Clean, consistent, "compiler-grade" surface area.
 * - Fully type-safe selection of targets (type / ctor / method / property).
 * - Attributes are represented as:
 *   - A constructor reference (e.g., ObsoleteAttribute)
 *   - Optional ctor args (typed via ConstructorParameters)
 * - Optional helper `A.attr(...)` to build an attribute descriptor (also typed).
 *
 * Runtime note:
 * This module is expected to be erased/ignored by the compiler pipeline.
 */

/** A class constructor type. */
export type Ctor<T = object, Args extends readonly JsValue[] = readonly JsValue[]> = new (
  ...args: Args
) => T;

/** Any class constructor, preserving the concrete constructor signature via generics. */
export type AnyCtor<T = object> = new (...args: never[]) => T;

/** Any attribute class constructor. */
export type AttributeCtor = AnyCtor<object>;

/**
 * C# attribute target specifiers (the `target:` prefix in `[target: Attr]`).
 *
 * @example
 * ```ts
 * import { attributes as A, AttributeTargets } from "@tsonic/core/lang.js";
 *
 * class Native {
 *   foo(): boolean { return true; }
 * }
 *
 * A<Native>()
 *   .method(x => x.foo)
 *   .target(AttributeTargets.return)
 *   .add(MarshalAsAttribute, UnmanagedType.Bool);
 * ```
 *
 * Emits C#:
 * ```csharp
 * [return: MarshalAs(UnmanagedType.Bool)]
 * public bool foo() { ... }
 * ```
 */
export interface AttributeTargets {
  readonly assembly: "assembly";
  readonly module: "module";
  readonly type: "type";
  readonly method: "method";
  readonly property: "property";
  readonly field: "field";
  readonly event: "event";
  readonly param: "param";
  readonly return: "return";
}

/**
 * Value-level constants for `AttributeTarget`.
 *
 * Note: This module is compile-time only; Tsonic erases these references.
 */
export declare const AttributeTargets: AttributeTargets;

/** Union of valid attribute target strings. */
export type AttributeTarget = AttributeTargets[keyof AttributeTargets];

/**
 * Extract constructor parameters across multiple overloads.
 *
 * TypeScript's built-in ConstructorParameters<C> collapses overloads to the
 * last signature, which makes attribute ctor typing unusably strict for many
 * .NET attributes.
 */
export type OverloadedConstructorParameters<C extends AttributeCtor> =
  C extends {
    new (...args: infer A1): object;
    new (...args: infer A2): object;
    new (...args: infer A3): object;
    new (...args: infer A4): object;
    new (...args: infer A5): object;
  }
    ? A1 | A2 | A3 | A4 | A5
    : C extends {
          new (...args: infer A1): object;
          new (...args: infer A2): object;
          new (...args: infer A3): object;
          new (...args: infer A4): object;
        }
      ? A1 | A2 | A3 | A4
      : C extends {
            new (...args: infer A1): object;
            new (...args: infer A2): object;
            new (...args: infer A3): object;
          }
        ? A1 | A2 | A3
        : C extends {
              new (...args: infer A1): object;
              new (...args: infer A2): object;
            }
          ? A1 | A2
          : C extends { new (...args: infer A): object }
            ? A
            : never;

/** Attribute application (constructor + ctor arguments). */
export interface AttributeDescriptor<C extends AttributeCtor = AttributeCtor> {
  readonly kind: "attribute";
  readonly ctor: C;
  readonly args: OverloadedConstructorParameters<C>;
}

/** Keys of T whose values are callable. */
export type MethodKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: infer _Args) => infer _Result
    ? K
    : never;
}[keyof T];

/** Keys of T whose values are NOT callable (i.e., "properties"). */
export type PropertyKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: infer _Args) => infer _Result
    ? never
    : K;
}[keyof T];

/**
 * Inferred "method value type" from a method selector.
 * The selector must resolve to a function-valued member on T.
 */
export type SelectedMethodValue<T> = Extract<T[keyof T], Function>;

export interface TypeAttributeBuilder<T>
  extends AttributeTargetBuilder<"type"> {
  /** Attach attributes to the constructor. */
  readonly ctor: AttributeTargetBuilder<"method">;

  /**
   * Select a method to annotate.
   *
   * Example:
   *   A<User>().method(u => u.save).add(TransactionAttribute);
   *   A<IUser>().method(u => u.Save).add(TransactionAttribute);
   */
  method<K extends MethodKeys<T>>(
    selector: (t: T) => T[K]
  ): AttributeTargetBuilder<"method" | "return">;

  /**
   * Select a property to annotate.
   *
   * Example:
   *   A<User>().prop(u => u.name).add(JsonPropertyNameAttribute, "name");
   *   A<IUser>().prop(u => u.Name).add(JsonPropertyNameAttribute, "name");
   */
  prop<K extends PropertyKeys<T>>(
    selector: (t: T) => T[K]
  ): AttributeTargetBuilder<"property" | "field">;
}

export interface FunctionAttributeBuilder {
  add<C extends AttributeCtor>(
    ctor: C,
    ...args: OverloadedConstructorParameters<C>
  ): void;
  add<C extends AttributeCtor>(descriptor: AttributeDescriptor<C>): void;
}

/**
 * Target builder that supports adding attributes.
 * Supports two canonical forms:
 *   - add(AttrCtor, ...args)
 *   - add(A.attr(AttrCtor, ...args))
 */
export interface AttributeTargetBuilder<
  TAllowedTargets extends AttributeTarget = AttributeTarget,
> {
  /**
   * Add a C# attribute target specifier.
   *
   * @example
   * ```ts
 * A<User>()
   *   .prop(x => x.name)
   *   .target(AttributeTargets.field)
   *   .add(NonSerializedAttribute);
   * ```
   *
   * Emits C#:
   * ```csharp
   * [field: NonSerialized]
   * public string name { get; set; }
   * ```
   */
  target(target: TAllowedTargets): AttributeTargetBuilder<TAllowedTargets>;

  /**
   * Add an attribute by constructor + arguments.
   *
   * Example:
   *   A<Config>().add(ObsoleteAttribute, "Will be removed in v2");
   */
  add<C extends AttributeCtor>(
    ctor: C,
    ...args: OverloadedConstructorParameters<C>
  ): void;

  /**
   * Add an attribute descriptor produced by A.attr(...).
   *
   * Example:
   *   A<Config>().add(A.attr(ObsoleteAttribute, "Will be removed in v2"));
   */
  add<C extends AttributeCtor>(descriptor: AttributeDescriptor<C>): void;
}

/**
 * The main entrypoint.
 *
 * Usage:
 *   import { attributes as A } from "@tsonic/core/lang.js";
 *
 *   class Config {}
 *   A<Config>().add(SerializableAttribute);
 *   A<Config>().add(ObsoleteAttribute, "Will be removed in v2");
 *
 * Emits:
 *   [System.SerializableAttribute]
 *   [System.ObsoleteAttribute("Will be removed in v2")]
 */
export interface AttributesApi {
  /**
   * Begin targeting a class or interface declaration by type.
   */
  <T>(): TypeAttributeBuilder<T>;

  /**
   * Begin targeting a top-level function declaration by value.
   */
  <F extends Function>(fn: F): FunctionAttributeBuilder;

  /**
   * Build an attribute descriptor (compiler-known "attribute instance").
   *
   * Example:
   *   A<Config>().add(A.attr(ObsoleteAttribute, "Will be removed in v2"));
   */
  attr<C extends AttributeCtor>(
    ctor: C,
    ...args: OverloadedConstructorParameters<C>
  ): AttributeDescriptor<C>;
}

/**
 * Named export used by consumers.
 */
export declare const attributes: AttributesApi;

/**
 * Overload-family marker API.
 *
 * Use real TS overload declarations for the public stub surface, then bind
 * emitted CLR bodies from distinct real implementations.
 *
 * Examples:
 *   O<Parser>().method(x => x.parse_string).family(x => x.Parse);
 *   O(parse_bytes).family(parse);
 */
export interface OverloadMethodFamilyBuilder<T> {
  family<K extends MethodKeys<T>>(selector: (t: T) => T[K]): void;
}

export interface OverloadTypeBuilder<T> {
  method<K extends MethodKeys<T>>(
    selector: (t: T) => T[K]
  ): OverloadMethodFamilyBuilder<T>;
}

export interface OverloadFunctionFamilyBuilder {
  family<F extends Function>(fn: F): void;
}

export interface OverloadsApi {
  <T>(): OverloadTypeBuilder<T>;
  <F extends Function>(fn: F): OverloadFunctionFamilyBuilder;
}

export declare const overloads: OverloadsApi;

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
