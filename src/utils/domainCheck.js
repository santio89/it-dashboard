export const domainCheck = (email) => {
  const regex = new RegExp(`@${"orlosh.com.ar".replace('.', '\\.')}$`);

  return (email === "santiolais1989@gmail.com" || regex.test(email));
}

export const adminCheck = (email) => {
  return (email === "santiago.olais@orlosh.com.ar");
}