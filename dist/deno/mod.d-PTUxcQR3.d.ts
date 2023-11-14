import { V as VNode } from './index.d--r8ZQDVC.js';

/**
 * A middleware is a function that encapsulates another function and transforms it
 *
 * @remarks
 *
 * They can both transform the input and output of the function,
 * and add additional functionality around it.
 *
 * @typeParam I - Input type of the middleware
 * @typeParam O - (Tranformed) Output type of the middleware
 * @typeParam II - (Tranformed) Input type of the encapsulated function
 * @typeParam OO - Output type of the encapsulated function
 */
type Middleware<I, O, II, OO> = (input: I, next: (input: II) => Promise<OO>) => Promise<O>;
/** Type convertible to a {@link Middleware} */
interface AsMiddleware<I, O, II, OO> {
    middleware(): Middleware<I, O, II, OO>;
}
/** Flattens {@link AsMiddleware} to {@link Middleware} */
declare function asMiddleware<I, O, II, OO>(middleware: Middleware<I, O, II, OO> | AsMiddleware<I, O, II, OO>): Middleware<I, O, II, OO>;
/** Throws an error inside a middleware so it can potentially catch it */
declare function throwInMiddleware<I, O, II, OO>(middleware: Middleware<I, O, II, OO>, input: I, error: unknown): Promise<O>;

declare type Primitive = string | number | symbol | bigint | boolean | null | undefined;
declare type Scalars = Primitive | Primitive[];

declare namespace util {
    type AssertEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2 ? true : false;
    export type isAny<T> = 0 extends 1 & T ? true : false;
    export const assertEqual: <A, B>(val: AssertEqual<A, B>) => AssertEqual<A, B>;
    export function assertIs<T>(_arg: T): void;
    export function assertNever(_x: never): never;
    export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    export type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
    export type MakePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
    export const arrayToEnum: <T extends string, U extends [T, ...T[]]>(items: U) => { [k in U[number]]: k; };
    export const getValidEnumValues: (obj: any) => any[];
    export const objectValues: (obj: any) => any[];
    export const objectKeys: ObjectConstructor["keys"];
    export const find: <T>(arr: T[], checker: (arg: T) => any) => T | undefined;
    export type identity<T> = objectUtil.identity<T>;
    export type flatten<T> = objectUtil.flatten<T>;
    export type noUndefined<T> = T extends undefined ? never : T;
    export const isInteger: NumberConstructor["isInteger"];
    export function joinValues<T extends any[]>(array: T, separator?: string): string;
    export const jsonStringifyReplacer: (_: string, value: any) => any;
    export {  };
}
declare namespace objectUtil {
    export type MergeShapes<U, V> = {
        [k in Exclude<keyof U, keyof V>]: U[k];
    } & V;
    type requiredKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? never : k;
    }[keyof T];
    export type addQuestionMarks<T extends object, R extends keyof T = requiredKeys<T>> = Pick<Required<T>, R> & Partial<T>;
    export type identity<T> = T;
    export type flatten<T> = identity<{
        [k in keyof T]: T[k];
    }>;
    export type noNeverKeys<T> = {
        [k in keyof T]: [T[k]] extends [never] ? never : k;
    }[keyof T];
    export type noNever<T> = identity<{
        [k in noNeverKeys<T>]: k extends keyof T ? T[k] : never;
    }>;
    export const mergeShapes: <U, T>(first: U, second: T) => T & U;
    export type extendShape<A, B> = flatten<Omit<A, keyof B> & B>;
    export {  };
}
declare const ZodParsedType: {
    function: "function";
    number: "number";
    string: "string";
    nan: "nan";
    integer: "integer";
    float: "float";
    boolean: "boolean";
    date: "date";
    bigint: "bigint";
    symbol: "symbol";
    undefined: "undefined";
    null: "null";
    array: "array";
    object: "object";
    unknown: "unknown";
    promise: "promise";
    void: "void";
    never: "never";
    map: "map";
    set: "set";
};
declare type ZodParsedType = keyof typeof ZodParsedType;
declare const getParsedType: (data: any) => ZodParsedType;

declare type allKeys<T> = T extends any ? keyof T : never;
declare type inferFlattenedErrors<T extends ZodType<any, any, any>, U = string> = typeToFlattenedError<TypeOf<T>, U>;
declare type typeToFlattenedError<T, U = string> = {
    formErrors: U[];
    fieldErrors: {
        [P in allKeys<T>]?: U[];
    };
};
declare const ZodIssueCode: {
    invalid_type: "invalid_type";
    invalid_literal: "invalid_literal";
    custom: "custom";
    invalid_union: "invalid_union";
    invalid_union_discriminator: "invalid_union_discriminator";
    invalid_enum_value: "invalid_enum_value";
    unrecognized_keys: "unrecognized_keys";
    invalid_arguments: "invalid_arguments";
    invalid_return_type: "invalid_return_type";
    invalid_date: "invalid_date";
    invalid_string: "invalid_string";
    too_small: "too_small";
    too_big: "too_big";
    invalid_intersection_types: "invalid_intersection_types";
    not_multiple_of: "not_multiple_of";
    not_finite: "not_finite";
};
declare type ZodIssueCode = keyof typeof ZodIssueCode;
declare type ZodIssueBase = {
    path: (string | number)[];
    message?: string;
};
interface ZodInvalidTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_type;
    expected: ZodParsedType;
    received: ZodParsedType;
}
interface ZodInvalidLiteralIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_literal;
    expected: unknown;
    received: unknown;
}
interface ZodUnrecognizedKeysIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.unrecognized_keys;
    keys: string[];
}
interface ZodInvalidUnionIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union;
    unionErrors: ZodError[];
}
interface ZodInvalidUnionDiscriminatorIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union_discriminator;
    options: Primitive[];
}
interface ZodInvalidEnumValueIssue extends ZodIssueBase {
    received: string | number;
    code: typeof ZodIssueCode.invalid_enum_value;
    options: (string | number)[];
}
interface ZodInvalidArgumentsIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_arguments;
    argumentsError: ZodError;
}
interface ZodInvalidReturnTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_return_type;
    returnTypeError: ZodError;
}
interface ZodInvalidDateIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_date;
}
declare type StringValidation = "email" | "url" | "emoji" | "uuid" | "regex" | "cuid" | "cuid2" | "ulid" | "datetime" | "ip" | {
    includes: string;
    position?: number;
} | {
    startsWith: string;
} | {
    endsWith: string;
};
interface ZodInvalidStringIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_string;
    validation: StringValidation;
}
interface ZodTooSmallIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_small;
    minimum: number | bigint;
    inclusive: boolean;
    exact?: boolean;
    type: "array" | "string" | "number" | "set" | "date" | "bigint";
}
interface ZodTooBigIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_big;
    maximum: number | bigint;
    inclusive: boolean;
    exact?: boolean;
    type: "array" | "string" | "number" | "set" | "date" | "bigint";
}
interface ZodInvalidIntersectionTypesIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_intersection_types;
}
interface ZodNotMultipleOfIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_multiple_of;
    multipleOf: number | bigint;
}
interface ZodNotFiniteIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_finite;
}
interface ZodCustomIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.custom;
    params?: {
        [k: string]: any;
    };
}
declare type DenormalizedError = {
    [k: string]: DenormalizedError | string[];
};
declare type ZodIssueOptionalMessage = ZodInvalidTypeIssue | ZodInvalidLiteralIssue | ZodUnrecognizedKeysIssue | ZodInvalidUnionIssue | ZodInvalidUnionDiscriminatorIssue | ZodInvalidEnumValueIssue | ZodInvalidArgumentsIssue | ZodInvalidReturnTypeIssue | ZodInvalidDateIssue | ZodInvalidStringIssue | ZodTooSmallIssue | ZodTooBigIssue | ZodInvalidIntersectionTypesIssue | ZodNotMultipleOfIssue | ZodNotFiniteIssue | ZodCustomIssue;
declare type ZodIssue = ZodIssueOptionalMessage & {
    fatal?: boolean;
    message: string;
};
declare const quotelessJson: (obj: any) => string;
declare type recursiveZodFormattedError<T> = T extends [any, ...any[]] ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : T extends any[] ? {
    [k: number]: ZodFormattedError<T[number]>;
} : T extends object ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : unknown;
declare type ZodFormattedError<T, U = string> = {
    _errors: U[];
} & recursiveZodFormattedError<NonNullable<T>>;
declare type inferFormattedError<T extends ZodType<any, any, any>, U = string> = ZodFormattedError<TypeOf<T>, U>;
declare class ZodError<T = any> extends Error {
    issues: ZodIssue[];
    get errors(): ZodIssue[];
    constructor(issues: ZodIssue[]);
    format(): ZodFormattedError<T>;
    format<U>(mapper: (issue: ZodIssue) => U): ZodFormattedError<T, U>;
    static create: (issues: ZodIssue[]) => ZodError<any>;
    toString(): string;
    get message(): string;
    get isEmpty(): boolean;
    addIssue: (sub: ZodIssue) => void;
    addIssues: (subs?: ZodIssue[]) => void;
    flatten(): typeToFlattenedError<T>;
    flatten<U>(mapper?: (issue: ZodIssue) => U): typeToFlattenedError<T, U>;
    get formErrors(): typeToFlattenedError<T, string>;
}
declare type stripPath<T extends object> = T extends any ? util.OmitKeys<T, "path"> : never;
declare type IssueData = stripPath<ZodIssueOptionalMessage> & {
    path?: (string | number)[];
    fatal?: boolean;
};
declare type ErrorMapCtx = {
    defaultError: string;
    data: any;
};
declare type ZodErrorMap = (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};

declare const errorMap: ZodErrorMap;

declare function setErrorMap(map: ZodErrorMap): void;
declare function getErrorMap(): ZodErrorMap;

declare const makeIssue: (params: {
    data: any;
    path: (string | number)[];
    errorMaps: ZodErrorMap[];
    issueData: IssueData;
}) => ZodIssue;
declare type ParseParams = {
    path: (string | number)[];
    errorMap: ZodErrorMap;
    async: boolean;
};
declare type ParsePathComponent = string | number;
declare type ParsePath = ParsePathComponent[];
declare const EMPTY_PATH: ParsePath;
interface ParseContext {
    readonly common: {
        readonly issues: ZodIssue[];
        readonly contextualErrorMap?: ZodErrorMap;
        readonly async: boolean;
    };
    readonly path: ParsePath;
    readonly schemaErrorMap?: ZodErrorMap;
    readonly parent: ParseContext | null;
    readonly data: any;
    readonly parsedType: ZodParsedType;
}
declare type ParseInput = {
    data: any;
    path: (string | number)[];
    parent: ParseContext;
};
declare function addIssueToContext(ctx: ParseContext, issueData: IssueData): void;
declare type ObjectPair = {
    key: SyncParseReturnType<any>;
    value: SyncParseReturnType<any>;
};
declare class ParseStatus {
    value: "aborted" | "dirty" | "valid";
    dirty(): void;
    abort(): void;
    static mergeArray(status: ParseStatus, results: SyncParseReturnType<any>[]): SyncParseReturnType;
    static mergeObjectAsync(status: ParseStatus, pairs: {
        key: ParseReturnType<any>;
        value: ParseReturnType<any>;
    }[]): Promise<SyncParseReturnType<any>>;
    static mergeObjectSync(status: ParseStatus, pairs: {
        key: SyncParseReturnType<any>;
        value: SyncParseReturnType<any>;
        alwaysSet?: boolean;
    }[]): SyncParseReturnType;
}
interface ParseResult {
    status: "aborted" | "dirty" | "valid";
    data: any;
}
declare type INVALID = {
    status: "aborted";
};
declare const INVALID: INVALID;
declare type DIRTY<T> = {
    status: "dirty";
    value: T;
};
declare const DIRTY: <T>(value: T) => DIRTY<T>;
declare type OK<T> = {
    status: "valid";
    value: T;
};
declare const OK: <T>(value: T) => OK<T>;
declare type SyncParseReturnType<T = any> = OK<T> | DIRTY<T> | INVALID;
declare type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>;
declare type ParseReturnType<T> = SyncParseReturnType<T> | AsyncParseReturnType<T>;
declare const isAborted: (x: ParseReturnType<any>) => x is INVALID;
declare const isDirty: <T>(x: ParseReturnType<T>) => x is OK<T> | DIRTY<T>;
declare const isValid: <T>(x: ParseReturnType<T>) => x is OK<T> | DIRTY<T>;
declare const isAsync: <T>(x: ParseReturnType<T>) => x is AsyncParseReturnType<T>;

declare namespace enumUtil {
    type UnionToIntersectionFn<T> = (T extends unknown ? (k: () => T) => void : never) extends (k: infer Intersection) => void ? Intersection : never;
    type GetUnionLast<T> = UnionToIntersectionFn<T> extends () => infer Last ? Last : never;
    type UnionToTuple<T, Tuple extends unknown[] = []> = [T] extends [never] ? Tuple : UnionToTuple<Exclude<T, GetUnionLast<T>>, [GetUnionLast<T>, ...Tuple]>;
    type CastToStringTuple<T> = T extends [string, ...string[]] ? T : never;
    export type UnionToTupleString<T> = CastToStringTuple<UnionToTuple<T>>;
    export {  };
}

declare namespace errorUtil {
    type ErrMessage = string | {
        message?: string;
    };
    const errToObj: (message?: ErrMessage | undefined) => {
        message?: string | undefined;
    };
    const toString: (message?: ErrMessage | undefined) => string | undefined;
}

declare namespace partialUtil {
    type DeepPartial<T extends ZodTypeAny> = T extends ZodObject<ZodRawShape> ? ZodObject<{
        [k in keyof T["shape"]]: ZodOptional<DeepPartial<T["shape"][k]>>;
    }, T["_def"]["unknownKeys"], T["_def"]["catchall"]> : T extends ZodArray<infer Type, infer Card> ? ZodArray<DeepPartial<Type>, Card> : T extends ZodOptional<infer Type> ? ZodOptional<DeepPartial<Type>> : T extends ZodNullable<infer Type> ? ZodNullable<DeepPartial<Type>> : T extends ZodTuple<infer Items> ? {
        [k in keyof Items]: Items[k] extends ZodTypeAny ? DeepPartial<Items[k]> : never;
    } extends infer PI ? PI extends ZodTupleItems ? ZodTuple<PI> : never : never : T;
}

declare type RefinementCtx = {
    addIssue: (arg: IssueData) => void;
    path: (string | number)[];
};
declare type ZodRawShape = {
    [k: string]: ZodTypeAny;
};
declare type ZodTypeAny = ZodType<any, any, any>;
declare type TypeOf<T extends ZodType<any, any, any>> = T["_output"];
declare type input<T extends ZodType<any, any, any>> = T["_input"];
declare type output<T extends ZodType<any, any, any>> = T["_output"];

declare type CustomErrorParams = Partial<util.Omit<ZodCustomIssue, "code">>;
interface ZodTypeDef {
    errorMap?: ZodErrorMap;
    description?: string;
}
declare type RawCreateParams = {
    errorMap?: ZodErrorMap;
    invalid_type_error?: string;
    required_error?: string;
    description?: string;
} | undefined;
declare type ProcessedCreateParams = {
    errorMap?: ZodErrorMap;
    description?: string;
};
declare type SafeParseSuccess<Output> = {
    success: true;
    data: Output;
};
declare type SafeParseError<Input> = {
    success: false;
    error: ZodError<Input>;
};
declare type SafeParseReturnType<Input, Output> = SafeParseSuccess<Output> | SafeParseError<Input>;
declare abstract class ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    readonly _type: Output;
    readonly _output: Output;
    readonly _input: Input;
    readonly _def: Def;
    get description(): string | undefined;
    abstract _parse(input: ParseInput): ParseReturnType<Output>;
    _getType(input: ParseInput): string;
    _getOrReturnCtx(input: ParseInput, ctx?: ParseContext | undefined): ParseContext;
    _processInputParams(input: ParseInput): {
        status: ParseStatus;
        ctx: ParseContext;
    };
    _parseSync(input: ParseInput): SyncParseReturnType<Output>;
    _parseAsync(input: ParseInput): AsyncParseReturnType<Output>;
    parse(data: unknown, params?: Partial<ParseParams>): Output;
    safeParse(data: unknown, params?: Partial<ParseParams>): SafeParseReturnType<Input, Output>;
    parseAsync(data: unknown, params?: Partial<ParseParams>): Promise<Output>;
    safeParseAsync(data: unknown, params?: Partial<ParseParams>): Promise<SafeParseReturnType<Input, Output>>;
    /** Alias of safeParseAsync */
    spa: (data: unknown, params?: Partial<ParseParams> | undefined) => Promise<SafeParseReturnType<Input, Output>>;
    refine<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, RefinedOutput, Input>;
    refine(check: (arg: Output) => unknown | Promise<unknown>, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, Output, Input>;
    refinement<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, RefinedOutput, Input>;
    refinement(check: (arg: Output) => boolean, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, Output, Input>;
    _refinement(refinement: RefinementEffect<Output>["refinement"]): ZodEffects<this, Output, Input>;
    superRefine<RefinedOutput extends Output>(refinement: (arg: Output, ctx: RefinementCtx) => arg is RefinedOutput): ZodEffects<this, RefinedOutput, Input>;
    superRefine(refinement: (arg: Output, ctx: RefinementCtx) => void): ZodEffects<this, Output, Input>;
    superRefine(refinement: (arg: Output, ctx: RefinementCtx) => Promise<void>): ZodEffects<this, Output, Input>;
    constructor(def: Def);
    optional(): ZodOptional<this>;
    nullable(): ZodNullable<this>;
    nullish(): ZodOptional<ZodNullable<this>>;
    array(): ZodArray<this>;
    promise(): ZodPromise<this>;
    or<T extends ZodTypeAny>(option: T): ZodUnion<[this, T]>;
    and<T extends ZodTypeAny>(incoming: T): ZodIntersection<this, T>;
    transform<NewOut>(transform: (arg: Output, ctx: RefinementCtx) => NewOut | Promise<NewOut>): ZodEffects<this, NewOut>;
    default(def: util.noUndefined<Input>): ZodDefault<this>;
    default(def: () => util.noUndefined<Input>): ZodDefault<this>;
    brand<B extends string | number | symbol>(brand?: B): ZodBranded<this, B>;
    catch(def: Output): ZodCatch<this>;
    catch(def: (ctx: {
        error: ZodError;
        input: Input;
    }) => Output): ZodCatch<this>;
    describe(description: string): this;
    pipe<T extends ZodTypeAny>(target: T): ZodPipeline<this, T>;
    readonly(): ZodReadonly<this>;
    isOptional(): boolean;
    isNullable(): boolean;
}
declare type IpVersion = "v4" | "v6";
declare type ZodStringCheck = {
    kind: "min";
    value: number;
    message?: string;
} | {
    kind: "max";
    value: number;
    message?: string;
} | {
    kind: "length";
    value: number;
    message?: string;
} | {
    kind: "email";
    message?: string;
} | {
    kind: "url";
    message?: string;
} | {
    kind: "emoji";
    message?: string;
} | {
    kind: "uuid";
    message?: string;
} | {
    kind: "cuid";
    message?: string;
} | {
    kind: "includes";
    value: string;
    position?: number;
    message?: string;
} | {
    kind: "cuid2";
    message?: string;
} | {
    kind: "ulid";
    message?: string;
} | {
    kind: "startsWith";
    value: string;
    message?: string;
} | {
    kind: "endsWith";
    value: string;
    message?: string;
} | {
    kind: "regex";
    regex: RegExp;
    message?: string;
} | {
    kind: "trim";
    message?: string;
} | {
    kind: "toLowerCase";
    message?: string;
} | {
    kind: "toUpperCase";
    message?: string;
} | {
    kind: "datetime";
    offset: boolean;
    precision: number | null;
    message?: string;
} | {
    kind: "ip";
    version?: IpVersion;
    message?: string;
};
interface ZodStringDef extends ZodTypeDef {
    checks: ZodStringCheck[];
    typeName: ZodFirstPartyTypeKind.ZodString;
    coerce: boolean;
}
declare class ZodString extends ZodType<string, ZodStringDef> {
    _parse(input: ParseInput): ParseReturnType<string>;
    protected _regex(regex: RegExp, validation: StringValidation, message?: errorUtil.ErrMessage): ZodEffects<this, string, string>;
    _addCheck(check: ZodStringCheck): ZodString;
    email(message?: errorUtil.ErrMessage): ZodString;
    url(message?: errorUtil.ErrMessage): ZodString;
    emoji(message?: errorUtil.ErrMessage): ZodString;
    uuid(message?: errorUtil.ErrMessage): ZodString;
    cuid(message?: errorUtil.ErrMessage): ZodString;
    cuid2(message?: errorUtil.ErrMessage): ZodString;
    ulid(message?: errorUtil.ErrMessage): ZodString;
    ip(options?: string | {
        version?: "v4" | "v6";
        message?: string;
    }): ZodString;
    datetime(options?: string | {
        message?: string | undefined;
        precision?: number | null;
        offset?: boolean;
    }): ZodString;
    regex(regex: RegExp, message?: errorUtil.ErrMessage): ZodString;
    includes(value: string, options?: {
        message?: string;
        position?: number;
    }): ZodString;
    startsWith(value: string, message?: errorUtil.ErrMessage): ZodString;
    endsWith(value: string, message?: errorUtil.ErrMessage): ZodString;
    min(minLength: number, message?: errorUtil.ErrMessage): ZodString;
    max(maxLength: number, message?: errorUtil.ErrMessage): ZodString;
    length(len: number, message?: errorUtil.ErrMessage): ZodString;
    /**
     * @deprecated Use z.string().min(1) instead.
     * @see {@link ZodString.min}
     */
    nonempty(message?: errorUtil.ErrMessage): ZodString;
    trim(): ZodString;
    toLowerCase(): ZodString;
    toUpperCase(): ZodString;
    get isDatetime(): boolean;
    get isEmail(): boolean;
    get isURL(): boolean;
    get isEmoji(): boolean;
    get isUUID(): boolean;
    get isCUID(): boolean;
    get isCUID2(): boolean;
    get isULID(): boolean;
    get isIP(): boolean;
    get minLength(): number | null;
    get maxLength(): number | null;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: true | undefined;
    }) | undefined) => ZodString;
}
declare type ZodNumberCheck = {
    kind: "min";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "max";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "int";
    message?: string;
} | {
    kind: "multipleOf";
    value: number;
    message?: string;
} | {
    kind: "finite";
    message?: string;
};
interface ZodNumberDef extends ZodTypeDef {
    checks: ZodNumberCheck[];
    typeName: ZodFirstPartyTypeKind.ZodNumber;
    coerce: boolean;
}
declare class ZodNumber extends ZodType<number, ZodNumberDef> {
    _parse(input: ParseInput): ParseReturnType<number>;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodNumber;
    gte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    min: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    gt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    lte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    max: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    lt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    protected setLimit(kind: "min" | "max", value: number, inclusive: boolean, message?: string): ZodNumber;
    _addCheck(check: ZodNumberCheck): ZodNumber;
    int(message?: errorUtil.ErrMessage): ZodNumber;
    positive(message?: errorUtil.ErrMessage): ZodNumber;
    negative(message?: errorUtil.ErrMessage): ZodNumber;
    nonpositive(message?: errorUtil.ErrMessage): ZodNumber;
    nonnegative(message?: errorUtil.ErrMessage): ZodNumber;
    multipleOf(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    step: (value: number, message?: errorUtil.ErrMessage | undefined) => ZodNumber;
    finite(message?: errorUtil.ErrMessage): ZodNumber;
    safe(message?: errorUtil.ErrMessage): ZodNumber;
    get minValue(): number | null;
    get maxValue(): number | null;
    get isInt(): boolean;
    get isFinite(): boolean;
}
declare type ZodBigIntCheck = {
    kind: "min";
    value: bigint;
    inclusive: boolean;
    message?: string;
} | {
    kind: "max";
    value: bigint;
    inclusive: boolean;
    message?: string;
} | {
    kind: "multipleOf";
    value: bigint;
    message?: string;
};
interface ZodBigIntDef extends ZodTypeDef {
    checks: ZodBigIntCheck[];
    typeName: ZodFirstPartyTypeKind.ZodBigInt;
    coerce: boolean;
}
declare class ZodBigInt extends ZodType<bigint, ZodBigIntDef> {
    _parse(input: ParseInput): ParseReturnType<bigint>;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBigInt;
    gte(value: bigint, message?: errorUtil.ErrMessage): ZodBigInt;
    min: (value: bigint, message?: errorUtil.ErrMessage | undefined) => ZodBigInt;
    gt(value: bigint, message?: errorUtil.ErrMessage): ZodBigInt;
    lte(value: bigint, message?: errorUtil.ErrMessage): ZodBigInt;
    max: (value: bigint, message?: errorUtil.ErrMessage | undefined) => ZodBigInt;
    lt(value: bigint, message?: errorUtil.ErrMessage): ZodBigInt;
    protected setLimit(kind: "min" | "max", value: bigint, inclusive: boolean, message?: string): ZodBigInt;
    _addCheck(check: ZodBigIntCheck): ZodBigInt;
    positive(message?: errorUtil.ErrMessage): ZodBigInt;
    negative(message?: errorUtil.ErrMessage): ZodBigInt;
    nonpositive(message?: errorUtil.ErrMessage): ZodBigInt;
    nonnegative(message?: errorUtil.ErrMessage): ZodBigInt;
    multipleOf(value: bigint, message?: errorUtil.ErrMessage): ZodBigInt;
    get minValue(): bigint | null;
    get maxValue(): bigint | null;
}
interface ZodBooleanDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodBoolean;
    coerce: boolean;
}
declare class ZodBoolean extends ZodType<boolean, ZodBooleanDef> {
    _parse(input: ParseInput): ParseReturnType<boolean>;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBoolean;
}
declare type ZodDateCheck = {
    kind: "min";
    value: number;
    message?: string;
} | {
    kind: "max";
    value: number;
    message?: string;
};
interface ZodDateDef extends ZodTypeDef {
    checks: ZodDateCheck[];
    coerce: boolean;
    typeName: ZodFirstPartyTypeKind.ZodDate;
}
declare class ZodDate extends ZodType<Date, ZodDateDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    _addCheck(check: ZodDateCheck): ZodDate;
    min(minDate: Date, message?: errorUtil.ErrMessage): ZodDate;
    max(maxDate: Date, message?: errorUtil.ErrMessage): ZodDate;
    get minDate(): Date | null;
    get maxDate(): Date | null;
    static create: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodDate;
}
interface ZodSymbolDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodSymbol;
}
declare class ZodSymbol extends ZodType<symbol, ZodSymbolDef, symbol> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodSymbol;
}
interface ZodUndefinedDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUndefined;
}
declare class ZodUndefined extends ZodType<undefined, ZodUndefinedDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    params?: RawCreateParams;
    static create: (params?: RawCreateParams) => ZodUndefined;
}
interface ZodNullDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNull;
}
declare class ZodNull extends ZodType<null, ZodNullDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodNull;
}
interface ZodAnyDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodAny;
}
declare class ZodAny extends ZodType<any, ZodAnyDef> {
    _any: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodAny;
}
interface ZodUnknownDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUnknown;
}
declare class ZodUnknown extends ZodType<unknown, ZodUnknownDef> {
    _unknown: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodUnknown;
}
interface ZodNeverDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNever;
}
declare class ZodNever extends ZodType<never, ZodNeverDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodNever;
}
interface ZodVoidDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodVoid;
}
declare class ZodVoid extends ZodType<void, ZodVoidDef> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodVoid;
}
interface ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodArray;
    exactLength: {
        value: number;
        message?: string;
    } | null;
    minLength: {
        value: number;
        message?: string;
    } | null;
    maxLength: {
        value: number;
        message?: string;
    } | null;
}
declare type ArrayCardinality = "many" | "atleastone";
declare type arrayOutputType<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = Cardinality extends "atleastone" ? [T["_output"], ...T["_output"][]] : T["_output"][];
declare class ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> extends ZodType<arrayOutputType<T, Cardinality>, ZodArrayDef<T>, Cardinality extends "atleastone" ? [T["_input"], ...T["_input"][]] : T["_input"][]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): T;
    min(minLength: number, message?: errorUtil.ErrMessage): this;
    max(maxLength: number, message?: errorUtil.ErrMessage): this;
    length(len: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodArray<T, "atleastone">;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodArray<T_1, "many">;
}
declare type ZodNonEmptyArray<T extends ZodTypeAny> = ZodArray<T, "atleastone">;
declare type UnknownKeysParam = "passthrough" | "strict" | "strip";
interface ZodObjectDef<T extends ZodRawShape = ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodObject;
    shape: () => T;
    catchall: Catchall;
    unknownKeys: UnknownKeys;
}
declare type mergeTypes<A, B> = {
    [k in keyof A | keyof B]: k extends keyof B ? B[k] : k extends keyof A ? A[k] : never;
};
declare type objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny, UnknownKeys extends UnknownKeysParam = UnknownKeysParam> = objectUtil.flatten<objectUtil.addQuestionMarks<baseObjectOutputType<Shape>>> & CatchallOutput<Catchall> & PassthroughType<UnknownKeys>;
declare type baseObjectOutputType<Shape extends ZodRawShape> = {
    [k in keyof Shape]: Shape[k]["_output"];
};
declare type objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny, UnknownKeys extends UnknownKeysParam = UnknownKeysParam> = objectUtil.flatten<baseObjectInputType<Shape>> & CatchallInput<Catchall> & PassthroughType<UnknownKeys>;
declare type baseObjectInputType<Shape extends ZodRawShape> = objectUtil.addQuestionMarks<{
    [k in keyof Shape]: Shape[k]["_input"];
}>;
declare type CatchallOutput<T extends ZodTypeAny> = ZodTypeAny extends T ? unknown : {
    [k: string]: T["_output"];
};
declare type CatchallInput<T extends ZodTypeAny> = ZodTypeAny extends T ? unknown : {
    [k: string]: T["_input"];
};
declare type PassthroughType<T extends UnknownKeysParam> = T extends "passthrough" ? {
    [k: string]: unknown;
} : unknown;
declare type deoptional<T extends ZodTypeAny> = T extends ZodOptional<infer U> ? deoptional<U> : T extends ZodNullable<infer U> ? ZodNullable<deoptional<U>> : T;
declare type SomeZodObject = ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny>;
declare type noUnrecognized<Obj extends object, Shape extends object> = {
    [k in keyof Obj]: k extends keyof Shape ? Obj[k] : never;
};
declare class ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny, Output = objectOutputType<T, Catchall, UnknownKeys>, Input = objectInputType<T, Catchall, UnknownKeys>> extends ZodType<Output, ZodObjectDef<T, UnknownKeys, Catchall>, Input> {
    private _cached;
    _getCached(): {
        shape: T;
        keys: string[];
    };
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get shape(): T;
    strict(message?: errorUtil.ErrMessage): ZodObject<T, "strict", Catchall>;
    strip(): ZodObject<T, "strip", Catchall>;
    passthrough(): ZodObject<T, "passthrough", Catchall>;
    /**
     * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
     * If you want to pass through unknown properties, use `.passthrough()` instead.
     */
    nonstrict: () => ZodObject<T, "passthrough", Catchall>;
    extend<Augmentation extends ZodRawShape>(augmentation: Augmentation): ZodObject<objectUtil.extendShape<T, Augmentation>, UnknownKeys, Catchall>;
    /**
     * @deprecated Use `.extend` instead
     *  */
    augment: <Augmentation extends ZodRawShape>(augmentation: Augmentation) => ZodObject<{ [k in keyof (Omit<T, keyof Augmentation> & Augmentation)]: (Omit<T, keyof Augmentation> & Augmentation)[k]; }, UnknownKeys, Catchall, objectOutputType<{ [k in keyof (Omit<T, keyof Augmentation> & Augmentation)]: (Omit<T, keyof Augmentation> & Augmentation)[k]; }, Catchall, UnknownKeys>, objectInputType<{ [k in keyof (Omit<T, keyof Augmentation> & Augmentation)]: (Omit<T, keyof Augmentation> & Augmentation)[k]; }, Catchall, UnknownKeys>>;
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge<Incoming extends AnyZodObject, Augmentation extends Incoming["shape"]>(merging: Incoming): ZodObject<objectUtil.extendShape<T, Augmentation>, Incoming["_def"]["unknownKeys"], Incoming["_def"]["catchall"]>;
    setKey<Key extends string, Schema extends ZodTypeAny>(key: Key, schema: Schema): ZodObject<T & {
        [k in Key]: Schema;
    }, UnknownKeys, Catchall>;
    catchall<Index extends ZodTypeAny>(index: Index): ZodObject<T, UnknownKeys, Index>;
    pick<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<Pick<T, Extract<keyof T, keyof Mask>>, UnknownKeys, Catchall>;
    omit<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<Omit<T, keyof Mask>, UnknownKeys, Catchall>;
    /**
     * @deprecated
     */
    deepPartial(): partialUtil.DeepPartial<this>;
    partial(): ZodObject<{
        [k in keyof T]: ZodOptional<T[k]>;
    }, UnknownKeys, Catchall>;
    partial<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<objectUtil.noNever<{
        [k in keyof T]: k extends keyof Mask ? ZodOptional<T[k]> : T[k];
    }>, UnknownKeys, Catchall>;
    required(): ZodObject<{
        [k in keyof T]: deoptional<T[k]>;
    }, UnknownKeys, Catchall>;
    required<Mask extends {
        [k in keyof T]?: true;
    }>(mask: Mask): ZodObject<objectUtil.noNever<{
        [k in keyof T]: k extends keyof Mask ? deoptional<T[k]> : T[k];
    }>, UnknownKeys, Catchall>;
    keyof(): ZodEnum<enumUtil.UnionToTupleString<keyof T>>;
    static create: <T_1 extends ZodRawShape>(shape: T_1, params?: RawCreateParams) => ZodObject<T_1, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T_1>, { [k in keyof baseObjectOutputType<T_1>]: undefined extends baseObjectOutputType<T_1>[k] ? never : k; }[keyof T_1]>]: objectUtil.addQuestionMarks<baseObjectOutputType<T_1>, { [k in keyof baseObjectOutputType<T_1>]: undefined extends baseObjectOutputType<T_1>[k] ? never : k; }[keyof T_1]>[k_1]; }, { [k_2 in keyof baseObjectInputType<T_1>]: baseObjectInputType<T_1>[k_2]; }>;
    static strictCreate: <T_1 extends ZodRawShape>(shape: T_1, params?: RawCreateParams) => ZodObject<T_1, "strict", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T_1>, { [k in keyof baseObjectOutputType<T_1>]: undefined extends baseObjectOutputType<T_1>[k] ? never : k; }[keyof T_1]>]: objectUtil.addQuestionMarks<baseObjectOutputType<T_1>, { [k in keyof baseObjectOutputType<T_1>]: undefined extends baseObjectOutputType<T_1>[k] ? never : k; }[keyof T_1]>[k_1]; }, { [k_2 in keyof baseObjectInputType<T_1>]: baseObjectInputType<T_1>[k_2]; }>;
    static lazycreate: <T_1 extends ZodRawShape>(shape: () => T_1, params?: RawCreateParams) => ZodObject<T_1, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T_1>, { [k in keyof baseObjectOutputType<T_1>]: undefined extends baseObjectOutputType<T_1>[k] ? never : k; }[keyof T_1]>]: objectUtil.addQuestionMarks<baseObjectOutputType<T_1>, { [k in keyof baseObjectOutputType<T_1>]: undefined extends baseObjectOutputType<T_1>[k] ? never : k; }[keyof T_1]>[k_1]; }, { [k_2 in keyof baseObjectInputType<T_1>]: baseObjectInputType<T_1>[k_2]; }>;
}
declare type AnyZodObject = ZodObject<any, any, any>;
declare type ZodUnionOptions = Readonly<[ZodTypeAny, ...ZodTypeAny[]]>;
interface ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> extends ZodTypeDef {
    options: T;
    typeName: ZodFirstPartyTypeKind.ZodUnion;
}
declare class ZodUnion<T extends ZodUnionOptions> extends ZodType<T[number]["_output"], ZodUnionDef<T>, T[number]["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    static create: <T_1 extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T_1, params?: RawCreateParams) => ZodUnion<T_1>;
}
declare type ZodDiscriminatedUnionOption<Discriminator extends string> = ZodObject<{
    [key in Discriminator]: ZodTypeAny;
} & ZodRawShape, UnknownKeysParam, ZodTypeAny>;
interface ZodDiscriminatedUnionDef<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<string>[] = ZodDiscriminatedUnionOption<string>[]> extends ZodTypeDef {
    discriminator: Discriminator;
    options: Options;
    optionsMap: Map<Primitive, ZodDiscriminatedUnionOption<any>>;
    typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion;
}
declare class ZodDiscriminatedUnion<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<Discriminator>[]> extends ZodType<output<Options[number]>, ZodDiscriminatedUnionDef<Discriminator, Options>, input<Options[number]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get discriminator(): Discriminator;
    get options(): Options;
    get optionsMap(): Map<Primitive, ZodDiscriminatedUnionOption<any>>;
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create<Discriminator extends string, Types extends [
        ZodDiscriminatedUnionOption<Discriminator>,
        ...ZodDiscriminatedUnionOption<Discriminator>[]
    ]>(discriminator: Discriminator, options: Types, params?: RawCreateParams): ZodDiscriminatedUnion<Discriminator, Types>;
}
interface ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    left: T;
    right: U;
    typeName: ZodFirstPartyTypeKind.ZodIntersection;
}
declare class ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> extends ZodType<T["_output"] & U["_output"], ZodIntersectionDef<T, U>, T["_input"] & U["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny, U_1 extends ZodTypeAny>(left: T_1, right: U_1, params?: RawCreateParams) => ZodIntersection<T_1, U_1>;
}
declare type ZodTupleItems = [ZodTypeAny, ...ZodTypeAny[]];
declare type AssertArray<T> = T extends any[] ? T : never;
declare type OutputTypeOfTuple<T extends ZodTupleItems | []> = AssertArray<{
    [k in keyof T]: T[k] extends ZodType<any, any> ? T[k]["_output"] : never;
}>;
declare type OutputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = Rest extends ZodTypeAny ? [...OutputTypeOfTuple<T>, ...Rest["_output"][]] : OutputTypeOfTuple<T>;
declare type InputTypeOfTuple<T extends ZodTupleItems | []> = AssertArray<{
    [k in keyof T]: T[k] extends ZodType<any, any> ? T[k]["_input"] : never;
}>;
declare type InputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = Rest extends ZodTypeAny ? [...InputTypeOfTuple<T>, ...Rest["_input"][]] : InputTypeOfTuple<T>;
interface ZodTupleDef<T extends ZodTupleItems | [] = ZodTupleItems, Rest extends ZodTypeAny | null = null> extends ZodTypeDef {
    items: T;
    rest: Rest;
    typeName: ZodFirstPartyTypeKind.ZodTuple;
}
declare type AnyZodTuple = ZodTuple<[
    ZodTypeAny,
    ...ZodTypeAny[]
] | [], ZodTypeAny | null>;
declare class ZodTuple<T extends [ZodTypeAny, ...ZodTypeAny[]] | [] = [ZodTypeAny, ...ZodTypeAny[]], Rest extends ZodTypeAny | null = null> extends ZodType<OutputTypeOfTupleWithRest<T, Rest>, ZodTupleDef<T, Rest>, InputTypeOfTupleWithRest<T, Rest>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get items(): T;
    rest<Rest extends ZodTypeAny>(rest: Rest): ZodTuple<T, Rest>;
    static create: <T_1 extends [] | [ZodTypeAny, ...ZodTypeAny[]]>(schemas: T_1, params?: RawCreateParams) => ZodTuple<T_1, null>;
}
interface ZodRecordDef<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    keyType: Key;
    typeName: ZodFirstPartyTypeKind.ZodRecord;
}
declare type KeySchema = ZodType<string | number | symbol, any, any>;
declare type RecordType<K extends string | number | symbol, V> = [
    string
] extends [K] ? Record<K, V> : [number] extends [K] ? Record<K, V> : [symbol] extends [K] ? Record<K, V> : [BRAND<string | number | symbol>] extends [K] ? Record<K, V> : Partial<Record<K, V>>;
declare class ZodRecord<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> extends ZodType<RecordType<Key["_output"], Value["_output"]>, ZodRecordDef<Key, Value>, RecordType<Key["_input"], Value["_input"]>> {
    get keySchema(): Key;
    get valueSchema(): Value;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): Value;
    static create<Value extends ZodTypeAny>(valueType: Value, params?: RawCreateParams): ZodRecord<ZodString, Value>;
    static create<Keys extends KeySchema, Value extends ZodTypeAny>(keySchema: Keys, valueType: Value, params?: RawCreateParams): ZodRecord<Keys, Value>;
}
interface ZodMapDef<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    keyType: Key;
    typeName: ZodFirstPartyTypeKind.ZodMap;
}
declare class ZodMap<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> extends ZodType<Map<Key["_output"], Value["_output"]>, ZodMapDef<Key, Value>, Map<Key["_input"], Value["_input"]>> {
    get keySchema(): Key;
    get valueSchema(): Value;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <Key_1 extends ZodTypeAny = ZodTypeAny, Value_1 extends ZodTypeAny = ZodTypeAny>(keyType: Key_1, valueType: Value_1, params?: RawCreateParams) => ZodMap<Key_1, Value_1>;
}
interface ZodSetDef<Value extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    valueType: Value;
    typeName: ZodFirstPartyTypeKind.ZodSet;
    minSize: {
        value: number;
        message?: string;
    } | null;
    maxSize: {
        value: number;
        message?: string;
    } | null;
}
declare class ZodSet<Value extends ZodTypeAny = ZodTypeAny> extends ZodType<Set<Value["_output"]>, ZodSetDef<Value>, Set<Value["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    min(minSize: number, message?: errorUtil.ErrMessage): this;
    max(maxSize: number, message?: errorUtil.ErrMessage): this;
    size(size: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodSet<Value>;
    static create: <Value_1 extends ZodTypeAny = ZodTypeAny>(valueType: Value_1, params?: RawCreateParams) => ZodSet<Value_1>;
}
interface ZodFunctionDef<Args extends ZodTuple<any, any> = ZodTuple<any, any>, Returns extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    args: Args;
    returns: Returns;
    typeName: ZodFirstPartyTypeKind.ZodFunction;
}
declare type OuterTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = Args["_input"] extends Array<any> ? (...args: Args["_input"]) => Returns["_output"] : never;
declare type InnerTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = Args["_output"] extends Array<any> ? (...args: Args["_output"]) => Returns["_input"] : never;
declare class ZodFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> extends ZodType<OuterTypeOfFunction<Args, Returns>, ZodFunctionDef<Args, Returns>, InnerTypeOfFunction<Args, Returns>> {
    _parse(input: ParseInput): ParseReturnType<any>;
    parameters(): Args;
    returnType(): Returns;
    args<Items extends Parameters<(typeof ZodTuple)["create"]>[0]>(...items: Items): ZodFunction<ZodTuple<Items, ZodUnknown>, Returns>;
    returns<NewReturnType extends ZodType<any, any>>(returnType: NewReturnType): ZodFunction<Args, NewReturnType>;
    implement<F extends InnerTypeOfFunction<Args, Returns>>(func: F): ReturnType<F> extends Returns["_output"] ? (...args: Args["_input"]) => ReturnType<F> : OuterTypeOfFunction<Args, Returns>;
    strictImplement(func: InnerTypeOfFunction<Args, Returns>): InnerTypeOfFunction<Args, Returns>;
    validate: <F extends InnerTypeOfFunction<Args, Returns>>(func: F) => ReturnType<F> extends Returns["_output"] ? (...args: Args["_input"]) => ReturnType<F> : OuterTypeOfFunction<Args, Returns>;
    static create(): ZodFunction<ZodTuple<[], ZodUnknown>, ZodUnknown>;
    static create<T extends AnyZodTuple = ZodTuple<[], ZodUnknown>>(args: T): ZodFunction<T, ZodUnknown>;
    static create<T extends AnyZodTuple, U extends ZodTypeAny>(args: T, returns: U): ZodFunction<T, U>;
    static create<T extends AnyZodTuple = ZodTuple<[], ZodUnknown>, U extends ZodTypeAny = ZodUnknown>(args: T, returns: U, params?: RawCreateParams): ZodFunction<T, U>;
}
interface ZodLazyDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    getter: () => T;
    typeName: ZodFirstPartyTypeKind.ZodLazy;
}
declare class ZodLazy<T extends ZodTypeAny> extends ZodType<output<T>, ZodLazyDef<T>, input<T>> {
    get schema(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(getter: () => T_1, params?: RawCreateParams) => ZodLazy<T_1>;
}
interface ZodLiteralDef<T = any> extends ZodTypeDef {
    value: T;
    typeName: ZodFirstPartyTypeKind.ZodLiteral;
}
declare class ZodLiteral<T> extends ZodType<T, ZodLiteralDef<T>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get value(): T;
    static create: <T_1 extends Primitive>(value: T_1, params?: RawCreateParams) => ZodLiteral<T_1>;
}
declare type ArrayKeys = keyof any[];
declare type Indices<T> = Exclude<keyof T, ArrayKeys>;
declare type EnumValues = [string, ...string[]];
declare type Values<T extends EnumValues> = {
    [k in T[number]]: k;
};
interface ZodEnumDef<T extends EnumValues = EnumValues> extends ZodTypeDef {
    values: T;
    typeName: ZodFirstPartyTypeKind.ZodEnum;
}
declare type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
declare type FilterEnum<Values, ToExclude> = Values extends [] ? [] : Values extends [infer Head, ...infer Rest] ? Head extends ToExclude ? FilterEnum<Rest, ToExclude> : [Head, ...FilterEnum<Rest, ToExclude>] : never;
declare type typecast<A, T> = A extends T ? A : never;
declare function createZodEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T, params?: RawCreateParams): ZodEnum<Writeable<T>>;
declare function createZodEnum<U extends string, T extends [U, ...U[]]>(values: T, params?: RawCreateParams): ZodEnum<T>;
declare class ZodEnum<T extends [string, ...string[]]> extends ZodType<T[number], ZodEnumDef<T>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    get enum(): Values<T>;
    get Values(): Values<T>;
    get Enum(): Values<T>;
    extract<ToExtract extends readonly [T[number], ...T[number][]]>(values: ToExtract): ZodEnum<Writeable<ToExtract>>;
    exclude<ToExclude extends readonly [T[number], ...T[number][]]>(values: ToExclude): ZodEnum<typecast<Writeable<FilterEnum<T, ToExclude[number]>>, [string, ...string[]]>>;
    static create: typeof createZodEnum;
}
interface ZodNativeEnumDef<T extends EnumLike = EnumLike> extends ZodTypeDef {
    values: T;
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum;
}
declare type EnumLike = {
    [k: string]: string | number;
    [nu: number]: string;
};
declare class ZodNativeEnum<T extends EnumLike> extends ZodType<T[keyof T], ZodNativeEnumDef<T>> {
    _parse(input: ParseInput): ParseReturnType<T[keyof T]>;
    get enum(): T;
    static create: <T_1 extends EnumLike>(values: T_1, params?: RawCreateParams) => ZodNativeEnum<T_1>;
}
interface ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodPromise;
}
declare class ZodPromise<T extends ZodTypeAny> extends ZodType<Promise<T["_output"]>, ZodPromiseDef<T>, Promise<T["_input"]>> {
    unwrap(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodPromise<T_1>;
}
declare type Refinement<T> = (arg: T, ctx: RefinementCtx) => any;
declare type SuperRefinement<T> = (arg: T, ctx: RefinementCtx) => void | Promise<void>;
declare type RefinementEffect<T> = {
    type: "refinement";
    refinement: (arg: T, ctx: RefinementCtx) => any;
};
declare type TransformEffect<T> = {
    type: "transform";
    transform: (arg: T, ctx: RefinementCtx) => any;
};
declare type PreprocessEffect<T> = {
    type: "preprocess";
    transform: (arg: T, ctx: RefinementCtx) => any;
};
declare type Effect<T> = RefinementEffect<T> | TransformEffect<T> | PreprocessEffect<T>;
interface ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    schema: T;
    typeName: ZodFirstPartyTypeKind.ZodEffects;
    effect: Effect<any>;
}
declare class ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<T>> extends ZodType<Output, ZodEffectsDef<T>, Input> {
    innerType(): T;
    sourceType(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"], input<I>>;
    static createWithPreprocess: <I extends ZodTypeAny>(preprocess: (arg: unknown, ctx: RefinementCtx) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], unknown>;
}

interface ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodOptional;
}
declare type ZodOptionalType<T extends ZodTypeAny> = ZodOptional<T>;
declare class ZodOptional<T extends ZodTypeAny> extends ZodType<T["_output"] | undefined, ZodOptionalDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodOptional<T_1>;
}
interface ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodNullable;
}
declare type ZodNullableType<T extends ZodTypeAny> = ZodNullable<T>;
declare class ZodNullable<T extends ZodTypeAny> extends ZodType<T["_output"] | null, ZodNullableDef<T>, T["_input"] | null> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodNullable<T_1>;
}
interface ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    defaultValue: () => util.noUndefined<T["_input"]>;
    typeName: ZodFirstPartyTypeKind.ZodDefault;
}
declare class ZodDefault<T extends ZodTypeAny> extends ZodType<util.noUndefined<T["_output"]>, ZodDefaultDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeDefault(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params: {
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        default: T_1["_input"] | (() => util.noUndefined<T_1["_input"]>);
    }) => ZodDefault<T_1>;
}
interface ZodCatchDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    catchValue: (ctx: {
        error: ZodError;
        input: unknown;
    }) => T["_input"];
    typeName: ZodFirstPartyTypeKind.ZodCatch;
}
declare class ZodCatch<T extends ZodTypeAny> extends ZodType<T["_output"], ZodCatchDef<T>, unknown> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeCatch(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params: {
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        catch: T_1["_output"] | (() => T_1["_output"]);
    }) => ZodCatch<T_1>;
}
interface ZodNaNDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodNaN;
}
declare class ZodNaN extends ZodType<number, ZodNaNDef> {
    _parse(input: ParseInput): ParseReturnType<any>;
    static create: (params?: RawCreateParams) => ZodNaN;
}
interface ZodBrandedDef<T extends ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodBranded;
}
declare const BRAND: unique symbol;
declare type BRAND<T extends string | number | symbol> = {
    [BRAND]: {
        [k in T]: true;
    };
};
declare class ZodBranded<T extends ZodTypeAny, B extends string | number | symbol> extends ZodType<T["_output"] & BRAND<B>, ZodBrandedDef<T>, T["_input"]> {
    _parse(input: ParseInput): ParseReturnType<any>;
    unwrap(): T;
}
interface ZodPipelineDef<A extends ZodTypeAny, B extends ZodTypeAny> extends ZodTypeDef {
    in: A;
    out: B;
    typeName: ZodFirstPartyTypeKind.ZodPipeline;
}
declare class ZodPipeline<A extends ZodTypeAny, B extends ZodTypeAny> extends ZodType<B["_output"], ZodPipelineDef<A, B>, A["_input"]> {
    _parse(input: ParseInput): ParseReturnType<any>;
    static create<A extends ZodTypeAny, B extends ZodTypeAny>(a: A, b: B): ZodPipeline<A, B>;
}
declare type BuiltIn = (((...args: any[]) => any) | (new (...args: any[]) => any)) | {
    readonly [Symbol.toStringTag]: string;
} | Date | Error | Generator | Promise<unknown> | RegExp;
declare type MakeReadonly<T> = T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : T extends Set<infer V> ? ReadonlySet<V> : T extends [infer Head, ...infer Tail] ? readonly [Head, ...Tail] : T extends Array<infer V> ? ReadonlyArray<V> : T extends BuiltIn ? T : Readonly<T>;
interface ZodReadonlyDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodReadonly;
}
declare class ZodReadonly<T extends ZodTypeAny> extends ZodType<MakeReadonly<T["_output"]>, ZodReadonlyDef<T>, T["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodReadonly<T_1>;
}
declare type CustomParams = CustomErrorParams & {
    fatal?: boolean;
};
declare const custom: <T>(check?: ((data: unknown) => any) | undefined, params?: string | CustomParams | ((input: any) => CustomParams), fatal?: boolean | undefined) => ZodType<T, ZodTypeDef, T>;

declare const late: {
    object: <T extends ZodRawShape>(shape: () => T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T>, { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k; }[keyof T]>]: objectUtil.addQuestionMarks<baseObjectOutputType<T>, { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k; }[keyof T]>[k_1]; }, { [k_2 in keyof baseObjectInputType<T>]: baseObjectInputType<T>[k_2]; }>;
};
declare enum ZodFirstPartyTypeKind {
    ZodString = "ZodString",
    ZodNumber = "ZodNumber",
    ZodNaN = "ZodNaN",
    ZodBigInt = "ZodBigInt",
    ZodBoolean = "ZodBoolean",
    ZodDate = "ZodDate",
    ZodSymbol = "ZodSymbol",
    ZodUndefined = "ZodUndefined",
    ZodNull = "ZodNull",
    ZodAny = "ZodAny",
    ZodUnknown = "ZodUnknown",
    ZodNever = "ZodNever",
    ZodVoid = "ZodVoid",
    ZodArray = "ZodArray",
    ZodObject = "ZodObject",
    ZodUnion = "ZodUnion",
    ZodDiscriminatedUnion = "ZodDiscriminatedUnion",
    ZodIntersection = "ZodIntersection",
    ZodTuple = "ZodTuple",
    ZodRecord = "ZodRecord",
    ZodMap = "ZodMap",
    ZodSet = "ZodSet",
    ZodFunction = "ZodFunction",
    ZodLazy = "ZodLazy",
    ZodLiteral = "ZodLiteral",
    ZodEnum = "ZodEnum",
    ZodEffects = "ZodEffects",
    ZodNativeEnum = "ZodNativeEnum",
    ZodOptional = "ZodOptional",
    ZodNullable = "ZodNullable",
    ZodDefault = "ZodDefault",
    ZodCatch = "ZodCatch",
    ZodPromise = "ZodPromise",
    ZodBranded = "ZodBranded",
    ZodPipeline = "ZodPipeline",
    ZodReadonly = "ZodReadonly"
}
declare type ZodFirstPartySchemaTypes = ZodString | ZodNumber | ZodNaN | ZodBigInt | ZodBoolean | ZodDate | ZodUndefined | ZodNull | ZodAny | ZodUnknown | ZodNever | ZodVoid | ZodArray<any, any> | ZodObject<any, any, any> | ZodUnion<any> | ZodDiscriminatedUnion<any, any> | ZodIntersection<any, any> | ZodTuple<any, any> | ZodRecord<any, any> | ZodMap<any> | ZodSet<any> | ZodFunction<any, any> | ZodLazy<any> | ZodLiteral<any> | ZodEnum<any> | ZodEffects<any, any, any> | ZodNativeEnum<any> | ZodOptional<any> | ZodNullable<any> | ZodDefault<any> | ZodCatch<any> | ZodPromise<any> | ZodBranded<any, any> | ZodPipeline<any, any>;
declare abstract class Class {
    constructor(..._: any[]);
}
declare const instanceOfType: <T extends typeof Class>(cls: T, params?: CustomParams) => ZodType<InstanceType<T>, ZodTypeDef, InstanceType<T>>;
declare const stringType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: true | undefined;
}) | undefined) => ZodString;
declare const numberType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodNumber;
declare const nanType: (params?: RawCreateParams) => ZodNaN;
declare const bigIntType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodBigInt;
declare const booleanType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodBoolean;
declare const dateType: (params?: ({
    errorMap?: ZodErrorMap | undefined;
    invalid_type_error?: string | undefined;
    required_error?: string | undefined;
    description?: string | undefined;
} & {
    coerce?: boolean | undefined;
}) | undefined) => ZodDate;
declare const symbolType: (params?: RawCreateParams) => ZodSymbol;
declare const undefinedType: (params?: RawCreateParams) => ZodUndefined;
declare const nullType: (params?: RawCreateParams) => ZodNull;
declare const anyType: (params?: RawCreateParams) => ZodAny;
declare const unknownType: (params?: RawCreateParams) => ZodUnknown;
declare const neverType: (params?: RawCreateParams) => ZodNever;
declare const voidType: (params?: RawCreateParams) => ZodVoid;
declare const arrayType: <T extends ZodTypeAny>(schema: T, params?: RawCreateParams) => ZodArray<T, "many">;
declare const objectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T>, { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k; }[keyof T]>]: objectUtil.addQuestionMarks<baseObjectOutputType<T>, { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k; }[keyof T]>[k_1]; }, { [k_2 in keyof baseObjectInputType<T>]: baseObjectInputType<T>[k_2]; }>;
declare const strictObjectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strict", ZodTypeAny, { [k_1 in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T>, { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k; }[keyof T]>]: objectUtil.addQuestionMarks<baseObjectOutputType<T>, { [k in keyof baseObjectOutputType<T>]: undefined extends baseObjectOutputType<T>[k] ? never : k; }[keyof T]>[k_1]; }, { [k_2 in keyof baseObjectInputType<T>]: baseObjectInputType<T>[k_2]; }>;
declare const unionType: <T extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T, params?: RawCreateParams) => ZodUnion<T>;
declare const discriminatedUnionType: typeof ZodDiscriminatedUnion.create;
declare const intersectionType: <T extends ZodTypeAny, U extends ZodTypeAny>(left: T, right: U, params?: RawCreateParams) => ZodIntersection<T, U>;
declare const tupleType: <T extends [] | [ZodTypeAny, ...ZodTypeAny[]]>(schemas: T, params?: RawCreateParams) => ZodTuple<T, null>;
declare const recordType: typeof ZodRecord.create;
declare const mapType: <Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny>(keyType: Key, valueType: Value, params?: RawCreateParams) => ZodMap<Key, Value>;
declare const setType: <Value extends ZodTypeAny = ZodTypeAny>(valueType: Value, params?: RawCreateParams) => ZodSet<Value>;
declare const functionType: typeof ZodFunction.create;
declare const lazyType: <T extends ZodTypeAny>(getter: () => T, params?: RawCreateParams) => ZodLazy<T>;
declare const literalType: <T extends Primitive>(value: T, params?: RawCreateParams) => ZodLiteral<T>;
declare const enumType: typeof createZodEnum;
declare const nativeEnumType: <T extends EnumLike>(values: T, params?: RawCreateParams) => ZodNativeEnum<T>;
declare const promiseType: <T extends ZodTypeAny>(schema: T, params?: RawCreateParams) => ZodPromise<T>;
declare const effectsType: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"], input<I>>;
declare const optionalType: <T extends ZodTypeAny>(type: T, params?: RawCreateParams) => ZodOptional<T>;
declare const nullableType: <T extends ZodTypeAny>(type: T, params?: RawCreateParams) => ZodNullable<T>;
declare const preprocessType: <I extends ZodTypeAny>(preprocess: (arg: unknown, ctx: RefinementCtx) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], unknown>;
declare const pipelineType: typeof ZodPipeline.create;
declare const ostring: () => ZodOptional<ZodString>;
declare const onumber: () => ZodOptional<ZodNumber>;
declare const oboolean: () => ZodOptional<ZodBoolean>;
declare const coerce: {
    string: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: true | undefined;
    }) | undefined) => ZodString;
    number: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodNumber;
    boolean: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBoolean;
    bigint: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodBigInt;
    date: (params?: ({
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        description?: string | undefined;
    } & {
        coerce?: boolean | undefined;
    }) | undefined) => ZodDate;
};

declare const NEVER: never;

type z_AnyZodObject = AnyZodObject;
type z_AnyZodTuple = AnyZodTuple;
type z_ArrayCardinality = ArrayCardinality;
type z_ArrayKeys = ArrayKeys;
type z_AssertArray<T> = AssertArray<T>;
type z_AsyncParseReturnType<T> = AsyncParseReturnType<T>;
type z_BRAND<T extends string | number | symbol> = BRAND<T>;
type z_CatchallInput<T extends ZodTypeAny> = CatchallInput<T>;
type z_CatchallOutput<T extends ZodTypeAny> = CatchallOutput<T>;
type z_CustomErrorParams = CustomErrorParams;
declare const z_DIRTY: typeof DIRTY;
type z_DenormalizedError = DenormalizedError;
declare const z_EMPTY_PATH: typeof EMPTY_PATH;
type z_Effect<T> = Effect<T>;
type z_EnumLike = EnumLike;
type z_EnumValues = EnumValues;
type z_ErrorMapCtx = ErrorMapCtx;
type z_FilterEnum<Values, ToExclude> = FilterEnum<Values, ToExclude>;
declare const z_INVALID: typeof INVALID;
type z_Indices<T> = Indices<T>;
type z_InnerTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = InnerTypeOfFunction<Args, Returns>;
type z_InputTypeOfTuple<T extends ZodTupleItems | []> = InputTypeOfTuple<T>;
type z_InputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = InputTypeOfTupleWithRest<T, Rest>;
type z_IpVersion = IpVersion;
type z_IssueData = IssueData;
type z_KeySchema = KeySchema;
declare const z_NEVER: typeof NEVER;
declare const z_OK: typeof OK;
type z_ObjectPair = ObjectPair;
type z_OuterTypeOfFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = OuterTypeOfFunction<Args, Returns>;
type z_OutputTypeOfTuple<T extends ZodTupleItems | []> = OutputTypeOfTuple<T>;
type z_OutputTypeOfTupleWithRest<T extends ZodTupleItems | [], Rest extends ZodTypeAny | null = null> = OutputTypeOfTupleWithRest<T, Rest>;
type z_ParseContext = ParseContext;
type z_ParseInput = ParseInput;
type z_ParseParams = ParseParams;
type z_ParsePath = ParsePath;
type z_ParsePathComponent = ParsePathComponent;
type z_ParseResult = ParseResult;
type z_ParseReturnType<T> = ParseReturnType<T>;
type z_ParseStatus = ParseStatus;
declare const z_ParseStatus: typeof ParseStatus;
type z_PassthroughType<T extends UnknownKeysParam> = PassthroughType<T>;
type z_PreprocessEffect<T> = PreprocessEffect<T>;
type z_Primitive = Primitive;
type z_ProcessedCreateParams = ProcessedCreateParams;
type z_RawCreateParams = RawCreateParams;
type z_RecordType<K extends string | number | symbol, V> = RecordType<K, V>;
type z_Refinement<T> = Refinement<T>;
type z_RefinementCtx = RefinementCtx;
type z_RefinementEffect<T> = RefinementEffect<T>;
type z_SafeParseError<Input> = SafeParseError<Input>;
type z_SafeParseReturnType<Input, Output> = SafeParseReturnType<Input, Output>;
type z_SafeParseSuccess<Output> = SafeParseSuccess<Output>;
type z_Scalars = Scalars;
type z_SomeZodObject = SomeZodObject;
type z_StringValidation = StringValidation;
type z_SuperRefinement<T> = SuperRefinement<T>;
type z_SyncParseReturnType<T = any> = SyncParseReturnType<T>;
type z_TransformEffect<T> = TransformEffect<T>;
type z_TypeOf<T extends ZodType<any, any, any>> = TypeOf<T>;
type z_UnknownKeysParam = UnknownKeysParam;
type z_Values<T extends EnumValues> = Values<T>;
type z_Writeable<T> = Writeable<T>;
type z_ZodAny = ZodAny;
declare const z_ZodAny: typeof ZodAny;
type z_ZodAnyDef = ZodAnyDef;
type z_ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = ZodArray<T, Cardinality>;
declare const z_ZodArray: typeof ZodArray;
type z_ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> = ZodArrayDef<T>;
type z_ZodBigInt = ZodBigInt;
declare const z_ZodBigInt: typeof ZodBigInt;
type z_ZodBigIntCheck = ZodBigIntCheck;
type z_ZodBigIntDef = ZodBigIntDef;
type z_ZodBoolean = ZodBoolean;
declare const z_ZodBoolean: typeof ZodBoolean;
type z_ZodBooleanDef = ZodBooleanDef;
type z_ZodBranded<T extends ZodTypeAny, B extends string | number | symbol> = ZodBranded<T, B>;
declare const z_ZodBranded: typeof ZodBranded;
type z_ZodBrandedDef<T extends ZodTypeAny> = ZodBrandedDef<T>;
type z_ZodCatch<T extends ZodTypeAny> = ZodCatch<T>;
declare const z_ZodCatch: typeof ZodCatch;
type z_ZodCatchDef<T extends ZodTypeAny = ZodTypeAny> = ZodCatchDef<T>;
type z_ZodCustomIssue = ZodCustomIssue;
type z_ZodDate = ZodDate;
declare const z_ZodDate: typeof ZodDate;
type z_ZodDateCheck = ZodDateCheck;
type z_ZodDateDef = ZodDateDef;
type z_ZodDefault<T extends ZodTypeAny> = ZodDefault<T>;
declare const z_ZodDefault: typeof ZodDefault;
type z_ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> = ZodDefaultDef<T>;
type z_ZodDiscriminatedUnion<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<Discriminator>[]> = ZodDiscriminatedUnion<Discriminator, Options>;
declare const z_ZodDiscriminatedUnion: typeof ZodDiscriminatedUnion;
type z_ZodDiscriminatedUnionDef<Discriminator extends string, Options extends ZodDiscriminatedUnionOption<string>[] = ZodDiscriminatedUnionOption<string>[]> = ZodDiscriminatedUnionDef<Discriminator, Options>;
type z_ZodDiscriminatedUnionOption<Discriminator extends string> = ZodDiscriminatedUnionOption<Discriminator>;
type z_ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<T>> = ZodEffects<T, Output, Input>;
declare const z_ZodEffects: typeof ZodEffects;
type z_ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> = ZodEffectsDef<T>;
type z_ZodEnum<T extends [string, ...string[]]> = ZodEnum<T>;
declare const z_ZodEnum: typeof ZodEnum;
type z_ZodEnumDef<T extends EnumValues = EnumValues> = ZodEnumDef<T>;
type z_ZodError<T = any> = ZodError<T>;
declare const z_ZodError: typeof ZodError;
type z_ZodErrorMap = ZodErrorMap;
type z_ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes;
type z_ZodFirstPartyTypeKind = ZodFirstPartyTypeKind;
declare const z_ZodFirstPartyTypeKind: typeof ZodFirstPartyTypeKind;
type z_ZodFormattedError<T, U = string> = ZodFormattedError<T, U>;
type z_ZodFunction<Args extends ZodTuple<any, any>, Returns extends ZodTypeAny> = ZodFunction<Args, Returns>;
declare const z_ZodFunction: typeof ZodFunction;
type z_ZodFunctionDef<Args extends ZodTuple<any, any> = ZodTuple<any, any>, Returns extends ZodTypeAny = ZodTypeAny> = ZodFunctionDef<Args, Returns>;
type z_ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> = ZodIntersection<T, U>;
declare const z_ZodIntersection: typeof ZodIntersection;
type z_ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> = ZodIntersectionDef<T, U>;
type z_ZodInvalidArgumentsIssue = ZodInvalidArgumentsIssue;
type z_ZodInvalidDateIssue = ZodInvalidDateIssue;
type z_ZodInvalidEnumValueIssue = ZodInvalidEnumValueIssue;
type z_ZodInvalidIntersectionTypesIssue = ZodInvalidIntersectionTypesIssue;
type z_ZodInvalidLiteralIssue = ZodInvalidLiteralIssue;
type z_ZodInvalidReturnTypeIssue = ZodInvalidReturnTypeIssue;
type z_ZodInvalidStringIssue = ZodInvalidStringIssue;
type z_ZodInvalidTypeIssue = ZodInvalidTypeIssue;
type z_ZodInvalidUnionDiscriminatorIssue = ZodInvalidUnionDiscriminatorIssue;
type z_ZodInvalidUnionIssue = ZodInvalidUnionIssue;
type z_ZodIssue = ZodIssue;
type z_ZodIssueBase = ZodIssueBase;
type z_ZodIssueCode = ZodIssueCode;
type z_ZodIssueOptionalMessage = ZodIssueOptionalMessage;
type z_ZodLazy<T extends ZodTypeAny> = ZodLazy<T>;
declare const z_ZodLazy: typeof ZodLazy;
type z_ZodLazyDef<T extends ZodTypeAny = ZodTypeAny> = ZodLazyDef<T>;
type z_ZodLiteral<T> = ZodLiteral<T>;
declare const z_ZodLiteral: typeof ZodLiteral;
type z_ZodLiteralDef<T = any> = ZodLiteralDef<T>;
type z_ZodMap<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> = ZodMap<Key, Value>;
declare const z_ZodMap: typeof ZodMap;
type z_ZodMapDef<Key extends ZodTypeAny = ZodTypeAny, Value extends ZodTypeAny = ZodTypeAny> = ZodMapDef<Key, Value>;
type z_ZodNaN = ZodNaN;
declare const z_ZodNaN: typeof ZodNaN;
type z_ZodNaNDef = ZodNaNDef;
type z_ZodNativeEnum<T extends EnumLike> = ZodNativeEnum<T>;
declare const z_ZodNativeEnum: typeof ZodNativeEnum;
type z_ZodNativeEnumDef<T extends EnumLike = EnumLike> = ZodNativeEnumDef<T>;
type z_ZodNever = ZodNever;
declare const z_ZodNever: typeof ZodNever;
type z_ZodNeverDef = ZodNeverDef;
type z_ZodNonEmptyArray<T extends ZodTypeAny> = ZodNonEmptyArray<T>;
type z_ZodNotFiniteIssue = ZodNotFiniteIssue;
type z_ZodNotMultipleOfIssue = ZodNotMultipleOfIssue;
type z_ZodNull = ZodNull;
declare const z_ZodNull: typeof ZodNull;
type z_ZodNullDef = ZodNullDef;
type z_ZodNullable<T extends ZodTypeAny> = ZodNullable<T>;
declare const z_ZodNullable: typeof ZodNullable;
type z_ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> = ZodNullableDef<T>;
type z_ZodNullableType<T extends ZodTypeAny> = ZodNullableType<T>;
type z_ZodNumber = ZodNumber;
declare const z_ZodNumber: typeof ZodNumber;
type z_ZodNumberCheck = ZodNumberCheck;
type z_ZodNumberDef = ZodNumberDef;
type z_ZodObject<T extends ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny, Output = objectOutputType<T, Catchall, UnknownKeys>, Input = objectInputType<T, Catchall, UnknownKeys>> = ZodObject<T, UnknownKeys, Catchall, Output, Input>;
declare const z_ZodObject: typeof ZodObject;
type z_ZodObjectDef<T extends ZodRawShape = ZodRawShape, UnknownKeys extends UnknownKeysParam = UnknownKeysParam, Catchall extends ZodTypeAny = ZodTypeAny> = ZodObjectDef<T, UnknownKeys, Catchall>;
type z_ZodOptional<T extends ZodTypeAny> = ZodOptional<T>;
declare const z_ZodOptional: typeof ZodOptional;
type z_ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> = ZodOptionalDef<T>;
type z_ZodOptionalType<T extends ZodTypeAny> = ZodOptionalType<T>;
type z_ZodParsedType = ZodParsedType;
type z_ZodPipeline<A extends ZodTypeAny, B extends ZodTypeAny> = ZodPipeline<A, B>;
declare const z_ZodPipeline: typeof ZodPipeline;
type z_ZodPipelineDef<A extends ZodTypeAny, B extends ZodTypeAny> = ZodPipelineDef<A, B>;
type z_ZodPromise<T extends ZodTypeAny> = ZodPromise<T>;
declare const z_ZodPromise: typeof ZodPromise;
type z_ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> = ZodPromiseDef<T>;
type z_ZodRawShape = ZodRawShape;
type z_ZodReadonly<T extends ZodTypeAny> = ZodReadonly<T>;
declare const z_ZodReadonly: typeof ZodReadonly;
type z_ZodReadonlyDef<T extends ZodTypeAny = ZodTypeAny> = ZodReadonlyDef<T>;
type z_ZodRecord<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> = ZodRecord<Key, Value>;
declare const z_ZodRecord: typeof ZodRecord;
type z_ZodRecordDef<Key extends KeySchema = ZodString, Value extends ZodTypeAny = ZodTypeAny> = ZodRecordDef<Key, Value>;
type z_ZodSet<Value extends ZodTypeAny = ZodTypeAny> = ZodSet<Value>;
declare const z_ZodSet: typeof ZodSet;
type z_ZodSetDef<Value extends ZodTypeAny = ZodTypeAny> = ZodSetDef<Value>;
type z_ZodString = ZodString;
declare const z_ZodString: typeof ZodString;
type z_ZodStringCheck = ZodStringCheck;
type z_ZodStringDef = ZodStringDef;
type z_ZodSymbol = ZodSymbol;
declare const z_ZodSymbol: typeof ZodSymbol;
type z_ZodSymbolDef = ZodSymbolDef;
type z_ZodTooBigIssue = ZodTooBigIssue;
type z_ZodTooSmallIssue = ZodTooSmallIssue;
type z_ZodTuple<T extends [ZodTypeAny, ...ZodTypeAny[]] | [] = [ZodTypeAny, ...ZodTypeAny[]], Rest extends ZodTypeAny | null = null> = ZodTuple<T, Rest>;
declare const z_ZodTuple: typeof ZodTuple;
type z_ZodTupleDef<T extends ZodTupleItems | [] = ZodTupleItems, Rest extends ZodTypeAny | null = null> = ZodTupleDef<T, Rest>;
type z_ZodTupleItems = ZodTupleItems;
type z_ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> = ZodType<Output, Def, Input>;
declare const z_ZodType: typeof ZodType;
type z_ZodTypeAny = ZodTypeAny;
type z_ZodTypeDef = ZodTypeDef;
type z_ZodUndefined = ZodUndefined;
declare const z_ZodUndefined: typeof ZodUndefined;
type z_ZodUndefinedDef = ZodUndefinedDef;
type z_ZodUnion<T extends ZodUnionOptions> = ZodUnion<T>;
declare const z_ZodUnion: typeof ZodUnion;
type z_ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> = ZodUnionDef<T>;
type z_ZodUnionOptions = ZodUnionOptions;
type z_ZodUnknown = ZodUnknown;
declare const z_ZodUnknown: typeof ZodUnknown;
type z_ZodUnknownDef = ZodUnknownDef;
type z_ZodUnrecognizedKeysIssue = ZodUnrecognizedKeysIssue;
type z_ZodVoid = ZodVoid;
declare const z_ZodVoid: typeof ZodVoid;
type z_ZodVoidDef = ZodVoidDef;
declare const z_addIssueToContext: typeof addIssueToContext;
type z_arrayOutputType<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = arrayOutputType<T, Cardinality>;
type z_baseObjectInputType<Shape extends ZodRawShape> = baseObjectInputType<Shape>;
type z_baseObjectOutputType<Shape extends ZodRawShape> = baseObjectOutputType<Shape>;
declare const z_coerce: typeof coerce;
declare const z_custom: typeof custom;
type z_deoptional<T extends ZodTypeAny> = deoptional<T>;
declare const z_getErrorMap: typeof getErrorMap;
declare const z_getParsedType: typeof getParsedType;
type z_inferFlattenedErrors<T extends ZodType<any, any, any>, U = string> = inferFlattenedErrors<T, U>;
type z_inferFormattedError<T extends ZodType<any, any, any>, U = string> = inferFormattedError<T, U>;
type z_input<T extends ZodType<any, any, any>> = input<T>;
declare const z_isAborted: typeof isAborted;
declare const z_isAsync: typeof isAsync;
declare const z_isDirty: typeof isDirty;
declare const z_isValid: typeof isValid;
declare const z_late: typeof late;
declare const z_makeIssue: typeof makeIssue;
type z_mergeTypes<A, B> = mergeTypes<A, B>;
type z_noUnrecognized<Obj extends object, Shape extends object> = noUnrecognized<Obj, Shape>;
type z_objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny, UnknownKeys extends UnknownKeysParam = UnknownKeysParam> = objectInputType<Shape, Catchall, UnknownKeys>;
type z_objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny, UnknownKeys extends UnknownKeysParam = UnknownKeysParam> = objectOutputType<Shape, Catchall, UnknownKeys>;
declare const z_objectUtil: typeof objectUtil;
declare const z_oboolean: typeof oboolean;
declare const z_onumber: typeof onumber;
declare const z_ostring: typeof ostring;
type z_output<T extends ZodType<any, any, any>> = output<T>;
declare const z_quotelessJson: typeof quotelessJson;
declare const z_setErrorMap: typeof setErrorMap;
type z_typeToFlattenedError<T, U = string> = typeToFlattenedError<T, U>;
type z_typecast<A, T> = typecast<A, T>;
declare const z_util: typeof util;
declare namespace z {
  export { type z_AnyZodObject as AnyZodObject, type z_AnyZodTuple as AnyZodTuple, type z_ArrayCardinality as ArrayCardinality, type z_ArrayKeys as ArrayKeys, type z_AssertArray as AssertArray, type z_AsyncParseReturnType as AsyncParseReturnType, type z_BRAND as BRAND, type z_CatchallInput as CatchallInput, type z_CatchallOutput as CatchallOutput, type z_CustomErrorParams as CustomErrorParams, z_DIRTY as DIRTY, type z_DenormalizedError as DenormalizedError, z_EMPTY_PATH as EMPTY_PATH, type z_Effect as Effect, type z_EnumLike as EnumLike, type z_EnumValues as EnumValues, type z_ErrorMapCtx as ErrorMapCtx, type z_FilterEnum as FilterEnum, z_INVALID as INVALID, type z_Indices as Indices, type z_InnerTypeOfFunction as InnerTypeOfFunction, type z_InputTypeOfTuple as InputTypeOfTuple, type z_InputTypeOfTupleWithRest as InputTypeOfTupleWithRest, type z_IpVersion as IpVersion, type z_IssueData as IssueData, type z_KeySchema as KeySchema, z_NEVER as NEVER, z_OK as OK, type z_ObjectPair as ObjectPair, type z_OuterTypeOfFunction as OuterTypeOfFunction, type z_OutputTypeOfTuple as OutputTypeOfTuple, type z_OutputTypeOfTupleWithRest as OutputTypeOfTupleWithRest, type z_ParseContext as ParseContext, type z_ParseInput as ParseInput, type z_ParseParams as ParseParams, type z_ParsePath as ParsePath, type z_ParsePathComponent as ParsePathComponent, type z_ParseResult as ParseResult, type z_ParseReturnType as ParseReturnType, z_ParseStatus as ParseStatus, type z_PassthroughType as PassthroughType, type z_PreprocessEffect as PreprocessEffect, type z_Primitive as Primitive, type z_ProcessedCreateParams as ProcessedCreateParams, type z_RawCreateParams as RawCreateParams, type z_RecordType as RecordType, type z_Refinement as Refinement, type z_RefinementCtx as RefinementCtx, type z_RefinementEffect as RefinementEffect, type z_SafeParseError as SafeParseError, type z_SafeParseReturnType as SafeParseReturnType, type z_SafeParseSuccess as SafeParseSuccess, type z_Scalars as Scalars, ZodType as Schema, type z_SomeZodObject as SomeZodObject, type z_StringValidation as StringValidation, type z_SuperRefinement as SuperRefinement, type z_SyncParseReturnType as SyncParseReturnType, type z_TransformEffect as TransformEffect, type z_TypeOf as TypeOf, type z_UnknownKeysParam as UnknownKeysParam, type z_Values as Values, type z_Writeable as Writeable, z_ZodAny as ZodAny, type z_ZodAnyDef as ZodAnyDef, z_ZodArray as ZodArray, type z_ZodArrayDef as ZodArrayDef, z_ZodBigInt as ZodBigInt, type z_ZodBigIntCheck as ZodBigIntCheck, type z_ZodBigIntDef as ZodBigIntDef, z_ZodBoolean as ZodBoolean, type z_ZodBooleanDef as ZodBooleanDef, z_ZodBranded as ZodBranded, type z_ZodBrandedDef as ZodBrandedDef, z_ZodCatch as ZodCatch, type z_ZodCatchDef as ZodCatchDef, type z_ZodCustomIssue as ZodCustomIssue, z_ZodDate as ZodDate, type z_ZodDateCheck as ZodDateCheck, type z_ZodDateDef as ZodDateDef, z_ZodDefault as ZodDefault, type z_ZodDefaultDef as ZodDefaultDef, z_ZodDiscriminatedUnion as ZodDiscriminatedUnion, type z_ZodDiscriminatedUnionDef as ZodDiscriminatedUnionDef, type z_ZodDiscriminatedUnionOption as ZodDiscriminatedUnionOption, z_ZodEffects as ZodEffects, type z_ZodEffectsDef as ZodEffectsDef, z_ZodEnum as ZodEnum, type z_ZodEnumDef as ZodEnumDef, z_ZodError as ZodError, type z_ZodErrorMap as ZodErrorMap, type z_ZodFirstPartySchemaTypes as ZodFirstPartySchemaTypes, z_ZodFirstPartyTypeKind as ZodFirstPartyTypeKind, type z_ZodFormattedError as ZodFormattedError, z_ZodFunction as ZodFunction, type z_ZodFunctionDef as ZodFunctionDef, z_ZodIntersection as ZodIntersection, type z_ZodIntersectionDef as ZodIntersectionDef, type z_ZodInvalidArgumentsIssue as ZodInvalidArgumentsIssue, type z_ZodInvalidDateIssue as ZodInvalidDateIssue, type z_ZodInvalidEnumValueIssue as ZodInvalidEnumValueIssue, type z_ZodInvalidIntersectionTypesIssue as ZodInvalidIntersectionTypesIssue, type z_ZodInvalidLiteralIssue as ZodInvalidLiteralIssue, type z_ZodInvalidReturnTypeIssue as ZodInvalidReturnTypeIssue, type z_ZodInvalidStringIssue as ZodInvalidStringIssue, type z_ZodInvalidTypeIssue as ZodInvalidTypeIssue, type z_ZodInvalidUnionDiscriminatorIssue as ZodInvalidUnionDiscriminatorIssue, type z_ZodInvalidUnionIssue as ZodInvalidUnionIssue, type z_ZodIssue as ZodIssue, type z_ZodIssueBase as ZodIssueBase, type z_ZodIssueCode as ZodIssueCode, type z_ZodIssueOptionalMessage as ZodIssueOptionalMessage, z_ZodLazy as ZodLazy, type z_ZodLazyDef as ZodLazyDef, z_ZodLiteral as ZodLiteral, type z_ZodLiteralDef as ZodLiteralDef, z_ZodMap as ZodMap, type z_ZodMapDef as ZodMapDef, z_ZodNaN as ZodNaN, type z_ZodNaNDef as ZodNaNDef, z_ZodNativeEnum as ZodNativeEnum, type z_ZodNativeEnumDef as ZodNativeEnumDef, z_ZodNever as ZodNever, type z_ZodNeverDef as ZodNeverDef, type z_ZodNonEmptyArray as ZodNonEmptyArray, type z_ZodNotFiniteIssue as ZodNotFiniteIssue, type z_ZodNotMultipleOfIssue as ZodNotMultipleOfIssue, z_ZodNull as ZodNull, type z_ZodNullDef as ZodNullDef, z_ZodNullable as ZodNullable, type z_ZodNullableDef as ZodNullableDef, type z_ZodNullableType as ZodNullableType, z_ZodNumber as ZodNumber, type z_ZodNumberCheck as ZodNumberCheck, type z_ZodNumberDef as ZodNumberDef, z_ZodObject as ZodObject, type z_ZodObjectDef as ZodObjectDef, z_ZodOptional as ZodOptional, type z_ZodOptionalDef as ZodOptionalDef, type z_ZodOptionalType as ZodOptionalType, type z_ZodParsedType as ZodParsedType, z_ZodPipeline as ZodPipeline, type z_ZodPipelineDef as ZodPipelineDef, z_ZodPromise as ZodPromise, type z_ZodPromiseDef as ZodPromiseDef, type z_ZodRawShape as ZodRawShape, z_ZodReadonly as ZodReadonly, type z_ZodReadonlyDef as ZodReadonlyDef, z_ZodRecord as ZodRecord, type z_ZodRecordDef as ZodRecordDef, ZodType as ZodSchema, z_ZodSet as ZodSet, type z_ZodSetDef as ZodSetDef, z_ZodString as ZodString, type z_ZodStringCheck as ZodStringCheck, type z_ZodStringDef as ZodStringDef, z_ZodSymbol as ZodSymbol, type z_ZodSymbolDef as ZodSymbolDef, type z_ZodTooBigIssue as ZodTooBigIssue, type z_ZodTooSmallIssue as ZodTooSmallIssue, ZodEffects as ZodTransformer, z_ZodTuple as ZodTuple, type z_ZodTupleDef as ZodTupleDef, type z_ZodTupleItems as ZodTupleItems, z_ZodType as ZodType, type z_ZodTypeAny as ZodTypeAny, type z_ZodTypeDef as ZodTypeDef, z_ZodUndefined as ZodUndefined, type z_ZodUndefinedDef as ZodUndefinedDef, z_ZodUnion as ZodUnion, type z_ZodUnionDef as ZodUnionDef, type z_ZodUnionOptions as ZodUnionOptions, z_ZodUnknown as ZodUnknown, type z_ZodUnknownDef as ZodUnknownDef, type z_ZodUnrecognizedKeysIssue as ZodUnrecognizedKeysIssue, z_ZodVoid as ZodVoid, type z_ZodVoidDef as ZodVoidDef, z_addIssueToContext as addIssueToContext, anyType as any, arrayType as array, type z_arrayOutputType as arrayOutputType, type z_baseObjectInputType as baseObjectInputType, type z_baseObjectOutputType as baseObjectOutputType, bigIntType as bigint, booleanType as boolean, z_coerce as coerce, z_custom as custom, dateType as date, errorMap as defaultErrorMap, type z_deoptional as deoptional, discriminatedUnionType as discriminatedUnion, effectsType as effect, enumType as enum, functionType as function, z_getErrorMap as getErrorMap, z_getParsedType as getParsedType, type TypeOf as infer, type z_inferFlattenedErrors as inferFlattenedErrors, type z_inferFormattedError as inferFormattedError, type z_input as input, instanceOfType as instanceof, intersectionType as intersection, z_isAborted as isAborted, z_isAsync as isAsync, z_isDirty as isDirty, z_isValid as isValid, z_late as late, lazyType as lazy, literalType as literal, z_makeIssue as makeIssue, mapType as map, type z_mergeTypes as mergeTypes, nanType as nan, nativeEnumType as nativeEnum, neverType as never, type z_noUnrecognized as noUnrecognized, nullType as null, nullableType as nullable, numberType as number, objectType as object, type z_objectInputType as objectInputType, type z_objectOutputType as objectOutputType, z_objectUtil as objectUtil, z_oboolean as oboolean, z_onumber as onumber, optionalType as optional, z_ostring as ostring, type z_output as output, pipelineType as pipeline, preprocessType as preprocess, promiseType as promise, z_quotelessJson as quotelessJson, recordType as record, setType as set, z_setErrorMap as setErrorMap, strictObjectType as strictObject, stringType as string, symbolType as symbol, effectsType as transformer, tupleType as tuple, type z_typeToFlattenedError as typeToFlattenedError, type z_typecast as typecast, undefinedType as undefined, unionType as union, unknownType as unknown, z_util as util, voidType as void };
}

declare class BodyError extends Error {
    constructor(message?: string, options?: ErrorOptions);
}
declare class BodyTypeError extends Error {
    readonly expected: string;
    constructor(options: {
        expected: string;
        cause?: Error;
    });
}
declare class BodyValidationError extends Error {
    readonly cause: ZodError;
    constructor(options: {
        cause: ZodError;
    });
}

type ZStringPrimitive = ZodString | ZodLiteral<string> | ZodEnum<[string, ...string[]]>;
type ZFromStringPrimitive = ZStringPrimitive | ZodNumber | ZodBoolean | ZodBigInt | ZodDate;
type ZFromString = ZFromStringPrimitive | ZodOptional<ZFromString> | ZodDefault<ZFromString> | ZodEffects<ZFromString, unknown, unknown> | ZodUnion<[ZFromString, ZFromString, ...ZFromString[]]>;
type ZFromStrings = ZFromString | ZodArray<ZFromStringPrimitive> | ZodTuple<[ZFromStringPrimitive, ...ZFromStringPrimitive[]]> | ZodOptional<ZFromStrings> | ZodDefault<ZFromStrings> | ZodEffects<ZFromStrings, unknown, unknown> | ZodUnion<[ZFromStrings, ZFromString, ...ZFromStrings[]]>;
type ZFromStringsMap = ZodRecord<ZStringPrimitive, ZFromStrings> | ZodObject<Record<string, ZFromStrings>> | ZodEffects<ZFromStringsMap, unknown, unknown> | ZodUnion<[ZFromStringsMap, ZFromStringsMap, ...ZFromStringsMap[]]>;

/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `body` property
 * containing the parsed form data.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 */
declare function form<I extends Context, O>(): Middleware<I, O, I & {
    body: FormData;
}, O>;
/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `body` property
 * containing the form data parsed and validated with the given schema.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 *
 * @param schema - Schema to validate the form data with
 */
declare function form<const T extends ZFromStringsMap, I extends Context, O>(schema: T): Middleware<I, O, I & {
    body: TypeOf<T>;
}, O>;
/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the parsed form data.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 *
 * @param key - Key to use for the form data property
 */
declare function form<const K extends string, I extends Context, O>(key: K): Middleware<I, O, I & {
    [body in K]: FormData;
}, O>;
/**
 * Form data middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the form data parsed and validated with the given schema.
 *
 * The returned middleware will only parse form data encoded as `application/x-www-form-urlencoded`.
 *
 * @param key - Key to use for the form data property
 * @param schema - Schema to validate the form data with
 */
declare function form<const K extends string, const T extends ZFromStringsMap, I extends Context, O>(key: K, schema: T): Middleware<I, O, I & {
    [body in K]: TypeOf<T>;
}, O>;

/**
 * JSON body middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `body` property
 * containing the parsed JSON body.
 */
declare function json$1<I extends Context, O>(): Middleware<I, O, I & {
    body: Json;
}, O>;
/**
 * JSON body middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `body` property
 * containing the JSON body parsed and validated with the given schema.
 *
 * @param schema - Schema to validate the JSON body with
 */
declare function json$1<const T extends ZodType, I extends Context, O>(schema: T): Middleware<I, O, I & {
    body: TypeOf<T>;
}, O>;
/**
 * JSON body middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the parsed JSON body.
 *
 * @param key - Key to use for the JSON body property
 */
declare function json$1<const K extends string, I extends Context, O>(key: K): Middleware<I, O, I & {
    [body in K]: Json;
}, O>;
/**
 * JSON body middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the JSON body parsed and validated with the given schema.
 *
 * @param key - Key to use for the JSON body property
 * @param schema - Schema to validate the JSON body with
 */
declare function json$1<const K extends string, const T extends ZodType, I extends Context, O>(key: K, schema: T): Middleware<I, O, I & {
    [body in K]: TypeOf<T>;
}, O>;

type body_d_BodyError = BodyError;
declare const body_d_BodyError: typeof BodyError;
type body_d_BodyTypeError = BodyTypeError;
declare const body_d_BodyTypeError: typeof BodyTypeError;
type body_d_BodyValidationError = BodyValidationError;
declare const body_d_BodyValidationError: typeof BodyValidationError;
declare const body_d_form: typeof form;
declare namespace body_d {
  export { body_d_BodyError as BodyError, body_d_BodyTypeError as BodyTypeError, body_d_BodyValidationError as BodyValidationError, body_d_form as form, json$1 as json };
}

/**
 * Middleware error handler
 *
 * @remarks
 *
 * It receives both the error and the input available at the level it was chained.
 *
 * @typeParam I - Input type of the error handler
 * @typeParam O - Output type of the error handler
 */
type ErrorHandler<I, O> = (error: unknown, input: I) => Awaitable<O>;
/**
 * A chain wraps a middleware to facilitate composition by chaining it with other middleware
 *
 * @see {@link Middleware}
 */
declare class Chain<I, O, II, OO> implements AsMiddleware<I, O, II, OO> {
    #private;
    /** Wraps a middleware into a new chain */
    constructor(middleware: Middleware<I, O, II, OO>);
    middleware(): Middleware<I, O, II, OO>;
    /**
     * Chains a middleware to the current one
     *
     * @remarks
     *
     * The chained middleware will receive the input passed to the `next` function by the current middleware.
     * It needs to produce the output that the current middleware expects from the `next` function.
     *
     * @typeParam III - New input passed to the `next` function by the chained middleware
     * @typeParam OOO - New output expected from the `next` function by the chained middleware
     *
     * @param middleware - Middleware to chain
     * @returns New chain with the chained middleware
     */
    use<III, OOO>(middleware: Middleware<II, OO, III, OOO> | AsMiddleware<II, OO, III, OOO>): Chain<I, O, III, OOO>;
    /**
     * Chains an error handler to the current middleware
     *
     * @remarks
     *
     * The error handler is chained by catching errors thrown by the call to the `next` function.
     * It receives both the error and the input that was given to the `next` call. It needs to either
     * produce the output that the `next` function would have, or re-throw the error it received if it can't.
     *
     * Note that if the call to `next` mutated the input in-place before throwing,
     * the error handler will receive the mutated input.
     *
     * @param errorHandler - Error handler to chain
     * @returns New chain with the chained error handler
     */
    catch(errorHandler: ErrorHandler<II, OO>): Chain<I, O, II, OO>;
}

/** Logger middleware options */
interface LoggerOptions {
    /** Whether to include the timestamp in the log message */
    timestamp?: boolean;
    /** Whether to include the latency in the log message */
    latency?: boolean;
}
/**
 * Logger middleware factory
 *
 * @param options - Options for the returned middleware
 * @returns A request logger middleware
 *
 * @example Create an app that logs requests and their latency
 * ```ts
 * const app = router(logger({ latency: true }))
 * ```
 */
declare function logger<I extends Context>(options?: LoggerOptions): Middleware<I, Response, I, Response>;

/**
 * Creates a text response
 *
 * @param data - Text to send in the response body
 */
declare function text(data: string, options?: ResponseInit): Response;
/**
 * Creates a JSON response
 *
 * @param data - JSON data to send in the response body
 */
declare function json(data: Json, options?: ResponseInit): Response;
/**
 * Creates a redirect
 *
 * @see [Redirections in HTTP on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
 *
 * @param url - URL to redirect to
 * @param status - Redirection status code
 */
declare function redirect(url: string | URL, status?: 301 | 302 | 303 | 307 | 308): Response;
/**
 * Creates a response with the given status code and its default status message as the body
 *
 * @param status - Status code
 */
declare function status(status: number, options?: Omit<ResponseInit, "status">): Response;
/**
 * Creates an HTML response
 *
 * @param data - HTML data to send in the response body
 */
declare function html(data: string, options?: ResponseInit): Response;
/**
 * Creates an HTML response from a JSX node
 *
 * @param node - JSX node to render and send in the response body
 */
declare function html(node: VNode, options?: ResponseInit): Response;

declare const response_d_html: typeof html;
declare const response_d_json: typeof json;
declare const response_d_redirect: typeof redirect;
declare const response_d_status: typeof status;
declare const response_d_text: typeof text;
declare namespace response_d {
  export { response_d_html as html, response_d_json as json, response_d_redirect as redirect, response_d_status as status, response_d_text as text };
}

type Match<Path extends string> = Path extends `${infer Prefix}/` ? Match<Prefix> : Path extends `${infer Prefix}*${infer Any}` ? Match<Prefix> & {
    [K in Any]: string;
} : Path extends `${infer Prefix}:${infer One}/${infer Suffix}` ? Match<Prefix> & {
    [K in One]: string;
} & Match<Suffix> : Path extends `${infer Prefix}:${infer One}` ? Match<Prefix> & {
    [K in One]: string;
} : Record<string, never>;

declare abstract class RouterError extends Error {
    readonly method: string;
    readonly path: string;
    constructor(info: {
        method: string;
        path: string;
    }, message?: string, options?: ErrorOptions);
}
declare class NotFoundError extends RouterError {
    constructor(info: {
        method: string;
        path: string;
    });
}
declare class MethodNotAllowedError extends RouterError {
    readonly route: string;
    readonly allowed: string[];
    constructor(info: {
        method: string;
        path: string;
        route: string;
        allowed: string[];
    });
}
declare function defaultErrorHandler(error: unknown): Response;

/** @module chene/router */

/** Base router context */
interface RouterContext extends Context {
    /** Currently matched route */
    route?: string;
}
/**
 * Input type combining the route input with the route parameters
 *
 * @typeParam Route - String literal type representing the route
 * @typeParam I - Route input
 */
type Input<Route extends string, I extends RouterContext> = I & {
    path: Match<Route>;
};
/**
 * Transform to apply to a route input and output before passing them to the handler
 *
 * @typeParam Route - String literal type representing the route
 * @typeParam I - Route input
 * @typeParam O - Route output
 * @typeParam II - Transformed route input passed to the handler
 * @typeParam OO - Transformed route output returned by the handler
 */
type Transform<Route extends string, I extends RouterContext, O, II, OO> = (chain: Chain<RouterContext, Response, Input<Route, I>, O>) => Chain<RouterContext, Response, II, OO>;
/** Route handler */
type Handler$1<I, O> = (input: I) => Awaitable<O>;
/**
 * A router is a middleware that routes requests to other middlewares based on their method and path
 *
 * @remarks
 *
 * Routes can contain named parameters which instead of matching part of the path verbatim will
 * capture one or many path segments and make them available by name to the route handler.
 * The provided path parameters is a properly typed object with the same keys as the named parameters.
 *
 * `:name` will capture a single path segment up to the next `/` or end of the path
 * while `*name` will capture any number of path segments until the end of the path.
 *
 * The router provides facilities to chain middleware both to the entire router through the {@link use} method
 * and to individual routes through a {@link Transform} parameter.
 *
 * This router is based on a prefix tree which means the order in which routes are registered
 * does not influence the matching process and the number of routes does not impact performance.
 *
 * Priority is given to verbatim segments over single named parameters (`:name`)
 * over multiple named parameters (`*name`). This means that `/hello/there` would be matched
 * before `/hello/:name` which would be matched before `/hello/*name`.
 *
 * Routes are matched case insensitively. Of course captured path segments are not modified and
 * their case is preserved.
 *
 * @example Simple route handler
 * ```ts
 * const app = router()
 * app.get("/hello/:name", ({ path }) => response.text(`Hello ${path.name} !`))
 * ```
 *
 * @example Chaining middleware to a route handler
 * ```ts
 * const app = router()
 * app.post(
 *   "/search/:term",
 *   (ctx) => ctx.use(middleware),
 *
 *   (ctx) => {
 *     // ctx.path.term is the string captured by the :term parameter
 *     // ctx will also contain any value the middleware might have added
 *     // and will by typed accordingly
 *   }
 * )
 * ```
 *
 * @typeParam I - Input type of route handlers and chained middleware
 * @typeParam O - Output type of route handlers and chained middleware
 */
declare class Router<I extends RouterContext = RouterContext, O = Response> implements AsMiddleware<Context, Response, Response, Response> {
    #private;
    middleware(): Middleware<Context, Response, Response, Response>;
    /**
     * Chains a middleware to the router
     *
     * @group Chaining
     *
     * @remarks
     *
     * Note that this method returns a new router. The new router shares the same routes
     * as the original one, but the middleware will not apply to the previously registered routes,
     * only the ones registered on the new router.
     *
     * Since the routes are shared, this method can be called two times on the same router and
     * routes can be registered on the two resulting routers, and all three routers will share
     * all the registered routes.
     *
     * @example Sharing routes
     * ```ts
     * const app = router()
     * const app1 = app1.use(middleware1)
     * const app2 = app2.use(middleware2)
     *
     * app.get("/foo", () => response.text("foo"))
     * app1.get("/bar", () => response.text("bar"))
     * app2.get("/baz", () => response.text("baz"))
     *
     * // /foo, /bar and /baz are all available
     * serve(app, { port: 8080 })
     * ```
     *
     * @see {@link Chain.use}
     *
     * @typeParam II - Input type of the `next` function of the middleware
     * @typeParam OO - Output type of the `next` function of the middleware
     *
     * @param middleware - Middeware to chain
     * @returns A new router with the given middleware chained and the existing routes
     */
    use<II extends RouterContext, OO>(middleware: Middleware<I, O, II, OO>): Router<II, OO>;
    /**
     * Chains an error handler to the router
     *
     * @group Chaining
     *
     * @remarks
     *
     * Note that this method behaves the same as {@link use} and returns a new router with shared routes.
     * It will only catch errors thrown by the routes registered on the new router and
     * by middleware chained after it.
     *
     * The error handler returns the same type as route handlers and chained middleware, since its goal is
     * to gracefully handle errors and return an appropriate response. It is good practice to re-throw errors
     * that the error handler doesn't know how to produce a response for so that upstream error handlers can
     * do it instead.
     *
     * @example Catching errors
     * ```ts
     * let app = router()
     *
     * // errors thrown from this middleware won't be caught
     * app = app.use(middelware1)
     * // errors thrown from this route won't be caught
     * app.get("/foo", () => {
     *   throw new Error("foo")
     * })
     *
     * app = app.catch((error, input) => {
     *   console.error(error)
     *   return response.status(500)
     * })
     *
     * // errors thrown from this middleware will be caught
     * app = app.use(middleware2)
     * // errors thrown from this route will be caught
     * app.get("/bar", () => {
     *  throw new Error("bar")
     * })
     * ```
     *
     * @see {@link Chain.catch}
     *
     * @param errorHandler - Error handler to chain
     * @returns A new router with the given error handler chained and the existing routes
     */
    catch(errorHandler: ErrorHandler<I, O>): Router<I, O>;
    /**
     * Registers the given `GET` route handler with its own middleware chain
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     * @typeParam II - Transformed route input passed to the handler
     * @typeParam OO - Transformed route output returned by the handler
     *
     * @param route - Route to register
     * @param transform - Middleware chain transform to apply to the route handler
     * @param handler - Route handler
     */
    get<const Route extends `/${string}`, II, OO>(route: Route, transform: Transform<Route, I, O, II, OO>, handler: Handler$1<II, OO>): this;
    /**
     * Registers the given `GET` route handler
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     *
     * @param route - Route to register
     * @param handler - Route handler
     */
    get<const Route extends `/${string}`>(route: Route, handler: Handler$1<Input<Route, I>, O>): this;
    /**
     * Registers the given `POST` route handler with its own middleware chain
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     * @typeParam II - Transformed route input passed to the handler
     * @typeParam OO - Transformed route output returned by the handler
     *
     * @param route - Route to register
     * @param transform - Middleware chain transform to apply to the route handler
     * @param handler - Route handler
     */
    post<const Route extends `/${string}`, II, OO>(route: Route, transform: Transform<Route, I, O, II, OO>, handler: Handler$1<II, OO>): this;
    /**
     * Registers the given `POST` route handler
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     *
     * @param route - Route to register
     * @param handler - Route handler
     */
    post<const Route extends `/${string}`>(route: Route, handler: Handler$1<Input<Route, I>, O>): this;
    /**
     * Registers the given `PATCH` route handler with its own middleware chain
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     * @typeParam II - Transformed route input passed to the handler
     * @typeParam OO - Transformed route output returned by the handler
     *
     * @param route - Route to register
     * @param transform - Middleware chain transform to apply to the route handler
     * @param handler - Route handler
     */
    patch<const Route extends `/${string}`, II, OO>(route: Route, transform: Transform<Route, I, O, II, OO>, handler: Handler$1<II, OO>): this;
    /**
     * Registers the given `PATCH` route handler
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     *
     * @param route - Route to register
     * @param handler - Route handler
     */
    patch<const Route extends `/${string}`>(route: Route, handler: Handler$1<Input<Route, I>, O>): this;
    /**
     * Registers the given `PUT` route handler with its own middleware chain
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     * @typeParam II - Transformed route input passed to the handler
     * @typeParam OO - Transformed route output returned by the handler
     *
     * @param route - Route to register
     * @param transform - Middleware chain transform to apply to the route handler
     * @param handler - Route handler
     */
    put<const Route extends `/${string}`, II, OO>(route: Route, transform: Transform<Route, I, O, II, OO>, handler: Handler$1<II, OO>): this;
    /**
     * Registers the given `PUT` route handler
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     *
     * @param route - Route to register
     * @param handler - Route handler
     */
    put<const Route extends `/${string}`>(route: Route, handler: Handler$1<Input<Route, I>, O>): this;
    /**
     * Registers the given `DELETE` route handler with its own middleware chain
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     * @typeParam II - Transformed route input passed to the handler
     * @typeParam OO - Transformed route output returned by the handler
     *
     * @param route - Route to register
     * @param transform - Middleware chain transform to apply to the route handler
     * @param handler - Route handler
     */
    delete<const Route extends `/${string}`, II, OO>(route: Route, transform: Transform<Route, I, O, II, OO>, handler: Handler$1<II, OO>): this;
    /**
     * Registers the given `DELETE` route handler
     *
     * @group Routing
     *
     * @typeParam Route - String literal type representing the route
     *
     * @param route - Route to register
     * @param handler - Route handler
     */
    delete<const Route extends `/${string}`>(route: Route, handler: Handler$1<Input<Route, I>, O>): this;
}
/**
 * Creates a new router
 *
 * @param middleware - Root middleware which is chained before anything else, including the router's builtin error handler
 */
declare function router(middleware?: Middleware<RouterContext, Response, RouterContext, Response> | AsMiddleware<RouterContext, Response, RouterContext, Response>): Router;

declare abstract class UrlError extends Error {
    constructor(message?: string, options?: ErrorOptions);
}
declare class QueryValidationError extends Error {
    readonly cause: ZodError;
    constructor(options: {
        cause: ZodError;
    });
}

/**
 * Query string middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `query` property
 * containing the parsed query string as {@link URLSearchParams}.
 */
declare function query<I extends Context, O>(): Middleware<I, O, I & {
    query: URLSearchParams;
}, O>;
/**
 * Query string middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a `query` property
 * containing the query parsed and validated with the given schema.
 *
 * @param schema - Schema to validate the query string with
 */
declare function query<const T extends ZFromStringsMap, I extends Context, O>(schema: T): Middleware<I, O, I & {
    query: TypeOf<T>;
}, O>;
/**
 * Query string middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the parsed query string as {@link URLSearchParams}.
 *
 * @param key - Key to use for the query string property
 */
declare function query<const K extends string, I extends Context, O>(key: K): Middleware<I, O, I & {
    [body in K]: URLSearchParams;
}, O>;
/**
 * Query string middleware factory
 *
 * @remarks
 *
 * The returned middleware enriches the input with a property with the given key
 * containing the query parsed and validated with the given schema.
 *
 * @param key - Key to use for the query string property
 * @param schema - Schema to validate the query string with
 */
declare function query<const K extends string, const T extends ZFromStringsMap, I extends Context, O>(key: K, schema: T): Middleware<I, O, I & {
    [body in K]: TypeOf<T>;
}, O>;

type url_d_QueryValidationError = QueryValidationError;
declare const url_d_QueryValidationError: typeof QueryValidationError;
type url_d_UrlError = UrlError;
declare const url_d_UrlError: typeof UrlError;
declare const url_d_query: typeof query;
declare namespace url_d {
  export { url_d_QueryValidationError as QueryValidationError, url_d_UrlError as UrlError, url_d_query as query };
}

/** @module chene */

/**
 * Type which can be awaited
 *
 * @typeParam T - Result of awaiting the type
 */
type Awaitable<T> = T | Promise<T>;
/** Valid JSON values */
type Json = null | boolean | number | string | Json[] | {
    [key: string]: Json;
};
/** Base input provided to the root middleware */
interface Context {
    /** HTTP request object for the current request */
    request: Request;
    /** Parsed URL for the current request */
    url: URL;
    /** Network information for the current request */
    network: {
        server: {
            /** Server IP address */
            address: string;
            /** Server port */
            port: number;
        };
        client: {
            /** Client IP address (does not follow Forwarded headers) */
            address: string;
            /** Client port (does not follow Forwarded headers) */
            port: number;
        };
    };
}
/**
 * Root middleware usable as a request handler
 *
 * {@link Router} is an instance of this type.
 */
type Handler = Middleware<Context, Response, Response, Response> | AsMiddleware<Context, Response, Response, Response>;
/** Server options */
interface ServeOptions {
    /**
     * Port to listen on
     *
     * @defaultValue 0
     */
    port?: number;
    /**
     * Hostname or IP address or interface to listen on
     *
     * @defaultValue "localhost"
     */
    hostname?: string;
    /** Signal usable to shutdown the server */
    signal?: AbortSignal;
    /**
     * Called when an unhandled error occurs
     *
     * @defaultValue console.error
     *
     * @param error - Unhandled error
     */
    onError?: (error: unknown) => void;
    /**
     * Called once the server starts listening for requests
     *
     * @param params - Server network information
     */
    onListen?: (params: Context["network"]["server"]) => void;
}
/** TLS (HTTPS) server options */
interface TlsServeOptions extends ServeOptions {
    /** TLS certificate chain in PEM format */
    cert: string;
    /** TLS private key in PEM format */
    key: string;
}
/** HTTP server */
interface Server {
    /** Shuts down the server */
    shutdown(): Promise<void>;
    /** Resolves once the server is shutdown and all connections closed */
    finished: Promise<void>;
}
/** HTTP server on V8 */
interface V8Server extends Server {
    /**
     * References the server within the engine
     *
     * @remarks
     *
     * The server will prevent the program from exiting until it is shutdown.
     *
     * This is the default behaviour.
     */
    ref(): void;
    /**
     * Unreferences the server within the engine
     *
     * @remarks
     *
     * The server will not prevent the program from exiting even if it is not shutdown.
     */
    unref(): void;
}

export { type Awaitable as A, type Context as C, type ErrorHandler as E, type Handler$1 as H, type Input as I, type Json as J, type LoggerOptions as L, MethodNotAllowedError as M, NotFoundError as N, type RouterContext as R, type ServeOptions as S, type Transform as T, type V8Server as V, Router as a, RouterError as b, type Handler as c, defaultErrorHandler as d, type TlsServeOptions as e, type Server as f, body_d as g, response_d as h, Chain as i, type Middleware as j, type AsMiddleware as k, logger as l, asMiddleware as m, router as r, throwInMiddleware as t, url_d as u, z };
