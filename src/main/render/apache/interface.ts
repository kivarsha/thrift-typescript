import * as ts from 'typescript'

import {
    FieldDefinition,
    Identifier,
    InterfaceWithFields,
} from '@creditkarma/thrift-parser'

import { typeNodeForFieldType } from './types'

import { IRenderState } from '../../types'
import { renderOptional } from './utils'

/**
 * Returns the name of the interface for the args arguments for a given struct-like object
 */
export function interfaceNameForClass(statement: InterfaceWithFields): string {
    return `I${statement.name.value}Args`
}

/**
 * This generates an interface for the argument to the constructor of any struct-like object
 * These include struct, union and exception
 *
 * EXAMPLE:
 *
 * // thrift
 * stuct MyStruct {
 *   1: required i32 id,
 *   2: optional bool field1,
 * }
 *
 * // typescript
 * export interface IMyStructArgs {
 *   id: number;
 *   field1?: boolean
 * }
 */
export function renderInterface(
    statement: InterfaceWithFields,
    state: IRenderState,
): ts.InterfaceDeclaration {
    let fields = statement.fields

    if (state.options.useInterfacesWithFunctions) {
        // if default value exists, no need to set in args
        fields = fields.filter((field: FieldDefinition) => {
            return field.defaultValue == null
        })
        if (state.options.functionFieldPromotion.isEnabled) {
            const promoteField = fields.find((field: FieldDefinition) => {
                return (
                    (field.fieldType as Identifier).value ===
                    state.options.functionFieldPromotion.typeName
                )
            })
            if (promoteField) {
                // cache properties for field we're promoting
                state.options.functionFieldPromotion.fieldName =
                    promoteField.name.value
                state.options.functionFieldPromotion.paramName =
                    promoteField.name.value.charAt(0).toLowerCase() +
                    promoteField.name.value.slice(1)
                state.options.functionFieldPromotion.qualifiedTypeName =
                    state.options.functionFieldPromotion.typeName +
                    '.' +
                    state.options.functionFieldPromotion.typeName

                // args should also exclude promotion fields
                fields = fields.filter((field: FieldDefinition) => {
                    return field !== promoteField
                })
            }
        }
    }

    const signatures = fields.map((field: FieldDefinition) => {
        return ts.createPropertySignature(
            undefined,
            field.name.value,
            renderOptional(field.requiredness),
            typeNodeForFieldType(field.fieldType, state, true),
            undefined,
        )
    })

    return ts.createInterfaceDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        interfaceNameForClass(statement),
        [],
        [],
        signatures,
    )
}

export function renderFullInterface(
    statement: InterfaceWithFields,
    state: IRenderState,
): ts.InterfaceDeclaration {
    const signatures = statement.fields.map((field: FieldDefinition) => {
        return ts.createPropertySignature(
            state.options.useInterfacesWithFunctions &&
                field.defaultValue != null
                ? [ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)]
                : undefined,
            field.name.value,
            renderOptional(field.requiredness),
            typeNodeForFieldType(field.fieldType, state, true),
            undefined,
        )
    })

    return ts.createInterfaceDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        statement.name.value,
        [],
        [],
        signatures,
    )
}
