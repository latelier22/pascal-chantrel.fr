"use client"

import React from 'react';
import styles from './home.module.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


const FormContact = () => {
  // Variables
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isSended, setIsSended] = useState(false);
  const [sendError, setSendError] = useState(false);

  // Méthode
  const onSubmitHandler = async (data) => {
    if (isLoading) return;
    setIsLoading(true);
    setSendError(false);
    setIsSended(false);
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        setSendError(true);
        return;
      }
      reset();
      setIsSended(true);
    } catch {
      setSendError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.contactForm} data-reveal onSubmit={handleSubmit(onSubmitHandler)}>
      <h2>Écrire un message</h2>
      <div className={styles.formRow}>
        <label>Prénom<input autoComplete="given-name" {...register("prenom", { required: true })} />
          {errors.prenom && <small>Renseignez votre prénom.</small>}
        </label>
        <label>Nom<input autoComplete="family-name" {...register("nom", { required: true })} />
          {errors.nom && <small>Renseignez votre nom.</small>}
        </label>
      </div>
      <label>Adresse e-mail<input type="email" autoComplete="email" {...register("email", { required: true })} />
        {errors.email && <small>Renseignez votre adresse e-mail.</small>}
      </label>
      <label>Message<textarea rows={6} {...register("contenu", { required: true })} />
        {errors.contenu && <small>Renseignez votre message.</small>}
      </label>
      <button className={styles.contactButton} disabled={isLoading} type="submit">{isLoading ? "Envoi…" : "Envoyer"}</button>
      {isSended && <p role="status">Votre message a été envoyé.</p>}
      {sendError && <p role="alert">Le message n’a pas pu être envoyé. Vous pouvez nous joindre par téléphone.</p>}
    </form>
  );
};

export default FormContact;
