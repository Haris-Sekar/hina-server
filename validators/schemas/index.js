import company from "./company.js";
import user from "./user.js";
import customer from "./customer.js";

export default {
	...user,
	...company,
	...customer,
};
