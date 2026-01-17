# @tsonic/core

Core type definitions for Tsonic - a TypeScript to native compiler.

## Installation

```bash
npm install @tsonic/core
```

## Usage

```typescript
import { int, float, bool } from "@tsonic/core/types.js";

const age: int = 42 as int;
const temp: float = 98.6 as float;
const isActive: bool = true;
```

## Type Aliases

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

## Important Notes

These are simple type aliases with NO runtime enforcement. TypeScript treats all numeric types as `number`, `bool` as `boolean`, etc.

**Tsonic enforces semantic correctness at compile time via its proof system.** TypeScript alone will NOT catch type errors between int/byte/long etc.

## License

MIT
