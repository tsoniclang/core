# @tsonic/core

Core language-facing declarations and intrinsics for Tsonic.

`@tsonic/core` is not an ambient surface by itself. It provides the shared
modules that source packages and CLR binding packages use for primitive intent,
language intrinsics, and compiler-recognized runtime helpers.

## Install

```bash
npm install @tsonic/core
```

## Modules

### `@tsonic/core/types.js`

CLR primitive intent aliases:

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

### `@tsonic/core/runtime.js`

Runtime-facing helpers used by generated code and first-party source packages.

## Primitive aliases

### Signed Integer Types
- `sbyte` - System.SByte (-128 to 127)
- `short` - System.Int16 (-32,768 to 32,767)
- `int` - System.Int32 (-2,147,483,648 to 2,147,483,647)
- `long` - System.Int64
- `nint` - System.IntPtr (native int)
- `int128` - System.Int128

### Unsigned Integer Types
- `byte` - System.Byte (0 to 255)
- `ushort` - System.UInt16 (0 to 65,535)
- `uint` - System.UInt32 (0 to 4,294,967,295)
- `ulong` - System.UInt64
- `nuint` - System.UIntPtr (native uint)
- `uint128` - System.UInt128

### Floating-Point Types
- `half` - System.Half (16-bit float)
- `float` - System.Single (32-bit float)
- `double` - System.Double (64-bit float)
- `decimal` - System.Decimal (128-bit decimal)

### Other Types
- `bool` - System.Boolean
- `char` - System.Char (single UTF-16 code unit)
- `ptr<T>` - C# unsafe pointer types

## TypeScript versus Tsonic

The TypeScript checker sees most numeric aliases as `number`. Tsonic carries the
semantic primitive identity through its own compiler pipeline and enforces the
CLR-facing rules during compilation.

Use these aliases to express intent at source level; do not expect plain
TypeScript to enforce every CLR primitive distinction by itself.

## Versioning

This repo is versioned by .NET major:

- .NET 10 declarations live under `versions/10/`.
- The npm package is published as `@tsonic/core@10.x`.

## Development

```bash
npm install
npm run generate:10
```

## License

MIT
