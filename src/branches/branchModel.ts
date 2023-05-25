import Location from '../company/locationModel';

export default interface BranchModel {
  name: string;
  code: string;
  location: Location;
}
