import * as sapper from '@sapper/app';
import { getUser } from "./stores/user";
import { initFirebase } from './services/auth';

const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.formatToDate = function () {
	const date = new Date(this);
	const month = date.getMonth();
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return `${monthNames[month]} ${day}${day === 1 ? 'st' : day === 2 ? "nd" : day === 3 ? "rd" : "th"}, ${hours}:${minutes}`;
};

// Array.prototype.swap = function (from, to) {
// 	let newList = [...this];
// 	newList[from] = [newList[to], (newList[to] = newList[from])][0];
// 	return newList;
// };

Array.prototype.move = function (from, to) {
	let newList = [...this];
	newList.splice(to, 0, newList.splice(from, 1)[0]);
	return newList;
};

Array.prototype.mergeById = function (arr) {
	const _ids = arr.map(i => i._id);
	const updatedItems = this.filter(i => !_ids.includes(i._id));
	return [...updatedItems, ...arr];
};

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function (err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}

initFirebase();

sapper.start({
	target: document.querySelector('#sapper')
}).then(() => {
	getUser();
});