import { getLogger } from '@xairline/shared-logger';
import {
  Flight,
  FlightApi as RemoteFlightApi,
  FlightReport,
  Passenger,
  PassengerApi,
} from '@xairline/shared-rest-client-remote';
import { makeObservable, observable, runInAction } from 'mobx';
import { remoteConfiguration } from './constants';
const logger = getLogger();
const passengerApi = new PassengerApi(remoteConfiguration);
const remoteFlightApi = new RemoteFlightApi(remoteConfiguration);
export class ReportStore {
  private flightId!: number;
  @observable
  public isLoaded: boolean;
  @observable
  public flight!: Flight;
  @observable
  public report!: FlightReport;
  @observable
  public passengerReport!: Passenger;

  constructor() {
    this.isLoaded = false;
    makeObservable(this);
  }

  public async loadReport(flightId: number) {
    try {
      if (this.flightId === flightId) {
        runInAction(() => {
          this.isLoaded = true;
        });
        return;
      }
      this.flightId = flightId;
      const { data } = await remoteFlightApi.getOneBaseFlightControllerFlight(
        flightId
      );

      const res =
        await remoteFlightApi.getManyBaseFlightReportControllerFlightReport(
          undefined,
          undefined,
          [`flight_id||$eq||${flightId}`]
        );

      const passengerRes =
        await passengerApi.getOneBasePassengerControllerPassenger(flightId);

      runInAction(() => {
        this.report = (res.data as FlightReport[])[0];
        this.flight = data;
        this.passengerReport = passengerRes.data as Passenger;
        this.isLoaded = true;
      });
    } catch (e) {
      logger.error(e);
    }
  }
}
export const reportStore = new ReportStore();
