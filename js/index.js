import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import "https://madata.dev/components/auth/index.js";
import RepoLabels from './RepoLabels.js';

globalThis.app = createApp({
	data () {
		let ret = {
			repoNames: [
				"leaverou/brep",
				"madatajs/madata",
			],
			labels: {},
			firstBackend: null,
		};

		return ret;
	},

	mounted () {
		for (let name of this.repoNames) {
			// this.load(name);
			this.labels[name] = new RepoLabels(name, {syncWith: this.firstBackend});
			this.firstBackend ??= this.labels[name].backend;
		}
	},

	computed: {
		backends () {
			return this.repoNames.map(name => this.labels[name].backend);
		},

		all () {
			return this.repoNames.map(name => this.labels[name]);
		}
	},

	methods: {
		dump (v) {
			return JSON.stringify(v, null, "\t");
		},

		load (name) {
			if (!this.labels[name]) {
				this.labels[name] = new RepoLabels(name, {syncWith: this.firstBackend});
				this.firstBackend ??= this.labels[name].backend;
			}

			return this.labels[name];
		},

		copyTo (labelIndex, fromRepoIndex, toRepoIndex) {
			let fromName = this.repoNames[fromRepoIndex];
			let toName = this.repoNames[toRepoIndex];
			let label = this.labels[fromName][labelIndex];
			this.labels[toName].add(label);
		}
	},

	watch: {
		repoNames: {
			handler () {
				for (let name of this.repoNames) {
					if (!this.labels[name]) {
						this.labels[name] = new RepoLabels(name, {syncWith: this.firstBackend});
						this.firstBackend ??= this.labels[name].backend;
					}
				}
			},
			immediate: true,
			deep: true,
		},
	}
}).mount(document.body);