import { getLogger } from '@xairline/shared-logger';
import { Plane, PlaneApi } from '@xairline/shared-rest-client-remote';
import { makeObservable, observable, runInAction } from 'mobx';
import { remoteConfiguration } from './constants';
const logger = getLogger();
const planeApi = new PlaneApi(remoteConfiguration);
export class FleetStore {
  @observable
  public isLoaded: boolean;
  @observable
  public listedPlanes!: Plane[];
  @observable
  public myPlanes!: Plane[];
  @observable
  public myListedPlanes!: Plane[];

  constructor() {
    this.isLoaded = false;
    makeObservable(this);
  }

  public async loadFleet(airlineId: string) {
    try {
      const { data: listedPlanes } =
        await planeApi.getManyBasePlaneControllerPlane(undefined, undefined, [
          `status||$eq||listed`,
          `owned_by||$ne||${airlineId}`,
        ]);
      const { data: myPlanes } = await planeApi.getManyBasePlaneControllerPlane(
        undefined,
        undefined,
        [`status||$ne||listed`, `owned_by||$eq||${airlineId}`]
      );
      const { data: myListedPlanes } =
        await planeApi.getManyBasePlaneControllerPlane(undefined, undefined, [
          `status||$ne||normal`,
          `status||$ne||in_flight`,
          `owned_by||$eq||${airlineId}`,
        ]);
      runInAction(() => {
        this.myListedPlanes = myListedPlanes as Plane[];
        this.myPlanes = myPlanes as Plane[];
        this.listedPlanes = listedPlanes as Plane[];
        this.isLoaded = true;
        logger.info('fleet loaded');
      });
    } catch (e) {
      logger.error(e);
    }
  }
}
export const fleetStore = new FleetStore();
