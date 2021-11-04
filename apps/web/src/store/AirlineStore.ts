import { getLogger } from '@xairline/shared-logger';
import { XPlaneData } from '@xairline/shared-xplane-data';
import { notification } from 'antd';
import { NotificationPlacement } from 'antd/lib/notification';
import compareVersions from 'compare-versions';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { machineId } from 'node-machine-id';
import 'reflect-metadata';
import { environment } from '../environments/environment';
import {
  Airline as RemoteAirline,
  AirlineRelationsApi,
  AirlineToAirlineRelation,
  AirlineV2Api as RemoteAirlineApi,
  FlightApi as RemoteFlightApi,
  Flight as RemoteFlight,
} from '@xairline/shared-rest-client-remote';
import {
  FlightApi,
  FlightReportSummary,
  PassengerApi,
} from '@xairline/shared-rest-client-remote';
import { configuration, remoteConfiguration } from './constants';
import { Airline, AirlineApi } from '../rest-client';
const airlineApi = new AirlineApi(configuration);
const flightApi = new FlightApi(remoteConfiguration);
const passengerApi = new PassengerApi(remoteConfiguration);
const logger = getLogger();
const remoteAirlieApi = new RemoteAirlineApi(remoteConfiguration);
const airlineRelationsApi = new AirlineRelationsApi(remoteConfiguration);
const remoteFlightApi = new RemoteFlightApi(remoteConfiguration);
export class AirlineStore {
  @observable
  public activeAirline: RemoteAirline | null;
  @observable
  public isLoaded: boolean;
  @observable
  public lastFlight!: RemoteFlight;
  @observable
  public hoursFlew!: number;
  @observable
  public totalFlights!: number;
  @observable
  public satisfication!: number;
  @observable
  public flightReportSummary!: FlightReportSummary[];
  @observable
  public updateAvailable!: boolean;
  @observable
  public remoteVersion!: string;
  @observable
  public ladderData!: RemoteAirline[];
  @observable
  public isOwner: boolean;
  @observable
  public pilots!: (RemoteAirline & { status: string; relationId: number })[];
  @observable
  public availabileAirlines!: RemoteAirline[];
  @observable
  public publicAirlines!: RemoteAirline[];

  public pilotId: string;
  public airlineApi;

  private newVersionNotified!: boolean;
  constructor() {
    this.isOwner = false;
    this.activeAirline = null;
    this.hoursFlew = 0;
    this.totalFlights = 0;
    this.satisfication = 0;
    this.airlineApi = remoteAirlieApi;
    this.isLoaded = false;
    this.updateAvailable = false;
    this.newVersionNotified = false;
    this.pilotId = '';
    this.getAirlineDetails();
    makeObservable(this);
  }

  public getAirlineDetails = async () => {
    try {
      this.hoursFlew = 0;
      this.totalFlights = 0;
      this.satisfication = 0;
      this.availabileAirlines = [];
      this.publicAirlines = [];
      this.pilots = [];
      const { data: airlines }: { data: Airline[] } =
        (await airlineApi.getManyBaseAirlineControllerAirline()) as {
          data: Airline[];
        };

      let myAirline: RemoteAirline;
      if (airlines.length > 0) {
        this.pilotId = airlines[0].id as string;
        await remoteAirlieApi
          .getOneBaseAirlineControllerV2Airline(this.pilotId as string)
          .catch(async (e) => {
            if (e?.response?.status === 404) {
              await remoteAirlieApi.createOneBaseAirlineControllerV2Airline({
                id: this.pilotId as string,
                callsign: 'XA',
                name: airlines[0].name,
                cash: 300000000,
                landing_g: 0.0,
                landing_vs: 0.0,
                total_flights: 0,
                total_hours: 0,
                total_violations: 0,
                password: airlines[0].machine_id,
              });
              return;
            }
          });
        await remoteAirlieApi.airlineControllerV2Login({
          id: this.pilotId,
          password: airlines[0].machine_id,
        });
        setInterval(() => {
          remoteAirlieApi.airlineControllerV2Login({
            id: this.pilotId,
            password: airlines[0].machine_id,
          });
        }, 15 * 1000);

        const { data } =
          await remoteAirlieApi.getOneBaseAirlineControllerV2Airline(
            this.pilotId as string
          );
        myAirline = data;
        await this.migrate(myAirline);
        runInAction(async () => {
          if (!this.activeAirline) {
            this.activeAirline = myAirline;
          }
          this.isOwner = this.activeAirline.id === this.pilotId;
          const lastFlights =
            await remoteFlightApi.getManyBaseFlightControllerFlight(
              undefined,
              undefined,
              [`bookable||$eq||0`, `owner_id||$eq||${this.activeAirline?.id}`],
              undefined,
              ['lastUpdate,DESC'],
              undefined
            );
          const flightReportSummary =
            await flightApi.getManyBaseFlightReportSummaryControllerFlightReportSummary(
              undefined,
              `{"$or":[{"pilot_id":"${airlineStore.pilotId}"},{"owner_id":"${airlineStore.activeAirline?.id}"}]}`
            );

          const passengerSummary =
            await passengerApi.getManyBasePassengerSummaryControllerPassengerSummary(
              undefined,
              undefined,
              [`airline_id||$eq||${this.activeAirline.id}`]
            );
          const flights = lastFlights.data as RemoteFlight[];
          this.flightReportSummary = flightReportSummary.data;
          const { data } =
            await remoteAirlieApi.getOneBaseAirlineControllerV2Airline(
              this.activeAirline.id as string
            );
          this.activeAirline = data;
          this.lastFlight = Object.values(lastFlights.data)[0];
          this.satisfication = passengerSummary.data.satification;

          this.updateAvailable = await this.isUpdateAvailable();
          flights.forEach((flight) => {
            this.totalFlights += 1;
            this.hoursFlew +=
              (flight?.actual_flight_time || 0) / 1000 / 60 / 60;
          });

          let landing_g = 0;
          let landing_vs = 0;
          let total_violations = 0;
          this.flightReportSummary.forEach((flightSummary) => {
            const violations = JSON.parse(flightSummary.violations);
            landing_g += flightSummary.landingGForce;
            landing_vs += flightSummary.landingVS;
            total_violations += violations.length;
          });
          this.isLoaded = true;
          landing_g =
            XPlaneData.dataRoundup(landing_g / this.totalFlights) || 0;
          landing_vs =
            XPlaneData.dataRoundup(landing_vs / this.totalFlights) || 0;
          if (this.isOwner) {
            remoteAirlieApi.updateOneBaseAirlineControllerV2Airline(
              myAirline.id as string,
              {
                id: this.activeAirline.id as string,
                callsign: this.activeAirline.callsign,
                name: this.activeAirline.name,
                cash: this.activeAirline.cash,
                landing_g,
                landing_vs,
                total_flights: this.totalFlights,
                total_hours: this.hoursFlew,
                total_violations,
                profilePic: myAirline.profilePic,
              }
            );
          }
          const last7Days = new Date(
            new Date().getTime() - 60 * 60 * 24 * 7 * 1000
          );
          const remoteAirlineData =
            await remoteAirlieApi.getManyBaseAirlineControllerV2Airline(
              undefined,
              undefined,
              [`lastUpdate||$gt||${last7Days.toISOString()}`],
              undefined,
              ['lastUpdate,DESC']
            );
          this.ladderData = remoteAirlineData.data as RemoteAirline[];

          const { data: availabileAirlines } =
            await airlineRelationsApi.getManyBaseAirlineRelationsControllerAirlineToAirlineRelation(
              undefined,
              undefined,
              [`pilot_id||$eq||${this.pilotId}`, `status||$eq||approved`]
            );
          for (
            let i = 0;
            i < (availabileAirlines as AirlineToAirlineRelation[]).length;
            i++
          ) {
            const airline = (availabileAirlines as AirlineToAirlineRelation[])[
              i
            ];
            const { data: remoteAirline } =
              await remoteAirlieApi.getOneBaseAirlineControllerV2Airline(
                airline.owner_id
              );
            this.availabileAirlines.push(remoteAirline);
          }

          const publicAirlinesData =
            await remoteAirlieApi.getManyBaseAirlineControllerV2Airline(
              undefined,
              undefined,
              [`email||$notnull`],
              undefined,
              ['lastUpdate,DESC']
            );
          this.publicAirlines = publicAirlinesData.data as RemoteAirline[];

          const tempData =
            await airlineRelationsApi.getManyBaseAirlineRelationsControllerAirlineToAirlineRelation(
              undefined,
              undefined,
              [`owner_id||$eq||${this.activeAirline.id as string}`]
            );
          const tmp = [];
          for (const temp of tempData.data as AirlineToAirlineRelation[]) {
            const { data: remoteAirline } =
              await remoteAirlieApi.getOneBaseAirlineControllerV2Airline(
                temp.pilot_id
              );
            tmp.push({
              ...remoteAirline,
              status: temp.status,
              relationId: temp.id as number,
            });
          }
          this.pilots = tmp;
        });
      } else {
        runInAction(() => {
          this.isLoaded = true;
        });
      }
    } catch (e) {
      logger.error(e);
    }
  };

  public setActiveAirline(airline: RemoteAirline) {
    this.activeAirline = airline;
  }

  public async updateAirline(airline: RemoteAirline) {
    try {
      await remoteAirlieApi.updateOneBaseAirlineControllerV2Airline(
        airline?.id as string,
        airline
      );
      await this.getAirlineDetails();
    } catch (e) {
      logger.error(e);
    }
  }

  public async isUpdateAvailable(): Promise<boolean> {
    try {
      const res = await airlineApi.airlineControllerGetRemoteVersion();
      runInAction(() => {
        this.remoteVersion = res.data;
      });
      if (compareVersions(res.data, environment.version) > 0) {
        const args = {
          message: 'New version is available',
          description: `${res.data}`,
          placement: 'bottomRight' as NotificationPlacement,
        };
        if (!this.newVersionNotified) {
          this.newVersionNotified = true;
          notification.info(args);
        }
        return true;
      }
      return false;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }

  async migrate(airline: RemoteAirline) {
    // migrate fligt
    // check if we need to migrate
    //migrage flit report
    // migrate passengers
  }

  @action
  public async createAirline(values: any) {
    try {
      const newAirline: Airline = {
        name: values.name,
        machine_id: await machineId(),
      };
      await airlineApi.createOneBaseAirlineControllerAirline(newAirline);
      // runInAction(() => {
      //   this.activeAirline = newAirline;
      // });
    } catch (e) {
      logger.error(e);
    }
  }
}

export const airlineStore = new AirlineStore();
