import * as ts from 'typescript'

import {
    FieldDefinition,
    Identifier,
    InterfaceWithFields,
} from '@creditkarma/thrift-parser'

import { IRenderState } from '../../types'
import { createArgsParameterForStruct } from './struct'
import { createFunctionParameter } from './utils'
import { renderValue } from './values'

export function functionNameForClass(statement: InterfaceWithFields): string {
    return `create${statement.name.value}`
}

function interfaceConstruction(
    statement: InterfaceWithFields,
    state: IRenderState,
): ts.Block {
    return ts.createBlock(
        [
            ts.createReturn(
                ts.createObjectLiteral(
                    statement.fields.map((field: FieldDefinition) => {
                        const defaultValue =
                            field.defaultValue !== null
                                ? renderValue(
                                      field.fieldType,
                                      field.defaultValue,
                                      state,
                                  )
                                : state.options.functionFieldPromotion
                                      .isEnabled &&
                                  (field.fieldType as Identifier).value ===
                                      state.options.functionFieldPromotion
                                          .typeName
                                ? ts.createIdentifier(
                                      state.options.functionFieldPromotion
                                          .paramName,
                                  )
                                : ts.createIdentifier(
                                      `args.${field.name.value}`,
                                  )
                        return ts.createPropertyAssignment(
                            ts.createIdentifier(field.name.value),
                            defaultValue,
                        )
                    }),
                    true,
                ),
            ),
        ],
        true,
    )
}

export function renderFunction(
    statement: InterfaceWithFields,
    state: IRenderState,
): ts.FunctionDeclaration {
    const paramSet = createArgsParameterForStruct(statement)
    if (state.options.functionFieldPromotion.isEnabled) {
        const promoteField = statement.fields.find((field) => {
            return (
                (field.fieldType as Identifier).value ===
                state.options.functionFieldPromotion.typeName
            )
        })

        if (promoteField) {
            paramSet.push(
                createFunctionParameter(
                    state.options.functionFieldPromotion.paramName, // param name
                    ts.createTypeReferenceNode(
                        state.options.functionFieldPromotion.qualifiedTypeName,
                        undefined,
                    ), // param type
                    undefined, // initializer
                    false, // optional?
                ),
            )
        }
    }
    return ts.createFunctionDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        undefined,
        functionNameForClass(statement),
        undefined,
        paramSet,
        ts.createTypeReferenceNode(statement.name.value, undefined),
        interfaceConstruction(statement, state),
    )
}
