//overall structure of a controller definition
let TasksController;

TasksController = {
	options: {},
	routes: {		
		getAllTasks: {
			method: "GET",	//This type of route uses the GET method and has no path and it is named getAllTasks
			path: []
		}

		getTask: {		//This route will allow the user to request a single task by ID
			method: "GET"
			path: ["*identifier"]		//The * tells Simple API to match any alphanumeric string for that portion of the URL and store it in a variable called identifier
		}

		getCategoryTasks: {		//This route has a static string match of category in the front and then another alphanumeric parameter match on the end
			method: "GET",
			path: ["category", "*category"]		//It will match URLs like http://host/api/v0/category/4lph4Num3r1C and the matched strinng in the second part of the URL will be stroed in the cattegory variable
		}

		createTask: {	//http method here is now POST
			method: "POST",
			path: []
		}

		updateTask: {
			method: "PUT",
			path: ["*identifier"]
		}

		deleteTask: {
			method: "DELETE",
			path: ["*identifier"]
		}

		completeTask: {
			method: "PUT"
			path: ["*identifier", "comlete"]
		}
	},
	actions: {		//names of actions must be the same as route names, thats how Simple API knows which action to call for which route
		getAllTasks: function(req, res, params) {
			let Tasks;
			Tasks = mongoose.model("Tasks");
			return Tasks.getAll((function(_this) {
				return function(err, allTasks) {
					if (err) {
						console.log(err);
						return _this.responses.internalError(res);
					} else {
						return _this.responses.respond(res, allTasks);
					}
				};
			})(this)); 
		},
		getTask: function(req, res, params) {
			let Tasks;
			if (this.helpers.isValidID(params.identifier)) {
				Tasks = mongoose.model("Tasks");
				return Tasks.getById(params.identifier, (function(_this) {
					return function(err, task) {
						if (err) {
							console.log(err);
							return _this.responses.internalError(res);
						} else {
							if (task) {
								return _this.responses.respond(res, task);
							} else {
								return _this.responses.notAvailable(res);
							}
						}
					};
				})(this));
			} else {
				return this.responses.notAvailable(res);
			}
		},
		getCategoryTasks: function(req, res, params) {
			let Tasks;
			Tasks = mongoose.model("Tasks");
			return Tasks.getAllFromCategory(params.category, (function(_this) {
				return function(err, catTasks) {
					if(err) {
						console.log(err);
						return _this.responses.internalError(res);
					} else {
						return _this.responses.respond(res, catTasks);
					}
				};
			})(this));
		},
		createTask: function(req, res, params) {
			let Tasks, data;
			Tasks = mongoose.model("Tasks");
			data = "";
			req.on('data', function(chunk) {
				return data += chunk;
			});
			return req.on('end', (function(_this) {
				return function() {
					let taskInfo;
					taskInfo = JSON.parse(data);
					return Tasks.create(taskInfo, function(err, task) {
						if (err) {
							console.log(err);
							return _this.responses.internalError(res);
						} else {
							return _this.responses.respond(res, task);
						}
					});
				};
			})(this));
		},
		updateTask: function(req, res, params) {
			let Tasks, data;
			if (this.helpers.isValidID(params.identifier)) {
				Tasks = mongoose.model("Tasks");
				data = "";
				req.on('data', function(chunk) {
					return data += chunk;
				});
				return req.on('end', (function(_this) {
					return function() {
						let taskInfo;
						taskInfo =JSON.parse(data);
						return Tasks.updateById(params.identifier, taskInfo, function(err, task) {
							if (err) {
								console.log(err);
								return _this.responses.internalError(res);
							} else {
								return _this.responses.respond(res, task);
							}
						});
					};
				})(this));
			} else {
				return this.responses.notAvailable(res);
			}
		},
		deleteTask: function(req, res, params) {
			let Tasks;
			if (this.helpers.isValidID(params.identifier)) {
				Tasks = mongoose.model("Tasks");
				return Tasks.deleteById(params.identifier, function(_this) {
					return function(err) {
						if (err) {
							console.log(err);
							return _this.responses.internalError(res);
						} else {
							return _this.responses.respond(res);
						}
					};
				})(this));
			} else {
				return this.responses.notAvailable(res);
			}
		},
		completeTask: function(req, res, params) {
			let Tasks;
			if (this.helpers.isValidID(params.identifier)) {
				Tasks = mongoose.model("Tasks");
				return Tasks.getById(params.identifier, (function(_this) {
					return function(err, task) {
						if (err) {
							console.log(err);
							return _this.responses.respond(res);
						} else {
							task.completed = true;
							return task.save(function(err) {
								if (err) {
									return _this.responses.internalError(res);
								} else {
									return _this.responses.respond(res);
								}
							});
						}
					}
				};
				})(this));
			} else {
				return thsis.responses.notAvailable(res);
			}
		}
	},
	helpers: {
		isValidID: function(id) {
			return id.match(/^[0-9a-fA-F]{24}$/);
		}
	}
};

module.exports = exports = TasksController;