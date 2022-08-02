const Certificates = {
	'Python': [
		"Certificates/Python_Core.png",
		"Certificates/Python_Beginners.png",
		"Certificates/Intermediate_Python.png",
		"Certificates/Python_Data_Science.png",
		"Certificates/Python_Data_Structures.png"
	],

	'Kotlin': [
		"Certificates/Kotlin_Course.jpg",
	],

	'Web': [
		"Certificates/HTML.jpeg",
	],
	'Another': [
		"Certificates/Marca_Personal.png",
	]
}
// Get the selector
const div = document.querySelector('#galery');
// Built a Galery
const galery = (element) => {
	div.innerHTML = '<p>Image</p>', element;
	div.innerHTML;
};;

// Iterate a JSON 
let num = 0; 
const Python = Certificates.Python.forEach(certificate => {
	galery(certificate);
	console.log(num)
	num++;
});
const Kotlin = Certificates.Kotlin.forEach(certificate => {
	galery(certificate);
});
