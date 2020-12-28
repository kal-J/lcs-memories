import './footer.scss';

const Footer = () => {
  return (
    <section className="footer_section">
      <div className="content">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <span>|</span>
          <li>
            <a href="https://github.com/kal-J">Github</a>
          </li>
          <span>|</span>
          <li>
            <a href="https://twitter.com/kal_code">Twitter</a>
          </li>
          <span>|</span>
          <li>
            <a href="https://kal.codes">Blog</a>
          </li>
        </ul>
      </div>

      <div className="content">
        <div className="description">
          <p>Made with love by kal-J</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
