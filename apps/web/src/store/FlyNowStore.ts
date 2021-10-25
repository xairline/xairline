import { getLogger } from '@xairline/shared-logger';
import {
  Airline as RemoteAirline,
  AirlineV2Api as RemoteAirlineApi,
  Flight as RemoteFlight,
  FlightApi,
  FlightApi as RemoteFlightApi,
  FlightReport,
  Livemap,
  LivemapApi,
  Passenger,
  PassengerApi,
  Plane,
  PlaneApi,
} from '@xairline/shared-rest-client-remote';
import {
  DATAREF_FEQ,
  FlightData,
  Rules,
  XPlaneData,
} from '@xairline/shared-xplane-data';
import { Engine } from 'json-rules-engine';
import { makeObservable, observable, runInAction } from 'mobx';
import 'reflect-metadata';
import { airlineStore } from './AirlineStore';
import { remoteConfiguration } from './constants';
const planeApi = new PlaneApi(remoteConfiguration);
const flightApi = new FlightApi(remoteConfiguration);
const passengerApi = new PassengerApi(remoteConfiguration);
const livemapApi = new LivemapApi(remoteConfiguration);
const remoteAirlieApi = new RemoteAirlineApi(remoteConfiguration);
const remoteFlightApi = new RemoteFlightApi(remoteConfiguration);
const logger = getLogger();
export class FlyNowStore {
  @observable
  public currentStep!: number;
  @observable
  public bookableFlights: any[] | undefined;
  @observable
  public selectedFlight: RemoteFlight | undefined | any;
  @observable
  public flightData!: FlightData;
  @observable
  public isTracking!: boolean;
  @observable
  public paxSheet!: Passenger;
  @observable
  public vaType: string | undefined;
  @observable
  public vaData:
    | {
        departure: string;
        arrival: string;
        est_flight_time: number;
      }
    | undefined;

  public ws: WebSocket | undefined;
  private engine!: Engine;
  public rules!: Rules;
  public plane!: Plane;

  constructor() {
    this.init();
    makeObservable(this);
  }

  public init() {
    this?.ws?.close();
    logger.info('websocket closed');
    this?.engine?.stop();
    logger.info('rules engine stopped');
    this.currentStep = 0;
    this.bookableFlights = [];
    this.selectedFlight = undefined;
    this.vaType = undefined;
    this.isTracking = false;
    this.loadBookableFlights();
  }

  public changeStep(value: number) {
    runInAction(() => {
      this.currentStep = value;
    });
  }

  public async createFlight(newFlight: RemoteFlight) {
    try {
      await remoteFlightApi.createOneBaseFlightControllerFlight(newFlight);
      runInAction(() => {
        this.loadBookableFlights();
      });
    } catch (e) {
      logger.error(e);
    }
  }

  public async loadBookableFlights() {
    try {
      const flights = await remoteFlightApi.getManyBaseFlightControllerFlight(
        undefined,
        undefined,
        [
          `bookable||$eq||1`,
          `owner_id||$eq||${airlineStore?.activeAirline?.id as string}`,
        ],
        undefined,
        ['lastUpdate,DESC']
      );
      runInAction(() => {
        this.bookableFlights = Object.values(flights.data).map((value) => {
          return { ...value, key: value.id };
        });
      });
    } catch (e) {
      logger.error(e);
    }
  }

  public async trackingFlight() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = this.connect();
  }

  private connect() {
    this.rules = new Rules(this.selectedFlight.aircraft, this.flightData);
    this.engine = new Engine(this.rules.getRules());
    const ws = new WebSocket('ws://localhost:4200');
    let cruiseCounter = 0;
    let climbCounter = 0;
    let descendCounter = 0;
    let landingDataFeq = false;
    let timeDelta = 0;
    const currentFlight = this.selectedFlight as RemoteFlight;
    const livemapData = {
      airline: airlineStore.activeAirline?.id as string,
      flight_number: currentFlight.name,
      route: `${currentFlight.departure} - ${currentFlight.arrival}`,
      latitude: 0,
      longitude: 0,
    };
    let livemapId = 0;
    livemapApi
      .getManyBaseLivemapControllerLivemap(undefined, undefined, [
        `airline||$eq||${airlineStore.pilotId as string}`,
      ])
      .then((res) => {
        const livemaps: Livemap[] = res.data as Livemap[];
        if (livemaps.length === 0) {
          livemapApi
            .createOneBaseLivemapControllerLivemap(livemapData)
            .then(({ data }) => {
              livemapId = data.id as number;
              logger.info('created live flight');
            })
            .catch((e) => {
              logger.info(e);
            });
        } else {
          livemapId = livemaps[0].id as number;
          logger.info(`livemap id: ${livemapId}`);
        }
      });

    ws.onmessage = (msg) => {
      runInAction(async () => {
        try {
          this.isTracking = true;
          if (!this.flightData.state) {
            XPlaneData.changeStateTo(this.flightData, 'parked', Date.now());
            this.flightData.startTime = Date.now();
          }
          const flightDataArray: any[] = XPlaneData.processRawData(msg.data);
          if (timeDelta === 0) {
            timeDelta =
              parseInt(`${this.flightData.startTime}`) -
              parseInt(flightDataArray[0].ts);
          }
          // update lat and lat
          if (livemapId !== 0) {
            const { lat, lng, ias, gs, vs, elevation } =
              flightDataArray[flightDataArray.length - 1];
            livemapApi
              .updateOneBaseLivemapControllerLivemap(livemapId, {
                ...livemapData,
                latitude: lat,
                longitude: lng,
                flight_data: JSON.stringify({ ias, gs, vs, elevation }),
              })
              .then(() => {
                logger.info('live flight updated');
              })
              .catch((e) => logger.error(e));
          }

          for (let i = 0; i < flightDataArray.length; i++) {
            const {
              ts,
              vs,
              agl,
              gs,
              gForce,
              gearForce,
              pitch,
              ias,
              n1,
              elevation,
            } = flightDataArray[i];
            const timestamp = Math.round(ts + timeDelta);
            const { results } = await this.engine.run({
              dataref: {
                ts: timestamp,
                vs,
                agl,
                gs,
                gForce,
                gearForce,
                pitch,
                ias,
                n1,
                elevation,
                state: this.flightData.state,
              },
            });
            results.forEach((result) => {
              if (result.name) {
                this.engine.removeRule(result.name);
              }
            });

            if (this.flightData.state === 'climb') {
              if (vs < 500 / 196.85 && vs > -500 / 196.85) {
                cruiseCounter++;
                if (cruiseCounter > 30 * DATAREF_FEQ) {
                  XPlaneData.changeStateTo(
                    this.flightData,
                    'cruise',
                    timestamp
                  );
                  cruiseCounter = 0;
                }
              } else {
                cruiseCounter = 0;
              }
            }

            if (this.flightData.state === 'cruise') {
              if (vs > 500 / 196.85) {
                climbCounter++;
                if (climbCounter > 30 * DATAREF_FEQ) {
                  XPlaneData.changeStateTo(this.flightData, 'climb', timestamp);
                  climbCounter = 0;
                }
              } else {
                climbCounter = 0;
              }
            }

            if (this.flightData.state === 'cruise') {
              if (vs < -500 / 196.85 && elevation < 20000 / 3.28) {
                descendCounter++;
                if (descendCounter > 60 * DATAREF_FEQ) {
                  XPlaneData.changeStateTo(
                    this.flightData,
                    'descend',
                    timestamp
                  );
                  descendCounter = 0;
                }
              } else {
                descendCounter = 0;
              }
            }

            if (this.flightData.state === 'landing') {
              if (!landingDataFeq) {
                this.ws?.send('Landing dataref freq');
                landingDataFeq = true;
              }
              XPlaneData.calculateLandingData(
                timestamp,
                vs,
                agl,
                gForce,
                gearForce,
                pitch,
                ias,
                this.flightData
              );
              if (gs < 30 / 1.9438 && gearForce > 0) {
                this.ws?.close();
                logger.info('websocket closed');
                this.engine.stop();
                logger.info('rules engine stopped');
                await this.createReport();
                XPlaneData.changeStateTo(this.flightData, 'stop', timestamp);
              }
            }
          }
        } catch (e) {
          logger.error(e);
        }
      });
    };

    return ws;
  }

  async createReport() {
    try {
      const actual_flight_time =
        this.flightData.endTime - this.flightData.startTime;
      // satification
      let satisfication = 100;
      const { data } =
        await passengerApi.getOneBasePassengerControllerPassenger(
          this.selectedFlight.id
        );

      satisfication += XPlaneData.caclSatification(
        actual_flight_time - this.selectedFlight.estimated_flight_time,
        this.flightData.landingData,
        data
      );
      await this.updateActualFlightTime(actual_flight_time);

      await this.updateSatisfication(satisfication, data);

      const flightReport: FlightReport = await this.createFlightReport();

      //set plane back to normal
      // set that plan to in_flight
      await planeApi
        .updateOneBasePlaneControllerPlane(this.plane.id as number, {
          ...this.plane,
          status: 'normal',
        })
        .catch((e) => {
          logger.error(e);
        });
      logger.info('set plane back to normal');

      await this.updateAirlineRevenue(data, satisfication, flightReport);

      await airlineStore.getAirlineDetails();
      this.currentStep = 3;
    } catch (e) {
      logger.error(e);
    }
  }
  private async updateAirlineRevenue(
    data: Passenger,
    satisfication: number,
    flightReport: FlightReport
  ) {
    let cash: number = XPlaneData.calcRevenue(
      data.total_number_of_passengers || 0,
      this.selectedFlight.estimated_flight_time || 0,
      satisfication || 0
    );
    JSON.parse(flightReport.cost).forEach((cost: any) => {
      cash -= cost.cost;
    });

    const { data: airlineData } =
      await remoteAirlieApi.airlineControllerV2UpdateCash(
        airlineStore.activeAirline?.id as string,
        {
          ...(airlineStore.activeAirline as RemoteAirline),
          cash,
        }
      );
    airlineStore.activeAirline = airlineData;
    logger.info('updated airlne revenue');
  }
  private async createFlightReport(): Promise<FlightReport> {
    const cost: any[] = [];
    cost.push({
      name: `XAA Violation Penalties x${this.flightData.violationEvents.length}`,
      cost: XPlaneData.dataRoundup(
        2000 * 50 * this.flightData.violationEvents.length
      ),
    });
    const flightReport: FlightReport = {
      events: JSON.stringify(this.flightData.events),
      flight_id: this.selectedFlight.id,
      landingData: JSON.stringify(this.flightData.landingData),
      violation_events: JSON.stringify(this.flightData.violationEvents),
      cost: JSON.stringify(cost),
      owner_id: airlineStore.activeAirline?.id,
      pilot_id: airlineStore.pilotId,
    };
    await flightApi.createOneBaseFlightReportControllerFlightReport(
      flightReport
    );
    logger.info('created flight report');
    return flightReport;
  }

  private async updateSatisfication(satisfication: number, data: Passenger) {
    await passengerApi.updateOneBasePassengerControllerPassenger(
      this.selectedFlight.id,
      {
        ...data,
        satisfication,
      }
    );
    logger.info('updated passenger satisfication');
  }

  private async updateActualFlightTime(actual_flight_time: number) {
    const patchData = this.selectedFlight;
    const id = patchData.id;
    delete patchData.id;

    await remoteFlightApi.createOneBaseFlightControllerFlight(patchData);
    logger.info('dup flight');

    await remoteFlightApi.updateOneBaseFlightControllerFlight(id, {
      ...patchData,
      bookable: false,
      actual_flight_time,
      aircraft: this.selectedFlight.aircraft,
      pilot_id: airlineStore.pilotId,
    });
    this.selectedFlight.id = id;
    logger.info('updated actual flight time');
  }

  async getLoadSheet(aircraft = 'B737-800') {
    try {
      const createPassengerRes =
        await passengerApi.createOneBasePassengerControllerPassenger({
          id: this.selectedFlight.id,
          aircraft_type: aircraft,
          airline_id: airlineStore.activeAirline?.id,
          owner_id: airlineStore.activeAirline?.id,
          pilot_id: airlineStore.pilotId,
        });
      runInAction(() => {
        this.paxSheet = createPassengerRes.data;
        logger.info(`Load pax for: ${aircraft}`);
      });
    } catch (e) {
      logger.error(e);
    }
  }
}
export const flyNowStore = new FlyNowStore();
