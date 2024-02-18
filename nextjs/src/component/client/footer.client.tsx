const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        padding: 15,
        textAlign: "center",
        background: "linear-gradient(269.85deg, #54151c 0%, #121212 54.89%)",
        color: "#ccc",
      }}
    >
      <div>
        Copyright {year} developed by &copy;Hoa Pham. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
