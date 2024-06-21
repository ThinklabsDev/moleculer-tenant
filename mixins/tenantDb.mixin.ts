import type { Context, ServiceSchema } from "moleculer";
import type { TenantEntity } from "../services/tenants.service";

const DbService = require("@moleculer/database").Service;

type DbServiceSchema = Partial<ServiceSchema>;

export default function createTenantDbServiceMixin(collection: string) {
	const schema: DbServiceSchema = {
		mixins: [DbService()],
		methods: {
			async getAdapterByContext(ctx: Context<unknown, { tenantId: string }>) {
				const tenantId = ctx.meta.tenantId;
				if (!tenantId) throw new Error("Required tenantId!");

				const tenant: TenantEntity = await this.broker.call("tenants.findOne", {
					code: tenantId,
				});
				if (!tenant) throw new Error(`Missing tenantId=${tenantId}`);

				return [
					tenantId,
					{
						type: "MongoDB",
						options: {
							uri: tenant.mongoUri,
							collection,
						},
					},
				];
			},
		},
	};

	return schema;
}
