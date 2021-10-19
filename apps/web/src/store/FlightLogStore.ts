import { getLogger } from '@xairline/shared-logger';
import {
  Flight,
  FlightApi as RemoteFlightApi,
} from '@xairline/shared-rest-client-remote';
import { makeObservable, observable, runInAction } from 'mobx';
import 'reflect-metadata';
import { remoteConfiguration } from '.';
import { airlineStore } from './AirlineStore';
const remoteFlightApi = new RemoteFlightApi(remoteConfiguration);
const logger = getLogger();
class FlightLogStore {
  @observable
  public flightLog: any[];
  @observable
  public selectedFlight: Flight | undefined | any;

  constructor() {
    this.flightLog = [];
    this.init();
    makeObservable(this);
  }

  public init() {
    this.selectedFlight = undefined;
    this.loadFlightLogs();
  }

  public async loadFlightLogs() {
    try {
      const flights = await remoteFlightApi.getManyBaseFlightControllerFlight(
        undefined,
        `{"$or":[{"$and":[{"owner_id":"${airlineStore.activeAirline?.id}"},{"bookable":0}]},{"$and":[{"pilot_id":"${airlineStore.pilotId}"},{"bookable":0}]}]}`,
        undefined,
        ['lastUpdate,DESC']
      );
      flights.data = (flights.data as any[]).sort(
        (a, b) => Date.parse(b.lastUpdate) - Date.parse(a.lastUpdate)
      );
      for (const flight of flights.data as Flight[]) {
        const { data } =
          await airlineStore.airlineApi.getOneBaseAirlineControllerV2Airline(
            flight.owner_id,
            ['name']
          );
        flight.owner_id = data.name;

        const { data: pilot } =
          await airlineStore.airlineApi.getOneBaseAirlineControllerV2Airline(
            flight.pilot_id,
            ['name']
          );
        flight.pilot_id = pilot.name;
      }
      runInAction(() => {
        this.flightLog = Object.values(flights.data).map((value) => {
          return { ...value, key: value.id };
        });
      });
    } catch (e) {
      logger.error(e);
    }
  }
  public getSelectedFlightEvents() {
    return this?.selectedFlight?.events
      ? JSON.parse(this.selectedFlight.events)
      : [];
  }
}
export const flightLogStore = new FlightLogStore();
