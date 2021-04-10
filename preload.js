const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
	invoke: async (channel, payLoad) => {
		let validChannels = [
			'get-data',
			'get-tags',
			'get-proj',
			'post-data',
			'post-tags',
			'post-proj',
			'put-data',
			'put-tags',
			'put-proj'
		];
		if (validChannels.includes(channel)) {
			const response = ipcRenderer.invoke(channel, payLoad);
			return response;
		}
	},
	send: (channel, payLoad) => {
		let validChannels = [
			'edit-data',
			'edit-tag',
			'edit-pro',
			'home',
			'Local_Resource'
		];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, payLoad);
		}
	}
});