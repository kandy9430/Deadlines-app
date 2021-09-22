module.exports = {
  categories: [
    "Housing",
    "Insurance",
    "Utilities",
    "Bills",
    "Subscriptions",
    "Credit Card",
  ],
  intervals: [
    { name: "Monthly", value: 1 },
    { name: "Bi-Monthly", value: 2 },
    { name: "Quarterly", value: 3 },
    { name: "Semi-Annually", value: 6 },
    { name: "Annually", value: 12 },
  ],
  formatDate: function (dateNumber) {
    if (dateNumber === 1 || dateNumber === 21 || dateNumber === 31) {
      return `${dateNumber}st`;
    } else if (dateNumber === 2 || dateNumber === 22) {
      return `${dateNumber}nd`;
    } else if (dateNumber === 3 || dateNumber === 23) {
      return `${dateNumber}rd`;
    } else {
      return `${dateNumber}th`;
    }
  },
};
