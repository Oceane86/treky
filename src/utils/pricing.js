// Transparence tarifaire & politique de remboursement Treky.
// Répartition alignée sur la promesse marketing : 80 % du prix reste à Madagascar
// (part guide + logistique locale), 20 % de commission Treky.

export const INSTALLMENT_THRESHOLD_AR = 10_000_000 // ≈ 2 000 € — seuil paiement fractionné

export const PRICE_SPLIT = {
  guide: 0.45,
  logistique: 0.35,
  commission: 0.20,
}

export function splitPrice(amountAr) {
  const guide = Math.round(amountAr * PRICE_SPLIT.guide)
  const logistique = Math.round(amountAr * PRICE_SPLIT.logistique)
  const commission = Math.max(0, amountAr - guide - logistique)
  return { guide, logistique, commission }
}

export function buildInstallments(totalAr, startDateStr) {
  const acompte = Math.round(totalAr * 0.3)
  const remaining = totalAr - acompte
  const echeance1 = Math.round(remaining / 2)
  const echeance2 = remaining - echeance1
  const start = startDateStr ? new Date(startDateStr) : new Date()
  const d1 = new Date(start); d1.setDate(d1.getDate() + 30)
  const d2 = new Date(start); d2.setDate(d2.getDate() + 60)
  return [
    { label: 'Acompte à la réservation', amount: acompte, date: start.toISOString().split('T')[0] },
    { label: '2ᵉ échéance', amount: echeance1, date: d1.toISOString().split('T')[0] },
    { label: '3ᵉ échéance (solde)', amount: echeance2, date: d2.toISOString().split('T')[0] },
  ]
}

export const REFUND_POLICY = [
  { seuil: 'Plus de 30 jours avant le départ', taux: '100 %', desc: 'Remboursement intégral, hors frais de service.' },
  { seuil: 'Entre 15 et 30 jours avant le départ', taux: '50 %', desc: 'Remboursement partiel de la part trek.' },
  { seuil: 'Moins de 15 jours avant le départ', taux: '0 %', desc: 'Aucun remboursement — guide et logistique sont déjà engagés.' },
]
