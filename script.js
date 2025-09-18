/*
 * Script principal pour le site de la Bat‑Mitzvah de Naomi.
 *
 *  – Chargement des inscriptions depuis le stockage local du navigateur
 *    et affichage dans le tableau de bord.
 *  – À la soumission du formulaire, enregistrement d’une nouvelle
 *    entrée dans le tableau local avant l’envoi des données par
 *    Formsubmit.co. Ceci permet de conserver un historique des
 *    inscriptions même sans connexion à un serveur.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Récupère l’élément du formulaire (s’il existe sur la page)
  const form = document.getElementById('registration-form');
  const tableBody = document.getElementById('table-body');

  // Charge les inscriptions depuis le stockage local ou initialise un tableau vide
  let registrations = [];
  try {
    const stored = localStorage.getItem('registrations');
    registrations = stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Impossible de lire les inscriptions dans localStorage :', err);
    registrations = [];
  }

  /**
   * Met à jour le tableau HTML à partir du tableau d’inscriptions.
   */
  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    registrations.forEach((reg) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(reg.prenom)}</td>
        <td>${escapeHtml(reg.nom)}</td>
        <td>${escapeHtml(reg.email)}</td>
        <td>${escapeHtml(reg.telephone)}</td>
        <td>${escapeHtml(reg.adultes)}</td>
        <td>${escapeHtml(reg.enfants)}</td>
        <td>${escapeHtml(reg.regime)}</td>
        <td>${escapeHtml(reg.message)}</td>
        <td>${escapeHtml(reg.date)}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  /**
   * Échappe les caractères HTML pour éviter les injections
   * potentielles lors de l’affichage dans le tableau.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Affiche les inscriptions existantes au chargement
  renderTable();

  // Gestionnaire de soumission du formulaire
  if (form) {
    form.addEventListener('submit', (event) => {
      // Récupère les valeurs des champs de formulaire
      const prenom = document.getElementById('prenom').value.trim();
      const nom = document.getElementById('nom').value.trim();
      const email = document.getElementById('email').value.trim();
      const telephone = document.getElementById('telephone').value.trim();
      const adultes = document.getElementById('adultes').value.trim();
      const enfants = document.getElementById('enfants').value.trim();
      const regime = document.getElementById('regime').value.trim();
      const message = document.getElementById('message').value.trim();
      const now = new Date();
      const dateLocale = now.toLocaleString('fr-FR');
      // Construit un nouvel enregistrement
      const newReg = {
        prenom,
        nom,
        email,
        telephone,
        adultes,
        enfants,
        regime,
        message,
        date: dateLocale
      };
      // Ajoute au tableau local et enregistre dans localStorage
      registrations.push(newReg);
      try {
        localStorage.setItem('registrations', JSON.stringify(registrations));
      } catch (err) {
        console.error('Impossible d’enregistrer les inscriptions dans localStorage :', err);
      }
      // Met à jour l’affichage du tableau immédiatement
      renderTable();
      // Ne pas empêcher l’envoi du formulaire : l’action POST est
      // nécessaire pour transmettre les données à Formsubmit.
      // Laisser le navigateur poursuivre le processus d’envoi.
    });
  }
});