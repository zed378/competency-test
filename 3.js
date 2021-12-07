function pattern(n) {
  if (n % 2 == 0) {
    alert("Input must be Odd Number");
  } else {
    // looping rows
    for (let i = 0; i < n; i++) {
      // Looping columns
      for (let j = 0; j < n; j++) {
        if (
          i == 0 ||
          j == 0 ||
          i == j ||
          i == n - 1 ||
          j == n - 1 ||
          i + j == n - 1
        )
          document.write(" * ");
        else document.write(" # ");
      }
      document.write("<br />");
    }
  }
}

pattern(5);
