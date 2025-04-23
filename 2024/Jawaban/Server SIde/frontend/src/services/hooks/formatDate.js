export const formatDate = (date) => {
  if (!date) return "-";
  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hour = String(newDate.getHours()).padStart(2, "0");
  const minute = String(newDate.getMinutes()).padStart(2, "0");
  const second = String(newDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
