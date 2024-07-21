import Backend from "https://madata.dev/backends/github/labels/github-labels.js";

let backends = {};

export default class RepoLabels extends Array {
	constructor(name, options) {
		super();

		if (options) {
			// Ensure we create actual backends and do not perform any array operation (map, splice, etc.) while working with an instance of this class
			this.name = name;
			this.backend = backends[name] ?? new Backend(`https://github.com/${name}/labels`, options);

			this.backend.load().then(d => {
				this.push(...d);
				backends[name] = this.backend;

				options.context?.$forceUpdate();
			});
		}
	}

	get colors () {
		if (!this.length) {
			return [];
		}

		return new Set(this.map(l => l.color));
	}

	save () {
		this.backend.store(this);
	}

	duplicate (labelIndex) {
		let label = this[labelIndex];
		let labelInfo = {name: label.name, color: label.color, description: label.description};
		this.splice(labelIndex + 1, 0, labelInfo);
	}

	add (label) {
		let labelInfo = {name: label.name, color: label.color, description: label.description};
		let existingLabel = this.find(l => l.name === label.name);

		if (existingLabel) {
			// Update
			Object.assign(existingLabel, labelInfo);
		}
		else {
			this.push(labelInfo);
		}
	}
}