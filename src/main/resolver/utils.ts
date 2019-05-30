import {
    ConstValue,
    createBooleanLiteral,
    FieldDefinition,
    FunctionDefinition,
    FunctionType,
    Identifier,
    PropertyAssignment,
    SyntaxType,
    ThriftStatement,
} from '@creditkarma/thrift-parser'

import {
    DefinitionType,
    IFileExports,
    INamespace,
    INamespacePath,
    IRenderState,
    IResolveContext,
    IResolvedIdentifier,
} from '../types'

import { ValidationError } from '../errors'
import { emptyLocation } from '../utils'

// Give some thrift statements this generates a map of the name of those statements to the
// definition of that statement
export function exportsForFile(fileBody: Array<ThriftStatement>): IFileExports {
    return fileBody.reduce((acc: IFileExports, next: ThriftStatement) => {
        switch (next.type) {
            case SyntaxType.TypedefDefinition:
            case SyntaxType.ConstDefinition:
            case SyntaxType.EnumDefinition:
            case SyntaxType.UnionDefinition:
            case SyntaxType.ExceptionDefinition:
            case SyntaxType.StructDefinition:
            case SyntaxType.ServiceDefinition:
                acc[next.name.value] = next
                break

            default:
                // Ignore
                break
        }

        return acc
    }, {})
}

function stubIdentifier(value: string): Identifier {
    return {
        type: SyntaxType.Identifier,
        value,
        annotations: undefined,
        loc: emptyLocation(),
    }
}

export function resolveIdentifierDefinition(
    id: Identifier,
    context: IResolveContext,
): DefinitionType {
    if (context.currentNamespace.exports[id.value]) {
        const definition: DefinitionType =
            context.currentNamespace.exports[id.value]

        if (definition.type === SyntaxType.TypedefDefinition) {
            if (definition.definitionType.type === SyntaxType.Identifier) {
                return resolveIdentifierDefinition(
                    definition.definitionType,
                    context,
                )
            } else {
                return definition
            }
        } else {
            return definition
        }
    } else {
        const [head, ...tail] = id.value.split('.')
        const namespace: INamespacePath =
            context.currentNamespace.includedNamespaces[head]

        if (context.currentNamespace.includedNamespaces[head]) {
            const nextNamespace: INamespace =
                context.namespaceMap[namespace.accessor]

            return resolveIdentifierDefinition(stubIdentifier(tail.join('.')), {
                currentNamespace: nextNamespace,
                namespaceMap: context.namespaceMap,
            })
        } else if (context.currentNamespace.namespaceIncludes[head]) {
            const accessor: string =
                context.currentNamespace.namespaceIncludes[head]

            const nextNamespace: INamespace = context.namespaceMap[accessor]

            return resolveIdentifierDefinition(stubIdentifier(tail.join('.')), {
                currentNamespace: nextNamespace,
                namespaceMap: context.namespaceMap,
            })
        } else {
            throw new ValidationError(
                `Unable to resolve identifier[${id.value}] in namespace[${
                    context.currentNamespace.namespace.path
                }]`,
                id.loc,
            )
        }
    }
}

// Given the name of an identifier and the state in which that file is being rendered return the name that
// should be used for the identifier in the given context.
export function resolveIdentifierName(
    name: string,
    state: IRenderState,
): IResolvedIdentifier {
    const currentNamespace: INamespace = state.currentNamespace
    const [pathName, base, ...tail] = name.split('.')
    let baseName: string = pathName

    if (base !== undefined) {
        baseName = [base, ...tail].join('.')
    }

    // Handle identifier exists in the current namespace
    if (currentNamespace.exports[pathName]) {
        if (state.currentDefinitions[pathName]) {
            return {
                rawName: name,
                name: pathName,
                baseName,
                pathName: undefined,
                fullName: name,
            }
        } else {
            const def = currentNamespace.exports[pathName]
            let rootName: string = pathName

            if (def.type === SyntaxType.ConstDefinition) {
                rootName = '__CONSTANTS__'
            }

            /**
             * Services do not export an object with the thrift-defined name.
             */
            if (def.type === SyntaxType.ServiceDefinition) {
                return {
                    rawName: name,
                    name: pathName,
                    baseName,
                    pathName: rootName,
                    fullName: `${rootName}`,
                }
            }

            return {
                rawName: name,
                name: pathName,
                baseName,
                pathName: rootName,
                fullName: `${rootName}.${name}`,
            }
        }
    }

    // Handle if identifier exists in another namespace
    const namespace: INamespacePath =
        currentNamespace.includedNamespaces[pathName]

    if (namespace !== undefined) {
        return {
            rawName: name,
            name: base,
            baseName,
            pathName,
            fullName: name,
        }
    }

    if (base === undefined) {
        return {
            rawName: name,
            name: pathName,
            baseName,
            pathName: undefined,
            fullName: name,
        }
    }

    throw new Error(`Unable to resolve identifier[${name}]`)
}

/**
 * It makes things easier to rewrite all const values to their literal values.
 * For example you can use the identifier of a constant as the initializer of another constant
 * or the default value of a field in a struct.
 *
 * const i32 VALUE = 32
 * cosnt list<i32> LIST = [ VALUE ]
 *
 * This can be safely rewritten to:
 *
 * const i32 VALUE = 32
 * const list<i32> LIST = [ 32 ]
 *
 * This is blunt, but it makes type-checking later very easy.
 */
export function resolveConstValue(
    value: ConstValue,
    expectedType: FunctionType,
    context: IResolveContext,
): ConstValue {
    switch (value.type) {
        case SyntaxType.IntConstant:
            if (expectedType.type === SyntaxType.BoolKeyword) {
                if (value.value.value === '1' || value.value.value === '0') {
                    return createBooleanLiteral(
                        value.value.value === '1',
                        value.loc,
                    )
                } else {
                    throw new ValidationError(
                        `Can only assign booleans to the int values '1' or '0'`,
                        value.loc,
                    )
                }
            } else {
                return value
            }

        case SyntaxType.Identifier:
            const [head, ...tail] = value.value.split('.')
            if (context.currentNamespace.exports[head]) {
                const statement: ThriftStatement =
                    context.currentNamespace.exports[head]
                if (statement.type === SyntaxType.ConstDefinition) {
                    return resolveConstValue(
                        statement.initializer,
                        expectedType,
                        context,
                    )
                } else {
                    return value
                }
            } else {
                const nextNamespacePath: INamespacePath | undefined =
                    context.currentNamespace.includedNamespaces[head]

                if (nextNamespacePath !== undefined) {
                    const nextNamespace: INamespace =
                        context.namespaceMap[nextNamespacePath.accessor]

                    return resolveConstValue(
                        stubIdentifier(tail.join('.')),
                        expectedType,
                        {
                            currentNamespace: nextNamespace,
                            namespaceMap: context.namespaceMap,
                        },
                    )
                }
            }
            throw new ValidationError(
                `Unable to resolve value of identifier[${value.value}]`,
                value.loc,
            )

        case SyntaxType.ConstMap:
            return {
                type: SyntaxType.ConstMap,
                properties: value.properties.map(
                    (next: PropertyAssignment): PropertyAssignment => {
                        return {
                            type: SyntaxType.PropertyAssignment,
                            name: resolveConstValue(
                                next.name,
                                expectedType,
                                context,
                            ),
                            initializer: resolveConstValue(
                                next.initializer,
                                expectedType,
                                context,
                            ),
                            loc: next.loc,
                        }
                    },
                ),
                loc: value.loc,
            }

        case SyntaxType.ConstList:
            return {
                type: SyntaxType.ConstList,
                elements: value.elements.map(
                    (next: ConstValue): ConstValue => {
                        return resolveConstValue(next, expectedType, context)
                    },
                ),
                loc: value.loc,
            }

        default:
            return value
    }
}

function identifiersForFieldType(
    fieldType: FunctionType,
    results: Set<string>,
    state: IRenderState,
    // Is this identifier being resolved in a context where we need to know the underlying type of typedefs?
    resolveTypedefs: boolean = false,
): void {
    switch (fieldType.type) {
        case SyntaxType.Identifier:
            if (resolveTypedefs) {
                const def: DefinitionType = resolveIdentifierDefinition(
                    fieldType,
                    {
                        currentNamespace: state.currentNamespace,
                        namespaceMap: state.project.namespaces,
                    },
                )

                if (def.type === SyntaxType.TypedefDefinition) {
                    identifiersForFieldType(def.definitionType, results, state)
                }
            }

            results.add(fieldType.value)
            break

        case SyntaxType.MapType:
            identifiersForFieldType(fieldType.keyType, results, state)
            identifiersForFieldType(fieldType.valueType, results, state)
            break

        case SyntaxType.SetType:
        case SyntaxType.ListType:
            identifiersForFieldType(fieldType.valueType, results, state)
            break
    }
}

function identifiersForConstValue(
    constValue: ConstValue | null,
    results: Set<string>,
): void {
    if (constValue !== null) {
        switch (constValue.type) {
            case SyntaxType.Identifier:
                results.add(constValue.value)
                break

            case SyntaxType.ConstList:
                constValue.elements.forEach((next: ConstValue) => {
                    identifiersForConstValue(next, results)
                })
                break

            case SyntaxType.ConstMap:
                constValue.properties.forEach((next: PropertyAssignment) => {
                    identifiersForConstValue(next.name, results)
                    identifiersForConstValue(next.initializer, results)
                })
        }
    }
}

/**
 * We're going to loop through the provided statements and find the Identifiers being used by these statements.
 *
 * The complicating factor here is that this is used to determine imports for a given file. In some cases a
 * file may need an identifier not explicitly in the AST node. For instance if a Identifer refers to a typedef
 * that aliases a map we may need to know the key and value types of the map so the including file can import
 * those types to handle encoding/decoding of those types.
 */
export function identifiersForStatements(
    statements: Array<ThriftStatement>,
    state: IRenderState,
): Array<string> {
    const results: Set<string> = new Set()

    statements.forEach((next: ThriftStatement) => {
        switch (next.type) {
            case SyntaxType.IncludeDefinition:
            case SyntaxType.CppIncludeDefinition:
            case SyntaxType.NamespaceDefinition:
            case SyntaxType.EnumDefinition:
                // Ignore
                break

            case SyntaxType.ConstDefinition:
                identifiersForFieldType(next.fieldType, results, state)
                identifiersForConstValue(next.initializer, results)
                break

            case SyntaxType.TypedefDefinition:
                identifiersForFieldType(next.definitionType, results, state)
                break

            case SyntaxType.StructDefinition:
            case SyntaxType.UnionDefinition:
            case SyntaxType.ExceptionDefinition:
                next.fields.forEach((field: FieldDefinition) => {
                    identifiersForFieldType(
                        field.fieldType,
                        results,
                        state,
                        true,
                    )
                    identifiersForConstValue(field.defaultValue, results)
                })
                break

            case SyntaxType.ServiceDefinition:
                if (next.extends) {
                    results.add(next.extends.value)
                }

                next.functions.forEach((func: FunctionDefinition) => {
                    func.fields.forEach((field: FieldDefinition) => {
                        identifiersForFieldType(
                            field.fieldType,
                            results,
                            state,
                            true,
                        )
                        identifiersForConstValue(field.defaultValue, results)
                    })

                    func.throws.forEach((field: FieldDefinition) => {
                        identifiersForFieldType(
                            field.fieldType,
                            results,
                            state,
                            true,
                        )
                        identifiersForConstValue(field.defaultValue, results)
                    })

                    identifiersForFieldType(
                        func.returnType,
                        results,
                        state,
                        true,
                    )
                })

                break

            default:
                const _exhaustiveCheck: never = next
                throw new Error(`Non-exhaustive match for ${_exhaustiveCheck}`)
        }
    })

    return Array.from(results)
}
