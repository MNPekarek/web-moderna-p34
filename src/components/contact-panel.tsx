"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const CONTACT_ENDPOINT: string | null = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? null;
const CONTACT_EMAIL: string | null = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;
const PROJECT_TYPES = ["Arquitectura", "Desarrollo", "Colaboración", "Otro"] as const;

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function ContactPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectType, setProjectType] = useState<(typeof PROJECT_TYPES)[number]>("Arquitectura");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!CONTACT_ENDPOINT) {
      setStatus("error");
      setErrorMessage("El canal de envío todavía no está configurado.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("projectType", projectType);
    setStatus("loading");

    try {
      const response = await fetch(CONTACT_ENDPOINT, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Contact request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("No pudimos enviar la consulta. Intentá nuevamente más tarde.");
    }
  };

  return (
    <div className={`contact-panel${isOpen ? " is-open" : ""}`}>
      <button
        className="home-closing__cta contact-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="contact-form"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="home-closing__cta-desktop">Hablemos de un proyecto</span>
        <span className="home-closing__cta-mobile">Hablemos</span>
        <span className="home-closing__cta-phone">Hablemos de tu proyecto</span>
        <i aria-hidden="true" />
        <b aria-hidden="true">{isOpen ? "×" : "↗"}</b>
      </button>

      <div id="contact-form" className="contact-form-shell" aria-hidden={!isOpen} inert={!isOpen}>
        <div className="contact-form-shell__inner">
          {status === "success" ? (
            <div className="contact-success" role="status">
              <strong>Gracias.<br /><em>Empecemos desde el lugar.</em></strong>
              <p>Recibimos tu consulta.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__field contact-form__field--name">
                <label htmlFor="contact-name"><span className="contact-label--desktop">Nombre</span><span className="contact-label--mobile"><small>01</small><strong>Nombre</strong></span></label>
                <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Nombre y apellido" required />
              </div>
              <div className="contact-form__field contact-form__field--email">
                <label htmlFor="contact-email"><span className="contact-label--desktop">Email</span><span className="contact-label--mobile"><small>02</small><strong>Email</strong></span></label>
                <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="nombre@email.com" required />
              </div>
              <div className="contact-form__field contact-form__field--company">
                <label htmlFor="contact-company"><span className="contact-label--desktop">Empresa / Estudio <span>(opcional)</span></span><span className="contact-label--mobile"><small>03</small><strong>Estudio / Empresa</strong></span></label>
                <input id="contact-company" name="company" type="text" autoComplete="organization" placeholder="Estudio / empresa (opcional)" />
              </div>
              <fieldset className="contact-form__types">
                <legend><span className="contact-label--desktop">Tipo de proyecto</span><span className="contact-label--mobile"><small>04</small><strong>Tipo de proyecto</strong></span></legend>
                <div>
                  {PROJECT_TYPES.map((type) => (
                    <button className={projectType === type ? "is-active" : ""} type="button" key={type} onClick={() => setProjectType(type)}>{type}</button>
                  ))}
                </div>
              </fieldset>
              <div className="contact-form__field contact-form__field--message">
                <label htmlFor="contact-message"><span className="contact-label--desktop">Contanos brevemente sobre el proyecto</span><span className="contact-label--mobile"><small>05</small><strong>Proyecto</strong></span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={1}
                  placeholder="Contanos brevemente sobre el proyecto..."
                  required
                  onInput={(event) => {
                    event.currentTarget.style.height = "auto";
                    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                  }}
                />
              </div>
              <div className="contact-form__actions">
                {CONTACT_EMAIL ? <a href={`mailto:${CONTACT_EMAIL}`}><small>Preferís otro medio</small>Escribinos directamente →</a> : <span><small>Preferís otro medio</small>Escribinos directamente →</span>}
                <button type="submit" disabled={status === "loading"}><span>{status === "loading" ? "Enviando…" : "Enviar consulta"}</span><b aria-hidden="true">↗</b></button>
              </div>
              {status === "error" && <p className="contact-form__status" role="status">{errorMessage}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
