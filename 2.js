const unsortArray = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21];

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    // loop every number in index
    for (let j = 0; j < arr.length; j++) {
      // check number in selected index and compare with next index number
      // if number is greater swap index
      if (arr[j] > arr[j + 1]) {
        // create temporary variable to store number
        let temp = arr[j];
        // init every looping value to array index
        arr[j] = arr[j + 1];
        // init new value of the array after sorting
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

console.log(bubbleSort(unsortArray));
