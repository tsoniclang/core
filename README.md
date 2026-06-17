# @tsonic/core

Core language-facing declarations and intrinsics for Tsonic.

`@tsonic/core` is not an ambient surface by itself. It provides the shared
modules that source packages and binding packages use for primitive intent,
language intrinsics, and compiler-recognized runtime helpers.

## Install

```bash
npm install @tsonic/core
```

## Modules

### `@tsonic/core/types.js`

Source primitive intent aliases:

```typescript
import type { int, long, double, bool, char } from "@tsonic/core/types.js";

const age: int = 42 as int;
const total: long = 123 as long;
const ratio: double = 0.5;
const isActive: bool = true;
const initial: char = "T" as char;
```

### `@tsonic/core/lang.js`

Compiler-recognized language intrinsics:

```typescript
import { asinterface, defaultof, nameof, out, sizeof, stackalloc } from "@tsonic/core/lang.js";
import type { int } from "@tsonic/core/types.js";

const zero = defaultof<int>();
const name = nameof("customerId");
const bytes = stackalloc<int>(16);
void asinterface;
void out;
void sizeof;
void zero;
void name;
void bytes;
```

## Broad values

Use concrete domain types at API boundaries whenever possible. When an API
needs a deliberately broad value, use TypeScript `unknown` and narrow it before
member access.

`JsValue` exists in `@tsonic/core/types.js` for first-party runtime declaration
surfaces that model JavaScript carriers. It is not a general-purpose host object
type. Binding packages use `unknown` for broad host values unless a closed source
type is known.

## Primitive aliases

### Signed Integer Types
- `sbyte` - signed 8-bit integer (-128 to 127)
- `short` - signed 16-bit integer (-32,768 to 32,767)
- `int` - signed 32-bit integer (-2,147,483,648 to 2,147,483,647)
- `long` - signed 64-bit integer
- `nint` - native signed integer
- `int128` - signed 128-bit integer

### Unsigned Integer Types
- `byte` - unsigned 8-bit integer (0 to 255)
- `ushort` - unsigned 16-bit integer (0 to 65,535)
- `uint` - unsigned 32-bit integer (0 to 4,294,967,295)
- `ulong` - unsigned 64-bit integer
- `nuint` - native unsigned integer
- `uint128` - unsigned 128-bit integer

### Floating-Point Types
- `half` - 16-bit floating-point number
- `float` - 32-bit floating-point number
- `double` - 64-bit floating-point number
- `decimal` - fixed-precision decimal number

### Other Types
- `bool` - boolean value
- `char` - single UTF-16 code unit
- `ptr<T>` - target-supported unsafe pointer types

## TypeScript versus Tsonic

The TypeScript checker sees most numeric aliases as `number`. Tsonic carries the
semantic primitive identity through its compiler pipeline and enforces the
active target's rules during compilation.

Use these aliases to express intent at source level; do not expect plain
TypeScript to enforce every primitive distinction by itself.

## Versioning

This repo is versioned by source contract major:

- Version 10 declarations live under `versions/10/`.
- The npm package is published as `@tsonic/core@10.x`.

## Development

```bash
npm install
npm run generate:10
```

## License

MIT
