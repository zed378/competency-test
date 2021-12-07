let stuffA = 4550;
let stuffB = 5330;
let qtyA = 13;
let qtyB = 7;

function countPrice(quality, quantity) {
  if (quality === "A") {
    if (quantity <= qtyA) {
      console.log("Total yang harus dibayar: " + quantity * stuffA);
    } else if (quantity > qtyA) {
      let totalPrice = quantity * stuffA;
      let discount = 231 * quantity;
      let finalPrice = totalPrice - discount;

      console.log(`Total Harga: ${totalPrice}`);
      console.log(`Potongan: ${discount}`);
      console.log("Harga yang harus dibayar: " + finalPrice);
    }
  } else if (quality === "B") {
    if (quantity <= qtyB) {
      console.log("Total yang harus dibayar: " + quantity * stuffB);
    } else if (quantity > qtyB) {
      let totalPrice = quantity * stuffB;
      let discount = 0.23 * totalPrice;
      let finalPrice = totalPrice - discount;

      console.log(`Total Harga: ${totalPrice}`);
      console.log(`Potongan: ${discount}`);
      console.log("Harga yang harus dibayar: " + finalPrice);
    }
  }
}

countPrice("A", 7);
countPrice("A", 14);
countPrice("B", 5);
countPrice("B", 15);
