export interface Activity {
  id: number;
  itemId: number;
  actionName: string;
  createdBy: string;
  userRole: string;
  startedAt: Date | string;
  status: 'SUCCESS' | 'FAILED';
}

export type ActivityFilters = Partial<
  Pick<
    Activity,
    'actionName' | 'createdBy' | 'userRole' | 'status' | 'startedAt'
  >
>;

export interface ActivityApiResponse {
  userActivities: Activity[];
  count: number;
}

export type ActivityStatus = Activity['status'];
