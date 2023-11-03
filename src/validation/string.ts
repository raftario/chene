import { z } from "zod"

type ZStringPrimitive =
  | z.ZodString
  | z.ZodLiteral<string>
  | z.ZodEnum<[string, ...string[]]>

type ZFromStringPrimitive =
  | ZStringPrimitive
  | z.ZodNumber
  | z.ZodBoolean
  | z.ZodBigInt
  | z.ZodDate

type ZFromString =
  | ZFromStringPrimitive
  | z.ZodOptional<ZFromString>
  | z.ZodDefault<ZFromString>
  | z.ZodEffects<ZFromString, unknown, unknown>
  | z.ZodUnion<[ZFromString, ZFromString, ...ZFromString[]]>

type ZFromStrings =
  | ZFromString
  | z.ZodArray<ZFromStringPrimitive>
  | z.ZodTuple<[ZFromStringPrimitive, ...ZFromStringPrimitive[]]>
  | z.ZodOptional<ZFromStrings>
  | z.ZodDefault<ZFromStrings>
  | z.ZodEffects<ZFromStrings, unknown, unknown>
  | z.ZodUnion<[ZFromStrings, ZFromString, ...ZFromStrings[]]>

function fromString(type: ZFromString): z.ZodType {
  if (
    type instanceof z.ZodString ||
    type instanceof z.ZodLiteral ||
    type instanceof z.ZodEnum
  ) {
    return z.coerce.string().pipe(type)
  } else if (type instanceof z.ZodNumber) {
    return z.coerce.number().pipe(type)
  } else if (type instanceof z.ZodBoolean) {
    return z.coerce.boolean().pipe(type)
  } else if (type instanceof z.ZodBigInt) {
    return z.coerce.bigint().pipe(type)
  } else if (type instanceof z.ZodDate) {
    return z.coerce.date().pipe(type)
  } else if (type instanceof z.ZodOptional) {
    return fromString(type.unwrap()).optional()
  } else if (type instanceof z.ZodEffects) {
    return fromString(type.innerType()).pipe(type)
  } else if (type instanceof z.ZodDefault) {
    return fromString(type.removeDefault()).optional().pipe(type)
  } else if (type instanceof z.ZodUnion) {
    return z.union(
      type.options.map(fromString) as [z.ZodType, z.ZodType, ...z.ZodType[]],
    )
  } else {
    throw new TypeError()
  }
}

function fromStrings(type: ZFromStrings): z.ZodType {
  if (type instanceof z.ZodArray) {
    return z.array(fromString(type.element)).default([])
  } else if (type instanceof z.ZodTuple) {
    return z.tuple(type.items.map(fromString) as [])
  } else if (type instanceof z.ZodOptional) {
    return fromStrings(type.unwrap()).optional()
  } else if (type instanceof z.ZodEffects) {
    return fromStrings(type.innerType()).pipe(type)
  } else if (type instanceof z.ZodDefault) {
    return fromStrings(type.removeDefault()).optional().pipe(type)
  } else if (type instanceof z.ZodUnion) {
    return z.union(
      type.options.map(fromStrings) as [z.ZodType, z.ZodType, ...z.ZodType[]],
    )
  } else {
    return z.tuple([fromString(type)]).transform(([v]: [unknown]) => v)
  }
}

export type ZFromStringsMap =
  | z.ZodRecord<ZStringPrimitive, ZFromStrings>
  | z.ZodObject<Record<string, ZFromStrings>>
  | z.ZodEffects<ZFromStringsMap, unknown, unknown>
  | z.ZodUnion<[ZFromStringsMap, ZFromStringsMap, ...ZFromStringsMap[]]>

type FromStringsMap<T extends ZFromStringsMap> = z.ZodType<
  z.output<T>,
  z.ZodTypeDef,
  Record<string, string[]>
>
export function fromStringsMap<const T extends ZFromStringsMap>(
  type: T,
): FromStringsMap<T> {
  if (type instanceof z.ZodRecord) {
    return z.record(
      type.keySchema,
      fromStrings(type.valueSchema),
    ) as unknown as FromStringsMap<T>
  } else if (type instanceof z.ZodObject) {
    return z.object(
      Object.fromEntries(
        Object.entries(type.shape).map(([k, v]) => [k, fromStrings(v)]),
      ),
    ) as unknown as FromStringsMap<T>
  } else if (type instanceof z.ZodEffects) {
    return fromStringsMap(type.innerType()).pipe(type)
  } else if (type instanceof z.ZodUnion) {
    return z.union(
      type.options.map(fromStringsMap) as [z.ZodType, z.ZodType, ...z.ZodType[]],
    ) as unknown as FromStringsMap<T>
  } else {
    throw new TypeError()
  }
}
