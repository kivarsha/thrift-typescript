import * as ts from 'typescript'

import {
    FieldDefinition,
    FunctionDefinition,
    ServiceDefinition,
} from '@creditkarma/thrift-parser'

import { COMMON_IDENTIFIERS } from '../identifiers'

import { createAnyType, TypeMapping } from '../types'

import { resolveIdentifierName } from '../../../resolver'
import { IRenderState } from '../../../types'
import { createFunctionParameter } from '../utils'

function funcToMethodReducer(
    acc: Array<ts.MethodSignature>,
    func: FunctionDefinition,
    typeMapping: TypeMapping,
    state: IRenderState,
): Array<ts.MethodSignature> {
    return acc.concat([
        ts.createMethodSignature(
            undefined,
            [
                ...func.fields.map((field: FieldDefinition) => {
                    return createFunctionParameter(
                        field.name.value,
                        typeMapping(field.fieldType, state),
                        undefined,
                        field.requiredness === 'optional',
                    )
                }),
                createFunctionParameter(
                    'context',
                    ts.createTypeReferenceNode('Context', undefined),
                    undefined,
                    true,
                ),
            ],
            ts.createUnionTypeNode([
                typeMapping(func.returnType, state, true),
                ts.createTypeReferenceNode(COMMON_IDENTIFIERS.Promise, [
                    typeMapping(func.returnType, state, true),
                ]),
            ]),
            func.name.value,
            undefined,
        ),
    ])
}

const defaultContextType = () =>
    ts.createTypeParameterDeclaration(
        COMMON_IDENTIFIERS.Context,
        undefined,
        createAnyType(),
    )

/**
 * // thrift
 * service MyService {
 *   i32 add(1: i32 a, 2: i32 b)
 * }
 *
 * // typescript
 * interface IMyServiceHandler<Context> {
 *   add(a: number, b: number): number
 *   add(a: number, b: number, context: Context): number
 * }
 */
export function renderHandlerInterface(
    service: ServiceDefinition,
    typeMapping: TypeMapping,
    state: IRenderState,
    contextType: ts.TypeParameterDeclaration = defaultContextType(),
): Array<ts.Statement> {
    const signatures: Array<ts.MethodSignature> = service.functions.reduce(
        (acc: Array<ts.MethodSignature>, next: FunctionDefinition) => {
            return funcToMethodReducer(acc, next, typeMapping, state)
        },
        [],
    )

    if (service.extends !== null) {
        return [
            ts.createInterfaceDeclaration(
                undefined,
                [ts.createToken(ts.SyntaxKind.ExportKeyword)],
                COMMON_IDENTIFIERS.ILocalHandler,
                [contextType],
                [],
                signatures,
            ),
            ts.createTypeAliasDeclaration(
                undefined,
                [ts.createToken(ts.SyntaxKind.ExportKeyword)],
                COMMON_IDENTIFIERS.IHandler,
                [contextType],
                ts.createIntersectionTypeNode([
                    ts.createTypeReferenceNode(
                        COMMON_IDENTIFIERS.ILocalHandler,
                        [
                            ts.createTypeReferenceNode(
                                COMMON_IDENTIFIERS.Context,
                                undefined,
                            ),
                        ],
                    ),
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(
                            `${
                                resolveIdentifierName(
                                    service.extends.value,
                                    state,
                                ).fullName
                            }.IHandler`,
                        ),
                        [ts.createTypeReferenceNode('Context', undefined)],
                    ),
                ]),
            ),
        ]
    } else {
        return [
            ts.createInterfaceDeclaration(
                undefined,
                [ts.createToken(ts.SyntaxKind.ExportKeyword)],
                COMMON_IDENTIFIERS.IHandler,
                [contextType],
                [],
                signatures,
            ),
        ]
    }
}
