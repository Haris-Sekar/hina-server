import company from "./company.js";
import user from "./user.js";
import customer from "./customer.js";
import item from "./item.js";

export default {
	...user,
	...company,
	...customer,
	...item,
};
