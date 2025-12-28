#!/bin/bash
# Generate TypeScript declarations for Tsonic.Runtime in @tsonic/core
#
# This script regenerates TypeScript type declarations from the
# Tsonic.Runtime.dll assembly using tsbindgen.
#
# Prerequisites:
#   - .NET 10 SDK installed
#   - tsbindgen repository cloned at ../tsbindgen (sibling directory)
#   - runtime repository cloned at ../runtime (sibling directory)
#
# Usage:
#   ./__build/scripts/generate.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TSBINDGEN_DIR="$PROJECT_DIR/../tsbindgen"
RUNTIME_DIR="$PROJECT_DIR/../runtime"
DOTNET_LIB="$PROJECT_DIR/../dotnet"

# .NET runtime path (needed for BCL type resolution)
DOTNET_VERSION="${DOTNET_VERSION:-10.0.0}"
DOTNET_HOME="${DOTNET_HOME:-$HOME/.dotnet}"
DOTNET_RUNTIME_PATH="$DOTNET_HOME/shared/Microsoft.NETCore.App/$DOTNET_VERSION"

# Tsonic.Runtime.dll path
RUNTIME_DLL="$RUNTIME_DIR/artifacts/bin/Tsonic.Runtime/Release/net10.0/Tsonic.Runtime.dll"

echo "================================================================"
echo "Generating Tsonic.Runtime TypeScript Declarations for @tsonic/core"
echo "================================================================"
echo ""
echo "Configuration:"
echo "  Runtime.dll:   $RUNTIME_DLL"
echo "  .NET Runtime:  $DOTNET_RUNTIME_PATH"
echo "  BCL Library:   $DOTNET_LIB (external reference)"
echo "  tsbindgen:     $TSBINDGEN_DIR"
echo "  Output:        $PROJECT_DIR"
echo "  Naming:        JS (camelCase)"
echo ""

# Verify prerequisites
if [ ! -f "$RUNTIME_DLL" ]; then
    echo "ERROR: Tsonic.Runtime.dll not found at $RUNTIME_DLL"
    echo "Build it first: cd ../runtime && dotnet build -c Release"
    exit 1
fi

if [ ! -d "$DOTNET_RUNTIME_PATH" ]; then
    echo "ERROR: .NET runtime not found at $DOTNET_RUNTIME_PATH"
    echo "Set DOTNET_HOME or DOTNET_VERSION environment variables"
    exit 1
fi

if [ ! -d "$TSBINDGEN_DIR" ]; then
    echo "ERROR: tsbindgen not found at $TSBINDGEN_DIR"
    echo "Clone it: git clone https://github.com/tsoniclang/tsbindgen ../tsbindgen"
    exit 1
fi

if [ ! -d "$DOTNET_LIB" ]; then
    echo "ERROR: @tsonic/dotnet not found at $DOTNET_LIB"
    echo "Clone it: git clone https://github.com/tsoniclang/dotnet ../dotnet"
    exit 1
fi

# Clean only generated runtime files (keep hand-written types.d.ts, attributes.d.ts)
echo "[1/3] Cleaning generated runtime files..."
cd "$PROJECT_DIR"

# Remove only the generated runtime directory and facade files
rm -rf Tsonic.Runtime/ runtime/ 2>/dev/null || true
rm -f Tsonic.Runtime.d.ts Tsonic.Runtime.js runtime.d.ts runtime.js 2>/dev/null || true
rm -f families.json 2>/dev/null || true

echo "  Done"

# Build tsbindgen
echo "[2/3] Building tsbindgen..."
cd "$TSBINDGEN_DIR"
dotnet build src/tsbindgen/tsbindgen.csproj -c Release --verbosity quiet
echo "  Done"

# Generate types with JavaScript-style naming
# Uses --lib to reference BCL types from @tsonic/dotnet instead of regenerating them
# Uses --namespace-map to emit as runtime.d.ts/runtime.js for cleaner imports
echo "[3/3] Generating TypeScript declarations..."
dotnet run --project src/tsbindgen/tsbindgen.csproj --no-build -c Release -- \
    generate -a "$RUNTIME_DLL" -d "$DOTNET_RUNTIME_PATH" -o "$PROJECT_DIR" \
    --lib "$DOTNET_LIB" \
    --naming js \
    --namespace-map "Tsonic.Runtime=runtime"

echo ""
echo "================================================================"
echo "Generation Complete"
echo "================================================================"
