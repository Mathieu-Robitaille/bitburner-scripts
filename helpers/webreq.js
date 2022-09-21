/** @param {NS} ns */
export async function main(ns) {
	ns.tail();
	
	const http = new XMLHttpRequest();
	const url = "http://n2:8000/";
	const body_data = {
		name: "test",
		id: 23
	};

	const params = {
		headers: {
			"content-type":"application/json; charset=UTF-8"
		},
		body: body_data,
		method: "POST"
	};

	await fetch(url, params)
		.then(data => {return data.json()})
		.then(res => {ns.print(`res: ${res}`)})
		.catch(error => ns.print(`uh oh ${error}`))
	
	// http.open("GET", url);
	// http.send();

	// http.onreadystatechange = (e) => {ns.print(`${http.responseText}`)}
}