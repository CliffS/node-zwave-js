import { IDriver } from "../driver/IDriver";
import {
	FunctionType,
	MessagePriority,
	MessageType,
} from "../message/Constants";
import {
	expectedResponse,
	Message,
	MessageBaseOptions,
	MessageDeserializationOptions,
	messageTypes,
	priority,
} from "../message/Message";

export interface IsFailedNodeRequestOptions extends MessageBaseOptions {
	// This must not be called nodeId or rejectAllTransactions may reject the request
	failedNodeId: number;
}

@messageTypes(MessageType.Request, FunctionType.IsFailedNode)
@expectedResponse(FunctionType.IsFailedNode)
@priority(MessagePriority.Normal)
export class IsFailedNodeRequest extends Message {
	public constructor(driver: IDriver, options: IsFailedNodeRequestOptions) {
		super(driver, options);
		this.failedNodeId = options.failedNodeId;
	}

	// This must not be called nodeId or rejectAllTransactions may reject the request
	public failedNodeId: number;

	public serialize(): Buffer {
		this.payload = Buffer.from([this.failedNodeId]);
		return super.serialize();
	}
}

@messageTypes(MessageType.Response, FunctionType.IsFailedNode)
export class IsFailedNodeResponse extends Message {
	public constructor(
		driver: IDriver,
		options: MessageDeserializationOptions,
	) {
		super(driver, options);
		this.result = !!this.payload[0];
	}

	public readonly result: boolean;
}
