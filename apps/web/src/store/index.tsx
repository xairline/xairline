import { createContext, useContext } from 'react';
import { airlineStore } from './AirlineStore';
import { fleetStore } from './FleetStore';
import { flightLogStore } from './FlightLogStore';
import { flyNowStore } from './FlyNowStore';
import { livemapStore } from './LivemapStore';
import { reportStore } from './ReportStore';
import { routerStore } from './RouterStore';
export const rootStoreContext = createContext({
  AirlineStore: airlineStore,
  RouterStore: routerStore,
  FlyNowStore: flyNowStore,
  FlightLogStore: flightLogStore,
  ReportStore: reportStore,
  FleetStore: fleetStore,
  LivemapStore: livemapStore,
});

export const useStores = () => {
  const store = useContext(rootStoreContext);
  if (!store) {
    throw new Error('useStores must be used winin a provider');
  }
  return store;
};

export * from './ReportStore';
export * from './constants';
