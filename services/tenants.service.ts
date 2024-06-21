import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, MoleculerDbMethods } from "moleculer-db";
import type { DbServiceMethods } from "../mixins/db.mixin";
import DbMixin from "../mixins/db.mixin";

export interface TenantEntity {
	_id: string;
	name: string;
	code: string;
	mongoUri: string;
}

interface TenantsThis extends Service, MoleculerDbMethods {
	adapter: DbAdapter;
}

const TenantsService: ServiceSchema & { methods: DbServiceMethods } = {
	name: "tenants",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("tenants")],

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Actions
	 */
	actions: {
		findOne: {
			async handler(this: TenantsThis, ctx) {
				return this.adapter.findOne(ctx.params);
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB(this: TenantsThis) {
			await this.adapter.insertMany([
				{
					name: "Phòng khám tClinic",
					code: "CLN",
					mongoUri:
						"mongodb://tclinic_db_test:thinklAb202x@103.124.95.232:17017/tclinic_db_test?authSource=tclinic_db_test",
				},
				{
					name: "Phòng khám bác sĩ Thành",
					code: "OLM",
					mongoUri:
						"mongodb://pkbacsithanh:thinklAb202x@113.160.181.249:4014/pkbacsithanh?authSource=pkbacsithanh",
				},
			]);
		},
	},
};

export default TenantsService;
