import { useEffect } from "react";
import theme from "../theme.js";
import { useTranslation } from "react-i18next";

export function Modal({ isOpen, onClose, title, children, maxWidth = "480px" }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth }} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, confirmColor = theme.colors.primary, icon = "⚠️" }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: "400px" }} onClick={e => e.stopPropagation()}>
        <div style={styles.confirmContent}>
          <div style={styles.confirmIcon}>{icon}</div>
          <h3 style={styles.confirmTitle}>{title}</h3>
          <p style={styles.confirmMessage}>{message}</p>
          <div style={styles.confirmButtons}>
            <button
              style={styles.cancelBtn}
              onClick={onClose}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(74,55,40,0.08)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {t("commun.annuler")}
            </button>
            <button
              style={{ ...styles.confirmBtn, backgroundColor: confirmColor }}
              onClick={() => { onConfirm(); onClose(); }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {confirmLabel || t("commun.confirmer")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuccessModal({ isOpen, onClose, title, message, onAction, actionLabel }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && !onAction) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: "380px" }} onClick={e => e.stopPropagation()}>
        <div style={styles.confirmContent}>
          <div style={{ ...styles.confirmIcon, fontSize: "3rem" }}>🎉</div>
          <h3 style={{ ...styles.confirmTitle, color: "#006633" }}>{title}</h3>
          <p style={styles.confirmMessage}>{message}</p>
          {onAction && actionLabel ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", marginTop: "0.5rem" }}>
              <button
                style={{ ...styles.confirmBtn, backgroundColor: theme.colors.primary }}
                onClick={onAction}
              >
                {actionLabel}
              </button>
              <button style={styles.cancelBtn} onClick={onClose}>
                {t("commun.fermer")}
              </button>
            </div>
          ) : (
            <>
              <div style={styles.successBar}>
                <div style={styles.successBarFill} />
              </div>
              <p style={{ fontSize: "0.75rem", color: theme.colors.textMuted, marginTop: "0.5rem" }}>
                {t("commun.fermetureAuto")}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorModal({ isOpen, onClose, title, message }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: "380px" }} onClick={e => e.stopPropagation()}>
        <div style={styles.confirmContent}>
          <div style={{ ...styles.confirmIcon, fontSize: "3rem" }}>❌</div>
          <h3 style={{ ...styles.confirmTitle, color: theme.colors.primary }}>
            {title || t("commun.erreur")}
          </h3>
          <p style={styles.confirmMessage}>{message}</p>
          <button
            style={{ ...styles.confirmBtn, backgroundColor: theme.colors.primary, width: "100%" }}
            onClick={onClose}
          >
            {t("commun.fermer")}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    backgroundColor: theme.colors.bgWhite,
    borderRadius: "16px",
    width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
    animation: "slideUp 0.25s ease",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 1.8rem",
    borderBottom: "1px solid rgba(74,55,40,0.1)",
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: "1.2rem",
    fontWeight: "900",
    color: theme.colors.textDark,
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.1rem",
    cursor: "pointer",
    color: theme.colors.textMuted,
    padding: "0.3rem",
    borderRadius: "6px",
  },
  body: { padding: "1.5rem 1.8rem 1.8rem" },
  confirmContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "2rem 1.8rem",
    gap: "0.75rem",
  },
  confirmIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  confirmTitle: {
    fontFamily: theme.fonts.heading,
    fontSize: "1.2rem",
    fontWeight: "900",
    color: theme.colors.textDark,
    margin: 0,
  },
  confirmMessage: {
    fontSize: "0.9rem",
    color: theme.colors.textMuted,
    lineHeight: "1.6",
    margin: 0,
  },
  confirmButtons: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.75rem",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(74,55,40,0.2)",
    background: "transparent",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.body,
    transition: "background 0.15s",
  },
  confirmBtn: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#fff",
    fontFamily: theme.fonts.body,
    transition: "opacity 0.15s",
  },
  successBar: {
    width: "100%",
    height: "4px",
    backgroundColor: "rgba(0,150,50,0.15)",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "0.5rem",
  },
  successBarFill: {
    height: "100%",
    backgroundColor: "#006633",
    borderRadius: "999px",
    animation: "shrink 3s linear forwards",
  },
};

export default Modal;