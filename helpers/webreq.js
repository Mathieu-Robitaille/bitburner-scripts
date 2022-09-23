// /** @param {NS} ns */
// export async function main(ns) {
// 	await post_hack_info("ecom", 1000)
// }


export async function post_hack_job(target, amount_hacked, threads=1) {
	const body_data = ` { "orchestration": { "${target}.hack.money": ${amount_hacked}, "${target}.hack.threads": "${threads}" } } `;
	await post_data(body_data)
}

export async function post_weaken_job(target, threads) {
	const body_data = ` { "orchestration": { "${target}.weaken.threads": "${threads}" }  } `;
	await post_data(body_data)
}

export async function post_grow_job(target, threads){
	const body_data = ` { "orchestration": { "${target}.grow.threads": "${threads}" } } `;
	await post_data(body_data)
}

export async function post_server_analasys(ns, data) {
	var body_data = ` { "servers": ${data} } `;
	await post_data(body_data)
}

export async function post_orchestration_stats(data) {
	const body_data = ` { "farm": ${data} } `;
	await post_data(body_data)
}

export async function post_data(body_data, url="http://n2:8080/") {
	await fetch(url, {
		body: body_data,
		headers: {
			'dataType': 'json',
			'content-type': 'application/json'
		},
		method: 'POST',
		redirect: 'follow'
	}).catch()
}