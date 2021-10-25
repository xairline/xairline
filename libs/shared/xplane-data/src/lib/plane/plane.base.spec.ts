import { PlaneBase } from './plane.base';
describe('Plane metadata test', () => {
  it('should gen a pax plane', () => {
    const testPlaneMetadata = new PlaneBase(
      {
        OneClass: [200],
        TwoClass: [100, 100],
        ThreeClass: [20, 50, 100],
      },
      100000,
      [1, 9]
    );
    const res = testPlaneMetadata.generateNewPlane();
    expect(res).toHaveProperty('paxCapacity');
    expect(res).toHaveProperty('cargoCapacity');
    expect(res).toHaveProperty('price');
  });

  it('should gen a cargo plane', () => {
    const testPlaneMetadata = new PlaneBase(
      undefined,
      100000,
      [1, 9]
    );
    const res = testPlaneMetadata.generateNewPlane();
    expect(res).not.toHaveProperty('paxCapacity');
    expect(res).toHaveProperty('cargoCapacity');
    expect(res).toHaveProperty('price');
  });
});
