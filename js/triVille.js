let csvFile;
let listVille = [];
let nbPermutation = 0;
let nbComparaison = 0;

document.querySelector("#read-button").addEventListener('click', function () {
    csvFile = document.querySelector("#file-input").files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
        // récupération de la liste des villes
        listVille = getArrayCsv(e.target.result);

        // Calcul de la distance des villes par rapport à Grenoble
        listVille.forEach(ville => {
            ville.distanceFromGrenoble = distanceFromGrenoble(ville);
        });
        // Tri
        const algo = $("#algo-select").val();
        nbPermutation = 0;
        nbComparaison = 0;
        // console.log(listVille.length)
        sort(algo);

        // Affichage 
        displayListVille()
    });
    reader.readAsText(csvFile)
})

/**
 * Récupére la liste des villes contenu dans le fichier csv
 * @param csv fichier csv brut
 * @returns la liste des villes mis en forme
 */
function getArrayCsv(csv) {
    let listLine = csv.split("\n")
    listVille = [];
    let isFirstLine = true;
    listLine.forEach(line => {
        if (isFirstLine || line === '') {
            isFirstLine = false;
        } else {
            let listColumn = line.split(";");
            listVille.push(
                new Ville(
                    listColumn[8],
                    listColumn[9],
                    listColumn[11],
                    listColumn[12],
                    listColumn[13],
                    0
                )
            );
        }
    });
    return listVille;
}

/**
 * Calcul de la distance entre Grenoble et une ville donnée
 * @param ville ville
 * @returns la distance qui sépare la ville de Grenoble
 */
function distanceFromGrenoble(ville) {
    const cityLat = ville.latitude;
    const cityLon = ville.longitude;
    const greLat = 45.188529;
    const greLon = 5.724524;
    const R = 6371e3; // metres
    const φ1 = greLat * Math.PI / 180; // φ, λ in radians
    const φ2 = cityLat * Math.PI / 180;
    const Δφ = (cityLat - greLat) * Math.PI / 180;
    const Δλ = (cityLon - greLon) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    
    //console.log("La ville " + ville.nom_commune + " est à " + km + " km de distance de Grenoble")
    return d;
}

/**
 * Retourne vrai si la ville i est plus proche de Grenoble
 * par rapport à j
 * @param {*} i distance de la ville i
 * @param {*} j distance de la ville j
 * @return vrai si la ville i est plus proche
 */
function isLess(i, j) {
    // console.log(listVille[i]);
    // console.log(listVille[j]);
    // if(listVille[i] == undefined){
    //     console.log(listVille[i].nom_commune)
    // }
    if(listVille[i].distanceFromGrenoble   <   listVille[j].distanceFromGrenoble   ){
        return true;
    }else{
        return false;
    }
}

/**
 * interverti la ville i avec la ville j dans la liste des villes
 * @param {*} i 
 * @param {*} j 
 */
function swap(i, j) {
    temp = listVille[i];
    listVille[i] = listVille[j];
    listVille[j] = temp;

    nbPermutation++;
    //console.log('valeurs swapée !');
}

function sort(type) {
    switch (type) {
        case 'insert':
            insertsort();
            break;
        case 'select':
            selectionsort();
            break;
        case 'bubble':
            bubblesort();
            break;
        case 'shell':
            shellsort();
            break;
        case 'merge':
            mergesort();
            break;
        case 'heap':
            heapsort();
            break;
        case 'quick':
            quicksort2(0, listVille.length - 1);
            // console.log(listVille[0])
            break;
    }
}

function insertsort() {
    for (i = 1; i <= listVille.length -1; i++){
        // let temp = listVille[i];
        j = i;
        while (j > 0 && isLess(j, j-1)){
            swap(j, j - 1)
            j--;
        }
    }
    return listVille;
}

function selectionsort() {
    for (i = 0; i <= listVille.length -1; i++){
        let minValue = listVille[i];
        let indexMinValue = i;
        //Compare la valeur de l'index aux autres valeurs du tableau
        for(j = i + 1; j <= listVille.length -1; j++){ 
            //Pendant l'analyse, enregistre la valeur la plus petite rencontrées et son index
            if (isLess(j, indexMinValue))  {
                minValue = listVille[j];
                indexMinValue = j;
            }
        }
        //Permutte les valeurs aux index concernés après analyse
        swap(i, indexMinValue)
    }
    return listVille;
}

function bubblesort() {
    permut = true;
    while(permut == true){
        permut = false;
        for(i=0; i < listVille.length -1; i++){
            if (!(isLess(i, i +1))){
                permut = true;
                swap( i, i + 1)
            }
        }
    }
    return listVille;
}

function insertionsortShell(gap, startIndex) {
    for (i = gap + startIndex; i <= listVille.length; i += gap) {
        let temp = listVille[i];
        j = i;
        while (j > 0 && listVille[j - gap] > temp) {
            swap(j, j - gap)
            j = j - gap;
        }
    }
    return listVille;
}

function shellsort() {
    console.log("Tableau à trier par shellSort");
    //Calcul intervalles :
    let step = Math.ceil(listVille.length / 2);
    let intervalles = [];
    //tableau de gap
    for (let i = 1; i <= step; i = 3 * i + 1) {
        intervalles.push(i)
    };
    console.log(intervalles)
    for (gapNumber = 0; gapNumber < intervalles.length; gapNumber++) {
        for (decalage = 0; decalage < intervalles[gapNumber]; decalage++) {
            insertionsortShell(intervalles[gapNumber], decalage)
        };
    }
    return listVille;
}

function mergesort() {
    console.log("mergesort - implement me !");
}


function heapsort() {
    console.log("heapsort - implement me !");
}

// QUICKSORT NON FONCTIONNEL => A DEBUGGER
// function partition(start, end){
//     // Taking the last element as the pivot
//         // const pivotValue = listVille[end].distanceFromGrenoble;
//         let swapIndex = start;
//         for (let i = swapIndex; i < end; i++) {
//             if (isLess(end, i)) {
//     // Swapping elements
//                 // [inputArr[i], inputArr[swapIndex]] = [inputArr[swapIndex], inputArr[i]];
//                 swap(i, end);
//     // Moving to next element
//                 swapIndex++;
//             }
//         }
//         // Putting the pivot value in the middle
//         // [inputArr[swapIndex], inputArr[end]] = [inputArr[end], inputArr[swapIndex]]
//         swap(swapIndex, end);
//         return swapIndex;
//     }
    
//     function quicksort(start, end) {
//         // Base case or terminating case
//         if (start >= end) {
//             return;
//         }
    
//         // Returns swapIndex
//         let index = partition(start, end);
    
//         // Recursively apply the same logic to the left and right subarrays
//         quicksort(start, index - 1);
//         quicksort(index + 1, end);
//         return listVille;
//     }

// QUICKSORT 2 (implémentation de la vidéo tuto - cf Notion)

function partition2(start, end) {
    let pivotValue = listVille[end].distanceFromGrenoble;
    let swapMarker = start - 1; // orange
    for (currentIndex = start; currentIndex <= end; currentIndex++) { // currentIndex = vert
        if (isLess(currentIndex, end) || listVille[currentIndex].distanceFromGrenoble == pivotValue) {
            swapMarker++;
            if (currentIndex > swapMarker) {
                swap(currentIndex, swapMarker)
            }
        }
    }
    return swapMarker;
}

function quicksort2(start, end) {
    if (start >= end) {
        return;
    }

    //Returns swapIndex
    let wall = partition2(start, end);

    // Recursively apply the same logic to the left and right subarrays
    quicksort2(start, wall - 1);
    quicksort2(wall + 1, end);
    return listVille;
}

/** MODEL */

class Ville {
    constructor(nom_commune, codes_postaux, latitude, longitude, dist, distanceFromGrenoble) {
        this.nom_commune = nom_commune;
        this.codes_postaux = codes_postaux;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dist = dist;
        this.distanceFromGrenoble = distanceFromGrenoble;
    }
}

/** AFFICHAGE */
function displayPermutation(nbPermutation) {
    document.getElementById('permutation').innerHTML = nbPermutation + ' permutations';
}

function metersToKmeters(m){
    const km = m / 1000;
    return km.toFixed(1);
}

function displayListVille() {
    document.getElementById("navp").innerHTML = "";
    displayPermutation(nbPermutation);
    let mainList = document.getElementById("navp");
    for (var i = 0; i < listVille.length; i++) {
        let item = listVille[i];
        let elem = document.createElement("li");
        elem.innerHTML = item.nom_commune + " - \t" + metersToKmeters(item.distanceFromGrenoble) + ' km';
        mainList.appendChild(elem);
    }
}
