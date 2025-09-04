import { Person } from "./Person"
import { User } from "./User"
import { Profile } from "./Profile"
import { Contract } from "./Contract"
import { Document } from "./Document"
import { Address } from "./Address"
import { Resource } from "./Resource"
import { OSResource } from "./OSResource"
import { Permission } from "./Permission"
import { OS } from "./OS"
import { ResourceCategory } from "./ResourceCategory"
import { OSPriority } from "./OSPriority"
import { Service } from "./Service"
import { ResourceDimension } from "./ResourceDimension"
import { Contact } from "./Contact"
import { ContactType } from "./ContactType"
import { DocumentType } from "./DocumentType"
import { ServiceCategory } from "./ServiceCategory"
import { Team } from "./Team"
import { Rule } from "./Rule"
import { File } from "./File"
import { ServiceQuote } from "./ServiceQuote"
import { ContractLot } from "./ContractLot"
import { Measurement } from "./Measurement"
import { ResourceDimensionResource } from "./ResourceDimensionResource"
import { Font } from "./Font"
import { Restriction } from "./Restriction"
import { Log } from "./Log"
import { LogType } from "./LogType"
import { Preference } from "./Preference"
import { PreferenceOption } from "./PreferenceOption"
import { OSUsedResource } from "./OSUsedResource"
import { ContractServiceLoad } from "./ContractServiceLoad"
import { OSStatus } from "./OSStatus"
import { OSAttribute } from "./OSAttribute"
import { OSAttributeOption } from "./OSAttributeOption"
import { OSAttributeValue } from "./OSAttributeValue"
import { UserPreference } from "./UserPreference"
import { OSService } from "./OSService"
import { OSExtraService } from "./OSExtraService"
import { Unit } from "./Unit"
import { OSAttributeField } from "./OSAttributeField"
import { UnitField } from "./UnitField"
import { UsedResourceValue } from "./UsedResourceValue"
import { WorkerLot } from "./WorkerLot"
import { Notification } from "./Notification"

Person.hasOne(User, { foreignKey: 'person_id', as: 'user' })
Person.hasMany(Contract, { foreignKey: 'company_contractor_id', as: 'contracts_as_contractor' })
Person.hasMany(Contract, { foreignKey: 'company_target_id', as: 'contracts_as_target' })
Person.hasMany(Document, { foreignKey: 'person_id', as: 'documents' })
Person.belongsTo(Address, { foreignKey: 'address_id', as: 'address' })
Person.hasMany(OS, { foreignKey: 'company_executor_id', as: 'company_executor_person' })
Person.hasMany(OS, { foreignKey: 'creator_id', as: 'creator_person' })
Person.belongsTo(Person, { foreignKey: 'company_id', as: 'company' })
Person.hasMany(Contact, { foreignKey: 'person_id', as: 'contacts' })
Person.belongsTo(Rule, { foreignKey: 'rule_id', as: 'rule' })
Person.belongsToMany(Team, { foreignKey: 'person_id', as: 'teams', through: 'team_person' })
Person.hasMany(Team, { foreignKey: 'supervisor_id', as: 'supervised_teams' })
Person.belongsToMany(ContractLot, { foreignKey: 'worker_id', as: 'lots', through: 'worker_lot', otherKey: 'lot_id' })

Team.belongsToMany(Person, { foreignKey: 'team_id', as: 'people', through: 'team_person' })
Team.belongsTo(Person, { foreignKey: 'master_id', as: 'master' })
Team.hasMany(OS, { foreignKey: 'execution_team_id', as: 'oss' })
Team.belongsTo(Person, { foreignKey: 'supervisor_id', as: 'supervisor' })

Contact.belongsTo(ContactType, { foreignKey: 'type_id', as: 'type' })

Document.belongsTo(DocumentType, { foreignKey: 'type_id', as: 'type' })
Document.belongsTo(File, { foreignKey: 'file_id', as: 'file' })

User.belongsTo(Profile, { foreignKey: 'profile_id', as: 'profile' })
User.belongsTo(Person, { foreignKey: 'person_id', as: 'person' })
User.hasMany(UserPreference, { foreignKey: 'user_id', as: 'preferences' })
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' })

Profile.belongsToMany(Permission, { foreignKey: 'profile_id', as: 'permissions', through: 'profile_permission' })
Profile.hasMany(Restriction, { foreignKey: 'profile_id', as: 'restrictions' })

Permission.belongsTo(Permission, { foreignKey: 'parent_id', as: 'parent' })
Permission.hasMany(Permission, { foreignKey: 'parent_id', as: 'children' })

Restriction.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission' })

Contract.belongsTo(Person, { foreignKey: 'company_contractor_id', as: 'contractor' })
Contract.belongsTo(Person, { foreignKey: 'company_target_id', as: 'target' })
Contract.hasMany(OS, { foreignKey: 'contract_id', as: 'oss' })
Contract.hasMany(ContractLot, { foreignKey: 'contract_id', as: 'lots' })
Contract.hasMany(ContractServiceLoad, { foreignKey: 'contract_id', as: 'service_loads' })

ContractServiceLoad.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

ContractLot.belongsTo(Contract, { foreignKey: 'contract_id', as: 'contract' })
ContractLot.hasMany(ServiceQuote, { foreignKey: 'lot_id', as: 'quotes' })
ContractLot.hasMany(Measurement, { foreignKey: 'contract_lot_id', as: 'measurements' })
ContractLot.hasMany(ContractServiceLoad, { foreignKey: 'lot_id', as: 'service_loads' })
ContractLot.hasMany(OS, { foreignKey: 'lot_id', as: 'oss' })
ContractLot.hasMany(WorkerLot, { foreignKey: 'lot_id', as: 'worker_lots' })

Measurement.belongsTo(ContractLot, { foreignKey: 'contract_lot_id', as: 'lot' })

Service.belongsToMany(OS, { foreignKey: 'service_id', as: 'oss', through: 'os_service' })
Service.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' })
Service.hasMany(ServiceQuote, { foreignKey: 'service_id', as: 'quotes' })
Service.belongsToMany(Contract, { foreignKey: 'service_id', as: 'contracts', through: ServiceQuote })
Service.belongsTo(Font, { foreignKey: 'font_id', as: 'font' })

ServiceCategory.hasMany(Service, { foreignKey: 'category_id', as: 'services' })
ServiceCategory.belongsTo(ServiceCategory, { foreignKey: 'parent_id', as: 'parent' })
ServiceCategory.hasMany(ServiceCategory, { foreignKey: 'parent_id', as: 'children' })

ServiceQuote.belongsTo(Contract, { foreignKey: 'contract_id', as: 'contract' })
ServiceQuote.belongsTo(Service, { foreignKey: 'service_id', as: 'service' })
ServiceQuote.belongsTo(ContractLot, { foreignKey: 'lot_id', as: 'lot' })
ServiceQuote.belongsTo(Person, { foreignKey: 'formula_creator_id', as: 'formula_creator' })

Resource.belongsTo(ResourceCategory, { foreignKey: 'category_id', as: 'category' })
Resource.belongsToMany(ResourceDimension, { foreignKey: 'resource_id', as: 'dimensions', through: 'resource_dimension_resource' })

ResourceCategory.hasMany(Resource, { foreignKey: 'category_id', as: 'resources' })

OS.belongsTo(Team, { foreignKey: 'execution_team_id', as: 'execution_team' })
OS.belongsTo(Person, { foreignKey: 'company_executor_id', as: 'company_executor' })
OS.belongsTo(Person, { foreignKey: 'creator_id', as: 'creator' })
OS.belongsTo(Person, { foreignKey: 'requester_id', as: 'requester' })
OS.belongsTo(Person, { foreignKey: 'company_requester_id', as: 'company_requester' })
OS.belongsTo(Person, { foreignKey: 'supervisor_id', as: 'supervisor' })
OS.belongsTo(Address, { foreignKey: 'address_id', as: 'address' })
OS.belongsTo(Contract, { foreignKey: 'contract_id', as: 'contract' })
OS.belongsTo(OSPriority, { foreignKey: 'priority_id', as: 'priority' })
OS.belongsToMany(Service, { foreignKey: 'os_id', as: 'services', through: 'os_service' })
OS.belongsToMany(Service, { foreignKey: 'os_id', as: 'extra_services', through: 'os_extra_service' })
OS.belongsToMany(Resource, { foreignKey: 'os_id', as: 'resources', through: OSResource })
OS.belongsToMany(File, { foreignKey: 'os_id', as: 'files', through: 'os_file' })
OS.belongsTo(OS, { foreignKey: 'linked_os_id', as: 'linked_os' })
OS.belongsTo(ContractLot, { foreignKey: 'lot_id', as: 'lot' })
OS.hasMany(OSUsedResource, { foreignKey: 'os_id', as: 'used_resources' })
OS.belongsTo(OSStatus, { foreignKey: 'status_id', as: 'status' })
OS.belongsTo(Person, { foreignKey: 'finisher_id', as: 'finisher' })
OS.belongsTo(Person, { foreignKey: 'executor_id', as: 'executor' })
OS.hasMany(OSAttributeValue, { foreignKey: 'os_id', as: 'attributes' })
OS.hasMany(OSExtraService, { foreignKey: 'os_id', as: 'os_extra_services' })
OS.hasMany(OSService, { foreignKey: 'os_id', as: 'os_services' })

OSService.belongsTo(OS, { foreignKey: 'os_id', as: 'os' })
OSExtraService.belongsTo(OS, { foreignKey: 'os_id', as: 'os' })
OSExtraService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' })

OSAttribute.hasMany(OSAttributeOption, { foreignKey: 'attribute_id', as: 'options' })
OSAttribute.hasMany(OSAttributeField, { foreignKey: 'attribute_id', as: 'fields' })

OSAttributeValue.belongsTo(OSAttributeOption, { foreignKey: 'attribute_option_id', as: 'option' })
OSAttributeValue.belongsTo(OSAttribute, { foreignKey: 'attribute_id', as: 'attribute' })
OSAttributeValue.belongsTo(OSAttributeField, { foreignKey: 'attribute_field_id', as: 'field' })

OSUsedResource.belongsTo(OS, { foreignKey: 'os_id', as: 'os' })
OSUsedResource.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' })
OSUsedResource.hasMany(UsedResourceValue, { foreignKey: 'os_used_resource_id', as: 'values' })

Unit.hasMany(UnitField, { foreignKey: 'unit_id', as: 'fields' })

UsedResourceValue.belongsTo(UnitField, { foreignKey: 'unit_field_id', as: 'field' })
UsedResourceValue.belongsTo(OSUsedResource, { foreignKey: 'os_used_resource_id', as: 'used_resource' })

OSResource.belongsTo(Resource, { foreignKey: 'resource_id', as: 'resource' })
OSResource.belongsTo(OS, { foreignKey: 'os_id', as: 'os' })
OSResource.hasMany(ResourceDimensionResource, { foreignKey: 'resource_id', as: 'resources' })

Log.belongsTo(LogType, { foreignKey: 'type_id', as: 'type' })
Log.belongsTo(Person, { foreignKey: 'person_id', as: 'person' })

Preference.hasMany(PreferenceOption, { foreignKey: 'preference_id', as: 'options' })

UserPreference.belongsTo(Preference, { foreignKey: 'preference_id', as: 'preference' })