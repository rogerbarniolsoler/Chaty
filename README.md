# Aplicació de Xat Real-time amb Expo i Supabase

Aquest projecte consisteix en una aplicació de missatgeria instantània desenvolupada amb **React Native (Expo)** i **Supabase**. L'aplicació permet la comunicació en temps real entre usuaris, gestionant la sessió de forma global i oferint una experiència d'usuari fluida.

## 🚀 Característiques Principals

### 🔐 Autenticació i Gestió d'Usuaris
* **Registre i Login**: Sistema d'accés complet mitjançant Supabase Auth.
* **Estat Global (Zustand)**: Gestió de la sessió de l'usuari (sessió activa, dades del perfil) de forma centralitzada per evitar els re-renders.
* **Persistència**: La sessió es manté activa fins i tot després de tancar l'aplicació.

### 💬 Sistema de Xat Real-time
* **Comunicació instantània**: Ús de **RealTime** a través de `supabase` per rebre missatges nous sense haver de refrescar la pantalla.
* **Historial de missatges**: Càrrega inicial de missatges antics mitjançant consultes a la base de dades (PostgreSQL).
* **Indicador d'escriptura (Presence)**: Implementació de l'estat "està escrivint..." per millorar l'experiència d'usuari.
* **Scroll Automàtic**: La llista de missatges es desplaça automàticament al final quan arriba un nou contingut.
* **Diferenciació visual**: Els missatges propis s'alineen a la dreta (estil WhatsApp) per facilitar la lectura de la conversa.

## 🛠️ Stack Tecnològic
* **Frontend**: React Native amb Expo (Expo Router).
* **Backend**: Supabase (Database & Auth).
* **Estat Global**: Zustand.
* **Icones**: Ionicons (@expo/vector-icons).

## 🔑 Credencials de Prova

Per provar el funcionament del xat en temps real entre dos dispositius, es poden utilitzar els següents comptes:

**Compte Alumne:**
* **Correu:** `alumne@gmail.com`
* **Contrasenya:** `alumne1234`

**Compte Professora:**
* **Correu:** `professora@gmail.com`
* **Contrasenya:** `professora1234`

## ⚙️ Instal·lació i Configuració

1. Clonar el repositori.
2. Instal·lar les dependències:
   npm install
3. Iniciar el projecte
   npx expo start
