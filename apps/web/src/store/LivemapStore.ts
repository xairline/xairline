import {
  AirlineV2Api,
  Livemap,
  LivemapApi,
} from '@xairline/shared-rest-client-remote';
import faker from 'faker';
import { makeObservable, observable, runInAction } from 'mobx';
import { remoteConfiguration } from '.';
const livemapApi = new LivemapApi(remoteConfiguration);
const remoteAirlieApi = new AirlineV2Api(remoteConfiguration);
class LivemapStore {
  @observable
  public planes!: Livemap[];
  @observable
  public selected!: Livemap;

  private airlineProfilePicMap!: any;

  constructor() {
    this.airlineProfilePicMap = {};
    setInterval(() => {
      const date30SecondsAgo = new Date(new Date().getTime() - 30 * 1000);
      runInAction(async () => {
        const { data } = await livemapApi.getManyBaseLivemapControllerLivemap(
          undefined,
          undefined,
          [`lastUpdate||$gt||${date30SecondsAgo.toISOString()}`]
        );
        this.planes = data as Livemap[];
        this.planes.forEach(async (plane) => {
          const { data } =
            await remoteAirlieApi.getOneBaseAirlineControllerV2Airline(
              plane.airline,
              ['profilePic']
            );
          this.airlineProfilePicMap[`${plane.airline}`] =
            data.profilePic ||
            faker.image.imageUrl(128,128,'animals',true);
        });
      });
    }, 15 * 1000);
    makeObservable(this);
  }

  public getAirlineProfilePic(id: string): string {
    return this.airlineProfilePicMap[`${id}`];
  }
}
export const livemapStore = new LivemapStore();
