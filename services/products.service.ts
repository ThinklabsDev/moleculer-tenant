import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, DbServiceSettings, MoleculerDbMethods } from "moleculer-db";
import type MongoDbAdapter from "moleculer-db-adapter-mongo";
import type { DbServiceMethods } from "../mixins/db.mixin";
import TenantDbMixin from "../mixins/tenantDb.mixin";

export interface ProductEntity {
	_id: string;
	name: string;
	price: number;
	quantity: number;
}

export type ActionCreateParams = Partial<ProductEntity>;

export interface ActionQuantityParams {
	id: string;
	value: number;
}

interface ProductSettings extends DbServiceSettings {
	indexes?: Record<string, number>[];
}

interface ProductsThis extends Service<ProductSettings>, MoleculerDbMethods {
	adapter: DbAdapter | MongoDbAdapter;
}

const ProductsService: ServiceSchema<ProductSettings> & { methods: DbServiceMethods } = {
	name: "products",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [TenantDbMixin("products")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		// fields: ["_id", "name", "quantity", "price"],

		fields: {
			// @ts-ignore
			_id: { type: "string", primaryKey: true },
			name: { type: "string", required: true },
			quantity: { type: "number" },
			price: { type: "number", required: true },
		},

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive",
		},

		indexes: [{ name: 1 }],
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 */
			create(ctx: Context<ActionCreateParams>) {
				ctx.params.quantity = 0;
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */
		create: {
			params: {
				name: "string",
				price: "number",
			},
		},

		update: {
			params: {
				name: { type: "string", optional: true },
				price: { type: "number", optional: true },
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
		// async seedDB(this: ProductsThis) {
		// 	await this.adapter.insertMany([
		// 		{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
		// 		{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
		// 		{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
		// 	]);
		// },
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected(this: ProductsThis) {
		if ("collection" in this.adapter) {
			if (this.settings.indexes) {
				await Promise.all(
					this.settings.indexes.map((index) =>
						(<MongoDbAdapter>this.adapter).collection.createIndex(index),
					),
				);
			}
		}
	},
};

export default ProductsService;
