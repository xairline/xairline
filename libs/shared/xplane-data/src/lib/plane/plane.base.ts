import { XPlaneData } from '../xplane-data';

export interface PlaneSeatConfiguration {
  [x: string]: number[];
}

export class PlaneBase {
  seatConfigurations: PlaneSeatConfiguration;
  maxLoad: number;
  price: [number, number];

  constructor(
    seatConfigurations: PlaneSeatConfiguration,
    maxLoad: number,
    price: [number, number]
  ) {
    this.seatConfigurations = seatConfigurations;
    this.maxLoad = maxLoad;
    this.price = price;
  }

  public generateNewPlane(): any {
    const res: any = {};
    // random pax configuration
    if (this.seatConfigurations) {
      const numOfConfigurations = Object.keys(this.seatConfigurations).length;
      const configuration = Object.keys(this.seatConfigurations)[
        Math.round(XPlaneData.randomGen(0, numOfConfigurations - 1))
      ];
      // random paxCapacity
      res.paxCapacity = this.seatConfigurations[configuration];
      const totalPax = res.paxCapacity.reduce(
        (pv: number, cv: number) => pv + parseInt(`${cv}`),
        0
      );
      res.cargoCapacity = this.maxLoad - 100 * totalPax;
    } else {
      res.cargoCapacity = this.maxLoad;
    }

    // random price
    res.price = XPlaneData.randomGen(this.price[0], this.price[1]);
    return res;
  }
}
