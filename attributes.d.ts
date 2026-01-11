// @tsonic/core/attributes.d.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

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
export type Ctor<T = unknown, Args extends readonly any[] = readonly any[]> = new (
  ...args: Args
) => T;

/** Any attribute class constructor. */
export type AttributeCtor = Ctor<object, readonly any[]>;

/**
 * Extract constructor parameters across multiple overloads.
 *
 * TypeScript's built-in ConstructorParameters<C> collapses overloads to the
 * last signature, which makes attribute ctor typing unusably strict for many
 * .NET attributes.
 */
export type OverloadedConstructorParameters<C extends AttributeCtor> =
  C extends {
    new (...args: infer A1): any;
    new (...args: infer A2): any;
    new (...args: infer A3): any;
    new (...args: infer A4): any;
    new (...args: infer A5): any;
  }
    ? A1 | A2 | A3 | A4 | A5
    : C extends {
          new (...args: infer A1): any;
          new (...args: infer A2): any;
          new (...args: infer A3): any;
          new (...args: infer A4): any;
        }
      ? A1 | A2 | A3 | A4
      : C extends {
            new (...args: infer A1): any;
            new (...args: infer A2): any;
            new (...args: infer A3): any;
          }
        ? A1 | A2 | A3
        : C extends { new (...args: infer A1): any; new (...args: infer A2): any }
          ? A1 | A2
          : C extends { new (...args: infer A): any }
            ? A
            : never;

/** Attribute application (constructor + ctor arguments). */
export interface AttributeDescriptor<C extends AttributeCtor = AttributeCtor> {
  readonly kind: "attribute";
  readonly ctor: C;
  readonly args: readonly OverloadedConstructorParameters<C>;
}

/** Extract instance type of a constructor. */
export type InstanceOf<C extends Ctor<any, any>> = C extends Ctor<infer I, any>
  ? I
  : never;

/** Keys of T whose values are callable. */
export type MethodKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

/** Keys of T whose values are NOT callable (i.e., "properties"). */
export type PropertyKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

/**
 * Inferred "method value type" from a method selector.
 * The selector must resolve to a function-valued member on T.
 */
export type SelectedMethodValue<T> = (...args: any[]) => any;

/**
 * Fluent builder returned from A.on(Foo).
 * Allows attaching attributes to:
 * - the type itself
 * - the constructor
 * - a method
 * - a property
 */
export interface OnBuilder<T> {
  /** Attach attributes to the type declaration (C# class/interface). */
  type: AttributeTargetBuilder;

  /** Attach attributes to the constructor. */
  ctor: AttributeTargetBuilder;

  /**
   * Select a method to annotate.
   *
   * The selector must be a simple member access in practice (enforced by compiler),
   * but is typed here as: (t: T) => T[K] where K is a method key.
   *
   * Example:
   *   A.on(User).method(u => u.save).add(TransactionAttribute);
   */
  method<K extends MethodKeys<T>>(
    selector: (t: T) => T[K]
  ): AttributeTargetBuilder;

  /**
   * Select a property to annotate.
   *
   * Example:
   *   A.on(User).prop(u => u.name).add(JsonPropertyNameAttribute, "name");
   */
  prop<K extends PropertyKeys<T>>(
    selector: (t: T) => T[K]
  ): AttributeTargetBuilder;
}

/**
 * Target builder that supports adding attributes.
 * Supports two canonical forms:
 *   - add(AttrCtor, ...args)
 *   - add(A.attr(AttrCtor, ...args))
 */
export interface AttributeTargetBuilder {
  /**
   * Add an attribute by constructor + arguments.
   *
   * Example:
   *   A.on(Config).type.add(ObsoleteAttribute, "Will be removed in v2");
   */
  add<C extends AttributeCtor>(
    ctor: C,
    ...args: OverloadedConstructorParameters<C>
  ): void;

  /**
   * Add an attribute descriptor produced by A.attr(...).
   *
   * Example:
   *   A.on(Config).type.add(A.attr(ObsoleteAttribute, "Will be removed in v2"));
   */
  add<C extends AttributeCtor>(descriptor: AttributeDescriptor<C>): void;
}

/**
 * The main entrypoint.
 *
 * Usage:
 *   import { attributes as A } from "@tsonic/core/attributes.js";
 *
 *   class Config {}
 *   A.on(Config).type.add(SerializableAttribute);
 *   A.on(Config).type.add(ObsoleteAttribute, "Will be removed in v2");
 *
 * Emits:
 *   [System.SerializableAttribute]
 *   [System.ObsoleteAttribute("Will be removed in v2")]
 */
export interface AttributesApi {
  /**
   * Begin targeting a type by passing its constructor.
   */
  on<C extends Ctor<any, any>>(ctor: C): OnBuilder<InstanceOf<C>>;

  /**
   * Build an attribute descriptor (compiler-known "attribute instance").
   *
   * Example:
   *   A.on(Config).type.add(A.attr(ObsoleteAttribute, "Will be removed in v2"));
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
