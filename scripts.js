function View() {
	var USER_TABLE_CLASS = 'js-user-table';

	this.getUserTable = function () {
		return document.getElementsByClassName(USER_TABLE_CLASS)[0];
	};

	this.renderUserTableContent = function (data) {
		var table = this.getUserTable();
		this.renderUserTableHeader(table).renderUserTableBody(table, data);
	};

	this.renderUserTableHeader = function (table) {
		var header = table.createTHead();
		var columnsName = ["Id", "Name", "Email"];
		var row = header.insertRow(0);

		columnsName.forEach(function (value, index) {
			var cell = row.insertCell(index);
			cell.innerHTML = "<b>" + value + "</b>";
		});

		return this;
	};

	this.renderUserTableBody = function (table, data) {
		var body = table.appendChild(document.createElement("tbody"));
		var cellsName = ["id", "username", "email"];

		data.forEach(function (user, index) {
			var row = body.insertRow(index);

			cellsName.forEach(function (value, index) {
				var cell = row.insertCell(index);
				cell.innerText = user[value];
			})
		});

		return this;
	};
}

function Model() {
	var JSON_PLACEHOLDER_URI = "https://jsonplaceholder.typicode.com/users";

	var METHOD = { GET: "GET", POST: "POST", PUT: "PUT", DELETE: "DELETE" };

	this.makeRequest = function (url, method, body) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open(method, url);

			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					resolve(JSON.parse(this.response));
				} else {
					reject(new Error("Error " + xhr.status + ": " + xhr.statusText));
				}
			};

			xhr.onerror = function() {
				reject(new Error("Error " + xhr.status + ": " + xhr.statusText));
			};

			xhr.send(body);
		});
	};

	this.fetchUsers =  function () {
		return this.makeRequest(JSON_PLACEHOLDER_URI, METHOD.GET, null);
	}
}

function Controller(view, model) {
	// entities

	// events
	document.addEventListener("DOMContentLoaded", handleUserTableLoad);

	function handleUserTableLoad() {
		model.fetchUsers()
			.then(function (data) {
				view.renderUserTableContent(data);
			})
			.catch(function (e) {
				console.warn(e.message);
			});
	}
}

(function(Controller, View, Model) {
	return new Controller(new View(), new Model());
}(Controller, View, Model));