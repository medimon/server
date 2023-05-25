import BranchModel from '../branches/branchModel';

export default interface UnitModel {
  name: string;
  // date: Date
  code: string;
  branch: BranchModel;
}
