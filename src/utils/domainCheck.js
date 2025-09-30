export const domainCheck = (email) => {
  const regex = new RegExp(`@${"orlosh.com.ar".replace('.', '\\.')}$`);

  return (email === import.meta.env.VITE_USER_EMAIL || regex.test(email));
}

export const adminCheck = (email) => {
  return (email === import.meta.env.VITE_ADMIN_EMAIL);
}