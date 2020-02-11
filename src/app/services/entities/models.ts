export class MWLObject {
  data: string[];
  column: string;
  delimiter: string;
}
export class MatchWithList {
  column: string;
  delimiter: string;
  values: string;
}
export interface IBreadcrumb {
  params: {
    [key: string]: any;
  };
  active?: boolean;
  current?: boolean;
  label: string;
  url: string;
}
//#region auth
export class JwtToken {
  expirationDate: any;
  isExpired: boolean;
  user: User;
  raw: string;
  exp: number;
  iat: number;
}
//#endregion auth

//#region admin
export class UserGSuite {
  internal_gapi_mappings: string[];
  modelData: string[];
  processed: string[];
  collection_key: string;
  addresses: null;
  agreedToTerms: boolean;
  aliases: null;
  changePasswordAtNextLogin: boolean;
  creationTime: Date;
  customSchemas: null;
  customerId: string;
  deletionTime: null;
  emails: [{
    address: string;
    primary: boolean;
  }];
  etag: string;
  externalIds: [{
    value: string;
    type: string;
  }];
  gender: null;
  hashFunction: null;
  id: number;
  ims: null;
  includeInGlobalAddressList: boolean;
  ipWhitelisted: boolean;
  isAdmin: boolean;
  isDelegatedAdmin: boolean;
  isEnforcedIn2Sv: boolean;
  isEnrolledIn2Sv: boolean;
  isMailboxSetup: boolean;
  keywords: null;
  kind: string;
  languages: null;
  lastLoginTime: Date;
  locations: null;
  nameType: string;
  nameDataType: string;
  nonEditableAliases: null;
  notes: null;
  orgUnitPath: string;
  organizations: [{
    title: string;
    primary: boolean;
    customType: string;
    department: string;
    description: string;
    costCenter: string;
  }];
  password: string;
  phones: string;
  posixAccounts: string;
  primaryEmail: string;
  relations: string;
  sshPublicKeys: string;
  suspended: boolean;
  suspensionReason: string;
  thumbnailPhotoEtag: string;
  thumbnailPhotoUrl: string;
  websites: string;
}
export class Group {

}

export class UserDetailsGroups {
  created_by: string;
  created_date: Date;
  group_description: string;
  group_id: number;
  group_name: string;
  user_count: number;
}

export class AdminGroup {
}

export class User {
  id: number;
  adminGroups: AdminGroup[];
  company: string;
  GsInfos: UserGSuite;
  corpSsoCompany: string;
  corpSsoCountry: string;
  corpSsoDivision: string;
  country: string;
  department: string;
  displayname: string;
  division: string;
  domain: string;
  email: string;
  firstname: string;
  groups: Group[];
  lastname: string;
  login: string;
  password: string;
  physicalDeliveryOfficeName: string;
  roles: string[];
  salt: string;
  telephoneNumber: string;
  userBehindApi: string;
  userGmad: UserGmad;
  userReferentialLight: UserReferentialLight;
  username: string;
}
//#endregion admin

//#region airbususer
export class UserReferentialLight {
  firstName: string;
  id: number;
  lastName: string;
  login: string;
  principalLocationCountry: string;
  siteName: string;
  uidSiglum: number;
  userEmail: string;
  usualName: string;
}

export class UserGmad {
  id: number;
  givenname: string;
  mail: string;
  msexchhidefromaddresslists: false;
  mailnickname: string;
  cn: string;
  immutableID: string;
  gMimmutableID: string;
  samaccountname: string;
  gmbuname: string;
  company: string;
  objectstatus: string;
  sn: string;
  targetaddress: string;
  telephonenumber: string;
  displayname: string;
  department: string;
  description: string;
  co: string;
  l: string;
  physicaldeliveryofficename: string;
  objectguid: string;
  gmGMMsExchRecipientTypeDetails: string;
  objectsid: string;
  domain: string;
  extensionAttribute15: string;
  isBBY: boolean;
  isDisabled: boolean;
  groups: Group[];
  licenseProfilLink: string;
}
//#endregion airbususer

//#region Provisioning
export class ProvisioningStep {
  id: number;
  label: string;
  interfaceLabel: string;
  idNextStep: number;
}

export class ProvisioningUserStep {
  idProvisioningUser?: number;
  idPovisioningStep?: number;
  changeStepDate?: Date;
  message?: string;
  messageHistoric?: string | Array<any>;
  provisioningUser?: UserProvisioning;
  provisioningStep?: ProvisioningStep;
  status?: EProvisioningUserStepState;
  diffDate?: Date | number;
}

export class UserProvisioning {
  id: number;
  userGmad: UserGmad;
  batch: Batch;
  batchUserFilter: BatchUserFilter;
  currentProvisioningStep: ProvisioningStep;
  provisioningSteps: ProvisioningUserStep[];
  ou: string;
  isGoogle: boolean;
  readyToMigrated: boolean;
  mailMigrationDate: Date;
  isMigrated: boolean;
  lastProvisioningStepChangeDate: Date;
}

export class OrgUnit {
  path: string;
  count: number;
}
export enum EProvisioningUserStepState {
  notStarted = 0,
  inProgress = 1,
  pending = 2,
  error = 99,
  success = 200
}
export enum EUserMonitoringState {
  creation = 'Creation',
  preRequisite = 'Pre Requisite',
  ouProvisioning = 'OU Provisioning',
  ouProvisioningValidation = 'OU Validation Pending',
  readyToMigrate = 'Ready To Migrate'
}
export class UserAllotmentMonitoringData {
  creation: ProvisioningUserStep;
  preRequisite: ProvisioningUserStep;
  ouProvisioning: ProvisioningUserStep;
  ouProvisioningValidation: ProvisioningUserStep;
  readyToMigrate: ProvisioningUserStep;
}
//#endregion Provisioning

//#region Mail Migration
export enum EMailMigrationStatus {
  notMigrated = 'not migrated',
  inProgress = 'in progress',
  planified = 'planified',
  failed = 'failed',
  migrated = 'migrated'
}
export enum EProvisioningStatus {
  isReady = 'ready to migrate',
  provisioningProgress = 'provisioning progress',
  notFound = 'not found',
  disabled = 'disabled',
  notProvisioned = 'not provisioned'
}
export class Batch {
  id: number;
  name: string;
  status: string;
  creationDate: Date;
  updateDate: Date;
  scheduledDate: Date;
  plannedDate: Date;
  forced: boolean;
  users: Array<ReferentialUser>;
  nbUsers: number;
  orgUnit: string;
  profile: BatchProfile;
  usersjob: Array<Usersjob>;
  batchUserLimit: number;
}

export class BatchProfile {
  id: number;
  name: string;
  description: string;
}

export class BatchUserFilter {
  id: number;
  name: string;
  data: any[];
}
export class UserProvisioningMailMigration {
  id: number;
  mail: string;
  givenname: string;
  samaccountname: string;
  sn: string;
  displayname: string;
  statusforprovisioning: EProvisioningStatus;
  statusformailmigration: EMailMigrationStatus;
  mailmigrationdate: Date;
}
//#endregion Mail Migration

//#region Monitoring
export class UsersRepartition {
  users: Array<UserRepartition>;
}

export class UserRepartition {
  country: string;
  AD: string;
  AH: string;
  AI: string;
}
//#endregion Monitoring

//#region Allotment
export enum BatchAllotmentCriteriaStatus {
  isTrue = 'Included',
  isFalse = 'Excluded'
}

export class BatchAllotmentCriteriaParameters {
  id: number;
  name: string;
  category: string;
  state: BatchAllotmentCriteriaStatus;
}

export class BatchAllotmentCriteria {
  inclusion: BatchAllotmentCriteriaParameters[];
  exclusion: BatchAllotmentCriteriaParameters[];
}

export class JobProfile {
  id: number;
  name: string;
}

export class Usersjob {
  id: number;
  user_id: number;
  job_id: number;
  email: string;
  gmad_id: number;
  status_id: number;
  ou_group: string;
  update_date: Date;
  creation_date: Date;
  job: string;
}

export class BatchGenerationAllotment {
  id: number;
  name: string;
  jobProfiles: Array<JobProfile>;
  criteria: BatchAllotmentCriteria;
  jobs: Array<Batch>;
}

export class BatchInformation {
  jobProfile: JobProfile;
  inclusion: BatchAllotmentCriteriaParameters[];
  exclusion: BatchAllotmentCriteriaParameters[];
}

export class BatchUsers {
  user_id: number;
  lastName: string;
  firstName: string;
  userEmail: string;
  siteName: string;
  userType: string;
  champion: boolean;
  sensitive: boolean;
  division: string;
  forced: boolean;
  eligibilityStatus: string;
  deploymentStatus: string;
  bypass: boolean;
}

export class GeneratedBatch {
  batch_id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  users: BatchUsers[];
}
//#endregion Allotment

//#region User provisioning

//#endregion User provisioning

//#region Referential
export class ReferentialUser {
  user_id: number;
  location: ReferentialNetworkSites;
  entity: referentialEntity;
  profile: ReferentialProfile;
  group: ReferentialGroup;
  manually_disabled: true;
  last_name: string;
  first_name: string;
  usual_name: string;
  user_email: string;
  userEmail: string;
  preferred_language: string;
  country_contract: string;
  site_name: string;
  corp_id: number;
  uid_siglum: number;
  hr_status: string;
  user_type: string;
  scope_status: string;
  ecl_code: string;
  license_type: string;
  manager_corp_id: number;
  manager_email: string;
  champion: false;
  business_focal_point: false;
  sensitive: null;
  vip: false;
  function: string;
  division: string;
  manager_blocked: false;
  one_login_account_exist: false;
  eligibility_status: string;
  deployment_status: string;
  manage_shared_mailbox: number;
  has_delegated_mailbox: number;
  manage_delegated_mailbox: number;
  manage_private_meeting_room: number;
  mailbox_is_in_litigation_hold: string;
  organization_unit: string;
  organizationUnit: string;
  mail_alias: string;
  customer_id: number;
  gmail_activated: string;
  calendar_activated: string;
  drive_activated: string;
  has_android: number;
  has_ios: number;
  open_profile_forced: number;
  connect_profile_forced: number;
  ready_to_google: string;
  owner_extended: number;
  grace_period: boolean;
  Champion_update_date: Date;
  ad_user_status: string;
  reactivation_count: number;
  removal_count: number;
  entities: UserDetailsEntities;
  groups: UserDetailsGroups;
  profiles: UserDetailsProfiles;
  network_site: UserDetailsNetworkSites;
  deployed_blocked_comment: any;
  job: any;
}

export class ReferentialUsersList {
  count: number;
  next: number;
  previous: number;
  results: Array<ReferentialUser>;
}

export class ReferentialGroupsList {
  count: number;
  next: number;
  previous: number;
  results: Array<ReferentialGroup>;
}

export class ReferentialGroup {
  group_id: number;
  group_users: Array<ReferentialUsersList>;
  group_name: string;
  group_description: string;
  created_by: string;
  created_date: string;
}

export class ReferentialEntities {
  count: number;
  next: number;
  previous: number;
  results: Array<referentialEntity>;
}

export class referentialEntity {
  entity_id: number;
  roof: number;
  division: string;
  kapisCode: number;
  shares: number;
  entityName: string;
  ratio_mail_users: number;
  hub_deploy_status: string;
  technical_readiness_date: Date;
  poa: boolean;
  chromeInstalled: string;
  entityEligible: string;
  entityNetskopeDeployed: string;
  technical_readiness: boolean;
  entity_users: Array<ReferentialUser>;
}

export enum EGraphTypeReferential {
  eligibilityUser = 'eligibilityUserGraph',
  deploymentUser = 'deploymentUserGraph',
  eligibilityProfile = 'eligibilityProfileGraph',
  deploymentProfile = 'deploymentProfileGraph'
}
export class DeploymentGraphReferential {
  mb_migrated: number;
  not_started: number;
  scheduled: number;
  canceled: number;
  open: number;
}
export class EligibilityGraphReferential {
  eligible: number;
  not_eligible: number;
  partially_eligible: number;
}
export class ReferentialProfile {
  profile_id: number;
  profile_name: string;
  profile_description: string;
  profile_type: string;
  profile_weight: string;
  eligibility: EligibilityGraphReferential;
  deployment: DeploymentGraphReferential;
  deployment_status: string;
  user_count: number;
}

export class ReferentialCriteria {
  categories_name: string;
  criterias_apply_to_AD_users: boolean;
  criterias_apply_to_AH_users: boolean;
  criterias_apply_to_AI_users: boolean;
  criterias_description: string;
  criterias_id: number;
  criterias_impact_level: string;
  criterias_model_field: string;
  criterias_name: string;
  criterias_operator: string;
  criterias_value: string;
}

export class ReferentialProfilesList {
  total_user_count: number;
  profiles: Array<ReferentialProfile>;
}

export class ReferentialProfiles {
  count: number;
  next: string;
  previous: string;
  results: Array<ReferentialProfile>;
}

export class ReferentialEligibilityProfilesChartData {
  profile_name: string;
  eligible: number;
  not_eligible: number;
  partially_eligible: number;
}
export class ReferentialDeploymentProfilesChartData {
  profile_name: string;
  scheduled: number;
  not_started: number;
  open: number;
  mb_migrated: number;
  canceled: number;
}

export class UserDetailsEntities {
  chrome_installed: boolean;
  division: string;
  entity_eligible: string;
  entity_id: number;
  entity_name: string;
  entity_netskope_deployed: string;
  hub_deploy_status: string;
  kapis_code: string;
  poa: boolean;
  ratio_mail_users: number;
  roof: string;
  shares: number;
  technical_readiness: boolean;
  technical_readiness_date: Date;
  user_count: number;
}

export class UserDetailsProfiles {
  profile_description: string;
  profile_id: number;
  profile_name: string;
  profile_type: string;
  profile_weight: number;
  user_count: number;
  profile_discriminating_criterias: any;
  profile_eligibility_criterias: any;
}

export class UserDetailsNetworkSites {
  kapis_code: string;
  locations: any;
  network_readiness: string;
  network_readiness_date: Date;
  network_site: number;
  site_alias: string;
  site_code: string;
  sitename: string;
  user_count: number;
}

export class ReferentialEntity {
  entity_id: number;
  ecl_code: string;
  entity_name: string;
  chrome_installed: string;
  entity_eligible: string;
  entity_users: Array<ReferentialUser>;
  roof: string;
  ratio_mail_users: any;
  shares: any;
  division: any;
  kapis_code: any;
  hub_deploy_status: any;
  technical_readiness_date: any;
  poa: any;
  entityNetskopeDeployed: any;
  technical_readiness: any;
}

export class Status {
  entities_count: boolean;
  user_count: boolean;
}

export class EligibilityStatus {
  eligible: Status;
  notEligible: Status;
  tbd: Status;
}

export class ChromeInstalled {
  eligible: Status;
  notEligible: Status;
  tbd: Status;
}

export class EntitiesList {
  entities: Array<ReferentialEntity>;
  eligibility_status: EligibilityStatus;
  chrome_installed: ChromeInstalled;
}

export class ReferentialProfileUsers {
  profile_id: number;
  profile_users: ReferentialUser;
  profile_name: string;
  profile_description: string;
}

export class ReferentialNetworkSites {
  count: number;
  next: number;
  previous: number;
  results: Array<ReferentialNetworkSite>;
}

export class ReferentialNetworkSite {
  network_site: number;
  site_alias: string;
  site_code: string;
  network_readiness: string;
  kapis_code: string;
  sitename: string;
  locations: Array<ReferentialLocation>;
  user_count: number;
  cleaned_city: any;
  cleaned_country: any;
}

export class ReferentialLocation {
  cleaned_city: string;
  cleaned_country: string;
}

//#endregion Referential

//#region Eligibility
export enum EGraphTypeEligibility {
  eligibilityUser = 'eligibilityUserGraph',
  deploymentUser = 'deploymentUserGraph',
  eligibilityProfile = 'eligibilityProfileGraph',
  deploymentProfile = 'deploymentProfileGraph'
}
export class DeploymentGraphEligibility {
  mb_migrated: number;
  not_started: number;
  scheduled: number;
  canceled: number;
  open: number;
  issue: number;
}
export class EligibilityCount {
  eligible: number;
  not_eligible: number;
  partially_eligible: number;
}
export class EligibilityProfileCount {
  open: EligibilityCount;
  connect: EligibilityCount;
}
export class EligibilityUser {
  user_id: number;
  last_name: string;
  first_name: string;
  user_email: string;
  division: string;
  function: string;
  location_name: string;
  location_country: string;
  eligibility_status: string;
  deployment_status: string;
  last_edited_by: string;
  last_edited_date: Date;
}

export class EligibilityProfile {
  profile_id: number;
  profile_name: string;
  profile_description: string;
  eligibility: EligibilityProfileCount;
  deployment: DeploymentGraphEligibility;
}

export class EligibilityCriteria {
  criterias_id: number;
  criterias_name: string;
  criterias_value: string;
  criterias_description: string;
  criterias_impact_level: string;
  criterias_operator: string;
  criterias_model_field: string;
  category: EligibilityCategories;
  criterias_apply_to_AI_users: boolean;
  criterias_apply_to_AH_users: boolean;
  criterias_apply_to_AD_users: boolean;
}

export class EligibilityCriterias {
  count: number;
  next: number;
  previous: number;
  results: Array<EligibilityCriteria>;
}

export class EligibilityCategories {
  categories_id: number;
  categories_name: string;
  categories_description: string;
}

export class EligibilityDiscriminatingCriteria {
  criteria: ReferentialCriteria;
  profile: ReferentialProfile;
  last_edited_date: Date;
  last_edited_user: Date;
}

export class EligibilityDiscriminatingCriterias {
  criterias: Array<EligibilityDiscriminatingCriteria>;
}



export class EligibilityEligibleCriteria {
  criteria: ReferentialCriteria;
  profile: ReferentialProfile;
  last_edited_date: Date;
  last_edited_user: Date;
  profile_eligibility_criteria: number;
}

export class EligibilityEligibleCriterias {
  criterias: Array<EligibilityEligibleCriteria>;
}

export class EligibilityQuery {
  eligibility_query: number;
  name: string;
  formula: string;
  description: string;
  last_edited_date: Date;
  last_edited_user: Date;
}

export class EligibilityQueries {
  count: number;
  next: string;
  previous: string;
  results: Array<EligibilityQuery>;
}

export class EligibilityBusinessExecutive {
  bev: number;
  division_name: string;
  function_name: string;
  validation_status: string;
  validation_date: Date;
  validation_comment: string;
  validation_expected_date: Date;
  last_edited_date: Date;
  last_edited_user: Date;
}

export class EligibilityBusinessExecutives {
  count: number;
  next: string;
  previous: string;
  results: EligibilityBusinessExecutive;
}
//#endregion Eligibility

export class MonitoringBatch {
  batchId: number;
  batchName: string;
  batchStatus: EOrchestratorStatus;
  batchCreationDate: Date;
  batchScheduledDate: Date;
  batchProfileName: string;
  batchProfileType: string;
  // JobTask Count Info --
  batchTasksCount: number;
  batchTasksReadyCount: number;
  batchTasksRunningCount: number;
  batchTasksErrorCount: number;
  batchTasksDoneCount: number;
  // UserJob Count Info --
  batchUsersCount: number;
  batchUsersReadyCount: number;
  batchUsersRunningCount: number;
  batchUsersErrorCount: number;
  batchUsersDoneCount: number;
}

export class MonitoringBatchUser {
  id: number;
  batchName: string;
  batchStatus: string;
  batchCreationDate: Date;
  batchScheduledDate: Date;
  batchProfileName: string;
  batchProfileType: string;
  batchTasksCount: number;
  batchUsersCount: number;
}

export enum EOrchestratorStatus {
  READY = 'READY',
  RUNNING = 'RUNNING',
  IN_ERROR = 'IN_ERROR',
  DONE = 'DONE'
}

export class Maintenance {
  id: number;
  portal: boolean;
  admin: boolean;
  reason: string;
}

export class MailboxRemoval {
  mailbox_removal_id: number;
  mailbox_removal_users: Array<MailboxRemovalUser>;
  comment: string;
  removal_request_date: Date;
  legal_validation: boolean;
  legal_validation_email: string;
  legal_validation_date: Date;
  admin_validation: boolean;
  admin_validation_email: string;
  admin_validation_date: Date;
  deletion_date: Date;
  deactivation_date: Date;
  canceled: boolean;
  /* --- column option --- */
  days_left: number;
}

export class MailboxRemovalUser {
  user_id: number;
  last_name: string;
  first_name: string;
  user_email: string;
}

export class ChampionsCrtiteria {
  criteria_id: number;
  criteria_name: string;
  criteria_type: EChampionsCrtiteria;
  criteria_added_date: Date;
  criteria_added_by: string;
}

export enum EChampionsCrtiteria {
  division = 'division',
  siteName = 'site_name'
}

export class ThirdParty {
  id: number;
  app_name: string;
  decision: string;
  file: string;
  last_update_at: Date;
  last_update_by: ReferentialUser;
  request_date: Date;
  requestor: ReferentialUser;
  status: string;
  answers: Array<ThirdPartyAnswer>;
}

export class ThirdPartyAnswer {
  id: number;
  request: string;
  question: ThirdPartyQuestion;
}

export class ThirdPartyQuestion {
  id: number;
  label: string;
  order: number;
  category: ThirdPartyCategory;
}

export class ThirdPartyCategory {
  id: number;
  label: string;
  order: number;
}

export class UserTransformers {
  userId: number;
  userEmail: string;
  transformer: boolean;
  transformerDate: Date;
  siteName: string;
  uidSiglum: string;
  division: string;
  deploymentStatus: string;
}
