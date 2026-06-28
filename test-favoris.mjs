import { chromium } from 'playwright'

const BASE = 'http://localhost:3001'
const DEMO_USER = JSON.stringify({ name: 'Océane Rakotomalala', email: 'oceane@treky.mg', avatar: '/images/avatar2.jpg' })
const browser = await chromium.launch({ headless: true })

async function newPage() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  return ctx.newPage()
}

// Login via the form — used only for Test 3
async function loginViaForm(page) {
  await page.goto(`${BASE}/connexion`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('input[type="email"]', { timeout: 8000 })
  await page.locator('input[type="email"]').click({ clickCount: 3 })
  await page.locator('input[type="email"]').type('oceane@treky.mg')
  await page.locator('input[type="password"]').click({ clickCount: 3 })
  await page.locator('input[type="password"]').type('treky2026')
  await page.locator('button[type="submit"]').click()
  // Wait for redirect — the success screen is only 1500ms
  await page.waitForURL(u => !u.toString().includes('/connexion'), { timeout: 6000 })
}

// Instant auth via localStorage (Tests 4 & 5)
async function loginViaStorage(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(u => localStorage.setItem('treky_user', u), DEMO_USER)
}

function log(msg) { console.log(msg) }

// ═══════════════════════════════════════════════
// TEST 1 — Déconnecté : ♡ sur la page /circuits
// ═══════════════════════════════════════════════
log('\n=== TEST 1 : favoris déconnecté (/circuits) ===')
{
  const page = await newPage()
  await page.goto(`${BASE}/circuits`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.circuit-card__fav', { timeout: 10000 })
  await page.waitForTimeout(700)

  await page.locator('.circuit-card__fav').first().click()
  await page.waitForTimeout(700)

  const title = await page.locator('.cc-gate-title').textContent().catch(() => null)
  const email = await page.locator('.cc-gate-hint code').first().textContent().catch(() => null)
  const pwd   = await page.locator('.cc-gate-hint code').nth(1).textContent().catch(() => null)
  const ok    = title === 'Connexion requise' && email === 'oceane@treky.mg' && pwd === 'treky2026'

  log(`  Gate visible    : ${title ?? 'NON'}`)
  log(`  Email démo      : ${email ?? 'absent'}`)
  log(`  Mot de passe    : ${pwd ?? 'absent'}`)
  log(`  RÉSULTAT        : ${ok ? '✅ PASS' : '❌ FAIL'}`)
  await page.context().close()
}

// ═══════════════════════════════════════════════
// TEST 2 — Déconnecté : ♡ sur la fiche circuit
// ═══════════════════════════════════════════════
log('\n=== TEST 2 : favoris déconnecté (fiche circuit) ===')
{
  const page = await newPage()
  await page.goto(`${BASE}/circuits/decouverte-isalo`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.cd__action-btn', { timeout: 10000 })
  await page.waitForTimeout(700)

  const iconBefore = await page.locator('.cd__action-btn').first().locator('span').textContent()
  await page.locator('.cd__action-btn').first().click()
  await page.waitForTimeout(600)

  const gateTitle    = await page.locator('.cd__gate-title').textContent().catch(() => null)
  const iconUnchanged = iconBefore === '♡'

  log(`  Icône initiale  : "${iconBefore}"`)
  log(`  Gate visible    : ${gateTitle ?? 'NON'}`)
  log(`  Icône inchangée : ${iconUnchanged ? 'oui' : 'non'}`)
  log(`  RÉSULTAT        : ${gateTitle === 'Connexion requise' && iconUnchanged ? '✅ PASS' : '❌ FAIL'}`)
  await page.context().close()
}

// ═══════════════════════════════════════════════
// TEST 3 — Connexion avec compte démo
// ═══════════════════════════════════════════════
log('\n=== TEST 3 : connexion avec compte démo ===')
{
  const page = await newPage()
  let redirected = false
  let lsSet = false
  try {
    await loginViaForm(page)
    redirected = !page.url().includes('/connexion')
    lsSet = !!(await page.evaluate(() => localStorage.getItem('treky_user')))
  } catch (err) {
    log(`  Erreur : ${err.message.split('\n')[0]}`)
  }
  log(`  URL finale      : ${page.url()}`)
  log(`  Redirigé        : ${redirected ? '✅ oui' : '❌ non'}`)
  log(`  Auth localStorage : ${lsSet ? '✅ sauvegardée' : '❌ absente'}`)
  log(`  RÉSULTAT        : ${redirected && lsSet ? '✅ PASS' : '❌ FAIL'}`)
  await page.context().close()
}

// ═══════════════════════════════════════════════
// TEST 4 — Connecté : toggle ♡/♥ sur fiche
// ═══════════════════════════════════════════════
log('\n=== TEST 4 : favoris connecté (fiche circuit) ===')
{
  const page = await newPage()
  let pass = false
  try {
    await loginViaStorage(page)
    await page.goto(`${BASE}/circuits/decouverte-isalo`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.cd__action-btn', { timeout: 10000 })
    await page.waitForTimeout(700)

    const btn = page.locator('.cd__action-btn').first()
    const iconBefore = await btn.locator('span').textContent()
    log(`  Icône avant     : "${iconBefore}"`)

    await btn.click()
    await page.waitForTimeout(1000)

    const iconAfter   = await btn.locator('span').textContent()
    const toast       = await page.locator('.cd__toast').textContent().catch(() => null)
    const gateVisible = await page.locator('.cd__gate-overlay').isVisible().catch(() => false)
    log(`  Icône après     : "${iconAfter}"`)
    log(`  Toast           : "${toast ?? 'absent'}"`)
    log(`  Gate apparue    : ${gateVisible ? '❌ oui' : '✅ non'}`)

    await btn.click()
    await page.waitForTimeout(800)
    const iconBack = await btn.locator('span').textContent()
    const toast2   = await page.locator('.cd__toast').textContent().catch(() => null)
    log(`  Icône retrait   : "${iconBack}"`)
    log(`  Toast retrait   : "${toast2 ?? 'absent'}"`)

    const toggled = iconBefore === '♡' && iconAfter === '♥'
    const toastOk = !!toast?.includes('favoris')
    pass = toggled && toastOk && !gateVisible && iconBack === '♡'
  } catch (err) {
    log(`  Erreur : ${err.message.split('\n')[0]}`)
  }
  log(`  RÉSULTAT        : ${pass ? '✅ PASS' : '❌ FAIL'}`)
  await page.context().close()
}

// ═══════════════════════════════════════════════
// TEST 5 — Connecté : ♡ sur les cartes /circuits
// ═══════════════════════════════════════════════
log('\n=== TEST 5 : favoris connecté (/circuits cards) ===')
{
  const page = await newPage()
  let pass = false
  try {
    await loginViaStorage(page)
    await page.goto(`${BASE}/circuits`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.circuit-card__fav', { timeout: 10000 })
    await page.waitForTimeout(700)

    const cardFav = page.locator('.circuit-card__fav').first()
    const before  = (await cardFav.textContent()).trim()
    await cardFav.click()
    await page.waitForTimeout(600)
    const after = (await cardFav.textContent()).trim()

    const gateVisible = await page.locator('.cc-gate-overlay').isVisible().catch(() => false)
    const toggled = before === '♡' && after === '♥'
    log(`  Card fav avant  : "${before}" → après : "${after}"`)
    log(`  Gate apparue    : ${gateVisible ? '❌ oui' : '✅ non'}`)
    pass = toggled && !gateVisible
  } catch (err) {
    log(`  Erreur : ${err.message.split('\n')[0]}`)
  }
  log(`  RÉSULTAT        : ${pass ? '✅ PASS' : '❌ FAIL'}`)
  await page.context().close()
}

await browser.close()
log('\n=== FIN ===')
