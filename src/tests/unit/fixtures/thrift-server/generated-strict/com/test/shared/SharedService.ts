/* tslint:disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v{{VERSION}}
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "test-lib";
import * as __NAMESPACE__ from "./.";
export const metadata: thrift.IServiceMetadata = {
    name: "SharedService",
    annotations: {},
    methods: {
        getStruct: {
            name: "getStruct",
            annotations: {},
            arguments: [
                {
                    name: "key",
                    fieldId: 1,
                    annotations: {},
                    definitionType: {
                        type: thrift.DefinitionMetadataType.BaseType
                    }
                }
            ]
        },
        getUnion: {
            name: "getUnion",
            annotations: {},
            arguments: [
                {
                    name: "index",
                    fieldId: 1,
                    annotations: {},
                    definitionType: {
                        type: thrift.DefinitionMetadataType.BaseType
                    }
                }
            ]
        }
    }
};
export interface IGetStruct__Args {
    __name: "GetStruct__Args";
    key: number;
}
export interface IGetStruct__ArgsArgs {
    key: number;
}
export const GetStruct__ArgsCodec: thrift.IStructCodec<IGetStruct__ArgsArgs, IGetStruct__Args> = {
    encode(args: IGetStruct__ArgsArgs, output: thrift.TProtocol): void {
        const obj = {
            key: args.key
        };
        output.writeStructBegin("GetStruct__Args");
        if (obj.key != null) {
            output.writeFieldBegin("key", thrift.TType.I32, 1);
            output.writeI32(obj.key);
            output.writeFieldEnd();
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[key] is unset!");
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IGetStruct__Args {
        let _args: any = {};
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                case 1:
                    if (fieldType === thrift.TType.I32) {
                        const value_1: number = input.readI32();
                        _args.key = value_1;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        if (_args.key !== undefined) {
            return {
                __name: "GetStruct__Args",
                key: _args.key
            };
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Unable to read GetStruct__Args from input");
        }
    }
};
export class GetStruct__Args implements thrift.IStructLike, IGetStruct__Args {
    public key: number;
    public readonly __name = "GetStruct__Args";
    constructor(args: IGetStruct__ArgsArgs) {
        if (args.key != null) {
            const value_2: number = args.key;
            this.key = value_2;
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[key] is unset!");
        }
    }
    public static read(input: thrift.TProtocol): GetStruct__Args {
        return new GetStruct__Args(GetStruct__ArgsCodec.decode(input));
    }
    public static write(args: IGetStruct__ArgsArgs, output: thrift.TProtocol): void {
        return GetStruct__ArgsCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return GetStruct__ArgsCodec.encode(this, output);
    }
}
export interface IGetUnion__Args {
    __name: "GetUnion__Args";
    index: number;
}
export interface IGetUnion__ArgsArgs {
    index: number;
}
export const GetUnion__ArgsCodec: thrift.IStructCodec<IGetUnion__ArgsArgs, IGetUnion__Args> = {
    encode(args: IGetUnion__ArgsArgs, output: thrift.TProtocol): void {
        const obj = {
            index: args.index
        };
        output.writeStructBegin("GetUnion__Args");
        if (obj.index != null) {
            output.writeFieldBegin("index", thrift.TType.I32, 1);
            output.writeI32(obj.index);
            output.writeFieldEnd();
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[index] is unset!");
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IGetUnion__Args {
        let _args: any = {};
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                case 1:
                    if (fieldType === thrift.TType.I32) {
                        const value_3: number = input.readI32();
                        _args.index = value_3;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        if (_args.index !== undefined) {
            return {
                __name: "GetUnion__Args",
                index: _args.index
            };
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Unable to read GetUnion__Args from input");
        }
    }
};
export class GetUnion__Args implements thrift.IStructLike, IGetUnion__Args {
    public index: number;
    public readonly __name = "GetUnion__Args";
    constructor(args: IGetUnion__ArgsArgs) {
        if (args.index != null) {
            const value_4: number = args.index;
            this.index = value_4;
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[index] is unset!");
        }
    }
    public static read(input: thrift.TProtocol): GetUnion__Args {
        return new GetUnion__Args(GetUnion__ArgsCodec.decode(input));
    }
    public static write(args: IGetUnion__ArgsArgs, output: thrift.TProtocol): void {
        return GetUnion__ArgsCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return GetUnion__ArgsCodec.encode(this, output);
    }
}
export interface IGetStruct__Result {
    __name: "GetStruct__Result";
    success?: __NAMESPACE__.ISharedStruct;
}
export interface IGetStruct__ResultArgs {
    success?: __NAMESPACE__.ISharedStructArgs;
}
export const GetStruct__ResultCodec: thrift.IStructCodec<IGetStruct__ResultArgs, IGetStruct__Result> = {
    encode(args: IGetStruct__ResultArgs, output: thrift.TProtocol): void {
        const obj = {
            success: args.success
        };
        output.writeStructBegin("GetStruct__Result");
        if (obj.success != null) {
            output.writeFieldBegin("success", thrift.TType.STRUCT, 0);
            __NAMESPACE__.SharedStructCodec.encode(obj.success, output);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IGetStruct__Result {
        let _args: any = {};
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                case 0:
                    if (fieldType === thrift.TType.STRUCT) {
                        const value_5: __NAMESPACE__.ISharedStruct = __NAMESPACE__.SharedStructCodec.decode(input);
                        _args.success = value_5;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return {
            __name: "GetStruct__Result",
            success: _args.success
        };
    }
};
export class GetStruct__Result implements thrift.IStructLike, IGetStruct__Result {
    public success?: __NAMESPACE__.ISharedStruct;
    public readonly __name = "GetStruct__Result";
    constructor(args: IGetStruct__ResultArgs = {}) {
        if (args.success != null) {
            const value_6: __NAMESPACE__.ISharedStruct = new __NAMESPACE__.SharedStruct(args.success);
            this.success = value_6;
        }
    }
    public static read(input: thrift.TProtocol): GetStruct__Result {
        return new GetStruct__Result(GetStruct__ResultCodec.decode(input));
    }
    public static write(args: IGetStruct__ResultArgs, output: thrift.TProtocol): void {
        return GetStruct__ResultCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return GetStruct__ResultCodec.encode(this, output);
    }
}
export interface IGetUnion__Result {
    __name: "GetUnion__Result";
    success?: __NAMESPACE__.SharedUnion;
}
export interface IGetUnion__ResultArgs {
    success?: __NAMESPACE__.SharedUnionArgs;
}
export const GetUnion__ResultCodec: thrift.IStructCodec<IGetUnion__ResultArgs, IGetUnion__Result> = {
    encode(args: IGetUnion__ResultArgs, output: thrift.TProtocol): void {
        const obj = {
            success: args.success
        };
        output.writeStructBegin("GetUnion__Result");
        if (obj.success != null) {
            output.writeFieldBegin("success", thrift.TType.STRUCT, 0);
            __NAMESPACE__.SharedUnionCodec.encode(obj.success, output);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IGetUnion__Result {
        let _args: any = {};
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                case 0:
                    if (fieldType === thrift.TType.STRUCT) {
                        const value_7: __NAMESPACE__.SharedUnion = __NAMESPACE__.SharedUnionCodec.decode(input);
                        _args.success = value_7;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return {
            __name: "GetUnion__Result",
            success: _args.success
        };
    }
};
export class GetUnion__Result implements thrift.IStructLike, IGetUnion__Result {
    public success?: __NAMESPACE__.SharedUnion;
    public readonly __name = "GetUnion__Result";
    constructor(args: IGetUnion__ResultArgs = {}) {
        if (args.success != null) {
            const value_8: __NAMESPACE__.SharedUnion = __NAMESPACE__.SharedUnionCodec.create(args.success);
            this.success = value_8;
        }
    }
    public static read(input: thrift.TProtocol): GetUnion__Result {
        return new GetUnion__Result(GetUnion__ResultCodec.decode(input));
    }
    public static write(args: IGetUnion__ResultArgs, output: thrift.TProtocol): void {
        return GetUnion__ResultCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return GetUnion__ResultCodec.encode(this, output);
    }
}
export class Client<Context extends thrift.IThriftContext = thrift.IThriftContext> implements thrift.IThriftClient {
    public static readonly metadata: thrift.IServiceMetadata = metadata;
    public readonly __metadata: thrift.IServiceMetadata = metadata;
    protected _requestId: number;
    protected transport: thrift.ITransportConstructor;
    protected protocol: thrift.IProtocolConstructor;
    protected connection: thrift.IThriftConnection<Context>;
    constructor(connection: thrift.IThriftConnection<Context>) {
        this._requestId = 0;
        this.transport = connection.Transport;
        this.protocol = connection.Protocol;
        this.connection = connection;
    }
    protected incrementRequestId(): number {
        return this._requestId += 1;
    }
    public getStruct(key: number, context?: Context): Promise<__NAMESPACE__.ISharedStruct> {
        const writer: thrift.TTransport = new this.transport();
        const output: thrift.TProtocol = new this.protocol(writer);
        output.writeMessageBegin("getStruct", thrift.MessageType.CALL, this.incrementRequestId());
        const args: IGetStruct__ArgsArgs = { key };
        GetStruct__ArgsCodec.encode(args, output);
        output.writeMessageEnd();
        return this.connection.send(writer.flush(), context).then((data: Buffer) => {
            const reader: thrift.TTransport = this.transport.receiver(data);
            const input: thrift.TProtocol = new this.protocol(reader);
            try {
                const { fieldName: fieldName, messageType: messageType }: thrift.IThriftMessage = input.readMessageBegin();
                if (fieldName === "getStruct") {
                    if (messageType === thrift.MessageType.EXCEPTION) {
                        const err: thrift.TApplicationException = thrift.TApplicationExceptionCodec.decode(input);
                        input.readMessageEnd();
                        return Promise.reject(err);
                    }
                    else {
                        const result: IGetStruct__Result = GetStruct__ResultCodec.decode(input);
                        input.readMessageEnd();
                        if (result.success != null) {
                            return Promise.resolve(result.success);
                        }
                        else {
                            return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, "getStruct failed: unknown result"));
                        }
                    }
                }
                else {
                    return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.WRONG_METHOD_NAME, "Received a response to an unknown RPC function: " + fieldName));
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    public getUnion(index: number, context?: Context): Promise<__NAMESPACE__.SharedUnion> {
        const writer: thrift.TTransport = new this.transport();
        const output: thrift.TProtocol = new this.protocol(writer);
        output.writeMessageBegin("getUnion", thrift.MessageType.CALL, this.incrementRequestId());
        const args: IGetUnion__ArgsArgs = { index };
        GetUnion__ArgsCodec.encode(args, output);
        output.writeMessageEnd();
        return this.connection.send(writer.flush(), context).then((data: Buffer) => {
            const reader: thrift.TTransport = this.transport.receiver(data);
            const input: thrift.TProtocol = new this.protocol(reader);
            try {
                const { fieldName: fieldName, messageType: messageType }: thrift.IThriftMessage = input.readMessageBegin();
                if (fieldName === "getUnion") {
                    if (messageType === thrift.MessageType.EXCEPTION) {
                        const err: thrift.TApplicationException = thrift.TApplicationExceptionCodec.decode(input);
                        input.readMessageEnd();
                        return Promise.reject(err);
                    }
                    else {
                        const result: IGetUnion__Result = GetUnion__ResultCodec.decode(input);
                        input.readMessageEnd();
                        if (result.success != null) {
                            return Promise.resolve(result.success);
                        }
                        else {
                            return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, "getUnion failed: unknown result"));
                        }
                    }
                }
                else {
                    return Promise.reject(new thrift.TApplicationException(thrift.TApplicationExceptionType.WRONG_METHOD_NAME, "Received a response to an unknown RPC function: " + fieldName));
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
}
export interface IHandler<Context extends thrift.IThriftContext = thrift.IThriftContext> {
    getStruct(key: number, context?: Context): __NAMESPACE__.ISharedStructArgs | Promise<__NAMESPACE__.ISharedStructArgs>;
    getUnion(index: number, context?: Context): __NAMESPACE__.SharedUnionArgs | Promise<__NAMESPACE__.SharedUnionArgs>;
}
export class Processor<Context extends thrift.IThriftContext = thrift.IThriftContext> implements thrift.IThriftProcessor<Context> {
    protected readonly _handler: IHandler<Context>;
    public static readonly metadata: thrift.IServiceMetadata = metadata;
    public readonly __metadata: thrift.IServiceMetadata = metadata;
    constructor(handler: IHandler<Context>) {
        this._handler = handler;
    }
    public process(input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject): void => {
            const metadata: thrift.IThriftMessage = input.readMessageBegin();
            const fieldName: string = metadata.fieldName;
            const requestId: number = metadata.requestId;
            const methodName: string = "process_" + fieldName;
            switch (methodName) {
                case "process_getStruct": {
                    resolve(this.process_getStruct(requestId, input, output, context));
                    break;
                }
                case "process_getUnion": {
                    resolve(this.process_getUnion(requestId, input, output, context));
                    break;
                }
                default: {
                    input.skip(thrift.TType.STRUCT);
                    input.readMessageEnd();
                    const errMessage = "Unknown function " + fieldName;
                    const err = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN_METHOD, errMessage);
                    output.writeMessageBegin(fieldName, thrift.MessageType.EXCEPTION, requestId);
                    thrift.TApplicationExceptionCodec.encode(err, output);
                    output.writeMessageEnd();
                    resolve(output.flush());
                    break;
                }
            }
        });
    }
    public process_getStruct(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
        return new Promise<__NAMESPACE__.ISharedStructArgs>((resolve, reject): void => {
            try {
                const args: IGetStruct__Args = GetStruct__ArgsCodec.decode(input);
                input.readMessageEnd();
                resolve(this._handler.getStruct(args.key, context));
            }
            catch (err) {
                reject(err);
            }
        }).then((data: __NAMESPACE__.ISharedStructArgs): Buffer => {
            const result: IGetStruct__ResultArgs = { success: data };
            output.writeMessageBegin("getStruct", thrift.MessageType.REPLY, requestId);
            GetStruct__ResultCodec.encode(result, output);
            output.writeMessageEnd();
            return output.flush();
        }).catch((err: Error): Buffer => {
            const result: thrift.TApplicationException = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, err.message);
            output.writeMessageBegin("getStruct", thrift.MessageType.EXCEPTION, requestId);
            thrift.TApplicationExceptionCodec.encode(result, output);
            output.writeMessageEnd();
            return output.flush();
        });
    }
    public process_getUnion(requestId: number, input: thrift.TProtocol, output: thrift.TProtocol, context: Context): Promise<Buffer> {
        return new Promise<__NAMESPACE__.SharedUnionArgs>((resolve, reject): void => {
            try {
                const args: IGetUnion__Args = GetUnion__ArgsCodec.decode(input);
                input.readMessageEnd();
                resolve(this._handler.getUnion(args.index, context));
            }
            catch (err) {
                reject(err);
            }
        }).then((data: __NAMESPACE__.SharedUnionArgs): Buffer => {
            const result: IGetUnion__ResultArgs = { success: data };
            output.writeMessageBegin("getUnion", thrift.MessageType.REPLY, requestId);
            GetUnion__ResultCodec.encode(result, output);
            output.writeMessageEnd();
            return output.flush();
        }).catch((err: Error): Buffer => {
            const result: thrift.TApplicationException = new thrift.TApplicationException(thrift.TApplicationExceptionType.UNKNOWN, err.message);
            output.writeMessageBegin("getUnion", thrift.MessageType.EXCEPTION, requestId);
            thrift.TApplicationExceptionCodec.encode(result, output);
            output.writeMessageEnd();
            return output.flush();
        });
    }
}
