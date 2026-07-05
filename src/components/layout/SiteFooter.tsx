import { Layers, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-top">
          <div className="brand">
            <span className="logo-mark">
              <Layers />
            </span>
            <span className="logo-text">{t("brand")}</span>
          </div>
          <div className="footer-contact">
            <a className="footer-contact-item" href="tel:+998773035665">
              <span className="footer-contact-ico">
                <Phone />
              </span>
              <span className="footer-contact-body">
                <small>{t("phone")}</small>
                <span className="footer-contact-val">+998 77 303 56 65</span>
              </span>
            </a>
            <a className="footer-contact-item" href="mailto:info@assembly.uz">
              <span className="footer-contact-ico">
                <Mail />
              </span>
              <span className="footer-contact-body">
                <small>{t("email")}</small>
                <span className="footer-contact-val">info@assembly.uz</span>
              </span>
            </a>
            <div className="footer-contact-item">
              <span className="footer-contact-ico">
                <MapPin />
              </span>
              <span className="footer-contact-body">
                <small>{t("mainOffice")}</small>
                <span className="footer-contact-val">{t("officeAddress")}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <Link to="/complaint" className="muted">{t("complaint")}</Link>
          <div className="muted">© 2026 {t("brand")}. {t("rights")}</div>
        </div>
      </div>
    </footer>
  );
}
