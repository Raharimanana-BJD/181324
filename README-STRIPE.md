# Configuration Stripe pour Agrisur

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agrisur"

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
SENDER_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Configuration Stripe

### 1. Créer un compte Stripe

- Allez sur [stripe.com](https://stripe.com)
- Créez un compte et accédez au dashboard

### 2. Récupérer les clés API

- Dans le dashboard Stripe, allez dans "Developers" > "API keys"
- Copiez la clé secrète (commence par `sk_test_` pour les tests)
- Copiez la clé publique (commence par `pk_test_` pour les tests)

### 3. Configurer les webhooks

- Dans le dashboard Stripe, allez dans "Developers" > "Webhooks"
- Cliquez sur "Add endpoint"
- URL : `https://votre-domaine.com/api/webhooks/stripe`
- Événements à écouter :
  - `checkout.session.completed`
  - `payment_intent.payment_failed`
- Copiez le secret du webhook (commence par `whsec_`)

### 4. Tester en local

Pour tester les webhooks en local, utilisez la commande :

```bash
pnpm str
```

Cette commande utilise Stripe CLI pour rediriger les webhooks vers votre serveur local.

## Migration de la base de données

Exécutez les commandes suivantes pour mettre à jour le schéma :

```bash
pnpm db:migrate
pnpm db:generate
```

## Test du paiement

1. Ajoutez des produits au panier
2. Remplissez vos informations (nom et email)
3. Cliquez sur "Payer"
4. Vous serez redirigé vers Stripe Checkout
5. Utilisez les cartes de test Stripe :
   - Succès : `4242 4242 4242 4242`
   - Échec : `4000 0000 0000 0002`

## Fonctionnalités implémentées

- ✅ Intégration Stripe Checkout
- ✅ Gestion des webhooks
- ✅ Envoi d'emails de confirmation
- ✅ Page de succès/échec
- ✅ Formulaire client dans le panier
- ✅ Gestion des statuts de commande

## Prochaines étapes

1. Ajouter les champs Stripe au schéma Prisma
2. Améliorer la gestion des erreurs
3. Ajouter des notifications en temps réel
4. Implémenter un système de remboursement
