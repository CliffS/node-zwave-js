import { IDriver } from "../driver/IDriver";
import { ZWaveError, ZWaveErrorCodes } from "../error/ZWaveError";
import { Endpoint } from "../node/Endpoint";
import { ValueID } from "../node/ValueDB";
import { getEnumMemberName } from "../util/misc";
import { Maybe, unknownBoolean } from "../values/Primitive";
import { getCommandClass } from "./CommandClass";
import { CommandClasses } from "./CommandClasses";

/** Used to identify the method on the CC API class that handles setting values on nodes directly */
export const SET_VALUE: unique symbol = Symbol.for("CCAPI_SET_VALUE");
export type SetValueImplementation = (
	property: Pick<ValueID, "property" | "propertyKey">,
	value: unknown,
) => Promise<void>;

// Since the setValue API is called from a point with very generic parameters,
// we must do narrowing inside the API calls. These three methods are for convenience
export function throwUnsupportedProperty(
	cc: CommandClasses,
	property: string | number,
): never {
	throw new ZWaveError(
		`${CommandClasses[cc]}: "${property}" is not a supported property`,
		ZWaveErrorCodes.Argument_Invalid,
	);
}

export function throwUnsupportedPropertyKey(
	cc: CommandClasses,
	property: string | number,
	propertyKey: string | number,
): never {
	throw new ZWaveError(
		`${CommandClasses[cc]}: "${propertyKey}" is not a supported property key for property "${property}"`,
		ZWaveErrorCodes.Argument_Invalid,
	);
}

export function throwWrongValueType(
	cc: CommandClasses,
	property: string | number,
	expectedType: string,
	receivedType: string,
): never {
	throw new ZWaveError(
		`${CommandClasses[cc]}: "${property}" must be of type "${expectedType}", received "${receivedType}"`,
		ZWaveErrorCodes.Argument_Invalid,
	);
}

/** The base class for all CC APIs exposed via `Node.commandClasses.<CCName>` */
export class CCAPI {
	public constructor(
		protected readonly driver: IDriver,
		protected readonly endpoint: Endpoint,
	) {
		this.ccId = getCommandClass(this);
	}

	/** The identifier of the Command Class this API is for */
	protected readonly ccId: CommandClasses;

	protected [SET_VALUE]: SetValueImplementation | undefined;
	/**
	 * Can be used on supported CC APIs to set a CC value by property name (and optionally the property key)
	 */
	public get setValue(): SetValueImplementation | undefined {
		return this[SET_VALUE];
	}

	/**
	 * Retrieves the version of the given CommandClass this endpoint implements
	 */
	public get version(): number {
		return this.endpoint.getCCVersion(this.ccId);
	}

	/** Determines if this simplified API instance may be used. */
	public isSupported(): boolean {
		return (
			// NoOperation is always supported
			// TODO: find out if there are other CCs always supported
			this.ccId === CommandClasses["No Operation"] ||
			this.endpoint.supportsCC(this.ccId)
		);
	}

	/**
	 * Determine whether the linked node supports a specific command of this command class.
	 * "unknown" means that the information has not been received yet
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public supportsCommand(command: number): Maybe<boolean> {
		// This needs to be overwritten per command class. In the default implementation, we don't know anything!
		return unknownBoolean;
	}

	protected assertSupportsCommand(
		commandEnum: unknown,
		command: number,
	): void {
		if (this.supportsCommand(command) !== true) {
			throw new ZWaveError(
				`Node #${this.endpoint.nodeId}${
					this.endpoint.index > 0
						? ` (Endpoint ${this.endpoint.index})`
						: ""
				} does not support the command ${getEnumMemberName(
					commandEnum,
					command,
				)}!`,
				ZWaveErrorCodes.CC_NotSupported,
			);
		}
	}
}

// This interface is auto-generated by maintenance/generateCCAPIInterface.ts
// Do not edit it by hand or your changes will be lost
export interface CCAPIs {
	[Symbol.iterator](): Iterator<CCAPI>;

	// AUTO GENERATION BELOW
	Association: import("./AssociationCC").AssociationCCAPI;
	"Association Group Information": import("./AssociationGroupInfoCC").AssociationGroupInfoCCAPI;
	Basic: import("./BasicCC").BasicCCAPI;
	Battery: import("./BatteryCC").BatteryCCAPI;
	"Binary Sensor": import("./BinarySensorCC").BinarySensorCCAPI;
	"Binary Switch": import("./BinarySwitchCC").BinarySwitchCCAPI;
	"CRC-16 Encapsulation": import("./CRC16").CRC16CCAPI;
	"Central Scene": import("./CentralSceneCC").CentralSceneCCAPI;
	"Climate Control Schedule": import("./ClimateControlScheduleCC").ClimateControlScheduleCCAPI;
	Configuration: import("./ConfigurationCC").ConfigurationCCAPI;
	Indicator: import("./IndicatorCC").IndicatorCCAPI;
	Language: import("./LanguageCC").LanguageCCAPI;
	"Manufacturer Proprietary": import("./ManufacturerProprietaryCC").ManufacturerProprietaryCCAPI;
	"Manufacturer Specific": import("./ManufacturerSpecificCC").ManufacturerSpecificCCAPI;
	Meter: import("./MeterCC").MeterCCAPI;
	"Multi Channel Association": import("./MultiChannelAssociationCC").MultiChannelAssociationCCAPI;
	"Multi Channel": import("./MultiChannelCC").MultiChannelCCAPI;
	"Multi Command": import("./MultiCommandCC").MultiCommandCCAPI;
	"Multilevel Sensor": import("./MultilevelSensorCC").MultilevelSensorCCAPI;
	"Multilevel Switch": import("./MultilevelSwitchCC").MultilevelSwitchCCAPI;
	"No Operation": import("./NoOperationCC").NoOperationCCAPI;
	"Node Naming and Location": import("./NodeNamingCC").NodeNamingAndLocationCCAPI;
	Notification: import("./NotificationCC").NotificationCCAPI;
	"Scene Activation": import("./SceneActivationCC").SceneActivationCCAPI;
	"Thermostat Mode": import("./ThermostatModeCC").ThermostatModeCCAPI;
	"Thermostat Operating State": import("./ThermostatOperatingStateCC").ThermostatOperatingStateCCAPI;
	"Thermostat Setback": import("./ThermostatSetbackCC").ThermostatSetbackCCAPI;
	"Thermostat Setpoint": import("./ThermostatSetpointCC").ThermostatSetpointCCAPI;
	Time: import("./TimeCC").TimeCCAPI;
	"Time Parameters": import("./TimeParametersCC").TimeParametersCCAPI;
	Version: import("./VersionCC").VersionCCAPI;
	"Wake Up": import("./WakeUpCC").WakeUpCCAPI;
	"Z-Wave Plus Info": import("./ZWavePlusCC").ZWavePlusCCAPI;
}
