// The behavior of the portfolio: the content comes from data.js; no library, no build.
(() => {
  const data = window.PORTFOLIO
  const $ = (selector, root = document) => root.querySelector(selector)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = (tag, className, text) => {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
  }

  // ---- Dates ----
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
  const parse = (text) => { const [year, month] = text.split('-').map(Number); return { year, month } }
  const monthsBetween = (a, b) => (b.year - a.year) * 12 + (b.month - a.month)
  const today = (() => { const now = new Date(); return { year: now.getFullYear(), month: now.getMonth() + 1 } })()
  const dateLabel = (text) => { const date = parse(text); return `${MONTHS[date.month - 1]} ${date.year}` }
  function duration(months) {
    const years = Math.floor(months / 12)
    const rest = months % 12
    return [years && `${years} an${years > 1 ? 's' : ''}`, rest && `${rest} mois`].filter(Boolean).join(' ') || '1 mois'
  }

  const experiences = data.timeline.filter((entry) => entry.type === 'experience')
  const companies = new Set(experiences.map((entry) => entry.company.replace(/\s*\(.*\)$/, '')))
  const certifications = data.timeline.filter((entry) => entry.type === 'certification')

  // ---- Text of the page ----
  const initials = data.name.split(/\s+/).filter((part) => /^[A-Z]/.test(part)).map((part) => part[0]).slice(0, 2).join('')
  $('#name').textContent = data.name
  $('#short-name').textContent = data.shortName
  $('#pitch').textContent = data.pitch
  $('#location').textContent = data.location
  $('#footer-name').textContent = data.name
  $('#year-now').textContent = today.year
  const avatar = $('#avatar')
  if (data.photo) {
    const image = el('img')
    image.src = data.photo
    image.alt = data.name
    avatar.appendChild(image)
    // The photo in the menu too, in place of the initials
    const logo = $('.logo')
    const small = el('img')
    small.src = data.photo
    small.alt = ''
    logo.replaceChildren(small)
  } else avatar.appendChild(el('span', '', initials))

  const actions = $('#contact-actions')
  const link = (href, text, primary, external) => {
    const anchor = el('a', `button${primary ? ' primary' : ''}`, text)
    anchor.href = href
    if (external) { anchor.target = '_blank'; anchor.rel = 'noopener' }
    actions.appendChild(anchor)
  }
  link(`mailto:${data.email}`, data.email, true)
  if (data.linkedin) link(data.linkedin, 'LinkedIn', false, true)
  if (data.cv) link(data.cv, 'Télécharger le CV', false, true)

  // ---- Theme: the choice of the visitor, else the one of the system ----
  const root = document.documentElement
  let stored = null
  try { stored = localStorage.getItem('theme') } catch { /* storage blocked: the system decides */ }
  root.dataset.theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  $('#theme').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('theme', root.dataset.theme) } catch { /* kept for this visit only */ }
  })

  // ---- Shown when they come into view ----
  const revealer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('in')
      revealer.unobserve(entry.target)
    }
  }, { threshold: 0.15 })
  document.querySelectorAll('.reveal').forEach((node, index) => {
    node.style.transitionDelay = node.closest('.hero') ? `${index * 90}ms` : '0ms'
    revealer.observe(node)
  })

  // ---- Reading progress and the section in view ----
  const bar = $('#progress')
  const links = [...document.querySelectorAll('.nav nav a')]
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    let current = ''
    for (const anchor of links) {
      const section = $(anchor.getAttribute('href'))
      if (section && section.getBoundingClientRect().top < window.innerHeight * 0.4) current = anchor.getAttribute('href')
    }
    links.forEach((anchor) => anchor.classList.toggle('active', anchor.getAttribute('href') === current))
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // ---- Hero: the network of the apps of Odoo ----
  ;(function network() {
    const canvas = $('#network')
    const context = canvas.getContext('2d')
    const APPS = ['Ventes', 'Achats', 'Stock', 'Comptabilité', 'CRM', 'Fabrication', 'Point de vente', 'Site web', 'Projet', 'Employés', 'Facturation', 'Réparation', 'Présences', 'Documents', 'QWeb', 'OWL', 'ORM', 'XML-RPC', 'Odoo.sh', 'Docker']
    let width = 0
    let height = 0
    let nodes = []
    let running = true
    const mouse = { x: -9999, y: -9999 }
    function size() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.round(Math.min(APPS.length + 16, Math.max(18, width / 38)))
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        label: index < APPS.length && width > 640 ? APPS[index] : '',
        r: index < APPS.length ? 2.6 : 1.6,
      }))
    }
    function colors() {
      const style = getComputedStyle(root)
      return { line: style.getPropertyValue('--purple').trim(), dot: style.getPropertyValue('--teal').trim(), text: style.getPropertyValue('--muted').trim() }
    }
    function draw() {
      const palette = colors()
      context.clearRect(0, 0, width, height)
      const reach = Math.min(170, width / 6)
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x
          const dy = nodes[a].y - nodes[b].y
          const distance = Math.hypot(dx, dy)
          if (distance > reach) continue
          context.globalAlpha = (1 - distance / reach) * 0.35
          context.strokeStyle = palette.line
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(nodes[a].x, nodes[a].y)
          context.lineTo(nodes[b].x, nodes[b].y)
          context.stroke()
        }
      }
      context.font = '500 12px "JetBrains Mono", monospace'
      for (const node of nodes) {
        const near = Math.hypot(node.x - mouse.x, node.y - mouse.y) < 140
        context.globalAlpha = near ? 1 : 0.75
        context.fillStyle = palette.dot
        context.beginPath()
        context.arc(node.x, node.y, near ? node.r * 1.8 : node.r, 0, Math.PI * 2)
        context.fill()
        if (node.label) {
          context.globalAlpha = near ? 0.95 : 0.4
          context.fillStyle = palette.text
          context.fillText(node.label, node.x + 8, node.y + 4)
        }
      }
      context.globalAlpha = 1
    }
    function step() {
      if (!running) return
      for (const node of nodes) {
        // Pulled softly toward the mouse
        const dx = mouse.x - node.x
        const dy = mouse.y - node.y
        const distance = Math.hypot(dx, dy)
        if (distance < 160 && distance > 1) { node.vx += (dx / distance) * 0.012; node.vy += (dy / distance) * 0.012 }
        node.vx *= 0.995
        node.vy *= 0.995
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      }
      draw()
      requestAnimationFrame(step)
    }
    size()
    window.addEventListener('resize', () => { size(); if (reduced) draw() })
    canvas.parentElement.addEventListener('pointermove', (event) => {
      const bounds = canvas.getBoundingClientRect()
      mouse.x = event.clientX - bounds.left
      mouse.y = event.clientY - bounds.top
    })
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999 })
    new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    if (reduced) { draw(); return }
    // Stopped when out of view or when the tab is hidden: no work for nothing
    new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && !document.hidden
      if (visible && !running) { running = true; requestAnimationFrame(step) } else if (!visible) running = false
    }).observe(canvas)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) running = false
      else if (!running && canvas.getBoundingClientRect().bottom > 0) { running = true; requestAnimationFrame(step) }
    })
    requestAnimationFrame(step)
  })()

  // ---- The verbs that change ----
  ;(function verbs() {
    const target = $('#verb')
    const prefix = $('#verb-prefix')
    // French elision: "J'installe", "J'héberge", but "Je migre"
    const subject = (word) => (/^[aeiouyhàâäéèêëîïôöûü]/i.test(word) ? 'J’' : 'Je ')
    target.textContent = data.verbs[0]
    prefix.textContent = subject(data.verbs[0])
    if (reduced) return
    let index = 0
    async function cycle() {
      for (;;) {
        await wait(2200)
        const word = target.textContent
        for (let size = word.length; size >= 0; size--) { target.textContent = word.slice(0, size); await wait(40) }
        index = (index + 1) % data.verbs.length
        const next = data.verbs[index]
        prefix.textContent = subject(next)
        for (let size = 1; size <= next.length; size++) { target.textContent = next.slice(0, size); await wait(70) }
      }
    }
    cycle()
  })()

  // ---- The numbers that count up ----
  const counts = {
    years: monthsBetween(parse(data.careerStart), today) / 12 | 0,
    versions: data.versions.length,
    certifications: certifications.length,
    companies: companies.size,
  }
  const counter = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      counter.unobserve(entry.target)
      const goal = counts[entry.target.dataset.count]
      if (reduced) { entry.target.textContent = goal; continue }
      const start = performance.now()
      const tick = (time) => {
        const progress = Math.min((time - start) / 1400, 1)
        entry.target.textContent = Math.round(goal * (1 - Math.pow(1 - progress, 3)))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }, { threshold: 0.6 })
  document.querySelectorAll('[data-count]').forEach((node) => counter.observe(node))

  function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) }

  // ---- The four facets, each with its demo; they follow each other ----
  const stage = $('#stage')
  const facetsBox = $('.facets')
  const tabs = [...document.querySelectorAll('.facet-tabs button')]
  const FACET_MS = 10000
  facetsBox.style.setProperty('--facet-time', `${FACET_MS / 1000}s`)
  let facetToken = 0

  const FACETS = {
    install: {
      title: 'Installation et déploiement',
      text: "Des environnements reproductibles avec Docker, des déploiements sur Odoo.sh, des serveurs Linux, et Git pour tout suivre.",
      render(box, token) {
        const terminal = el('div', 'terminal')
        const top = el('div', 'terminal-bar')
        top.append(el('b'), el('b'), el('b'), document.createTextNode('odoo — bash'))
        const pre = el('pre')
        terminal.append(top, pre)
        box.appendChild(terminal)
        const lines = [
          ['$ ', 'docker compose up -d db odoo', 'prompt'],
          ['', '✓ Container db    Started\n✓ Container odoo  Started', 'ok'],
          ['$ ', 'odoo -d demo -i sale_management,stock --stop-after-init', 'prompt'],
          ['', 'INFO demo odoo.modules.loading: 64 modules loaded in 9.8s', 'dim'],
          ['$ ', 'git push origin staging', 'prompt'],
          ['', '→ Odoo.sh : build de la branche staging lancé', 'ok'],
        ]
        typeLines(pre, lines, token)
      },
    },
    custom: {
      title: 'Personnalisation et modules sur mesure',
      text: "Modèles, vues, logique métier, rapports QWeb, composants OWL : des modules propres, testés et lisibles, qui suivent les règles d'Odoo.",
      render(box) {
        const grid = el('div', 'module-tree')
        const files = el('div', 'files')
        const tree = ['custom_repair/', '├─ __manifest__.py', '├─ models/', '│  └─ repair_order.py', '├─ views/', '│  └─ repair_views.xml', '├─ report/', '│  └─ repair_report.xml', '├─ static/src/', '│  └─ dashboard.js', '└─ security/']
        tree.forEach((line, index) => {
          const row = el('div', line.endsWith('/') ? 'folder' : '', line)
          row.style.animationDelay = `${index * 110}ms`
          files.appendChild(row)
        })
        const pieces = el('div', 'pieces')
        ;[['Modèles & ORM', 'Champs calculés, contraintes, héritage'], ['Vues XML', 'Formulaires, listes, kanban, héritage xpath'], ['Rapports QWeb', 'Devis, factures, bons sur mesure'], ['OWL & JS', 'Widgets et tableaux de bord'], ['Sécurité', "Groupes, droits d'accès, règles"], ['API', 'XML-RPC, JSON-RPC, REST']].forEach(([title, text], index) => {
          const piece = el('div', 'piece')
          piece.style.animationDelay = `${500 + index * 160}ms`
          piece.append(el('b', '', title), el('span', '', text))
          pieces.appendChild(piece)
        })
        grid.append(files, pieces)
        box.appendChild(grid)
      },
    },
    migration: {
      title: 'Migration de version en version',
      text: "Des modules portés de la v8 jusqu'à la v19. Chaque version change des règles : voici ce que devient le même code, étape par étape.",
      render(box, token) {
        const steps = el('div', 'versions-steps')
        const diff = el('div', 'diff')
        const STEPS = [
          ['16 → 17', [["<field name=\"date_done\" attrs=\"{'invisible': [('state', '!=', 'done')]}\"/>", '<field name="date_done" invisible="state != \'done\'"/>'], ['attrs et states disparaissent : des expressions Python à la place']]],
          ['17 → 18', [['<tree string="Réparations">', '<list string="Réparations">'], ["group_operator='sum'", "aggregator='sum'"], ['les vues tree deviennent list']]],
          ['18 → 19', [["_sql_constraints = [('name_uniq', 'unique(name)', 'Déjà utilisé')]", "_name_uniq = models.Constraint('unique(name)', 'Déjà utilisé')"], ['self._cr, self._uid', 'self.env.cr, self.env.uid'], ['les contraintes SQL deviennent des models.Constraint']]],
        ]
        STEPS.forEach(([label]) => steps.appendChild(el('span', '', label)))
        box.append(steps, diff)
        let index = 0
        const show = () => {
          if (token !== facetToken) return
          ;[...steps.children].forEach((chip, at) => chip.classList.toggle('on', at === index))
          diff.replaceChildren()
          for (const change of STEPS[index][1]) {
            if (change.length === 1) { diff.appendChild(el('div', 'note', `# ${change[0]}`)); continue }
            diff.append(el('div', 'del', `- ${change[0]}`), el('div', 'add', `+ ${change[1]}`))
          }
          index = (index + 1) % STEPS.length
          setTimeout(show, 3200)
        }
        show()
      },
    },
    functional: {
      title: 'Analyse fonctionnelle',
      text: "Comprendre le métier avant d'écrire du code : analyse des besoins, paramétrage des applications standard, et le développement seulement là où il apporte quelque chose.",
      render(box) {
        const apps = el('div', 'apps')
        ;['Ventes', 'Achats', 'Stock', 'Comptabilité', 'Facturation', 'CRM', 'Fabrication', 'Point de vente', 'Site web', 'Employés', 'Présences', 'Documents', 'Réparation', "Appels d'offres"].forEach((name, index) => {
          const chip = el('span', '', name)
          chip.style.animationDelay = `${index * 70}ms`
          apps.appendChild(chip)
        })
        const certs = el('div', 'certs')
        certifications.forEach((entry, index) => {
          const cert = el('div', 'cert')
          cert.style.animationDelay = `${900 + index * 200}ms`
          cert.append(el('strong', '', `v${entry.versions[0]}`), el('span', '', `Certification fonctionnelle Odoo · ${parse(entry.start).year}`))
          certs.appendChild(cert)
        })
        box.append(apps, certs)
      },
    },
  }

  /** Types the lines of a terminal, the commands letter by letter */
  async function typeLines(pre, lines, token) {
    const caret = el('span', 'caret')
    pre.appendChild(caret)
    for (const [prompt, text, kind] of lines) {
      if (token !== facetToken) return
      if (prompt) {
        pre.insertBefore(el('span', 'prompt', prompt), caret)
        const command = el('span')
        pre.insertBefore(command, caret)
        for (const char of text) {
          if (token !== facetToken) return
          command.textContent += char
          await wait(reduced ? 0 : 28)
        }
        await wait(reduced ? 0 : 350)
      } else pre.insertBefore(el('span', kind, text), caret)
      pre.insertBefore(document.createTextNode('\n'), caret)
    }
  }

  let facetTimer = 0
  let paused = false
  function showFacet(name, restart = true) {
    facetToken++
    const facet = FACETS[name]
    tabs.forEach((tab) => {
      tab.setAttribute('aria-selected', String(tab.dataset.facet === name))
      // The bar starts again on the chosen tab
      const fill = tab.querySelector('.bar')
      fill.style.animation = 'none'
      void fill.offsetWidth
      fill.style.animation = ''
    })
    const color = data.categories[name].color
    facetsBox.style.setProperty('--accent', color)
    stage.style.setProperty('--accent', color)
    stage.classList.remove('stage-in')
    stage.replaceChildren()
    void stage.offsetWidth
    stage.classList.add('stage-in')
    stage.append(el('h3', 'stage-title', facet.title), el('p', 'stage-text', facet.text))
    const body = el('div')
    stage.appendChild(body)
    facet.render(body, facetToken)
    const more = el('button', 'stage-link', 'Voir ces missions dans le parcours →')
    more.type = 'button'
    more.addEventListener('click', () => { setCategory(name); $('#parcours').scrollIntoView() })
    stage.appendChild(more)
    if (restart) schedule()
  }
  function schedule() {
    clearTimeout(facetTimer)
    if (paused || reduced) return
    facetTimer = setTimeout(() => {
      const current = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true')
      showFacet(tabs[(current + 1) % tabs.length].dataset.facet)
    }, FACET_MS)
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => showFacet(tab.dataset.facet)))
  // Stays on a facet while the visitor reads it
  facetsBox.addEventListener('pointerenter', () => { paused = true; facetsBox.classList.add('paused'); clearTimeout(facetTimer) })
  facetsBox.addEventListener('pointerleave', () => {
    paused = false
    facetsBox.classList.remove('paused')
    // The demo is not played again: only the countdown starts over
    const fill = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.querySelector('.bar')
    if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = '' }
    schedule()
  })
  // Starts when the section comes into view (the terminal types for the visitor, not for nobody)
  let facetsStarted = false
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !facetsStarted) { facetsStarted = true; showFacet('install') }
  }, { threshold: 0.3 }).observe(facetsBox)

  // ---- The ladder of the versions ----
  const ladder = $('#ladder')
  const ladderInfo = $('#ladder-info')
  const monthsOn = (version) => experiences.filter((entry) => entry.versions.includes(version))
    .reduce((sum, entry) => sum + monthsBetween(parse(entry.start), entry.end ? parse(entry.end) : today), 0)
  const longest = Math.max(...data.versions.map(monthsOn))
  data.versions.forEach((version, index) => {
    const rung = el('button', 'rung')
    rung.type = 'button'
    const pillar = el('span', 'pillar')
    pillar.style.setProperty('--h', `${22 + (monthsOn(version) / longest) * 78}%`)
    pillar.style.setProperty('--delay', `${index * 80}ms`)
    rung.append(pillar, el('b', '', `v${version}`))
    rung.setAttribute('aria-label', `Odoo ${version}`)
    const describe = () => {
      const where = [...new Set(experiences.filter((entry) => entry.versions.includes(version)).map((entry) => entry.company.replace(/\s*\(.*\)$/, '')))]
      const cert = certifications.find((entry) => entry.versions.includes(version))
      ladderInfo.innerHTML = ''
      ladderInfo.append(el('b', '', `Odoo ${version}`), document.createTextNode(` · ${where.join(', ')}${cert ? ` · certifié en ${parse(cert.start).year}` : ''} · cliquez pour filtrer le parcours`))
      ladder.querySelectorAll('.rung').forEach((other) => other.classList.toggle('off', other !== rung))
    }
    rung.addEventListener('pointerenter', describe)
    rung.addEventListener('focus', describe)
    rung.addEventListener('click', () => { setVersion(version); $('#parcours').scrollIntoView() })
    ladder.appendChild(rung)
  })
  ladder.addEventListener('pointerleave', () => {
    ladder.querySelectorAll('.rung').forEach((rung) => rung.classList.remove('off'))
    ladderInfo.innerHTML = '&nbsp;'
  })

  // ---- The career: filters and the replay year by year ----
  const TYPES = { all: 'Tout', experience: 'Expériences', certification: 'Certifications', education: 'Formation' }
  const firstYear = Math.min(...data.timeline.map((entry) => parse(entry.start).year))
  const state = { type: 'all', category: 'all', version: null, year: today.year }
  const timeline = $('#timeline')
  const yearInput = $('#year')
  const yearLabel = $('#year-label')
  yearInput.min = firstYear
  yearInput.max = today.year
  yearInput.value = today.year

  const typeChips = $('#type-chips')
  for (const [value, label] of Object.entries(TYPES)) {
    const chip = el('button', 'chip', label)
    chip.type = 'button'
    chip.dataset.value = value
    const count = value === 'all' ? data.timeline.length : data.timeline.filter((entry) => entry.type === value).length
    chip.appendChild(el('small', '', String(count)))
    chip.addEventListener('click', () => { state.type = value; render() })
    typeChips.appendChild(chip)
  }
  const categoryChips = $('#category-chips')
  for (const [value, info] of [['all', { label: 'Toutes les facettes', color: 'var(--muted)' }], ...Object.entries(data.categories)]) {
    const chip = el('button', 'chip')
    chip.type = 'button'
    chip.dataset.value = value
    chip.style.setProperty('--c', info.color)
    chip.append(el('i'), document.createTextNode(info.label))
    chip.addEventListener('click', () => { state.category = value; render() })
    categoryChips.appendChild(chip)
  }
  const versionChip = el('button', 'chip on')
  versionChip.type = 'button'
  versionChip.style.setProperty('--c', 'var(--teal)')
  versionChip.addEventListener('click', () => { state.version = null; render() })

  function setCategory(category) { state.category = category; state.type = 'all'; state.year = today.year; stopPlay(); render() }
  function setVersion(version) { state.version = version; state.type = 'all'; state.category = 'all'; state.year = today.year; stopPlay(); render() }

  // The cards, newest first
  const cards = [...data.timeline].sort((a, b) => b.start.localeCompare(a.start)).map((entry) => {
    const item = el('li', 'entry')
    const main = entry.items[0]?.[0]
    item.style.setProperty('--dot', data.categories[main]?.color ?? 'var(--purple)')
    const card = el('article', 'card')
    const head = el('div', 'card-head')
    const title = el('h3', '', entry.role)
    if (entry.type === 'experience' && !entry.end) title.appendChild(el('span', 'badge now', 'Actuel'))
    else if (entry.type !== 'experience') title.appendChild(el('span', 'badge', TYPES[entry.type].replace(/s$/, '')))
    const when = entry.type === 'certification'
      ? String(parse(entry.start).year)
      : `${dateLabel(entry.start)} — ${entry.end ? dateLabel(entry.end) : "aujourd'hui"} · ${duration(monthsBetween(parse(entry.start), entry.end ? parse(entry.end) : today) + 1)}`
    head.append(title, el('span', 'when', when))
    const where = el('p', 'where')
    where.append(el('b', '', entry.company), document.createTextNode(` · ${entry.place}`))
    const list = el('ul')
    const rows = entry.items.map(([category, text]) => {
      const row = el('li')
      row.dataset.category = category
      const dot = el('i')
      dot.style.setProperty('--c', data.categories[category].color)
      dot.title = data.categories[category].label
      row.append(dot, el('span', '', text))
      list.appendChild(row)
      return row
    })
    card.append(head, where, list)
    const tags = el('div', 'tags')
    entry.versions.forEach((version) => tags.appendChild(el('span', 'v', `v${version}`)))
    ;(entry.tools ?? []).forEach((tool) => tags.appendChild(el('span', '', tool)))
    if (tags.children.length) card.appendChild(tags)
    item.appendChild(card)
    timeline.appendChild(item)
    return { entry, item, rows, shown: true }
  })

  function render() {
    typeChips.querySelectorAll('.chip').forEach((chip) => chip.classList.toggle('on', chip.dataset.value === state.type))
    categoryChips.querySelectorAll('.chip').forEach((chip) => chip.classList.toggle('on', chip.dataset.value === state.category))
    if (state.version) {
      versionChip.replaceChildren(el('i'), document.createTextNode(`Odoo ${state.version} ✕`))
      categoryChips.appendChild(versionChip)
    } else versionChip.remove()
    yearInput.value = state.year
    yearLabel.textContent = state.year
    let visible = 0
    for (const card of cards) {
      const { entry } = card
      const matchesCategory = state.category === 'all' || entry.items.some(([category]) => category === state.category)
      const show = (state.type === 'all' || entry.type === state.type)
        && matchesCategory
        && (!state.version || entry.versions.includes(state.version))
        && parse(entry.start).year <= state.year
      // The lines of another facet stay, dimmed: the mission is told whole
      card.rows.forEach((row) => row.classList.toggle('dim', state.category !== 'all' && row.dataset.category !== state.category))
      if (show) visible++
      if (show === card.shown) continue
      card.shown = show
      toggle(card.item, show)
    }
    $('#empty').hidden = visible > 0
  }

  /** Shows or hides a card with a movement; a hidden card leaves no room */
  function toggle(item, show) {
    clearTimeout(item.hideTimer)
    if (show) {
      item.hidden = false
      item.classList.add('hide')
      void item.offsetWidth
      item.classList.remove('hide')
    } else {
      item.classList.add('hide')
      item.hideTimer = setTimeout(() => { item.hidden = true }, reduced ? 0 : 450)
    }
  }

  yearInput.addEventListener('input', () => { stopPlay(); state.year = Number(yearInput.value); render() })

  // The career told year by year, from the first one to today
  const play = $('#play')
  const PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>'
  const PAUSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>'
  let playTimer = 0
  function startPlay() {
    stopPlay()
    state.year = firstYear
    render()
    play.innerHTML = PAUSE_ICON
    play.setAttribute('aria-label', 'Arrêter')
    playTimer = setInterval(() => {
      if (state.year >= today.year) { stopPlay(); return }
      state.year++
      render()
    }, 850)
  }
  function stopPlay() {
    clearInterval(playTimer)
    playTimer = 0
    play.innerHTML = PLAY_ICON
    play.setAttribute('aria-label', 'Rejouer le parcours année par année')
  }
  play.addEventListener('click', () => (playTimer ? stopPlay() : startPlay()))
  render()
  // Played once by itself the first time the career comes into view
  if (!reduced) {
    const once = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      once.disconnect()
      startPlay()
    }, { rootMargin: '0px 0px -40% 0px' })
    once.observe($('#parcours .filters'))
  }

  // ---- Skills, by group ----
  const skills = $('#skills')
  const groups = [...new Set(data.skills.map((skill) => skill.group))]
  for (const group of groups) {
    const box = el('div', 'skill-group')
    box.appendChild(el('h3', '', group))
    const list = el('div')
    data.skills.filter((skill) => skill.group === group).forEach((skill) => list.appendChild(el('span', `skill${skill.strong ? ' strong' : ''}`, skill.name)))
    box.appendChild(list)
    skills.appendChild(box)
  }
})()
