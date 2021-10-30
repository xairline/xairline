import { PlaneBase } from '../plane.base';
import {
  COMMON_DESCEND_RULES,
  COMMON_TAXI_RULES,
  DEFAULT_RULES,
  IRules,
} from '../rules';

export const RULES: IRules = {
  defaultRules: DEFAULT_RULES,
  taxiRules: [...COMMON_TAXI_RULES],
  descendRules: [...COMMON_DESCEND_RULES],
};
export const A320 = new PlaneBase(
  {
    OneClass: [180],
    TwoClass: [8, 150],
    ThreeClass: [14,36, 96],
  },
  19219,
  [85000000, 99000000]
);