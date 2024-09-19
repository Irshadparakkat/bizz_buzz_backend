export enum Permission {
  /** user */
  CreateUser = 'create:User',
  GetUser = 'get:User',
  ListUser = 'list:User',
  UpdateUser = 'update:User',
  DeleteUser = 'delete:User',

  /** ad */
  CreateAd = 'create:Ad',
  GetAd = 'get:Ad',
  ListAd = 'list:Ad',
  UpdateAd = 'update:Ad',
  DeleteAd = 'delete:Ad',

  /** ad stats */
  ListAdStats = 'list:AdStats',
  UpdateAdStats = 'update:AdStats',

  /** bus */
  CreateBus = 'create:Bus',
  GetBus = 'get:Bus',
  ListBus = 'list:Bus',
  UpdateBus = 'update:Bus',
  DeleteBus = 'delete:Bus',
  AssignBus = 'assign:Bus',
  UnassignBus = 'unassign:Bus',

  /** business */
  CreateBusiness = 'create:Business',
  GetBusiness = 'get:Business',
  ListBusiness = 'list:Business',
  UpdateBusiness = 'update:Business',
  DeleteBusiness = 'delete:Business',

  /** coupon */
  CreateCoupon = 'create:Coupon',
  GetCoupon = 'get:Coupon',
  ListCoupon = 'list:Coupon',
  UpdateCoupon = 'update:Coupon',
  DeleteCoupon = 'delete:Coupon',
  RedeemCoupon = 'redeem:Coupon',

  /** customer */
  CreateCustomer = 'create:Customer',
  GetCustomer = 'get:Customer',
  ListCustomer = 'list:Customer',
  UpdateCustomer = 'update:Customer',
  DeleteCustomer = 'delete:Customer',

  /** driver */
  CreateDriver = 'create:Driver',
  GetDriver = 'get:Driver',
  ListDriver = 'list:Driver',
  UpdateDriver = 'update:Driver',
  DeleteDriver = 'delete:Driver',

  /** trip */
  CreateTrip = 'create:Trip',
  GetTrip = 'get:Trip',
  ListTrip = 'list:Trip',
  UpdateTrip = 'update:Trip',
  DeleteTrip = 'delete:Trip',
  GetTripTiming = 'get:TripTiming',
  BulkUploadTrip = 'bulkUpload:Trip',

  /** fav ad */
  CreateFavAd = 'create:FavAd',
  ListFavAd = 'list:FavAd',
  DeleteFavAd = 'delete:FavAd',

  /** fav stop */
  CreateFavStop = 'create:FavStop',
  ListFavStop = 'list:FavStop',
  DeleteFavStop = 'delete:FavStop',

  /** instant offer */
  CreateInstantOffer = 'create:InstantOffer',
  GetInstantOffer = 'get:InstantOffer',
  ListInstantOffer = 'list:InstantOffer',
  UpdateInstantOffer = 'update:InstantOffer',
  DeleteInstantOffer = 'delete:InstantOffer',

  /** Journey */
  CreateJourney = 'create:Journey',
  GetJourney = 'get:Journey',
  ListJourney = 'list:Journey',
  UpdateJourney = 'update:Journey',
  DeleteJourney = 'delete:Journey',

  /** route */
  CreateRoute = 'create:Route',
  GetRoute = 'get:Route',
  ListRoute = 'list:Route',
  UpdateRoute = 'update:Route',
  DeleteRoute = 'delete:Route',

  /** stop */
  CreateStop = 'create:Stop',
  BulkUploadStop = 'bulkUpload:Stop',
  GetStop = 'get:Stop',
  ListStop = 'list:Stop',
  UpdateStop = 'update:Stop',
  DeleteStop = 'delete:Stop',

  /** setting */
  GetSetting = 'get:Setting',
  UpdateSetting = 'update:Setting',
}

export const adminPermission: Permission[] = [
  /** user */
  Permission.CreateUser,
  Permission.GetUser,
  Permission.ListUser,
  Permission.UpdateUser,
  Permission.DeleteUser,

  /** ad */
  Permission.CreateAd,
  Permission.GetAd,
  Permission.ListAd,
  Permission.UpdateAd,
  Permission.DeleteAd,

  /** ad stats */
  Permission.ListAdStats,
  Permission.UpdateAdStats,

  /** bus */
  Permission.CreateBus,
  Permission.GetBus,
  Permission.ListBus,
  Permission.UpdateBus,
  Permission.DeleteBus,
  Permission.AssignBus,
  Permission.UnassignBus,

  /** business */
  Permission.CreateBusiness,
  Permission.GetBusiness,
  Permission.ListBusiness,
  Permission.UpdateBusiness,
  Permission.DeleteBusiness,

  /** coupon */
  Permission.CreateCoupon,
  Permission.GetCoupon,
  Permission.ListCoupon,
  Permission.UpdateCoupon,
  Permission.DeleteCoupon,
  Permission.RedeemCoupon,

  /** customer */
  Permission.CreateCustomer,
  Permission.GetCustomer,
  Permission.ListCustomer,
  Permission.UpdateCustomer,
  Permission.DeleteCustomer,

  /** driver */
  Permission.CreateDriver,
  Permission.GetDriver,
  Permission.ListDriver,
  Permission.UpdateDriver,
  Permission.DeleteDriver,

  /** trip */
  Permission.CreateTrip,
  Permission.GetTrip,
  Permission.ListTrip,
  Permission.UpdateTrip,
  Permission.DeleteTrip,
  Permission.GetTripTiming,
  Permission.BulkUploadTrip,

  /** fav ad */
  Permission.CreateFavAd,
  Permission.ListFavAd,
  Permission.DeleteFavAd,

  /** fav stop */
  Permission.CreateFavStop,
  Permission.ListFavStop,
  Permission.DeleteFavStop,

  /** instant offer */
  Permission.CreateInstantOffer,
  Permission.GetInstantOffer,
  Permission.ListInstantOffer,
  Permission.UpdateInstantOffer,
  Permission.DeleteInstantOffer,

  /** Journey */
  Permission.CreateJourney,
  Permission.GetJourney,
  Permission.ListJourney,
  Permission.UpdateJourney,
  Permission.DeleteJourney,

  /** route */
  Permission.CreateRoute,
  Permission.GetRoute,
  Permission.ListRoute,
  Permission.UpdateRoute,
  Permission.DeleteRoute,

  /** stop */
  Permission.CreateStop,
  Permission.BulkUploadStop,
  Permission.GetStop,
  Permission.ListStop,
  Permission.UpdateStop,
  Permission.DeleteStop,

  /** setting */
  Permission.GetSetting,
  Permission.UpdateSetting,
];

export const driverPermission: Permission[] = [
  /** bus */
  Permission.GetBus,
  Permission.ListBus,

  /** driver */
  Permission.GetDriver,
  Permission.UpdateDriver,

  /** trip */
  Permission.GetTripTiming,
  Permission.GetTrip,

  /** Journey */
  Permission.CreateJourney,
  Permission.UpdateJourney,
];

export const businessPermission: Permission[] = [
  /** ad */
  Permission.GetAd,
  Permission.ListAd,

  /** business */
  Permission.GetBusiness,
  Permission.UpdateBusiness,

  /** ad stat */
  Permission.ListAdStats,

  /** coupon */
  Permission.RedeemCoupon,
  Permission.ListCoupon,
];

export const customerPermission: Permission[] = [
  /** ad */
  Permission.GetAd,
  Permission.ListAd,

  /** customer */
  Permission.GetCustomer,
  Permission.UpdateCustomer,
  Permission.DeleteCustomer,

  /** ad stat */
  Permission.UpdateAdStats,

  /** coupon */
  Permission.CreateCoupon,
  Permission.ListCoupon,

  /** fav ad */
  Permission.CreateFavAd,
  Permission.DeleteFavAd,
  Permission.ListFavAd,

  /** fav stop */
  Permission.CreateFavStop,
  Permission.DeleteFavStop,
  Permission.ListFavStop,

  /** stop */
  Permission.ListStop,

  /** route */
  Permission.GetRoute,
  Permission.ListRoute,

  /** trip */
  Permission.GetTrip,
  Permission.ListTrip,
  Permission.GetTripTiming,
];
