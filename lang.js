const COMPILE_TIME_ONLY_ERROR =
  "This @tsonic/core/lang.js intrinsic must be erased by Tsonic before runtime.";

const compileTimeOnly = (name) => {
  throw new Error(`${name}: ${COMPILE_TIME_ONLY_ERROR}`);
};

const createAttributeTargetBuilder = () => {
  const builder = {
    target: (_target) => builder,
    add: (..._args) => undefined,
    method: (_selector) => builder,
    prop: (_selector) => builder,
    ctor: undefined,
  };

  builder.ctor = builder;
  return builder;
};

const createOverloadTypeBuilder = () => ({
  method: (_selector) => ({
    family: (_familySelector) => undefined,
  }),
});

export const stackalloc = (size) => new Array(size);
export const sizeof = () => compileTimeOnly("sizeof");
export const defaultof = () => undefined;
export const nameof = () => compileTimeOnly("nameof");
export const trycast = (value) => value;
export const asinterface = (value) => value;
export const out = (value) => value;
export const ref = (value) => value;
export const inref = (value) => value;
export const istype = (_value) => compileTimeOnly("istype");

export const AttributeTargets = Object.freeze({
  assembly: "assembly",
  module: "module",
  type: "type",
  method: "method",
  field: "field",
  property: "property",
  event: "event",
  param: "param",
  return: "return",
  typevar: "typevar",
});

export const attributes = Object.assign(
  (_fn) => createAttributeTargetBuilder(),
  {
    attr: (ctor, ...args) => ({
      kind: "attribute",
      ctor,
      args,
    }),
  }
);

export const overloads = (_fn) =>
  _fn === undefined
    ? createOverloadTypeBuilder()
    : {
        family: (_familyFn) => undefined,
      };
